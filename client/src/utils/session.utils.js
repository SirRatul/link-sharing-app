import Cookies from 'js-cookie';

// save the token and user into the Cookies
export const setUserSession = (token, user) => {
    Cookies.set('token', JSON.stringify(token));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// update user session
export const updateUserSession = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

// return the user data from the Cookies
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
}

// return the token from the Cookies or LocalStorage
export const getToken = () => {
    if (localStorage.getItem('token') && Cookies.get('token')) {
        if (localStorage.getItem('token')) {
            return localStorage.getItem('token');
        }
        if (Cookies.get('token')) {
            return JSON.parse(Cookies.get('token'));
        }
    }
    return null;
}

// remove the token and user from the Cookies
export const removeUserSession = () => {
    Cookies.remove('token');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}