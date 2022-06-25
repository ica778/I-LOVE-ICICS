import { combineReducers } from 'redux';
import userReducer from './userReducer';
import searchpageReducer from './searchpageReducer';
import commentReducer from './commentReducer';

const rootReducer = combineReducers({
    userReducer,
    searchpageReducer,
    commentReducer
});

export default rootReducer;