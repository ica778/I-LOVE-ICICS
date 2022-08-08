// let searchResults = [
//   {
//     _id: 1,
//     text: 'This is a sentence.',
//     comments: [
//       {
//         _id: '62d1c76430fb46821ea49032',
//         text: 'i am bigger builder',
//         submittedBy: '62d1c71f30fb46821ea4902f',
//         responses: Array(0),
//       },
//     ],
//   },
//   {
//     _id: 2,
//     text: 'The quick brown fox jumps over the lazy dog.',
//     comments: [
//       {
//         _id: '62d1c76430fb46821ea49032',
//         text: 'i am digger builder',
//         submittedBy: '62d1c71f30fb46821ea4902f',
//         responses: Array(0),
//       },
//     ],
//   },
//   {
//     _id: 3,
//     text:
//       'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.',
//     comments: [
//       {
//         _id: '62d1c76430fb46821ea49032',
//         text: 'i am tigger builder',
//         submittedBy: '62d1c71f30fb46821ea4902f',
//         responses: Array(0),
//       },
//     ],
//   },
// ];

const searchpageReducer = (
  state = { latestSearchText: '', latestHighlightText: '', currentSearch: { searchText: 'testing', results: [] }, exploreSentences: [], atBottomOfPage: false },
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
    // for after performing an actual search, temporarily saving the search metadata
    case 'UPDATE_LATEST_SEARCH_TEXT':
      return {
        ...state,
        latestSearchText: action.payload.latestSearchText,
        latestHighlightText: action.payload.latestHighlightText
      };
	case 'SET_CURRENT_SEARCH_RESULTS':
		return {
			...state,
			currentSearch: {
				...state.currentSearch,
				results: action.payload
			}
		}
  case 'UPDATE_CURRENT_SEARCH_RESULTS':
    return {
      ...state,
      currentSearch: {
        ...state.currentSearch,
        results: [...state.currentSearch.results, ...action.payload]
      }
    }
  case 'HIT_BOTTOM_OF_PAGE':
    return {
      ...state,
      atBottomOfPage: action.payload
    }
  case 'UPDATE_EXPLORE_SENTENCES':
    return {
      ...state,
      exploreSentences: [...state.exploreSentences, ...action.payload]
    }
  case 'SET_EXPLORE_SENTENCES':
    return {
      ...state,
      exploreSentences: action.payload
    }
    default:
      return state;
  }
};

export default searchpageReducer;
