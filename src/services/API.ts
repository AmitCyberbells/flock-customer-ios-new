//export const BASE_HOST = 'http://127.0.0.1:8000/';
//'https://web.cyberbells.com/DitroInfotech/Projects/flock/';

export const BASE_HOST = 'https://api.getflock.io/';
export const API_ENDPOINT = `${BASE_HOST}api/`;
export const BASE_IMG_URL = `${BASE_HOST}assets/images/users/`;
export const BASE_URL = `${API_ENDPOINT}customer/`

export const API = {
  host: `${BASE_HOST}`,
  api_endpoint: `${API_ENDPOINT}`,
  base_url: `${BASE_URL}`,
  imgURL: `${BASE_IMG_URL}`,

  terms: `${BASE_URL}terms`,
  signup: `${BASE_URL}signup`,
  login: `${BASE_URL}login`,
  otp_login: `${BASE_URL}otp-login`,
  send_email_otp: `${BASE_URL}send-otp/email`,
  send_contact_otp: `${BASE_URL}send-otp/contact`,
  forgot_password: `${BASE_URL}forgot-password`,
  reset_password: `${BASE_URL}reset-password`,
  verify_contact: `${BASE_URL}verify-contact`,
  verify_email: `${BASE_URL}verify-email`,
  categories: `${BASE_URL}categories`,  
  venues: `${BASE_URL}venues`,   // fetch venues
  venue: `${BASE_URL}venues/`, // venue by id
  toggleVenue: `${BASE_URL}venues/toggle/`, // add/remove favourite venue by id
  offers: `${BASE_URL}venue-offers/`, // by venue id
  toggleOffer: `${BASE_URL}venue-offers/toggle-save/`, // add/remove favourite offer
  savedOffers: `${BASE_URL}saved-offers`,
  savedVenues: `${BASE_URL}saved-venues`,
  adBanners: `${BASE_URL}ad-banners`,
  change_password: `${BASE_URL}profile/change-password`,
  request_venue: `${BASE_URL}request-venue`,
  faq: `${BASE_URL}faq`,
  tutorials: `${BASE_URL}tutorials`,
  logout: `${BASE_URL}logout`,
  update_device_token: `${BASE_URL}devices/update`,
  checkin: `${BASE_URL}checkin`,
  redeemOffer: `${BASE_URL}venue-offers/redeem`, // POST
  redeemedOffers: `${BASE_URL}venue-offers/redeemed-list`, // GET
  walletBalances: `${BASE_URL}wallet/balances`, // GET
  updateProfile: `${BASE_URL}profile/update`, // POST
  deleteAccount: `${BASE_URL}profile/delete`, // POST
  hotVenues: `${BASE_URL}venues/hot`, // GET
  walletLogs: `${BASE_URL}wallet/logs`, // GET
  supportList: `${BASE_URL}support/list`, // GET
  supportStore: `${BASE_URL}support/store`, // POST
  supportReply: `${BASE_URL}support/reply`, // POST
  supportReplies: `${BASE_URL}support/`, // GET
  reportVenue: `${BASE_URL}report-venues/store`, // POST
  notifications: `${BASE_URL}notifications/list`, // GET
  createAppLogs: `${BASE_URL}app-logs/store`, // POST
  feathersHistory: `${BASE_URL}wallet/feathers-log`,//GET
  venuePointsHistory: `${BASE_URL}wallet/venue-points-log`,//GET
  
  updateUserLocation: `${BASE_URL}profile/update-location` // POST
};
