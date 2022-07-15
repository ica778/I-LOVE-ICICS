const { model, Schema } = require('mongoose');

const sentenceSchema = new Schema(
  {
    text: String,
    usefulnessRating: Number,
    source: String,
    posString: [{ type: String }],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);
sentenceSchema.index({ createdAt: 1 });
sentenceSchema.index({ usefulnessRating: 1 });

module.exports = model('Sentence', sentenceSchema);
