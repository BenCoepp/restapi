const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "dev",
  password: "root",
  database: "test_db",
  port: 3308
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Result: " + err);
  if(err == null){
    if(checkTablesExist()){
      
    }else{
      
    }
  }
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

function checkTablesExist(){
  con.query("SELECT * FROM information_schema.tables WHERE table_schema = 'test_db';", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    if(result == []){
      return false
    }else{
      return true
    }
  });
}

function createTables(){
  var sqlUSER = "CREATE TABLE USER (USERID INT AUTO_INCREMENT PRIMARY KEY, NAME VARCHAR(255), USERNAME VARCHAR(255), PASSWORD VARCHAR(255), CREATINDATE INT, LASTLOGIN INT)"
  var sqlSESSION = ""
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})