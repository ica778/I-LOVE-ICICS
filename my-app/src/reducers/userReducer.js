const userReducer = (state = {userId: -1}, action) => {
    switch (action.type) {
        case 'UPDATE_USERID':
            return {
                ...state,
                userId: action.payload
            };
        default:
            return state;
    };
}

export default userReducer;