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

export const eraseCurrentComment = id => {
    // sentenceBoxId:
    // 1234
    return {
        type: 'ERASE_COMMENT',
        payload: id
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

export const setCurrentSearchResults = results => {
    return {
        type: 'SET_CURRENT_SEARCH_RESULTS',
        payload: results
    }
}

export const updateCurrentSearchResults = results => {
    return {
        type: 'UPDATE_CURRENT_SEARCH_RESULTS',
        payload: results
    }
}

export const updateUserSubmittedSentences = sentences => {
    return {
        type: 'UPDATE_USER_SUBMITTED_SENTENCES',
        payload: sentences
    }
}

export const updateUserSavedSentences = sentences => {
    return {
        type: 'UPDATE_USER_SAVED_SENTENCES',
        payload: sentences
    }
}

export const updateOtherSavedSentences = sentences => {
    return {
        type: 'UPDATE_OTHER_SAVED_SENTENCES',
        payload: sentences
    }
}

export const updateOtherSubmittedSentences = sentences => {
    return {
        type: 'UPDATE_OTHER_SUBMITTED_SENTENCES',
        payload: sentences
    }
}

export const updateUserProfileMode = mode => {
    return {
        type: 'UPDATE_USER_PROFILE_MODE',
        payload: mode
    }
}

export const bottomOfPage = payload => {
    return {
        type: 'HIT_BOTTOM_OF_PAGE',
        payload
    }
}

export const updateExploreSentences = payload => {
    return {
        type: 'UPDATE_EXPLORE_SENTENCES',
        payload
    }
}

export const setExploreSentences = payload => {
    return {
        type: 'SET_EXPLORE_SENTENCES',
        payload
    }
}

export const updateLatestSearchText = payload => {
    return {
        type: 'UPDATE_LATEST_SEARCH_TEXT',
        payload
    }
}