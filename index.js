const express = require('express');
const app = express();
const { QuickDB } =require('quick.db')
const db = new QuickDB()
const bodyParser = require('body-parser');
const path = require("path")
const fs = require("fs")
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname,'wgl.ico')))

 

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});
 
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
});
app.get('/noexist', (req, res) => {
  res.sendFile(__dirname + '/public/noexist.html');
});
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/public/test.html');
});





app.use(sanitizeInput);
app.get('/:value', async (req, res) => {
  const short = req.params.value;
  const url = await db.get(`${short}`);
  if(url==null){
  res.redirect('/noexist');
  }else {
    res.render('userpage', {short})
  }
});

app.post('/submitext/:value', async (req, res) => {
  const short = req.params.value;
  const {name1} = req.body;
  await db.push(`${short}.messages`, name1)
  res.render('sent', {short})
});

app.post('/signup', async (req, res) => {
  const { name1, name2 } = req.body;
  let message;
  const user = await db.get(`${name1}`)
  if(user==null){
    await db.set(`${name1}.password`, name2)
    message = `Account created!\nYour Link is: <a href="https://wgl.starlinkboy.repl.co/${name1}">https://wgl.starlinkboy.repl.co/${name1}</a>`
  } else {
    message= "Account exists!"
  }
  
  const filePath = path.join(__dirname, '/public/signup.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }
    const updatedData = data.replace('<div id="output"></div>', `<div id="output">${message}</div>`);
    res.send(updatedData);
  });
});


app.post('/dash', async (req, res) => {
  const { name1, name2 } = req.body;
  let message, finalmessage= "";
  const user = await db.get(`${name1}`);
  
  if (user == null) {
    message = "No user with that username exists!";
    const filePath = path.join(__dirname, '/public/signin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading file');
      }
      const updatedData = data.replace('<div id="output"></div>', `<div id="output">${message}</div>`);
      res.send(updatedData);
    });
  } else {
    const pass = await db.get(`${name1}.password`);
    if (pass == name2) {
      
      const filePath = path.join(__dirname, '/public/dash.html');
      fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }
        
      

      const mes = await db.get(`${name1}.messages`);
      mes.forEach(messag => { 
        if(!message){
          finalmessage = `<h2>No messages received for ${name1}!</h2>`
        }
        
      finalmessage= finalmessage+`<br><div class="message" id="mydiv-${messag}"><h2 class="header">Send me anonymous messages!</h2><br><p>${messag}</p></div><br><button onclick="downloadImage('${messag}')" class = "button">Download Image</button>`                         })
        finalmessage=`<button onclick="copyLink('${name1}')" class = "button">Copy Link</button>`+finalmessage;
      
     const updatedData = data.replace('<!--finalmessage-->', `${finalmessage}`);
        
        
      
      setTimeout(() => {
        res.send(updatedData);
      }, 3000);
      
      });
      
  

    } else {
      message = "Password Invalid!";
      const filePath = path.join(__dirname, '/public/signin.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }
        const updatedData = data.replace('<div id="output"></div>', `<div id="output">${message}</div>`);
        res.send(updatedData);
      });
    }
  }
});


app.listen(8080, () => {
  console.log('Server started on port 8080');
});

function sanitizeInput(req, res, next) {
  const { body } = req;
  for (const key in body) {
    if (typeof body[key] === 'string') {
      body[key] = body[key].trim();
    }
  }
  next();
}
