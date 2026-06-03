import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import conceptReducer from '../features/concepts/conceptSlice';
import adminReducer from '../features/admin/adminSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        concepts: conceptReducer,
        admin: adminReducer,
    },
    devTools: import.meta.env.DEV,
});

export default store;
