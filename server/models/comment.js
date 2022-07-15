const { model, Schema } = require('mongoose');

const comment = new Schema(
  {
    sentenceId: {
      type: Schema.Types.ObjectId,
      ref: 'Sentence',
    },
    text: {
      type: String,
      required: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    responses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Comment', comment);
