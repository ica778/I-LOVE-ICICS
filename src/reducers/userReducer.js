const userReducer = (state = {userId: -1, userProfileMode: 'self'}, action) => {
    switch (action.type) {
        case 'UPDATE_USERID':
            return {
                ...state,
                userId: action.payload
            };
		case 'UPDATE_USER_SUBMITTED_SENTENCES':
			return {
				...state,
				userSubmittedSentences: action.payload
			}
		case 'UPDATE_USER_SAVED_SENTENCES':
			return {
				...state,
				userSavedSentences: action.payload
			}
		case 'UPDATE_OTHER_SAVED_SENTENCES':
			return {
				...state,
				otherSavedSentences: action.paylopad
			}
		case 'UPDATE_OTHER_SUBMITTED_SENTENCES':
			return {
				...state,
				otherSubmittedSentences: action.payload
			}
		case 'UPDATE_USER_PROFILE_MODE':
			return {
				...state,
				userProfileMode: action.payload
			}
        default:
            return state;
    };
}

export default userReducer;