import axios from 'axios';
import { baseUrl } from './config';

export const createNewSentence = async (text, highlightedPart, source) => {
	let userId = localStorage.getItem("userId");

	let res = await axios.post(baseUrl + '/sentence', {
		text, highlightedPart, source
	});

	return res.data;
}

export const searchKeywords = async (search, highlightedPart) => {
	let res = await axios.get(baseUrl + '/sentence/search', {
		params: {
			search, highlightedPart
		}
	})
}

export const getSentencesQuery = (populate, orderKey, timeFilterKey, sentenceId) => async () => {
	let res = await axios.get(baseUrl + '/sentence/recent50', {
		params: {
			populate, orderKey, timeFilterKey, sentenceId
		}
	})
	console.log(res.data);
	return res.data;
}