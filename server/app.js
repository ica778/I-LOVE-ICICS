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

var app = express();
app.use(cors());
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sentence', sentenceRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);

mongoose.connect(
    "mongodb://127.0.0.1:27017/language_project", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
		app.listen(3001, () => {
			'app listening on port 3001'
		});
	}).catch((err) => {
	console.log("encountered an ERROR!!!!");
	console.log(err);
});