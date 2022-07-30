var mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
  'User',
  new Schema({
    username: String,
    hash: String,
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
