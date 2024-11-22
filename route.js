import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Splash from "./src/screens/Splash";
import Onboard from "./src/screens/Onboard";
import Login from "./src/screens/Login"
import Register from "./src/screens/Register"
import HomeScreen from "./src/screens/HomeScreen"
import Feathers from "./src/screens/Feathers"
import Settings from "./src/screens/Settings"
import SingleDetail from "./src/screens/SingleDetail"
import Tutorials from "./src/screens/Tutorials"
import Report from "./src/screens/Report"
import Faq from "./src/screens/Faq"
import Map from "./src/screens/Map"
import QR_Code from "./src/screens/QR_Code"
import AllTransactions from "./src/screens/AllTransactions"
import CategoryTranscations from "./src/screens/CategoryTranscations"
import EditProfile from "./src/screens/EditProfile"
import ChangePassword from "./src/screens/ChangePassword"
import Support from "./src/screens/Support"
import SupportList from "./src/screens/SupportList"
import Webview from "./src/screens/Webview"
import MySavedOffers from "./src/screens/MySavedOffers"
import UsedOffered from "./src/screens/UsedOffered"
import ForgotPassword from "./src/screens/ForgotPassword"
import QRCodeScreen from "./src/screens/QRCodeScreen";
import TermsConditionsWebview from "./src/screens/TermsConditionsWebview";
import CustomTabBar from "./src/screens/CustomTabBar";
import Categories from "./src/screens/Categories";
import Hot from "./src/screens/Hot";
import SideNavigation from "./src/screens/SideNavigation";
import TabProfile from "./src/screens/TabProfile";
import OTPScreen from "./src/screens/OTPScreen";
import ScanningScreen from "./src/screens/ScanningScreen";
import CustomTabBar_IOS from "./src/screens/CustomTabBar_IOS"
import CustomTabBar_Android from "./src/screens/CustomTabBar_Android"
import VideoPlayer from "./src/screens/VideoPlayer";
import StartUpAd from "./src/screens/StartUpAd";
import DeleteAccount from "./src/screens/DeleteAccount";
import RequestVenue from "./src/screens/RequestVenue";
import GooglePlaces from "./src/screens/GooglePlaces";
import MoreTutorials from "./src/screens/MoreTutorials";

const Project = createStackNavigator({

  Splash: {
    screen: Splash,
    navigationOptions: {
      headerShown: false
    }
  },

  Onboard: {
    screen: Onboard,
    navigationOptions: {
      headerShown: false
    }
  },

  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },

  Register: {
    screen: Register,
    navigationOptions: {
      headerShown: false
    }
  },

  OTPScreen: {
    screen: OTPScreen,
    navigationOptions: {
      headerShown: false
    }
  },

  CustomTabBar: {
    screen: CustomTabBar,
    navigationOptions: {
      headerShown: false
    }
  },

  CustomTabBarIOS: {
    screen: CustomTabBar_IOS,
    navigationOptions: {
      headerShown: false
    }
  },
  CustomTabBarAndroid: {
    screen: CustomTabBar_Android,
    navigationOptions: {
      headerShown: false
    }
  },

  ScanningScreen: {
    screen: ScanningScreen,
    navigationOptions: {
      headerShown: false
    }
  },

  Map: {
    screen: Map,
    navigationOptions: {
      headerShown: false
    }
  },

  SideNavigation: {
    screen: SideNavigation,
    navigationOptions: {
      headerShown: false
    }

  },

  Categories: {
    screen: Categories,
    navigationOptions: {
      headerShown: false
    }
  },

  GooglePlaces: {
    screen: GooglePlaces,
    navigationOptions: {
      headerShown: false
    }

  },

  RequestVenue: {
    screen: RequestVenue,
    navigationOptions: {
      headerShown: false
    }
  },


  Hot: {
    screen: Hot,
    navigationOptions: {
      headerShown: false
    }
  },

  Feathers: {
    screen: Feathers,
    navigationOptions: {
      headerShown: false
    }
  },

  Settings: {
    screen: Settings,
    navigationOptions: {
      headerShown: false
    }
  },

  SingleDetail: {
    screen: SingleDetail,
    navigationOptions: {
      headerShown: false
    }
  },

  TermsConditionsWebview: {
    screen: TermsConditionsWebview,
    navigationOptions: {
      headerShown: false
    }
  },

  Tutorials: {
    screen: Tutorials,
    navigationOptions: {
      headerShown: false
    }
  },

  Report: {
    screen: Report,
    navigationOptions: {
      headerShown: false
    }
  },

  Faq: {
    screen: Faq,
    navigationOptions: {
      headerShown: false
    }
  },

  TabProfile: {
    screen: TabProfile,
    navigationOptions: {
      headerShown: false
    }
  },

  SingleDetail: {
    screen: SingleDetail,
    navigationOptions: {
      headerShown: false
    }
  },

 

  QR_Code: {
    screen: QR_Code,
    navigationOptions: {
      headerShown: false
    }
  },

  AllTransactions: {
    screen: AllTransactions,
    navigationOptions: {
      headerShown: false
    }
  },

  CategoryTranscations: {
    screen: CategoryTranscations,
    navigationOptions: {
      headerShown: false
    }
  },

  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      headerShown: false
    }
  },

  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      headerShown: false
    }
  },

  DeleteAccount: {
    screen: DeleteAccount,
    navigationOptions: {
      headerShown: false
    }
  },

  Support: {
    screen: Support,
    navigationOptions: {
      headerShown: false
    }
  },

  SupportList: {
    screen: SupportList,
    navigationOptions: {
      headerShown: false
    }
  },

  Webview: {
    screen: Webview,
    navigationOptions: {
      headerShown: false
    }
  },

  VideoPlayer: {
    screen: VideoPlayer,
    navigationOptions: {
      headerShown: false
    }
  },

  StartUpAd: {
    screen: StartUpAd,
    navigationOptions: {
      headerShown: false
    }
  },
  
  MySavedOffers: {
    screen: MySavedOffers,
    navigationOptions: {
      headerShown: false
    }
  },

  QRCodeScreen: {
    screen: QRCodeScreen,
    navigationOptions: {
      headerShown: false
    }
  },

  UsedOffered: {
    screen: UsedOffered,
    navigationOptions: {
      headerShown: false
    }
  },

  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      headerShown: false
    }
  },

  MoreTutorials: {
    screen: MoreTutorials,
    navigationOptions: {
      headerShown: false
    }
  },

});
export default createAppContainer(Project);
