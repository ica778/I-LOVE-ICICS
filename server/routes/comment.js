const express = require('express');
const router = express.Router();
const comment = require('../models/comment');
const Sentence = require('../models/sentence');

router.get('/', async (_, res) => {
  try {
    const comments = await comment.find({});
    if (!comments)
      return res.status(404).json({ message: 'No comments found.' });
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

/* GET individual comment listing. */
router.get('/:id', async (req, res) => {
  try {
    const data = await comment.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No comment found' });
    res.json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { text, submittedBy, sentenceId, commentId } = req.body;
    if (commentId) {
      const parentComment = await comment.findById(commentId);
      if (!parentComment)
        return res.status(404).json({ message: 'No parent comment found.' });

      const newComment = await comment.create({
        text,
        submittedBy,
      });

      parentComment.responses.push(newComment._id);
      await parentComment.save();

      res.status(201).json(newComment);
    } else {
      const sentence = await Sentence.findById(sentenceId);
      if (!sentence)
        return res.status(404).json({ message: 'No sentence found.' });
      const data = await comment.create({
        text,
        submittedBy,
        sentenceId,
      });
      sentence.comments.push(data._id);
      await sentence.save();
      return res.status(201).json({ data });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.put('/', async (req, res) => {
  try {
    const { commentId, subcommentId, text } = req.body;
    const _comment = await comment.findById(commentId);
    if (!_comment)
      return res.status(404).json({ message: 'No comment found.' });

    let toEdit = _comment;
    if (subcommentId) {
      toEdit = _comment.responses.find(sub => sub.id == subcommentId);
      if (!toEdit)
        return res.status(404).json({ message: 'No subcomment found.' });
    }
    toEdit.text = text;
    const data = await _comment.save();
    return res.json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
