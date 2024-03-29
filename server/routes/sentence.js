var express = require('express');
var router = express.Router();
const Sentence = require('../models/sentence');
const Comment = require('../models/comment');
const User = require('../models/user');
const moment = require('moment');
var pos = require('pos');
var nlp = require('compromise');
const { MongoClient, ObjectId } = require("mongodb");
const { compareSync } = require('bcrypt');
const client = new MongoClient("mongodb+srv://root:xuOuq4BJ7cN28MEc@cypress.ofwuv.mongodb.net/language_project");
client.connect();

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

router.get('/testdb', async function (req, res, next) {
	try {
		const db = client.db('language_project');
		let aggr_step = {
			$match: {
				$expr: {
					$function: {
						body: `function(posString) {
							return posString.length > 2;
						}`,
						args: ["$posString"],
						lang: "js"
					}
				}
			}
		}

		let sentences = db.collection('sentences').aggregate([aggr_step]);
		for await (const doc of sentences) {
			console.log(doc);
		}
		return res.send(sentences);	
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
})

router.get('/testpos', async function (req, res, next) {
	try {
		let expanded = nlp('wanna').contractions().expand().text();
		let tried = nlp('want to').contract().text();
		return res.send(tried);	
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
	let aggregateArr = [];
	try {
		let populate = req.query.populate;

		let id = req.query.sentenceId;
		let orderKey = req.query.orderKey;
		let timeFilterKey = req.query.timeFilterKey;

		if (orderKey) {
			if (orderKey === 'recent') {
				aggregateArr.push({ $sort: { createdAt: -1 }});
				let date = new Date();
				if (timeFilterKey === '7 days') {
					date.setDate(date.getDate() - 7);
					aggregateArr.push({ $match: { createdAt: { $gt: date }}});
				} else if (timeFilterKey === '24 hours') {
					date.setDate(date.getDate() - 1);
					aggregateArr.push({ $match: { createdAt: { $gt: date }}});
				} else if (timeFilterKey === '30 days') {
					date.setDate(date.getDate() - 30);
					aggregateArr.push({ $match: { createdAt: { $gt: date }}});
				}

				if (id) {
					let querySentence = await Sentence.findById(id);
					let b = querySentence.createdAt;
					aggregateArr.push({ $match: { createdAt: { $lt: b }}});
				}

				aggregateArr.push({ $limit: 10 });
				let sentences = await Sentence.aggregate(aggregateArr);
				await Comment.populate(sentences, 'text', () => {});
				return res.send(sentences);

			} else if (orderKey === 'trending') {
				if (timeFilterKey === '7 days') {
					aggregateArr.push({ $sort: { upvotesLast7DaysCount: -1, _id: -1 }});
					if (id) {
						let querySentence = await Sentence.findById(id);
						let b = querySentence.upvotesLast7DaysCount;
						aggregateArr.push({$match: { upvotesLast7DaysCount: { $lte: b }}});
					}
				} else if (timeFilterKey === '24 hours') {
					aggregateArr.push({ $sort: { upvotesLast24HoursCount: -1, _id: -1 }});
					if (id) {
						let querySentence = await Sentence.findById(id);
						let b = querySentence.upvotesLast24HoursCount;
						aggregateArr.push({$match: { upvotesLast24HoursCount: { $lte: b }}});
					}
				} else if (timeFilterKey === '30 days') {
					aggregateArr.push({ $sort: { upvotesLast30DaysCount: -1, _id: -1 }});
					if (id) {
						let querySentence = await Sentence.findById(id);
						let b = querySentence.upvotesLast30DaysCount;
						aggregateArr.push({$match: { upvotesLast30DaysCount: { $lte: b }}});
					}
				}
				if (!id) {
					aggregateArr.push({ $limit: 10 });
				}
				let sentences = await Sentence.aggregate(aggregateArr);
				console.log(`have a total length of: ${sentences.length}`)
				if (id) {
					let returnSentences = [];
					for (let i = 0; i < sentences.length; i++) {
						if (sentences[i]._id.toString() === id) {
							console.log('found!!!!')
							// change to 51 if limit is 50
							returnSentences = sentences.slice(i+1, i+11);
							break;
						}
					}
					console.log('RETURN SENTENCES LENGTH')
					console.log(returnSentences.length);
					await Comment.populate(returnSentences, 'text', () => {});
					return res.send(returnSentences);
				}
				return res.send(sentences);
			}
		}		
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

const searchHasPos = (txtArr) => {
	for (let a of txtArr) {
		if (a && a.length > 0 && a[0] === '{' && a[a.length - 1] === '}') {
			let b = a.slice(1, -1);
			if (b.length > 0) {
				return true;
			}
		}
	}
	return false;
}

function isLetter(str) {
	return str && str.length === 1 && str.match(/[a-z]/i);
}

function updateEltIdxExactWords(elt, exactWords) {
	for (let exactWord of exactWords) {
		let lastSeenIdx = elt.text.toLowerCase().search(`(^|[ \\.,\\?"'!])${exactWord}([ \\.,\\?"'!]|$)`)
		if (lastSeenIdx !== -1 && !isLetter(elt.text.toLowerCase()[lastSeenIdx])) lastSeenIdx++;
		while (lastSeenIdx !== -1) {
			console.log(lastSeenIdx);
			elt['searchTextIdxs'].push({start: lastSeenIdx, length: exactWord.length});
			let slicedString = elt.text.slice(lastSeenIdx + 1);
			let tempLastSeenIdx = slicedString.toLowerCase().search(`(^|[ \\.,\\?"'!])${exactWord}([ \\.,\\?"'!]|$)`)
			if (tempLastSeenIdx === -1) {
				lastSeenIdx = -1;
				break;
			}

			if (!isLetter(slicedString[tempLastSeenIdx])) tempLastSeenIdx++;
			lastSeenIdx = lastSeenIdx + tempLastSeenIdx + 1;
		}
	}
}

function updateEltIdxMainSearch(elt, regexString, searchIdx) {
	// finding length of corresponding text in the search res
	let regexStringIdx = 0;
	let searchResIdx = searchIdx;
	while (regexStringIdx < regexString.length && searchResIdx < elt.text.length) {
		if (regexString[regexStringIdx] === '[' || regexString[regexStringIdx] === '(') {
			if (regexString[regexStringIdx] === '[') {
				// search until next space
				let nxtSpace = elt.text.indexOf(' ', searchResIdx);
				if (nxtSpace === -1) {
					// current word is end of sentence
					searchResIdx = elt.text.length;
					break;
				} else {
					// found next space, need to reset loop
					regexStringIdx = regexStringIdx + 10;
					searchResIdx = nxtSpace + 1;
				}
			} else {
				// we encountered '('
				console.log('in encountering (')
				let closingBracketIdx = regexString.indexOf(')', regexStringIdx);
				let bracketContents = regexString.slice(regexStringIdx + 1, closingBracketIdx);
				let bracketContentsSplit = bracketContents.split('|');
				console.log(bracketContentsSplit);
				console.log(bracketContentsSplit[0].length)
				console.log(elt.text.substring(searchResIdx, bracketContentsSplit[0].length))
				console.log(elt.text.substring(searchResIdx, bracketContentsSplit[1].length))
				if ((elt.text.substring(searchResIdx, bracketContentsSplit[0].length + searchResIdx) === bracketContentsSplit[0] &&
					bracketContentsSplit[0].includes(' ')) ||
					(elt.text.substring(searchResIdx, bracketContentsSplit[1].length + searchResIdx) === bracketContentsSplit[1] &&
					bracketContentsSplit[1].includes(' '))) {
						console.log('in double word');
						// corresponds to double word
					let firstSpace = elt.text.indexOf(' ', searchResIdx);
					let secondSpace = elt.text.indexOf(' ', firstSpace + 1);
					if (secondSpace === -1) {
						searchResIdx = elt.text.length; 
						break;
					}
					searchResIdx = secondSpace + 1;
					regexStringIdx = closingBracketIdx + 2;
				} else {
					// corresponds to single word
					let firstSpace = elt.text.indexOf(' ', searchResIdx);
					searchResIdx = firstSpace + 1;
					regexStringIdx = closingBracketIdx + 2;
				}	
			}
		} else {
			regexStringIdx++;
			searchResIdx++;
		}
	}
	if (searchResIdx < elt.text.length && isLetter(elt.text[searchResIdx])) searchResIdx--;
	elt['searchTextIdxs'] = [];
	elt['searchTextIdxs'].push({start: searchIdx, length: searchResIdx - searchIdx})
}


router.get('/search', async function (req, res, next) {
	try {
		let searchText = req.query.search;
		if (searchText === undefined) searchText = '';
		let highlightedPart = req.query.highlightedPart;
		let lastSentenceId = req.query.lastSentenceId;
		let aggregateArr = [];
		let searchTextNoNots = '';
		if (!highlightedPart && !searchText) {
			throw new Error('Must fill at least one of the search boxes.')
		}

		if (highlightedPart) {
			aggregateArr.push(
				{ $match: { highlightedPart: { $regex: new RegExp(`(^|.* )"*${highlightedPart}($|["'*\\.\\?,! ]+ *.*)`)}}}
			);
		}
		let regexString = "";
		let searchTextArr = [];
		let exactWords = [];
		if (searchText) {
			if (searchText.includes('/')) {
				if (!searchText.includes('//')) {
					// Find all "exact" matches requested (eg. by /bob went//to the pool/)
					exactWords = textsBetweenChar(searchText, '/');
					for (let i of exactWords) {
						let regString = `(^|.* )"*${i}($|["'*\\.\\?,! ]+ *.*)`;
						aggregateArr.push(
							{ $match: { text: { $regex: new RegExp(`(^|.* )"*${i}($|["'*\\.\\?,! ]+ *.*)`, "i")}}}
						);
					}
				} else {
					exactWords = textsBetweenChar(searchText, '/');
					exactWords = exactWords.filter((val) => {
						return val !== '';
					})
					let regexStringExactWords = exactWords.join('.*');
					aggregateArr.push(
						{ $match: { text: { $regex: new RegExp('.*' + regexStringExactWords + '.*', "i") } } }
					);
				}
				searchText = searchText.slice(searchText.lastIndexOf('/') + 1);
			}
			// Find the "main" portion of text if there is one
			let idxOfBackslash = searchText.indexOf('\\');
			searchTextNoNots = searchText;
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
						if (tried !== potentialContract) {
							// found a collapsible contraction
							// "want to"
							// "wanna"
							i = `(${potentialContract}|${tried})`
							a++;
						}
					}
					regexString = regexString + ' ' + i;
				}
			}
			// (^|.* )"*He [A-Za-z]+ went to the mall["*\.\?,! ]+ *[A-Za-z]*
			regexString = regexString.trim();
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
		aggregateArr.push({ $sort: { createdAt: -1 }})
		if (!searchHasPos(searchTextArr)) {
			if (lastSentenceId) {
				let querySentence = await Sentence.findById(lastSentenceId);
				let date = querySentence.createdAt;
				const filter = { createdAt: { $lt: date }};
				aggregateArr.push({$match: filter});			
			}

			aggregateArr.push({ $limit: 10 });
			let searchRes = await Sentence.aggregate(aggregateArr);
			for (let elt of searchRes) {
				elt['searchTextIdxs'] = [];
				if (regexString) {
					let searchIdx = elt.text.toLowerCase().search(`(^|[ \\.,\\?"'!])${regexString}([ \\.,\\?"'!]|$)`)
					if (!isLetter(elt.text[searchIdx])) searchIdx++;
					updateEltIdxMainSearch(elt, regexString, searchIdx);
				}
				updateEltIdxExactWords(elt, exactWords);
			}
			return res.send(searchRes);
		} else {
			// search has part of speech
			let searchRes = await Sentence.aggregate(aggregateArr);
			let sentenceDate;
			if (lastSentenceId) {
				let querySentence = await Sentence.findById(lastSentenceId);
				sentenceDate = querySentence.createdAt;
			}

			let returnRes = [];

			for (let elt of searchRes) {
				if (sentenceDate) {
					if (elt.createdAt >= sentenceDate) {
						// current elt was created after the last sentence id from the frontend page
						continue;
					}
				}
				let text = elt.text;

				let includeCurrentEltOverall = false;
				let start_idx = 0;
				let searchIdx = -1;

				while (!includeCurrentEltOverall) {
					let includeCurrentEltCurrIter = true;
					searchIdx = elt.text.slice(start_idx, elt.text.length).toLowerCase().search(`(^|[ \\.,\\?"'!])${regexString}([ \\.,\\?"'!]|$)`)
					if (searchIdx === -1) break;
					if (!isLetter(elt.text[searchIdx])) searchIdx++;

					console.log(searchIdx);
					console.log(start_idx);
					// finding the relative word position for POS string in the element text
					let counter = 0;
					for (let i = 0; i < searchIdx + start_idx; i++) {
						if (text[i] === ' ') {
							counter++;
						}
					}
					for (let i = 0; i < searchTextArr.length; i++,counter++) {
						if (searchTextArr[i][0] === '{') {
							let posText = searchTextArr[i].slice(1, -1);
							if (posText.length > 0) {
								if (posText !== elt.posString[counter]) {
									includeCurrentEltCurrIter = false;
									break;
								}
							}
						}
					}
					if (includeCurrentEltCurrIter) {
						includeCurrentEltOverall = true;
					} else start_idx = start_idx + searchIdx + 1;
				}

				if (searchIdx !== -1) {
					updateEltIdxMainSearch(elt, regexString, start_idx + searchIdx);
					updateEltIdxExactWords(elt, exactWords);
					returnRes.push(elt);
				}
				// counter represents idx of the corresponding word to the searchText to start from 
				// need to account for case {JJ} -> exhaust all cases until we can return a result
	
				// if (includeCurrentElt) returnRes.push(elt);
				if (returnRes.length === 10) {
					return res.send(returnRes);
				}
			}
			return res.send(returnRes);
		}
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
