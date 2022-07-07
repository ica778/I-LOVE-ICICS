const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(
    "mongodb://127.0.0.1:27017/public", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
	const sentence = mongoose.model('sentence', new Schema({
		text: String,
	  }), 'sentence');
}).catch((err) => {
	console.log("encountered an ERROR!!!!");
	console.log(err);
});

module.exports = mongoose;