const auth = 'https://easyrent-t7he.onrender.com/api/auth/';
const home = 'https://easyrent-t7he.onrender.com/api/home/';
const profile = 'https://easyrent-t7he.onrender.com/api/profile/';
const wallet = 'https://easyrent-t7he.onrender.com/api/wallet/';
// const auth = "http://127.0.0.1:8000/api/auth/";
// const home = "http://127.0.0.1:8000/api/home/"

export const swrKeys = {
  registerUser: `${auth}register-user/`,
  registerCompany: `${auth}register-company/`,
  logIn: `${auth}login/`,
  search: (queryString: string = ''): string =>
    `${home}search?${queryString}&limit=198&page=1`, // search sa tipovima
  userinfo: `${auth}user-info/`,
  logout: `${auth}logout/`,
  profileUser: `${profile}/user/info`,
  deleteUser: `${profile}user/delete`,
  userRentals: `${profile}user/rentals`,
  addBalance: (amount: number) => `${wallet}addMoney/${amount}`,
  cities: `${home}cities/`,
  companies: `${home}showcased-companies/?limit=6`,
  bestValue: `${home}best-value/?limit=10&page=1`,
  mostPopular: `${home}most-popular/?limit=10&page=1`,
  allLocations: `${home}locations`,
  offer: (queryString: string = ''): string => `${home}offer/${queryString}/`,
  offerLocations: (queryString: string = ''): string =>
    `${home}offer-locations/${queryString}/`,
  reviews: (queryString: string = ''): string =>
    `${home}reviews/${queryString}/?limit=16&page=1`,
  carModels: `${home}models/`,
  review: (id: string) => `${home}addReview/${id}`, // TODO    !!!! potenicjalno promejnit ime u addReview ili nesot lsicno

  companyInfo: `${profile}/company/info`,
  companyLocations: `${profile}/company/locations`,
  companyLocationInfo: `${profile}/company/location/`, // + locationId
  companyVehicles: `${profile}/company/vehicles`,
  companyOffers: `${profile}/company/offers`,
  companyVehicleVisi: `${profile}/company/toggle-vehicle-visibility/`, // + vehicleId
  companyVehicleDelete: `${profile}/company/vehicles/edit-vehicle/`, // + vehicleId
  companyOfferVisi: `${profile}/company/toggle-offer-visibility/`, // + offerId
  companyOfferDelete: `${profile}/company/offer/`, // + offerId
  companyLogsComplete: `${profile}/company/log/completed`, 
  companyLogsOngoing: `${profile}/company/log/ongoing`, 
  companyLogsUpcoming: `${profile}/company/log/upcoming`, 
  




};
