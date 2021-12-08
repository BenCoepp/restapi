const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "dev",
  password: "root",
  database: "mysql",
  port: 3308
});

con.connect(function(err) {
  con.query("SELECT * FROM user", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });
});

const apiKey = '12345'

app.get('/login', (req, res) => {
  res.send(200)
  //TODO
  //validate password and username 
  //send token back
})

app.post('/createuser', (req, res) =>{
 res.send("sucess")
 //TODO
 //validate that user doas not exist
 //validate that req send is ok
 //create user
 //respond that everything is ok
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})