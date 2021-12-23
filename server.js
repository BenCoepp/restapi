const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
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

app.use(function (req, res, next){
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // Pass to next layer of middleware
  next();
});


const apiKey = '12345'

app.get('/', (req, res) => {
  res.send("Hello from the other side")
})

app.get('/ping', (req, res) => {
  res.send(200)
})

app.get('/login', (req, res) => {
  if(apiKey == req.query.apiKey){
    var loginCheckSQL = "SELECT * FROM USER WHERE USERNAME='" + req.query.username +"' AND PASSWORD='"+req.query.password+"'"
    con.query(loginCheckSQL, function (err, result) {
      if (err) throw err;
      if(result !== []){
        var token = generateToken(25)
        con.query("INSERT INTO TOKEN (USERID, TOKENSTRING)VALUES ("+result[0]["USERID"] +", '"+token +"');", function (err, result) {
          if (err) throw err;
          res.send({"token":token})
        });
      }else{
        res.send(403)
      }
    });
  }
})

app.post('/createuser', (req, res) =>{
 if(apiKey == req.query.apiKey){
  var createUser = "INSERT INTO USER (USERRANK,NAME,USERNAME,PASSWORD,CREATINDATE,LASTLOGIN,COUNTRY,AGE)VALUES (2 ,'" + req.query.name+"', '" + req.query.username+"', '" + req.query.password+"'," + req.query.creatintime + "," + req.query.lastlogin +",'" + req.query.country+"'," +req.query.age + ");"
  con.query(createUser, function (err, result) {
    if (err) throw err;
    if(result !== []){
      res.send(200)
    }else{
      res.send(403)
    }
  });
}else{
  res.send(403)
}
})

app.get('/getuser', (req, res) =>{
  if(apiKey == req.query.apiKey){
    var getToken = "SELECT * FROM TOKEN WHERE TOKENSTRING ='" + req.query.token + "'"
    con.query(getToken, function (err, resultToken) {
      if (err) throw err;
      if(resultToken !== []){
        var getUser = "SELECT * FROM USER WHERE USERNAME = '" + req.query.username + "' AND PASSWORD = '" + req.query.password + "'" 
        con.query(getUser, function (err, resultUser) {
          if (err) throw err;
          if(resultUser !== []){
            var tokenOBJ = resultToken
            var userOBJ = resultUser
            try {
              if(tokenOBJ[0].userid == userOBJ[0].userid){
                res.send(JSON.stringify(resultUser))
              }
            } catch (error) {
              res.send(400)
            }
          }else{
            res.send(404)
          }
        });
      }else{
        res.send(403)
      }
    });
  }else{
    res.send(403)
  }
 })

function checkTablesExist(){
  con.query("SELECT * FROM information_schema.tables WHERE table_schema = 'test_db';", function (err, result) {
    if (err) throw err;
    if(result == ""){
      createTables()
    }else{
      console.log("TABLES EXIST")
    }
  });
}

function createTables(){
  var sqlUSER = "CREATE TABLE USER (USERID INT NOT NULL AUTO_INCREMENT,USERRANK INT NOT NULL ,NAME VARCHAR(255),USERNAME VARCHAR(255),PASSWORD VARCHAR(255),CREATINDATE INT,LASTLOGIN INT,COUNTRY VARCHAR(255),AGE INT,PRIMARY KEY (USERID, USERRANK));"
  var sqlSESSION = "CREATE TABLE SESSION (SESSIONID INT AUTO_INCREMENT,USERID INT,CLICKS MEDIUMTEXT NOT NULL,STARTTIME INT,STOPTIME INT,PLATFORM VARCHAR(255),GOODCLICKS INT,BADCLICKS INT,PRIMARY KEY (SESSIONID, USERID));"
  var sqlTOKEN = "CREATE TABLE TOKEN (TOKENID INT NOT NULL AUTO_INCREMENT,USERID INT NOT NULL , TOKENSTRING VARCHAR(255),PRIMARY KEY (TOKENID, USERID));"
  con.query(sqlUSER, function (err, result) {
    if (err) throw err;
    console.log("Result USER: " + JSON.stringify(result));
  });
  con.query(sqlSESSION, function (err, result) {
    if (err) throw err;
    console.log("Result USER: " + JSON.stringify(result));
  });
  con.query(sqlTOKEN, function (err, result) {
    if (err) throw err;
    console.log("Result USER: " + JSON.stringify(result));
  });
}

app.get('/getsession', (req, res) =>{
  if(apiKey == req.query.apiKey){
   
  }
})

app.post('/createsession', (req, res) =>{
  console.log(JSON.stringify(req.query.userid))
  if(apiKey == req.query.apiKey){
    var getToken = "SELECT * FROM TOKEN WHERE TOKENSTRING ='" + req.query.token + "'"
    con.query(getToken, function (err, resultToken) {
      if (err) throw err;
      if(resultToken !== []){
        var getUser = "SELECT * FROM USER WHERE USERID = " + req.query.userid 
        con.query(getUser, function (err, resultUser) {
          if (err) throw err;
          if(resultUser !== []){
            var tokenOBJ = resultToken
            var userOBJ = resultUser
            try {
              if(tokenOBJ[0].userid == userOBJ[0].userid){
                var createSESSION = "INSERT INTO SESSION (USERID,CLICKS,STARTTIME,STOPTIME,PLATFORM,GOODCLICKS,BADCLICKS) VALUES ("+req.query.userid + " ,'" + req.query.clicks+"', " + req.query.starttime+", " + req.query.stoptime+",'" + req.query.platform + "'," + req.query.goodclicks +"," + req.query.badclicks+");"
                con.query(createSESSION, function (err, result) {
                  if (err) throw err;
                  if(result !== []){
                    res.send(200)
                  }else{
                    res.send(403)
                  }
                });
              }
            } catch (error) {
              res.send(400)
            }
          }else{
            res.send(404)
          }
        });
      }else{
        res.send(403)
      }
    });
  }else{
    res.send(403)
  }
})

function generateToken(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})