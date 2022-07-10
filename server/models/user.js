var mongoose = require('mongoose');
const {Schema} = mongoose;

module.exports = mongoose.model("User", new Schema({username: String, hash: String, submittedSentences: [{String}], savedSentences: [{String}], comments: [{String}] }));