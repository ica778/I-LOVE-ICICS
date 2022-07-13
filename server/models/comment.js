var mongoose = require('mongoose');
const {Schema} = mongoose;

let commentSchema = new Schema({text: String, parentId: String, submittedBy: String, deleted: { type: Boolean, default: false }, responses: [{
	// for storing comment ids
	type: String,
}]}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);