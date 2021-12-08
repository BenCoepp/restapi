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

app.get('/', (req, res) => {
  res.send(200)
})

app.post('/createuser', (req, res) =>{
 //TODO needs to be a function
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})