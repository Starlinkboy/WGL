const { QuickDB } =require('quick.db')
const db = new QuickDB()
async function siu() {
const mes = await db.get("starlinkboy");


  console.log(mes);


}
siu()
