require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 5002
// routes
const authRoutes = require('./routes/auth.routes')

const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')

const db = require('./db/connection')

db.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
	})

app.use(helmet())
app.use(morgan('dev'))
// app.use(cors)
app.use(express.json())
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
	console.log(req.body)
	res.send(req.body)
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
