import axios from 'axios';

export const getSentencesQuery = populate => async () =>
  {
   	let res = await axios.get(
      `http://localhost:3001/sentence${
        populate ? `?populate=${populate.join(',')}` : ''
      }`
    );
	console.log(res.data);
	return res.data;
}

export const getCommentsQuery = id => async () =>
  (await axios.get(`http:///localhost:8080/sentence/${id}/comments`)).data;
