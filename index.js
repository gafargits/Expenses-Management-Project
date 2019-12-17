const path = require('path');
const express = require('express')

//process.env is used to keep variables private
require('dotenv').config()
//Express Middleware
const helmet = require('helmet') //for security reason
const bodyParser = require('body-parser') //turns response to json format
const cors = require('cors') //for cross-site communication
const morgan = require('morgan') //logs requests


// db connection with localhost
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'gafar',
    password: 'gafar',
    database: 'expenses'
  }
});

//db queries
const main = require('./server/backend/main')

//App
const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use((req, res)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
  })
}

//App Routes - Auth
app.get('/', (req, res) => res.send('testing the routes'))
app.get('/expenses', (req, res) => main.getTableData(req, res, db))
app.post('/expenses', (req, res) => {
  return main.postTableData(req, res, db)
})
app.put('/expenses', (req, res) => main.putTableData(req, res, db))
app.delete('/expenses/:id', (req, res) => main.deleteTableData(req, res, db))


// App Server Connection
app.listen(process.env.PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT || 5000}`)
})