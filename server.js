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
  if(err == null){
    checkTablesExist()
  }
});


const apiKey = '12345'

app.get('/login', (req, res) => {
  console.log(JSON.stringify(req.query.apiKey))
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
    if(result == ""){
      createTables()
    }else{
      console.log("TABLES EXIST")
    }
  });
}

function createTables(){
  var sqlUSER = "CREATE TABLE USER (USERID INT NOT NULL AUTO_INCREMENT,USERRANK INT NOT NULL ,NAME VARCHAR(255),USERNAME VARCHAR(255),PASSWORD VARCHAR(255),CREATINDATE INT,LASTLOGIN INT,COUNTRY VARCHAR(255),PRIMARY KEY (USERID, USERRANK));"
  var sqlSESSION = "CREATE TABLE SESSION (SESSIONID INT AUTO_INCREMENT,USERID INT,CLICKS MEDIUMTEXT NOT NULL,STARTTIME INT,STOPTIME INT,PLATFORM VARCHAR(255),GOODCLICKS INT,BADCLICKS INT,PRIMARY KEY (SESSIONID, USERID));"
  con.query(sqlUSER, function (err, result) {
    if (err) throw err;
    console.log("Result USER: " + JSON.stringify(result));
  });
  con.query(sqlSESSION, function (err, result) {
    if (err) throw err;
    console.log("Result USER: " + JSON.stringify(result));
  });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})