var mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
  'User',
  new Schema({
    _id: String,
    username: String,
    hash: String,
    password: String,
	submittedSentences: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Sentence'
		}
	],
    savedSentences: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Sentence'
		}
	],
    comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
  })
);
