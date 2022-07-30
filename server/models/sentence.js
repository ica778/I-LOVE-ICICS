const { model, Schema } = require('mongoose');

const sentenceSchema = new Schema(
  {
    text: String,
    usefulnessRating: Number,
    source: String,
    posString: [{ type: String }],
	viewCount: Number,
	highlightedPart: String,
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
	upvotesLast24HoursCount: Number,
	upvotesLast7DaysCount: Number,
	upvotesLast30DaysCount: Number,
	upvotesLast24Hours: [{ type: Date }],
	upvotesLast7Days: [{ type: Date}],
	upvotesLast30Days: [{ type: Date }]
  },
  { timestamps: true }
);
sentenceSchema.index({ createdAt: 1 });
sentenceSchema.index({ usefulnessRating: 1 });

module.exports = model('Sentence', sentenceSchema);
