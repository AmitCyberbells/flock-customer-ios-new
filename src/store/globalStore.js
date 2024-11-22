import { combineReducers, createStore } from "redux";
import countReducer from "../reducers/countReducer";

const rootReducer = combineReducers({
  info: countReducer,
  category_list: countReducer,
  venue_list: countReducer,
  venue_hot_list: countReducer,
  venue_star_list: countReducer,
  faq_list: countReducer,
  dashboard_list: countReducer,
  notification_list: countReducer,
  all_transaction_list: countReducer,
  report_list: countReducer,
  tutorial_list: countReducer,
  support_list: countReducer,
  my_redeem_list: countReducer,
  saved_offer_list: countReducer,
  global: countReducer
});

const globalStore = createStore(rootReducer);

export default globalStore;

