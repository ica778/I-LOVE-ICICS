import axios from 'axios';

export const getSentencesQuery = async () =>
  (await axios.get('http://localhost:8080/sentence')).data;
