var mongoose = require('mongoose');
const { Schema } = mongoose;

//TODO: make the password hash
module.exports = mongoose.model(
  'User',
  new Schema({
    _id: String,
    username: String,
    hash: String,
    password: String,
    submittedSentences: [{ String }],
    savedSentences: [{ String }],
    comments: [{ String }],
  })
);
