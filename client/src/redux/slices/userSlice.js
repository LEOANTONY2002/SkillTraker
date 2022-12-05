import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'user',
    initialState: {
        user: [],
        accessToken: ''
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        getUserAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
    },
});

export const { getUser, getUserAccessToken } = slice.actions

export default slice.reducer