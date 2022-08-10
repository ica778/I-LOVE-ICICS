const commentReducer = (state = {currentComments: {}}, action) => {
    switch (action.type) {
        case 'UPDATE_CURRENT_COMMENT':
            return {
                ...state,
                currentComments: Object.assign({}, state.currentComments, {[action.payload.sentenceBoxId]: action.payload.commentText})
            };
        case 'ERASE_COMMENT':
            const next = {...state};
            console.log(next);
            delete next.currentComments[action.payload]
            console.log(next);
            return next;
        default:
            return state;
    };
}

export default commentReducer;