import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        skills: [],
        categories: []
    },
    reducers: {
        getUsers: (state, action) => {
            state.users = action.payload;
        },
        getSkills: (state, action) => {
            state.skills = action.payload
        },
        getCategories: (state, action) => {
            state.categories = action.payload
        }
    },
});

export const { getUsers, getSkills, getCategories } = slice.actions

export default slice.reducer