import axios from 'axios';

export const getSentencesQuery = populate => async () =>
  (
    await axios.get(
      `http://localhost:8080/sentence${
        populate ? `?populate=${populate.join(',')}` : ''
      }`
    )
  ).data;

export const getCommentsQuery = id => async () =>
  (await axios.get(`http:///localhost:8080/sentence/${id}/comments`)).data;
