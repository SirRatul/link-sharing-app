import { createSlice } from '@reduxjs/toolkit';

// Utility Service
import { getUser } from '../utils/session.utils';

const userData = getUser();

const initialState = {
    isAuthenticated: !!userData,
    user: userData,
    links: userData ? userData.links?.map(item => ({
        platform: {
            value: item.platform,
            label: item.platform
        },
        link: item.link
    })) : [],
    loginModal: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loginModal = false;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.links = [];
            state.loginModal = false;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        updateLinks: (state, action) => {
            state.links = action.payload;
        },
        toggleLoginModal: (state) => {
            state.loginModal = !state.loginModal;
        },
        openLoginModal: (state) => {
            state.loginModal = true;
        },
        closeLoginModal: (state) => {
            state.loginModal = false;
        }
    }
});

export const {
    login,
    logout,
    updateUser,
    updateLinks,
    toggleLoginModal,
    openLoginModal,
    closeLoginModal
} = userSlice.actions;

export const selectAuthStatus = (state) => state.user.isAuthenticated;
export const selectCurrentUser = (state) => state.user.user;
export const selectUserLinks = (state) => state.user.links;
export const selectLoginModal = (state) => state.user.loginModal;

export default userSlice.reducer;