import { configureStore } from '@reduxjs/toolkit';

// slice reducer
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export default store;