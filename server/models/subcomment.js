const { model, Schema } = require('mongoose');

const baseComment = {
  text: String,
  submittedBy: String,
  deleted: {
    type: Boolean,
    default: false,
  },
};

const Subcomment = new Schema(baseComment);

const subcomment = model('subcomment', Subcomment);

module.exports = { baseComment, subcomment, Subcomment };
