require("dotenv").config(); 
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Schema } = mongoose;

mongoose.connect(
    "mongodb://root:password@127.0.0.1:27017/public", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(async () => {
	const sentence = mongoose.model('sentence', new Schema({
		text: String,
	  }), 'sentence');
	  const sentences = await sentence.find();
	  console.log(sentences);
}).catch((err) => {
	console.log("encountered an ERROR!!!!");
	console.log(err);
});

var indexRouter = require('./routes/index');
var sentenceRouter = require('./routes/sentence');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sentence', sentenceRouter);

module.exports = app;