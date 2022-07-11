var express = require('express');
var router = express.Router();
const Sentence = require('../models/sentence');
const moment = require('moment');
var pos = require('pos');
var nlp = require('compromise');
// import findExactWords from '../utils';

/* GET sentence listing. */
router.get('/', async function(req, res, next) {
	let sentences;
	try {
		sentences = await Sentence.find();
		// let doc = nlp(`The quick brown fox is not actually brown LOL but i saw it yesterday`);
		// doc.compute('penn');
		// let json = doc.json()[0].terms;
		// let a = json.map(term => [ term.text, term.penn] );
		// console.log(a);
		// var words = new pos.Lexer().lex('The quick brown fox is not actually brown LOL but i saw it yesterday');
		// var tagger = new pos.Tagger();
		// var taggedWords = tagger.tag(words);
		// for (i in taggedWords) {
		// 	var taggedWord = taggedWords[i];
		// 	var word = taggedWord[0];
		// 	var tag = taggedWord[1];
		// 	console.log(word + " /" + tag);
		// }
	} catch (err) {
		return res.status(500).send(err);
	}
  return res.send(sentences);
});

router.get('/recent50/', async function(req, res, next) {
	try {
		let id = req.query.id;
		if (id) {
			let querySentence = await Sentence.findById(id);
			if (querySentence) {
				let date = querySentence.createdAt;
				if (date instanceof Date) {
					let dateISOString = date.toISOString();
					console.log(dateISOString.toString());
					const filter = { createdAt: { $lt: date }};
					let sentences = await Sentence.aggregate([
						{ $match: filter },
						{ $sort: { createdAt: -1 }},
						{ $limit: 50 }
					]);
					return res.send(sentences);
				}
			}
		} else {
			let recent50 = await Sentence.find().sort({createdAt: -1}).limit(50);
			return res.send(recent50);
		}
	} catch (err) {
		return res.status(500).send(err);
	}
});

const textsBetweenChar = (text, char) => {
    if (text[0] !== char) {
        throw new Error('Incorrectly formatted input text.')
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
}

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
					aggregateArr.push(
						{ $match: { text: { $regex: new RegExp(i, "i") } } }
					);
				}
			} else {
				let exactWords = textsBetweenChar(searchText, '/');
				exactWords = exactWords.filter((val) => {
					return val !== '';
				})
				let regexString = exactWords.join('.*');
				aggregateArr.push(
					{ $match: { text: { $regex: new RegExp(regexString, "i") } } }
				);
			}
			searchText = searchText.slice(searchText.lastIndexOf('/') + 1);
		}

		// Find the "main" portion of text if there is one
		let regexString = "";
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
		regexString = regexString.trim();
		console.log(regexString);
		aggregateArr.push(
			{ $match: { text: { $regex: new RegExp(regexString, "i")}}}
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
		let posString = [];

		let words = new pos.Lexer().lex(text);
		let tagger = new pos.Tagger();
		let taggedWords = tagger.tag(words);
		for (let taggedWord of taggedWords) {
			posString.push(taggedWord[1].substring(0, 2));
		}
		console.log(posString);
		let sentence = new Sentence({text: text, usefulnessRating: 0, source: source, posString: posString});
		let sentenceSaved = await sentence.save();
		return res.send(sentenceSaved);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

router.put('/', async function(req, res, next) {
	try {
		let text = req.body.text;
		let usefulnessRating = req.body.usefulnessRating;
		let sentenceId = req.body.sentenceId;
		let source = req.body.source;
		let posString = req.body.posString;

		let sentence = await Sentence.findById(sentenceId);
		sentence.text = text;
		sentence.usefulnessRating = sentence.usefulnessRating + usefulnessRating;
		sentence.source = source;
		sentence.posString = posString;
		let sentenceSaved = sentence.save();
		return res.send(sentenceSaved);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.delete('/', async function(req, res, next) {
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
})

module.exports = router;