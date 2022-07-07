var express = require('express');
var router = express.Router();
const Sentence = require('../models/sentence');

/* GET users listing. */
router.get('/', async function(req, res, next) {
	try {
		const sentences = await Sentence.find();
		console.log(sentences);
	} catch (err) {
		next(err);
	}
  res.send('respond with a resource');
});

module.exports = router;
