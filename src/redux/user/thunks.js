import UserService from './userService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';

export const getUsersAsync = createAsyncThunk(
    actionTypes.GET_USERS,
    async () => {
        return await UserService.getUsers();
    }
);

export const addUserAsync = createAsyncThunk(
    actionTypes.ADD_USER,
    async (credentials) => {
        return await UserService.addUser(credentials);
    }
);