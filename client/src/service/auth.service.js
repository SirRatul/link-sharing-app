import axios from "axios"

/**
    * @function signUpService 
    * @param data
    * @description This function is used to signup the user
*/
export const signUpService = async (data) => {
    const result = await axios.post('/signup', data)
    return result;
}

/**
    * @function loginService
    * @param data
    * @description This function is used to signin the user
*/
export const loginService = async (data) => {
    const result = await axios.post('/login', data)
    return result;
}
