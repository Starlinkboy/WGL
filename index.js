const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/love', (req, res) => {
  const { name1, name2 } = req.body;
  const arr1 = name1.split('');
  const arr2 = name2.split('');
  let sum1 = 0;
  let sum2 = 0;
  let per;
  let i = 0;
  for (const ch of arr1) {
    const n = arr1[i++].charCodeAt(0);
    sum1 += n;
  }
  i = 0;
  for (const ch of arr2) {
    const n = arr2[i++].charCodeAt(0);
    sum2 += n;
  }
  if (sum1 <= sum2) {
    per = Math.ceil((sum1 / sum2) * 100);
  } else {
    per = Math.ceil((sum2 / sum1) * 100);
  }
  res.render('love', { per });
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
