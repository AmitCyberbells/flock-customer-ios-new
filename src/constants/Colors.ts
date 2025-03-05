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
