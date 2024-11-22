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

export function saved_user_info(info) {
  return {
    type: USER_INFO,
    payload: info
  };
}

export function saved_category(category) {
  return {
    type: CATEGORY_DATA,
    payload: category
  };
}


export function saved_vanue(vanue) {
  return {
    type: VANUE_DATA,
    payload: vanue
  };
}

export function saved_vanue_hot(hot) {
  return {
    type: VANUE_HOT,
    payload: hot
  };
}

export function saved_vanue_star(star) {
  return {
    type: VANUE_STAR,
    payload: star
  };
}
export function faq_data(faq) {
  return {
    type: FAQ,
    payload: faq
  };
}

export function dashboarddata(dash) {
  return {
    type: DASHBOARD_DATA,
    payload: dash
  };
}
export function notificationdata(noti) {
  return {
    type: NOTIFICATION_DATA,
    payload: noti
  };
}
export function alltransactiondata(all) {
  return {
    type: ALL_TRANSACTIONS,
    payload: all
  };
}
export function report_type_data(reporttype) {
  return {
    type: REPORT_TYPE,
    payload: reporttype
  };
}
export function tutorial_data(t_data) {
  return {
    type: TUTORIAL_LIST,
    payload: t_data
  };
}
export function support_data(s_data) {
  return {
    type: SUPPORT_LIST,
    payload: s_data
  };
}
export function my_redeem_data(m_data) {
  return {
    type: MYREDEEMOFFERS,
    payload: m_data
  };
}
export function saved_offer_data(savedoffeer_data) {
  return {
    type: SAVED_OFFERED,
    payload: savedoffeer_data
  };
}

export function location(data) {
  return {
    type: LOCATION,
    payload: data
  }
}

export function current_location(data) {
  return {
    type: CURRENT_LOCATION,
    payload: data
  }
}

export function selected_category(data) {
  return {
    type: SELECTED_CATEGORY,
    payload: data
  }
}