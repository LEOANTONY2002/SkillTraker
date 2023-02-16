import { createAction } from "@reduxjs/toolkit";


export const getAllUsers = createAction("getUsers", (users) => {
    return {

        payload: { users }
    }
})