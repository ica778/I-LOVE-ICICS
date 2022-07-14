let searchResults = [
  {
    sentenceBoxId: 1,
    sentenceText: 'This is a sentence.',
    noComments: 2,
  },
  {
    sentenceBoxId: 2,
    sentenceText: 'The quick brown fox jumps over the lazy dog.',
    noComments: 3,
  },
  {
    sentenceBoxId: 3,
    sentenceText:
      'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.',
    noComments: 0,
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
