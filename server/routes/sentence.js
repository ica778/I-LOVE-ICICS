var express = require('express');
var router = express.Router();
const Sentence = require('../models/sentence');
const Comment = require('../models/comment');
const User = require('../models/user');
const moment = require('moment');
var pos = require('pos');
var nlp = require('compromise');
// import findExactWords from '../utils';

/* GET sentence listing. */
router.get('/', async function (req, res, next) {
  try {
    let populate;
    if (req.query.populate) populate = req.query.populate?.split(',');
    const data = populate?.length
      ? await Sentence.find().populate('comments', populate.join(' '))
      : await Sentence.find();
    res.json(data);
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
});

router.get('/test', async function (req, res, next) {
	try {
		let sentences = await Sentence.find();
		let sentence = sentences[0];
		console.log(sentence.upvotesLast24Hours);
		sentence.upvotesLast24Hours.pop();
		await sentence.save();

		return res.send(sentence.text);	
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

router.get('/:id/comments', async (req, res) => {
  try {
    const sentence = await Sentence.findById(req.params.id);
    if (!sentence) return res.status(500).send('Sentence does not exist');
    await sentence.populate('comments', 'submittedBy text');
    res.json(sentence.comments);
  } catch (err) {
    console.error({ err });
    res.status(500).json(err);
  }
});

router.get('/recent50/', async function(req, res, next) {
	console.log(' at recent 50 from backend');
	let aggregateArr = [];
	try {
		let populate = req.query.populate;
		console.log(populate);

		let id = req.query.sentenceId;
		let orderKey = req.query.orderKey;
		console.log(orderKey);
		let timeFilterKey = req.query.timeFilterKey;

		if (orderKey) {
			if (orderKey === 'recent') {
				aggregateArr.push({ $sort: { createdAt: -1 }});
			} else if (orderKey === 'trending') {
				if (timeFilterKey === '7 days') {
					aggregateArr.push({ $sort: { upvotesLast7DaysCount: -1 }});
				} else if (timeFilterKey === '24 hours') {
					aggregateArr.push({ $sort: { upvotesLast24HoursCount: -1 }});
				} else if (timeFilterKey === '30 days') {
					aggregateArr.push({ $sort: { upvotesLast30DaysCount: -1 }});
				}
			}
		}

		if (id) {
			let querySentence = await Sentence.findById(id);
			let date = querySentence.createdAt;
			const filter = { createdAt: { $lt: date }};
			aggregateArr.push({$match: filter});			
		}

		aggregateArr.push({ $limit: 50 });

		let sentences = await Sentence.aggregate(aggregateArr);
		console.log(sentences);
		
		await Comment.populate(sentences, 'text', () => {});
		return res.send(sentences);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

const textsBetweenChar = (text, char) => {
  if (text[0] !== char) {
    throw new Error('Incorrectly formatted input text.');
  }
  let retWords = [];
  let buildWord = '';
  for (let i = 1; i < text.length; i++) {
    if (text[i] === char) {
      retWords.push(buildWord);
      buildWord = '';
    } else buildWord += text[i];
  }

  return retWords;
};

router.get('/search', async function (req, res, next) {
	try {
		let searchText = req.query.search;
		let highlightedPart = req.query.highlightedPart;
		let lastSentenceId = req.query.lastSentenceId;
		let aggregateArr = [];
		if (!highlightedPart && !searchText) {
			throw new Error('Must fill at least one of the search boxes.')
		}

		if (highlightedPart) {
			aggregateArr.push(
				{ $match: { highlightedPart: { $regex: new RegExp('.*' + highlightedPart + '.*', 'i') } } }
			);
		}
		let regexString = "";
		let searchTextArr = [];
		if (searchText) {
			if (searchText.includes('/')) {
				if (!searchText.includes('//')) {
					// Find all "exact" matches requested (eg. by /bob went//to the pool/)
					let exactWords = textsBetweenChar(searchText, '/');
					console.log(exactWords);
					for (let i of exactWords) {
						let regString = `(^|.* )"*${i}($|["'*\\.\\?,! ]+ *.*)`;
						console.log(regString);
						aggregateArr.push(
							{ $match: { text: { $regex: new RegExp(`(^|.* )"*${i}($|["'*\\.\\?,! ]+ *.*)`, "i")}}}
						);
					}
				} else {
					let exactWords = textsBetweenChar(searchText, '/');
					exactWords = exactWords.filter((val) => {
						return val !== '';
					})
					let regexString = exactWords.join('.*');
					aggregateArr.push(
						{ $match: { text: { $regex: new RegExp('.*' + regexString + '.*', "i") } } }
					);
				}
				searchText = searchText.slice(searchText.lastIndexOf('/') + 1);
			}
			// Find the "main" portion of text if there is one
			let idxOfBackslash = searchText.indexOf('\\');
			let searchTextNoNots = searchText;
			if (idxOfBackslash !== -1) {
				searchTextNoNots = searchText.substring(0, idxOfBackslash);
			}

			searchTextArr = searchTextNoNots.split(' ');
			for (let a = 0; a < searchTextArr.length; a++) {
				let i = searchTextArr[a];

				if (i[0] === '{') {
					regexString = regexString + ' ' + '[A-Za-z]+';
				} else {
					let expanded = nlp(i).contractions().expand().text();
					if (expanded) {
						i = `(${i}|${expanded})`
					} else if (a < searchTextArr.length - 1) {
						// looking to contract
						let potentialContract = i + ' ' + searchTextArr[a + 1];
						let tried = nlp(potentialContract).contract().text();
						console.log(potentialContract);
						console.log(tried);
						if (tried !== potentialContract) {
							// found a collapsible contraction
							// "want to"
							// "wanna"
							console.log('we found one boys!')
							i = `(${potentialContract}|${tried})`
							a++;
						}
					}
					regexString = regexString + ' ' + i;
				}
			}
			// (^|.* )"*He [A-Za-z]+ went to the mall["*\.\?,! ]+ *[A-Za-z]*
			regexString = regexString.trim();
			console.log('printing regex string');
			console.log(regexString);
			if (regexString) {
				aggregateArr.push(
					{ $match: { text: { $regex: new RegExp(`(^|.* )"*${regexString}($|["'*\\.\\?,! ]+ *.*)`, "i")}}}
				);
			}
			
			// Find the parts to remove from text if there are any
			if (searchText.includes('\\')) {
				let idx = searchText.indexOf('\\');
				searchText = searchText.slice(idx);
				let removeTextArr = textsBetweenChar(searchText, '\\');
				for (let i of removeTextArr) {
					aggregateArr.push(
						{ $match: { text: { $regex: new RegExp(`^(?!"*'*${i}"*'*\\.*,*\\?*!* .+|.+ "*'*${i}"*'*\\.*,*\\?*!* .+|.+ "*'*${i}"*'*\\.*,*\\?*!*$).*`, "i")}}}
					);
				}
			}
		}

		let searchRes = await Sentence.aggregate(aggregateArr);
		let returnRes = [];
		let seenPosInSearchText = false;

		if (searchText) {
			for (let elt of searchRes) {
				let text = elt.text;
				let idx = text.search(regexString);
				let counter = 0;
				for (let i = 0; i < idx; i++) {
					if (text[i] === ' ') {
						counter++;
					}
				}
				console.log('counter is ' + counter);
				console.log(elt.posString)
				console.log('orig string arr form is: ' + searchTextArr);
				let includeCurrentElt = true;
				// counter represents idx of the corresponding word to the searchText to start from 
				for (let i = 0; i < searchTextArr.length; i++,counter++) {
					if (searchTextArr[i][0] === '{') {
						let posText = searchTextArr[i].slice(1, -1);
						if (posText.length > 0) {
							seenPosInSearchText = true;
							if (posText !== elt.posString[counter]) {
								includeCurrentElt = false;
								break;
							}
						}
					}
				}
	
				if (includeCurrentElt) returnRes.push(elt);
			}
		}
		if (seenPosInSearchText) return res.send(returnRes);
		else return res.send(searchRes);
		
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

router.post('/', async function(req, res, next) {
	try {
		let text = req.body.text.trim();
		let userid = req.headers.userid;
		console.log(userid);
		let source = req.body.source ? req.body.source.trim() : '';
		let highlightedPart = req.body.highlightedPart ? req.body.highlightedPart : '';
		let posString = [];

		let words = new pos.Lexer().lex(text);
		let tagger = new pos.Tagger();
		let taggedWords = tagger.tag(words);
		for (let taggedWord of taggedWords) {
			posString.push(taggedWord[1].substring(0, 2));
		}
		console.log(posString);
		console.log(highlightedPart);
		let sentence = new Sentence(
			{
				text: text, 
				usefulnessRating: 0, 
				submittedBy: userid,
				viewCount: 0, 
				highlightedPart: highlightedPart, 
				source: source, 
				posString: posString, 
				comments: [], 
				upvotesLast24Hours: [], 
				upvotesLast7Days: [], 
				upvotesLast30Days: [],
				upvotesLast24HoursCount: 0,
				upvotesLast7DaysCount: 0,
				upvotesLast30DaysCount: 0,
			});
		let sentenceSaved = await sentence.save();

		let user = await User.findById(userid);
		user.submittedSentences = [...user.submittedSentences, sentence._id]
		await user.save();
		return res.send(sentence);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

router.put('/viewcount', async function (req, res, next) {
	try {
		let ids = req.body.ids;
		let sentences = await Sentence.find({
			'_id': {
				$in: ids
			}
		});
		sentences.forEach(async (sentence) => {
			sentence.viewCount = sentence.viewCount + 1;
			await sentence.save();
		})
		return res.send('OK');
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

router.put('/upvote', async function (req, res, next) {
	try {
		let id = req.body.id;
		let sentence = await Sentence.findById(id);
		sentence.upvotesLast24Hours = [new Date(), ...sentence.upvotesLast24Hours];
		sentence.usefulnessRating = sentence.usefulnessRating + 1;
		sentence.upvotesLast24HoursCount = sentence.upvotesLast24HoursCount + 1;
		sentence.upvotesLast7DaysCount = sentence.upvotesLast7DaysCount + 1;
		sentence.upvotesLast30DaysCount = sentence.upvotesLast30DaysCount + 1;
		await sentence.save();
		return res.send('OK');
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

router.delete('/', async function (req, res, next) {
  try {
    let id = req.query.id;
    if (id) {
      await Sentence.findByIdAndRemove(id);
    } else {
      await Sentence.deleteMany({});
    }
    return res.send('OK');
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
