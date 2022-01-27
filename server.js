const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');
const schedule = require('node-schedule');

var con = mysql.createConnection({
  host: "localhost",
  user: "dev",
  password: "root",
  database: "test_db",
  port: 3308
});

con.connect(function(err) {
  if (err) console.log(err);
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

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
})


const apiKey = '12345'

app.get('/', (req, res) => {
  res.send("Hello from the other side")
})

app.get('/ping', (req, res) => {
  res.send(200)
})

app.get('/login', (req, res) => {
  try {
    if(apiKey == req.query.apiKey){
      var loginCheckSQL = "SELECT * FROM USER WHERE USERNAME='" + req.query.username +"' AND PASSWORD='"+req.query.password+"'"
      con.query(loginCheckSQL, function (err, result) {
        if (err) console.log(err);
        if(result !== []){
          var token = generateToken(25)
          con.query("INSERT INTO TOKEN (USERID, TOKENSTRING)VALUES ("+result[0]["USERID"] +", '"+token +"');", function (err, result) {
            if (err) console.log(err);
            res.send({"token":token})
          });
        }else{
          res.send(403)
        }
      });
    }
  } catch (error) {
    console.log(error)
  }
})

app.post('/createuser', (req, res) =>{
 if(apiKey == req.query.apiKey){
  var createUser = "INSERT INTO USER (USERRANK,NAME,USERNAME,PASSWORD,CREATINDATE,LASTLOGIN,COUNTRY,AGE)VALUES (2 ,'" + req.query.name+"', '" + req.query.username+"', '" + req.query.password+"','" + req.query.creatindate + "','" + req.query.lastLogin +"','" + req.query.country+"'," +req.query.age + ");"
  console.log(createUser)
  con.query(createUser, function (err, result) {
    if (err) console.log(err);
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
      if (err) console.log(err);
      if(resultToken !== []){
        var getUser = "SELECT * FROM USER WHERE USERNAME = '" + req.query.username + "' AND PASSWORD = '" + req.query.password + "'" 
        con.query(getUser, function (err, resultUser) {
          if (err) console.log(err);
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
    if (err) console.log(err);
    if(result == ""){
      createTables()
    }else{
      console.log("TABLES EXIST")
    }
  });
}

function createTables(){
  var sqlUSER = "CREATE TABLE USER (USERID INT NOT NULL AUTO_INCREMENT,USERRANK INT NOT NULL ,NAME VARCHAR(255),USERNAME VARCHAR(255),PASSWORD VARCHAR(255),CREATINDATE VARCHAR(255),LASTLOGIN VARCHAR(255),COUNTRY VARCHAR(255),AGE INT,PRIMARY KEY (USERID, USERRANK));"
  var sqlSESSION = "CREATE TABLE SESSION (SESSIONID INT AUTO_INCREMENT,USERID INT,CLICKS MEDIUMTEXT NOT NULL,STARTTIME VARCHAR(255),STOPTIME VARCHAR(255),PLATFORM VARCHAR(255),GOODCLICKS INT,BADCLICKS INT,PRIMARY KEY (SESSIONID, USERID));"
  var sqlTOKEN = "CREATE TABLE TOKEN (TOKENID INT NOT NULL AUTO_INCREMENT,USERID INT NOT NULL , TOKENSTRING VARCHAR(255),PRIMARY KEY (TOKENID, USERID));"
  con.query(sqlUSER, function (err, result) {
    if (err) console.log(err);
  });
  con.query(sqlSESSION, function (err, result) {
    if (err) console.log(err);
  });
  con.query(sqlTOKEN, function (err, result) {
    if (err) console.log(err);
  });
}

app.get('/getsession', (req, res) =>{
  if(apiKey == req.query.apiKey){
   
  }
})

app.get('/getleaderboard', (req, res) =>{
  if(apiKey == req.query.apiKey){
    var getToken = "SELECT * FROM TOKEN WHERE TOKENSTRING ='" + req.query.token + "'"
    con.query(getToken, function (err, resultToken) {
      if (err) console.log(err);
      if(resultToken !== []){
        var getUSERS = "SELECT USERRANK,NAME,COUNTRY FROM USER ORDER BY USERRANK ASC"
        con.query(getUSERS, function (err, resultUSER) {
          if (err) console.log(err);
          if(resultUSER !== []){
            res.send(JSON.stringify(resultUSER))
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

app.post('/createsession', (req, res) =>{
  if(apiKey == req.query.apiKey){
    var getToken = "SELECT * FROM TOKEN WHERE TOKENSTRING ='" + req.query.token + "'"
    con.query(getToken, function (err, resultToken) {
      if (err) console.log(err);
      if(resultToken !== []){
        var getUser = "SELECT * FROM USER WHERE USERID = " + req.query.userid 
        con.query(getUser, function (err, resultUser) {
          if (err) console.log(err);
          if(resultUser !== []){
            var tokenOBJ = resultToken
            var userOBJ = resultUser
            try {
              if(tokenOBJ[0].userid == userOBJ[0].userid){
                var createSESSION = "INSERT INTO SESSION (USERID,CLICKS,STARTTIME,STOPTIME,PLATFORM,GOODCLICKS,BADCLICKS) VALUES ("+req.query.userid + " ,'" + req.query.clicks+"', '" + req.query.starttime+"', '" + req.query.stoptime+"','" + req.query.platform + "'," + req.query.goodclicks +"," + req.query.badclicks+");"
                con.query(createSESSION, function (err, result) {
                  if (err) console.log(err);
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

const job = schedule.scheduleJob('10 * * * * *', function(){
  //TODO here goas the function for updating the rancing
    var stringSessions = "SELECT USERID, SESSIONID FROM SESSION"
    con.query(stringSessions, function (err, resultSession) {
      if (err) console.log(err);
      if(resultSession !== []){
        var numberArray = []
        for (let index = 0; index < resultSession.length; index++) {
          const element = resultSession[index];
          numberArray[index] = element["USERID"]
        }
        var map = numberArray.reduce(function(p, c) {
          p[c] = (p[c] || 0) + 1;
          return p;
        }, {});

        var newTypesArray = Object.keys(map).sort(function(a, b) {
          return map[b] - map[a];
        });
        console.log(newTypesArray)
        var getUser = "SELECT * FROM USER" 
        con.query(getUser, function (err, resultUser) {
          if (err) console.log(err);
          if(resultUser !== []){
            var count = 0;
            for (let index = 0; index < resultUser.length; index++) {
              const user = resultUser[index];
              newTypesArray.forEach(element => {
                if(user["USERID"] == element){
                  console.log(newTypesArray.indexOf(element) + 1)
                  count++
                  var getUSERS = "UPDATE USER SET USERRANK = "+ count + " WHERE USERID = " + user["USERID"]
                  con.query(getUSERS, function (err, resultUSER) {
                    if (err) console.log(err);
                  });
                }
              });
              var getUSERS = "UPDATE USER SET USERRANK = "+ count + " WHERE USERID = " + user["USERID"]
                  con.query(getUSERS, function (err, resultUSER) {
                    if (err) console.log(err);
                  });
            }
          }else{
            res.send(403)
          }
        });
      }else{
        res.send(403)
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})