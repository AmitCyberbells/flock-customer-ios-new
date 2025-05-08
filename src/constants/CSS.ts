import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors} from './Colors';
import { Fonts } from './Fonts';
import { isIos } from './IsPlatform';

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');

const scale = DEVICE_WIDTH / 375; // Using 375 as base width
const normalize = (size: number) => Math.round(scale * size);

export const CSS = StyleSheet.create({
  themeButton: {
    fontSize: Fonts.fs_17,
    color: Colors.white,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    backgroundColor: Colors.primary_color_orange,
    marginHorizontal: 17,
    paddingVertical: isIos ? 15 : 10,
    borderRadius: 10,
  },
  title: {
    fontSize: Fonts.fs_25,
    color: Colors.black,
    fontFamily: Fonts.medium,
    alignSelf: 'center',
    marginTop: 35,
  },
  subTitle: {
    fontSize: Fonts.fs_18,
    color: Colors.black,
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
  },
  flex: {
    flex: 1,
  },
  bgWhitesmoke: {
    backgroundColor: Colors.whitesmoke,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  Splashcontainer: {
    flex: 1,
    backgroundColor: Colors.whitesmoke,
  },
  showGrid: {
    borderWidth: 1,
    borderColor: Colors.black
  },
  Homecontainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },

  Favcontainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  LoginBackground: {
    height: '100%',
    width: '100%',
  },

  ForgetPass: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 20
  },

  SocilaLogin: {
    flexDirection: 'row',
    marginHorizontal: 40,
    justifyContent: 'space-evenly',
    marginTop: 15,
  },

  DontHaveAccount: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: isIos ? 50 : 40,
    marginBottom: 40,
  },

  HaveAccount: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: isIos ? 30 : 20,
    marginBottom: 30,
  },

  tab_container: {
    flexDirection: 'row',
    alignContent: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
  },

  image_icon: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  buttonView: {
    marginTop: 10,
    width: '80%',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },

  logout_text_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  home_toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isIos ? 53 : 15,
  },
  home_mapicon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 80,
  },

  home_title: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: isIos ? 53 : 30,
  },
  cat_list: {
    flexGrow: 0,
    marginTop: isIos ? 18 : 15,
  },
  home_tab_click: {
    flexDirection: 'row',
    marginTop: isIos ? 20 : 20,
  },

  hot_button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6cf',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: isIos ? 8 : 5,
    borderRadius: 10,
  },
  dot_view: {
    position: 'absolute',
    bottom: 10,
    right: 15,
  },
  active_dot: {
    width: 30,
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 3,
    marginBottom: -40
  },
  inactive_dot_view: {
    width: 6,
    height: 6,
    backgroundColor: Colors.grey,
    borderRadius: 10,
    marginHorizontal: 3,
    marginBottom: -40
  },
  home_value_image: {
    width: '100%',
    height: DEVICE_HEIGHT > 880 ? 250 : 180,
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity by changing the last value (0.5 in this case)
  },
  view_detail: {
    position: 'absolute',
    bottom: 15,
  },
  no_data_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  qr_code_container: {
    flex: 1,
    backgroundColor: '#0362FF',
  },

  qr_code_toolbar: {
    flexDirection: 'row',
    marginTop: isIos ? 30 : 10,
    alignItems: 'center',
    marginHorizontal: isIos ? 7 : 5,
  },

  qr_code_view: {
    height: '60%',
    width: '75%',
    //overflow: 'hidden',
    marginVertical: 40,
    alignSelf: 'center',
    //borderRadius: 20,
    //borderColor: Colors.primary_color_orange,
    //borderWidth: 2,
  },
});
