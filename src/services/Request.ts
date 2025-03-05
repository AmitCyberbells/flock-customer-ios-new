import NetInfo from '@react-native-community/netinfo';
import { ErrorResponse, SuccessResponse } from '../types/response';
import User from '../types/User';
import { API } from './API';
import Toast from 'react-native-toast-message';
import Venue, { Offer } from '../types/Venue';
import store from '../store/store';
import Category from '../types/Category';
import Utils from './Util';
import AdBanner from '../types/AdBanner';
import Device from '../types/Device';
import Tutorial from '../types/Tutorial';
import FAQ from '../types/FAQ';
import OfferRedeemBy from '../types/RedeemBy';
import RedeemedOffers from '../types/RedeemedOffers';
import { Wallet, WalletLog } from '../types/Wallet';
import SupportRequest, { SupportReply } from '../types/SupportRequest';
import ReportedVenue from '../types/ReportedVenue';
import Notification from '../types/Notification';
import AppLog from '../types/AppLog';

export default class Request {
  static getRequest = async (
    url: string,
    callback: (success: any, error: any) => void,
  ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      //console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      //console.log(json);
      callback(json, undefined);
    } catch (error) {
      //console.log(error);
      callback(undefined, error);
    }
  };

  static postRequest = async (
    url: string,
    body: any,
    callback: (success: any, error: any) => void,
  ) => {
    //console.log(body);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
        },
        body: JSON.stringify(body),
      });
      //console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      //console.log(json);
      callback(json, undefined);
    } catch (error) {
      //console.log(error);
      callback(undefined, error);
    }
  };

  static _getRequest = (
    url: string,
    callback: (success: any, error: any) => void,
  ) => {
    const storex = store.getState();
    //console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    if (storex.auth.accessToken) {
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + storex.auth.accessToken,
      );
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        ////console.log('xhr>response-ou- ', xhr)
        if (xhr.status >= 200 && xhr.status < 500) {
          try {
            const json = JSON.parse(xhr.responseText);

            if (xhr.status < 300) {
              callback(json, undefined);
            } else {
              callback(undefined, json);
            }
          } catch (error) {
            callback(undefined, error);
          }
        }
      }
    };

    xhr.onerror = () => {
      callback(undefined, new Error('Network error'));
    };

    xhr.send();
  };

  static _postRequest = (
    url: string,
    body: any,
    callback: (success: any, error: any) => void,
    uploadFiles: boolean = false
  ) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    console.log({ body })
    if (uploadFiles) {
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');

    } else if (!(body instanceof FormData)) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    const storex = store.getState();

    if (storex.auth.accessToken) {
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + storex.auth.accessToken,
      );
    }

    //console.log(xhr)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        ////console.log('xhr>response-ou- ', xhr)
        if (xhr.status >= 200 && xhr.status < 500) {
          try {
            const json = JSON.parse(xhr.responseText);
            //console.log(json);
            if (xhr.status < 300) {
              callback(json, undefined);
            } else {
              callback(undefined, json);
            }
          } catch (error) {
            callback(undefined, error);
          }
        }
      }
    };

    xhr.onerror = () => {
      callback(undefined, new Error('Network error'));
    };

    xhr.send(body instanceof FormData ? body : JSON.stringify(body));
  };

  static checkInternet = async (callback?: () => void) => {
    const network = await NetInfo.fetch();
    if (!network.isConnected) {
      Toast.show({
        type: 'MtToastError',
        text1: 'Please turn on your internet',
        position: 'bottom',
      });
    } else if (callback) {
      callback();
    }
  };

  static signup = async (
    body: any,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.signup, body, callback));
  };

  static verifyEmail = async (
    body: {
      otp: number | string,
      email: string
    },
    callback: (
      success: SuccessResponse<User>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._postRequest(API.verify_email, body, callback),
    );
  };

  static verifyContact = async (
    body: {
      otp: number | string,
      contact: string
    },
    callback: (
      success: SuccessResponse<User>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._postRequest(API.verify_contact, body, callback),
    );
  };

  static forgotPassword = async (
    body: any,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._postRequest(API.forgot_password, body, callback),
    );
  };

  static resetPassword = async (
    body: any,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._postRequest(API.reset_password, body, callback),
    );
  };

  /*
  {
        access_token: string;
        token_type: string;
        user: User;
      } 
   */
  static login = async (
    body: any,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.login, body, callback));
  };

  static sendEmailOtp = async (
    body: { email: string },
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.send_email_otp, body, callback));
  };

  static sendContactOtp = async (
    body: { contact: string },
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.send_contact_otp, body, callback));
  };

  static loginWithOtp = async (
    body: any,
    callback: (
      success: SuccessResponse<{
        access_token: string;
        token_type: string;
        user: User;
      }>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.otp_login, body, callback));
  };

  static changePassword = async (
    body: any,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.change_password, body, callback));
  };

  static requestVenue = async (
    body: {
      venue_name: string,
      location: string,
      lat: number,
      long: number
    },
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.request_venue, body, callback));
  };

  static fetch_venue = async (
    venue_id: number,
    callback: (
      success: SuccessResponse<Venue>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    //console.log('fetching...');
    this.checkInternet(() => this._getRequest(API.venue + venue_id, callback));
  };

  static fetch_venues = async (
    params: {},
    callback: (
      success: SuccessResponse<Array<Venue>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    //console.log('fetching...');
    this.checkInternet(() =>
      this._getRequest(
        API.venues + '?' + Utils.convertToUrlParams(params),
        callback,
      ),
    );
  };

  static fetch_hot_venues = async (
    params: {},
    callback: (
      success: SuccessResponse<Array<Venue>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    //console.log('fetching...');
    this.checkInternet(() =>
      this._getRequest(
        API.hotVenues + '?' + Utils.convertToUrlParams(params),
        callback,
      ),
    );
  };

  static fetch_categories = async (
    callback: (
      success: SuccessResponse<Array<Category>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    //console.log('fetching...');
    this.checkInternet(() => this._getRequest(API.categories, callback));
  };

  static toggleOffer = async (
    offer_id: number,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._getRequest(API.toggleOffer + offer_id, callback),
    );
  };

  static venueOffers = async (
    venue_id: number,
    callback: (
      success: SuccessResponse<Array<Offer>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.offers + venue_id, callback));
  };

  static savedOffers = async (
    callback: (
      success: SuccessResponse<Array<Offer>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.savedOffers, callback));
  };

  static savedVenues = async (
    params: {},
    callback: (
      success: SuccessResponse<Array<Venue>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.savedVenues + '?' + Utils.convertToUrlParams(params), callback));
  };

  static adBanners = async (
    callback: (
      success: SuccessResponse<Array<AdBanner>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.adBanners, callback));
  };

  static toggleVenue = async (
    venue_id: number,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() =>
      this._getRequest(API.toggleVenue + venue_id, callback),
    );
  };

  static updateDeviceToken = async (
    body: Device,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.update_device_token, body, callback));
  };

  static tutorials = async (
    callback: (
      success: SuccessResponse<Tutorial[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.tutorials, callback));
  };

  static faq = async (
    callback: (
      success: SuccessResponse<Array<FAQ>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.faq, callback));
  };

  static checkin = async (
    body: {
      venue_id: number,
      lat: number,
      long: number
    },
    callback: (
      success: SuccessResponse<any>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.checkin, body, callback));
  };

  static redeemOffer = async (
    body: {
      offer_id: number,
      redeem_by: OfferRedeemBy
    },
    callback: (
      success: SuccessResponse<any>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.redeemOffer, body, callback));
  };

  static redeemedOffers = async (
    callback: (
      success: SuccessResponse<Array<RedeemedOffers>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.redeemedOffers, callback));
  };

  static walletBalances = async (
    callback: (
      success: SuccessResponse<Wallet>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.walletBalances, callback));
  };

  static walletLogs = async (
    body: {
      record_limit?: number
    },
    callback: (
      success: SuccessResponse<Array<WalletLog>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    const params = body?.record_limit ? '?' + Utils.convertToUrlParams(body) : '';
    this.checkInternet(() => this._getRequest(API.walletLogs + params, callback));
  };

  static updateProfile = async (
    body: FormData,
    callback: (
      success: SuccessResponse<User>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.updateProfile, body, callback, true));
  };

  static archiveProfile = async (
    body: {
      reason: string
    },
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.deleteAccount, body, callback));
  };

  static supportTickets = async (
    callback: (
      success: SuccessResponse<Array<SupportRequest>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.supportList, callback));
  };

  static createSupportTicket = async (
    body: {
      title: string,
      description: string
    },
    callback: (
      success: SuccessResponse<SupportRequest>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.supportStore, body, callback));
  };

  static createSupportTicketReply = async (
    body: {
      support_id: number,
      content: string
    },
    callback: (
      success: SuccessResponse<SupportReply>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.supportReply, body, callback));
  };

  static reportVenue = async (
    body: {
      venue_id: number,
      description: string
    },
    callback: (
      success: SuccessResponse<ReportedVenue>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.reportVenue, body, callback));
  };

  static notifications = async (
    callback: (
      success: SuccessResponse<Array<Notification>>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._getRequest(API.notifications, callback));
  };

  static logger = async (
    body: AppLog,
    callback: (
      success: SuccessResponse<[]>,
      error: ErrorResponse<{ [key: string]: string }>,
    ) => void,
  ) => {
    this.checkInternet(() => this._postRequest(API.createAppLogs, body, callback));
  };
}
