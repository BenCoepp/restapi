const express = require('express')
const app = express()
const port = 3000

const apiKey = 12345

app.get('/', (req, res) => {
  res.send(200)
})

app.post('/createuser', (req, res) =>{
 //TODO needs to be a function
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})