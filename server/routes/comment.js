var express = require('express');
var router = express.Router();
const Comment = require('../models/comment');
const bcrypt = require('bcrypt');

/* GET individual comment listing. */
router.get('/', async function(req, res, next) {
    try {
		let commentId = req.query.commentId;
		let comment = await Comment.findById(commentId);
		return comment;
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

router.post('/', async function(req, res, next) {
    try {
		let text = req.body.text;
		let userId = req.body.userId;
		let postId = req.body.postId;
		let comment = new Comment({ text: text, submittedBy: userId, parentId: postId, responses: []});
		await comment.save();
		return res.send('OK');

	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

router.put('/', async function(req, res, next) {
	try {
		let text = req.body.text;
		let commentId = req.body.commentId;
		let comment = await Comment.findById(commentId);
		comment.text = text;
		await comment.save();
		return res.send('OK');
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

module.exports = router;