import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';

const INITIAL_STATE = {
    userId: null
}

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsersAsync.pending, (state) => {
                state.getUsers = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(getUsersAsync.fulfilled, (state, action) => {
                state.getUsers = REQUEST_STATE.FULFILLED;
                state.list = action.payload;
            })
            .addCase(getUsersAsync.rejected, (state, action) => {
                state.getUsers = REQUEST_STATE.REJECTED;
                state.error = action.error;
            })
            .addCase(addUserAsync.pending, (state) => {
                state.addUser = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(addUserAsync.fulfilled, (state, action) => {
                state.addUser = REQUEST_STATE.FULFILLED;
                state.list = action.payload;
            })
            .addCase(addUserAsync.rejected, (state, action) => {
                state.addUser = REQUEST_STATE.REJECTED;
                state.error = action.error;
            })
    }
});

export default userSlice.reducer;