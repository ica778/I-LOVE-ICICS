var mongoose = require('mongoose');
const {Schema} = mongoose;

let sentenceSchema = new Schema({text: String, usefulnessRating: Number, source: String, posString: [{type: String}], comments: [{
	// for storing comment ids
	type: String,
}]}, { timestamps: true });
sentenceSchema.index({"createdAt": 1});
sentenceSchema.index({"usefulnessRating": 1});

module.exports = mongoose.model("Sentence", sentenceSchema);