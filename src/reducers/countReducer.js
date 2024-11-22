
import {
  USER_INFO,
  CATEGORY_DATA,
  VANUE_DATA,
  VANUE_HOT,
  VANUE_STAR,
  FAQ,
  DASHBOARD_DATA,
  NOTIFICATION_DATA,
  ALL_TRANSACTIONS,
  REPORT_TYPE,
  TUTORIAL_LIST,
  SUPPORT_LIST,
  MYREDEEMOFFERS,
  SAVED_OFFERED,
  LOCATION,
  CURRENT_LOCATION,
  SELECTED_CATEGORY
} from "../constant";

const initialState = {
  info: {
    // "dob": "",
    // "email": "",
    // "first_name": "",
    // "image": "",
    // "last_name": "",
    // "phone": ""
  },
  category_list: [
    // {
    //   category_name:'',
    //   category_id:'',
    //   category_image:''
    // }
  ],
  venue_list: [],
  venue_hot_list: [],
  venue_star_list: [],
  faq_list: [
    // "id": "",
    // "question": "",
    // "answer": ""
  ],
  dashboard_list: {
    // "status": "",
    // "message": "",
    // "total_feather": 0,
    // "earn_feather": 0,
    // "spend_feather": 0,
    // "Booking": [],
    // "Transaction": []
  },
  notification_list: [
    // "image": "",
    // "title": "",
    // "description": "",
    // "created_at": ""
  ],
  all_transaction_list: [
    // "id": "",
    // "name": "",
    // "image": "",
    // "feather": "",
    // "status": "",
    // "datetime": ""
  ],
  report_list: [
    // "id": "",
    // "venue_title": ""
  ],
  tutorial_list: [
    // "tutorials_video": "",
    // "tutorials_name": "",
    // "tutorials_desc": ""
  ],
  support_list: [],
  my_redeem_list: [],
  saved_offer_list: [],
  location: {
    latitude: '-33.865143',
    longitude: '151.209900',
    radius: 100000, // 100 meter
    canReset: false
  },
  current_location: {
    latitude: '-33.865143',
    longitude: '151.209900',
  },
  selected_category: {}
};

const countReducer = (state = initialState, action) => {
  //console.log("countReducer ", action.type);

  switch (action.type) {

    case USER_INFO:
      return {
        ...state,
        info: action.payload
      };

    case CATEGORY_DATA:
      return {
        ...state,
        category_list: action.payload
      };

    case VANUE_DATA:
      return {
        ...state,
        venue_list: action.payload
      };

    case VANUE_HOT:
      return {
        ...state,
        venue_hot_list: action.payload
      };

    case VANUE_STAR:
      return {
        ...state,
        venue_star_list: action.payload
      };
    case FAQ:
      return {
        ...state,
        faq_list: action.payload
      };

    case DASHBOARD_DATA:
      return {
        ...state,
        dashboard_list: action.payload
      };
    case NOTIFICATION_DATA:
      return {
        ...state,
        notification_list: action.payload
      };
    case ALL_TRANSACTIONS:
      return {
        ...state,
        all_transaction_list: action.payload
      };
    case REPORT_TYPE:
      return {
        ...state,
        report_list: action.payload
      };
    case TUTORIAL_LIST:
      return {
        ...state,
        tutorial_list: action.payload
      };
    case SUPPORT_LIST:
      return {
        ...state,
        support_list: action.payload
      };
    case MYREDEEMOFFERS:
      return {
        ...state,
        my_redeem_list: action.payload
      };
    case SAVED_OFFERED:
      return {
        ...state,
        saved_offer_list: action.payload
      };
    case LOCATION:
      return {
        ...state,
        location: action.payload
      };
    case CURRENT_LOCATION:
      return {
        ...state,
        current_location: action.payload
      };
    case SELECTED_CATEGORY:
      return {
        ...state,
        selected_category: action.payload
      };

    default:
      return state;
  }
};
export default countReducer;