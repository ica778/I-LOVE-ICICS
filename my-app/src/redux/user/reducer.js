import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';

const INITIAL_STATE = {
    userId: -1

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
    }
});

export default userSlice.reducer;