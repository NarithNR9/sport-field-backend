require('dotenv').config()

const pool = require('./config/database')
const bodyParser = require('body-parser')
const express = require('express')
const {errorHandler} = require('./middleware/errorMiddleware')
const adminRoute = require('./routes/admin.router')
const playerRoute = require('./routes/player.router')
const ownerRoute = require('./routes/owner.router')
const fieldRoute = require('./routes/field.router')

const app = express()

app.use(bodyParser.json())

app.use(errorHandler)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE') // or '*' for all method
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/admin', adminRoute)

app.use('/players', playerRoute)

app.use('/owners', ownerRoute)

app.use('/field', fieldRoute)

app.listen(process.env.APP_PORT)
