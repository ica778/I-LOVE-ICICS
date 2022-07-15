var express = require('express');
var router = express.Router();
const Sentence = require('../models/sentence');
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

router.get('/:id/comments', async (req, res) => {
  try {
    const sentence = await Sentence.findById(req.params.id);
    if (!sentence) return res.json({ message: 'No sentence found.' });
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
		let id = req.query.id;
		let orderKey = req.query.orderKey;
		let timeFilterKey = req.query.timeFilterKey;
		aggregateArr.push({ $limit: 50 });

		if (id) {
			let querySentence = await Sentence.findById(id);
			let date = querySentence.createdAt;
			let dateISOString = date.toISOString();
			const filter = { createdAt: { $lt: date }};
			aggregateArr.push({$match: filter});
			// let sentences = await Sentence.aggregate([
			// 	{ $match: filter },
			// 	{ $sort: { createdAt: -1 }},
			// 	{ $limit: 50 }
			// ]);			
		}
		if (orderKey) {
			if (orderKey === 'viewCount') {
				aggregateArr.push({$sort: { viewCount: -1, createdAt: -1 }});
			} else if (orderKey === 'usefulnessRating') aggregateArr.push({ $sort: { usefulnessRating: -1, createdAt: -1}});
			else aggregateArr.push({ $sort: { createdAt: -1 }});
		} else {
			aggregateArr.push({ $sort: { createdAt: -1 }});
		}

		if (timeFilterKey) {
			let date = new Date();
			if (timeFilterKey === '7 days') {
				date.setDate(date.getDate() - 7);
				aggregateArr.push({ $match: { createdAt: { $gt: date }}});
			} else if (timeFilterKey === '30 days') {
				date.setDate(date.getDate() - 30);
				aggregateArr.push({ $match: { createdAt: { $gt: date }}});
			} else if (timeFilterKey === '24 hours') {
				date.setDate(date.getDate() - 1);
				aggregateArr.push({ $match: { createdAt: { $gt: date }}});
			}
		}

		let sentences = await Sentence.aggregate(aggregateArr);
		return res.send(sentences);
	} catch (err) {
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
    let aggregateArr = [];
    if (searchText.includes('/')) {
      if (!searchText.includes('//')) {
        // Find all "exact" matches requested (eg. by /bob went/ /to the pool/)
        let exactWords = textsBetweenChar(searchText, '/');
        console.log(exactWords);
        for (let i of exactWords) {
          aggregateArr.push({
            $match: { text: { $regex: new RegExp(i, 'i') } },
          });
        }
      } else {
        let exactWords = textsBetweenChar(searchText, '/');
        exactWords = exactWords.filter(val => {
          return val !== '';
        });
        let regexString = exactWords.join('.*');
        aggregateArr.push({
          $match: { text: { $regex: new RegExp(regexString, 'i') } },
        });
      }
      searchText = searchText.slice(searchText.lastIndexOf('/') + 1);
    }

    // Find the "main" portion of text if there is one
    let regexString = '';
    let idxOfBackslash = searchText.indexOf('\\');
    let searchTextNoNots = searchText;
    if (idxOfBackslash !== -1) {
      searchTextNoNots = searchText.substring(0, idxOfBackslash);
    }

    let searchTextArr = searchTextNoNots.split(' ');
    for (let i of searchTextArr) {
      if (i[0] === '{') {
        regexString = regexString + ' ' + '([^_]+)';
      } else regexString = regexString + ' ' + i;
    }
    let retWords = [];
    let buildWord = '';
    for (let i = 1; i < text.length; i++) {
        if (text[i] === char) {
			buildWord = buildWord.trim();
            retWords.push(buildWord);
            buildWord = '';
        } else buildWord += text[i];
    }

    let searchRes = await Sentence.aggregate(aggregateArr);
    let returnRes = [];
    let seenPosInSearchText = false;

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
      console.log(elt.posString);
      console.log('orig string arr form is: ' + searchTextArr);
      let includeCurrentElt = true;
      // counter represents idx of the corresponding word to the searchText to start from
      for (let i = 0; i < searchTextArr.length; i++, counter++) {
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
    if (seenPosInSearchText) return res.send(returnRes);
    else return res.send(searchRes);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get('/search', async function (req, res, next) {
	try {
		let searchText = req.query.search;
		let highlightedPart = req.query.highlightedPart;
		let aggregateArr = [];
		if (searchText.includes('/')) {
			if (!searchText.includes('//')) {
				// Find all "exact" matches requested (eg. by /bob went//to the pool/)
				let exactWords = textsBetweenChar(searchText, '/');
				console.log(exactWords);
				for (let i of exactWords) {
					aggregateArr.push(
						{ $match: { text: { $regex: new RegExp('.*' + i + '.*', "i") } } }
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

		if (highlightedPart) {
			aggregateArr.push(
				{ $match: { highlightedParts: { $regex: new RegExp('.*' + highlightedPart + '.*', i) } } }
			);
		}

		// Find the "main" portion of text if there is one
		let regexString = "";
		let idxOfBackslash = searchText.indexOf('\\');
		let searchTextNoNots = searchText;
		if (idxOfBackslash !== -1) {
			searchTextNoNots = searchText.substring(0, idxOfBackslash);
		}

		let searchTextArr = searchTextNoNots.split(' ');
		for (let a = 0; a < searchTextArr.length; a++) {
			let i = searchTextArr[a];

			if (i[0] === '{') {
				regexString = regexString + ' ' + '([^_]+)';
			} else {
				let expanded = nlp(i).contractions().expand().text();
				if (expanded) {
					i = '(' + i + '|' + expanded + ')';
				} else if (a < searchTextArr.length - 1) {
					// looking to contract
					let potentialContract = i + ' ' + searchTextArr[a + 1];
					let tried = nlp(potentialContract).contract().text();
					if (tried !== potentialContract) {
						// found a collapsible contraction
						// "want to"
						// "wanna"
						i = '(' + potentialContract + '|' + tried + ')';
						a++;
					}
				}
				regexString = regexString + ' ' + i;
			}
		}
		regexString = regexString.trim();
		console.log(regexString);
		aggregateArr.push(
			{ $match: { text: { $regex: new RegExp('.*' + regexString + '.*', "i")}}}
		);
		
		// Find the parts to remove from text if there are any
		if (searchText.includes('\\')) {
			let idx = searchText.indexOf('\\');
			searchText = searchText.slice(idx);
			let removeTextArr = textsBetweenChar(searchText, '\\');
			for (let i of removeTextArr) {
				aggregateArr.push(
					{ $match: { text: { $regex: new RegExp('^(?!' + i + ' |.+ ' + i + ' .+|.+ ' + i + '$).*', "i") }}}
				);
			}
		}

		let searchRes = await Sentence.aggregate(aggregateArr);
		let returnRes = [];
		let seenPosInSearchText = false;

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
		let source = req.body.source ? req.body.source.trim() : '';
		let highlightedParts = req.body.highlightedParts ? req.body.highlightedParts : '';
		let posString = [];

		let words = new pos.Lexer().lex(text);
		let tagger = new pos.Tagger();
		let taggedWords = tagger.tag(words);
		for (let taggedWord of taggedWords) {
			posString.push(taggedWord[1].substring(0, 2));
		}
		console.log(posString);
		console.log(highlightedParts);
		let sentence = new Sentence({text: text, usefulnessRating: 0, viewCount: 0, highlightedParts: highlightedParts, source: source, posString: posString, comments: []});
		let sentenceSaved = await sentence.save();
		return res.send(sentenceSaved);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

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
