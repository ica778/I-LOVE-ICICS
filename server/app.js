require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const sentenceRouter = require('./routes/sentence');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');

const app = express();

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

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    const port = process.env.PORT ?? 8080;
    app.listen(port, () => {
      console.log(`LISTENING on :${port}`);
    });
  })
  .catch(err => {
    console.log('encountered an ERROR!!!!');
    console.log(err);
  });
