const auth = 'https://easyrent-t7he.onrender.com/api/auth/';
const home = 'https://easyrent-t7he.onrender.com/api/home/';
const profile = 'https://easyrent-t7he.onrender.com/api/profile/';
// const auth = "http://127.0.0.1:8000/api/auth/";
// const home = "http://127.0.0.1:8000/api/home/"

export const swrKeys = {
  registerUser: `${auth}register-user/`,
  registerCompany: `${auth}register-company/`,
  logIn: `${auth}login/`,
  search: (queryString: string = ''): string => `${home}search?${queryString}`, // search sa tipovima
  userinfo: `${auth}user-info/`,
  logout: `${auth}logout/`,
  profileuser: `${profile}/user/info`,
  deleteuser: `${profile}/`,
  cities: `${home}cities/`,
  companies: `${home}showcased-companies/?limit=6`,
  bestValue: `${home}best-value/?limit=10&page=1`,
  mostPopular: `${home}most-popular/?limit=10&page=1`,
  allLocations: `${home}locations`,
  offer: (queryString: string = ''): string => `${home}offer/${queryString}/`, // search sa tipovima
};
