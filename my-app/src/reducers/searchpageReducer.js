let searchResults = [
  {
    sentenceBoxId: 1,
    sentenceText: 'This is a sentence.',
    comments: [
      {
        _id: '62d1c76430fb46821ea49032',
        text: 'i am bigger builder',
        submittedBy: '62d1c71f30fb46821ea4902f',
        responses: Array(0),
      },
    ],
  },
  {
    sentenceBoxId: 2,
    sentenceText: 'The quick brown fox jumps over the lazy dog.',
    comments: [
      {
        _id: '62d1c76430fb46821ea49032',
        text: 'i am digger builder',
        submittedBy: '62d1c71f30fb46821ea4902f',
        responses: Array(0),
      },
    ],
  },
  {
    sentenceBoxId: 3,
    sentenceText:
      'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.',
    comments: [
      {
        _id: '62d1c76430fb46821ea49032',
        text: 'i am tigger builder',
        submittedBy: '62d1c71f30fb46821ea4902f',
        responses: Array(0),
      },
    ],
  },
];

const searchpageReducer = (
  state = { currentSearch: { searchText: 'testing', results: searchResults } },
  action
) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_SEARCH_TEXT':
      return {
        ...state,
        currentSearch: {
          ...state.currentSearch,
          searchText: action.payload,
        },
      };
    default:
      return state;
  }
};

export default searchpageReducer;
