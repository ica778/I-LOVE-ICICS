require("dotenv").config(); 
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Schema } = mongoose;
var cors = require('cors');
const indexRouter = require('./routes/index');
const sentenceRouter = require('./routes/sentence');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
var cron = require('node-cron');
const Sentence = require('./models/sentence');

var app = express();
app.use(cors());
app.use(logger('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/sentence', sentenceRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});
// "mongodb://127.0.0.1:27017"
mongoose.connect(
    'mongodb+srv://root:xuOuq4BJ7cN28MEc@cypress.ofwuv.mongodb.net/language_project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err) => {console.log(err)});


module.exports = app;

cron.schedule('30 40 22 * * *', async function() {
	try {
		// for each timestamp in 24 hours array for each sentence, check if now() - timestamp > 24 hours. If so, move it 
		// to the 7 day array. Same for 7 day array. For 30 days array, delete anything: now() - timestamp > 30 days
		let sentences = await Sentence.find();
		let currentDate = new Date();
		console.log('running cron');
		for (let sentence of sentences) {
			let dayArray = sentence.upvotesLast24Hours;
			let moveTo7DaysArray = [];
			
			// removing stuff that passed a day
			for (let i = dayArray.length - 1; i > -1; i--) {
				let timeStamp = dayArray[i];
				let hourDifference  = (currentDate - timeStamp.getTime()) / 3600000;
				console.log(sentence.text);
				console.log(hourDifference);
				if (hourDifference > 24) {
					sentence.upvotesLast24Hours.pop();
					moveTo7DaysArray.push(timeStamp);
				}
			}
			console.log('2');
			console.log(moveTo7DaysArray);
			sentence.upvotesLast24HoursCount = sentence.upvotesLast24HoursCount - moveTo7DaysArray.length;
			moveTo7DaysArray = moveTo7DaysArray.reverse();
			let weekArray = sentence.upvotesLast7Days;
			sentence.upvotesLast7Days = [...moveTo7DaysArray, ...weekArray];
			let moveTo30DaysArray = [];

			console.log('3');
			for (let i = weekArray.length - 1; i > -1; i--) {
				let timeStamp = weekArray[i];
				let hourDifference = (currentDate - timeStamp.getTime()) / 3600000;
				if (hourDifference > 168) {
					sentence.upvotesLast7Days.pop();
					moveTo30DaysArray.push(timestamp);
				}
			}

			console.log('4');
			sentence.upvotesLast7DaysCount = sentence.upvotesLast7DaysCount - moveTo30DaysArray.length;

			moveTo30DaysArray = moveTo30DaysArray.reverse();
			let monthArray = sentence.upvotesLast30Days;
			sentence.upvotesLast30Days = [...moveTo30DaysArray, ...monthArray]

			console.log('5');
			for (let i = monthArray.length - 1; i > -1; i--) {
				let timeStamp = monthArray[i];
				let hourDifference = (currentDate - timeStamp.getTime()) / 3600000;
				if (hourDifference > 720) {
					sentence.upvotesLast30Days.pop();
					sentence.upvotesLast30DaysCount = sentence.upvotesLast30DaysCount - 1;
				}
			}

			console.log(sentence.upvotesLast24Hours);
			console.log(sentence.upvotesLast7Days);

			console.log('6');
			await sentence.save();
		}
	} catch (err) {
		console.log(err);
	}
})