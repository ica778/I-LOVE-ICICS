export const updateCurrentComments = commentData => {
    // commentData:
    // {
    //     sentenceBoxId: 1234,
    //     commentText: 'testing'
    // }
    return {
        type: 'UPDATE_CURRENT_COMMENT',
        payload: commentData
    }
}

export const eraseCurrentComment = sentenceBoxId => {
    // sentenceBoxId:
    // 1234
    return {
        type: 'ERASE_COMMENT',
        payload: sentenceBoxId
    }
}

export const updateUserId = userId => {
    // userId:
    // testing123
    return {
        type: 'UPDATE_USERID',
        payload: userId
    }
}

export const updateCurrentSearchText = searchData => {
    //searchData:
    // 'testing123
    return {
        type: 'UPDATE_CURRENT_SEARCH_TEXT',
        payload: searchData
    }
}