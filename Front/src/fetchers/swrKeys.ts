const auth = 'https://easyrent-t7he.onrender.com/api/auth/';
const home = 'https://easyrent-t7he.onrender.com/api/home/';
// const auth = "http://127.0.0.1:8000/api/auth/";
// const home = "http://127.0.0.1:8000/api/home/"
export const swrKeys = {
    registerUser: `${auth}register-user/`,
    registerCompany: `${auth}register-company/`,
    logIn: `${auth}login/`,
    showcased: `${home}showcased/`,
    search: (queryString: string = ''): string => `${home}search?${queryString}`, // search sa tipovima
    userinfo: `${auth}user-info/`,
    logout: `${auth}logout/`,
};
