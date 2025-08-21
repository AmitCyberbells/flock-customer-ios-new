/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary_color_orange: '#FF8210',
  light_color_orange: '#ffe6cf',
  orange_shade1: '#facea5',

  color_one:'#ffdfc3',
	color_two:'#cad2f7',
	color_three:'#c3ced6',
	color_four:'#fff2be',
	color_five:'#ffdfc3',

  venueIconColor: '#234dd1',
  blue: '#007AFF',
  black: '#000000',
  red: '#ff0000',
  lightRed: '#ffcccc',
  darkRed: '#8B0000',
  firebrick: '#B22222',
  crimson: '#DC143C',
  indianRed: '#CD5C5C',
  lightCoral: '#F08080',
  grey: '#8E8E8E',
  light_grey: '#B4B4B4',
  dark_blue: '#103E5B',
  light_blue: '#2B4CE0',
  blue3: '#ADD8E6',
  white: '#fff',
  whitesmoke: '#F5F5F5',
  transparent: 'transparent',
  success: '#4BB543',
  error: '#FF0000',

  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#FF8210', // orange
    secondary: '#ffe6cf', // light orange
    backgroundSecondary: '#F5F5F5',
    border: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#FF8210', // orange
    secondary: '#ffe6cf', // light orange
    backgroundSecondary: '#1F1F1F',
    border: '#333333',
  },
};



export const BaseColors = {
  orange: '#FF8210',
  lightOrange: '#ffe6cf',
  orangeShade1: '#facea5',

  colorOne: '#ffdfc3',
  colorTwo: '#cad2f7',
  colorThree: '#c3ced6',
  colorFour: '#fff2be',
  colorFive: '#ffdfc3',

  venueIcon: '#234dd1',
  blue: '#007AFF',
  black: '#000000',
  red: '#FF0000',
  lightRed: '#FFCCCC',
  darkRed: '#8B0000',
  firebrick: '#B22222',
  crimson: '#DC143C',
  indianRed: '#CD5C5C',
  lightCoral: '#F08080',
  grey: '#8E8E8E',
  lightGrey: '#B4B4B4',
  darkBlue: '#103E5B',
  lightBlue: '#234dd1', //'#2B4CE0',
  blue3: '#ADD8E6',
  white: '#FFFFFF',
  basecolour:'#B4B4B4',
  whiteSmoke: '#F5F5F5',
  transparent: 'transparent',
  success: '#4BB543',
  error: '#FF0000',
  categoryIconBg: '#dfe4fb',
};


export const LightTheme = {
  text: '#11181C',
  textDes:'#D1D5DB',
  muteText: BaseColors.lightGrey,
  placeholder: '#B4B4B4',
  background: BaseColors.white,
  backgroundfav: BaseColors.white,
  shadow:'#dcdcdc',
  inputBackground: BaseColors.whiteSmoke,
  tint: tintColorLight,
  icon: '#687076',
  tabIconDefault: '#687076',
  tabIconSelected: tintColorLight,
  primary: BaseColors.orange,
  secondary: BaseColors.lightOrange,
  backgroundSecondary: BaseColors.whiteSmoke,
  border: '#E0E0E0',
  blueFont: BaseColors.lightBlue,
  blueIcon: BaseColors.lightBlue,
  greyIcon: BaseColors.grey,
  cyanBlueIcon: '#18415a',
  categoryIconBg: BaseColors.categoryIconBg,
  shadowColor: BaseColors.black,
  cardBackground: BaseColors.white,
  white: BaseColors.white,
  category:BaseColors.lightBlue,
  categoryText:BaseColors.lightBlue
};

export const DarkTheme = {
  text: '#ECEDEE',
  textDes:'#D1D5DB',
  muteText: BaseColors.lightGrey,
  placeholder: '#B4B4B4',
  background: '#151718',
  backgroundfav:'#1F1F1F',
  shadow:'#1F1F1F',
  inputBackground: '#1F1F1F',
  tint: tintColorDark,
  icon: '#9BA1A6',
  tabIconDefault: '#9BA1A6',
  tabIconSelected: tintColorDark,
  primary: BaseColors.orange,
  secondary: BaseColors.lightOrange,
  backgroundSecondary: '#1F1F1F',
  border: '#333333',
  blueFont: BaseColors.white,
  blueIcon: BaseColors.orange,
  greyIcon: BaseColors.orange,
  cyanBlueIcon: BaseColors.orange,
  categoryIconBg: BaseColors.categoryIconBg,
  shadowColor: BaseColors.basecolour,
  cardBackground: '#2A2A2A',
  white: BaseColors.white,
  category:BaseColors.orange,
  categoryText:BaseColors.orange
};