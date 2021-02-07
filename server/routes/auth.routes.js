const express = require('express')
const router = express.Router()
const db = require('../db/connection')
const User = require('../db/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const sendError = (res, statusCode, err) => {
	res.status(statusCode).send(err)
	return false
}

const createTokenSendResponse = (user, res) => {
	jwt.sign(
		user,
		process.env.JWT_SECRET,
		{ algorithm: 'HS256' },
		(err, token) => {
			if (err) {
				sendError(res, 500, { 'Problem signing JWT token': err })
			}
			res.status(200).send(token)
		}
	)
}

router.get('/', (req, res) => {
	// get token from the headers
	const authHeader = req.get('authorization').split(' ')[1]
	jwt.verify(authHeader, process.env.JWT_SECRET, (err, allUserInfo) => {
		if (err) {
			sendError(res, 401, { 'Problem with jwt': err })
		}

		User.findAll()
			.then(result => {
				res.json(result)
			})
			.catch(err => console.log(err))
	})
})

router.post('/register', async (req, res) => {
	const schema = Joi.object({
		username: Joi.string().alphanum().min(3).max(30).required(),
		email: Joi.string().pattern(
			new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
		),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
	})

	const { username, email, password } = req.body

	const validation = schema.validate({
		username: username,
		email: email,
		password: password,
	})

	if (validation.error) {
		if (validation.error.details[0].path[0] === 'email') {
			res.status(409).send('Invalid email address')
			return false
		} else {
			res.status(409).send(validation.error.details[0])
			return false
		}
	}

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, async (err, hash) => {
			if (err) {
				res.status(200).json(err)
				return false
			}
			const data = User.build({
				username: username,
				email: email,
				password: hash,
			})
			try {
				// In order to save (i.e. persist) this instance in the database,
				// the save method should be used
				await data
					.save()
					.then(res => console.log('data saved to the db: ', res))
				res.status(200).send(data)
			} catch (error) {
				res.status(409).send({ err: error.errors[0].message })
			}
			// res.status(200).json({ hashedPS: hash })
		})
	})
	// build() creates an object that represents data that can be mapped to a database#
})

router.post('/login', async (req, res) => {
	const { username, email, password } = req.body

	const userInDb = await User.findOne({ where: { username: username } })
	if (userInDb === null) {
		console.log('Not found!')
	} else {
		// user found

		// compare ps against hash
		bcrypt.compare(password, userInDb.password).then(response => {
			// If passwords match
			console.log('response ', response) // 'My Title'
			if (response) {
				createTokenSendResponse(req.body, res)
			} else {
				res.status(401).send('There was a problem with your login')
			}
		})
	}

	// jwt.sign( req.body, process.env.JWT_SECRET,{ algorithm: 'RS256' }, (err, token) => {
	// 	console.log(token);
	// });
})

module.exports = router
