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

/*
mongoose.connect(
    "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ar138.mongodb.net/?retryWrites=true&w=majority", 
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
*/
app.set('port', (process.env.PORT || 5000));

const uri = 'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ar138.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection successful===============================================================" + process.env.PORT);
});