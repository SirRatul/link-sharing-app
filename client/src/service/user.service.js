import axios from 'axios';

/**
     * @function getUserService
     * @param userId
     * @description This function retrieves user information by user ID.
*/
export const getUserService = async (userId) => {
    const result = await axios.get(`/user?userId=${userId}`);
    return result;
};

/**
    * @function updateUserService
    * @param data
    * @description This function updates user information and profile image.
*/
export const updateUserService = async (data) => {
    const result = await axios.patch('/user', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result;
};

/**
    * @function getLinksService
    * @param {string} userId
    * @description This function retrieves links by user ID.
*/
export const getLinksService = async (userId) => {
    const result = await axios.get(`/links?userId=${userId}`);
    return result;
};

/**
    * @function updateLinksService
    * @param data
    * @description This function updates links for a user.
*/
export const updateLinksService = async (data) => {
    const result = await axios.patch('/links', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
};
