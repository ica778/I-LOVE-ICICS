const { model, Schema } = require('mongoose');
const { baseComment, Subcomment } = require('./subcomment');

const comment = new Schema({
  sentenceId: {
    type: Schema.Types.ObjectId,
    ref: 'Sentence',
  },
  ...baseComment,
  responses: [Subcomment],
});

module.exports = model('Comment', comment);
