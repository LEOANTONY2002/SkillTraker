import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './slices/adminSlice';
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminSlice
  },
});
