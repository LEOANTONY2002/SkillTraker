import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'admin',
    initialState: {
        employees: [],
        skills: [],
        categories: []
    },
    reducers: {
        getEmployees: (state, action) => {
            state.employees = action.payload;
        },
        getSkills: (state, action) => {
            state.skills = action.payload
        },
        getCategories: (state, action) => {
            state.categories = action.payload
        }
    },
});

export const { getEmployees, getSkills, getCategories } = slice.actions

export default slice.reducer