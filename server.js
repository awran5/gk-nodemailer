require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const cors = require('cors')

// Firebase
const firebase = require('firebase/app')
require('firebase/firestore')

const db = firebase.initializeApp({
	apiKey: process.env.FIREBASE_API,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID
})

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	host: process.env.HOST,
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.SENDER,
		pass: process.env.PASSWORD
	},
	tls: {
		rejectUnauthorized: false
	}
})

app.use(cors())
app.use(express.json())

app.post('/send', (req, res) => {
	const { name, email, subject, message } = req.body

	// setup email data with unicode symbols
	let mailOptions = {
		from: `"GK Style" <${process.env.SENDER}>`,
		to: process.env.RECEIVER, // list of receivers
		subject: '📩 New Message From GK Style!',
		html: `
		<table>
			<tbody>
				<tr>
				<td><b>Name:</b></td>
				<td>${name}</td>
				</tr>
				<tr>
				<td><b>Email:</b></td>
				<td>${email}</td>
				</tr>
				<tr>
				<td><b>Subject:</b></td>
				<td>${subject}</td>
				</tr>
				<tr>
				<td><b>Message:</b></td>
				<td>${message}</td>
				</tr>
			</tbody>
		</table>
		<br><br>
		-- 
		<small>This e-mail sent from GK Style contact page.</small>
  `
	}

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.sendStatus(500)
		}

		// save to database
		db.firestore().collection('contacts').add({
			name,
			email,
			subject,
			message,
			timestamp: new Date().toLocaleString()
		})
		// return server response
		res.sendStatus(200)
	})
})

app.post('/quote', (req, res) => {
	const { name, email, company, job, phone, country, services, type, hosting, time, budget, message } = req.body
	// setup email data with unicode symbols
	let mailOptions = {
		from: `"GK Style" <${process.env.SENDER}>`,
		to: process.env.RECEIVER, // list of receivers
		subject: '🔥 New Request From GK Style!',
		html: `
		<table>
			<tbody>
				<tr>
					<td><b>Name:</b></td>
					<td>${name}</td>
				</tr>
				<tr>
					<td><b>Email:</b></td>
					<td>${email}</td>
				</tr>
				<tr>
					<td><b>Company:</b></td>
					<td>${company}</td>
				</tr>
				<tr>
					<td><b>Job Title:</b></td>
					<td>${job}</td>
				</tr>
				<tr>
					<td><b>Phone:</b></td>
					<td>${phone}</td>
				</tr>
				<tr>
					<td><b>Country:</b></td>
					<td>${country}</td>
				</tr>
				<tr>
					<td><b>Service Need:</b></td>
					<td>${services}</td>
				</tr>
				<tr>
					<td><b>Service Type:</b></td>
					<td>${type}</td>
				</tr>
				<tr>
					<td><b>Hosting:</b></td>
					<td>${hosting}</td>
				</tr>
				<tr>
					<td><b>Time Frame:</b></td>
					<td>${time}</td>
				</tr>
				<tr>
					<td><b>Budget:</b></td>
					<td>${budget}</td>
				</tr>
				<tr>
					<td><b>Message:</b></td>
					<td>${message}</td>
				</tr>
			</tbody>
		</table>
		<br><br>
		-- 
		<small>This e-mail sent from GK Style request page.</small>
  `
	}

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.sendStatus(500)
		}
		// save to database
		db.firestore().collection('requests').add({
			name,
			email,
			company,
			job,
			phone,
			country,
			services,
			type,
			hosting,
			time,
			budget,
			message,
			timestamp: new Date().toLocaleString()
		})
		res.sendStatus(200)
	})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
