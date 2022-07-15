import axios from 'axios';
import { baseUrl } from './config';

export const createNewSentence = async (text, highlightedParts, source) => {
	console.log(highlightedParts)
	let userId = localStorage.getItem("userId");

	let res = await axios.post(baseUrl + '/sentence', {
		text, highlightedParts, source
	});

	return res;
}

export const fetchBrowsingPage = async(orderKey, sentenceId) => {
	let res = await axios.get(baseUrl + '/sentence', {
		params: {
			orderKey,
			id: sentenceId
		}
	})
	return res;
}

export const searchKeywords = async (search, highlightedPart) => {
	let res = await axios.get(baseUrl + '/sentence/search', {
		params: {
			search, highlightedPart
		}
	})
}