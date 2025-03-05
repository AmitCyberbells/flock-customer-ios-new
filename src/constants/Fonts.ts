import { Platform } from "react-native";

export const Fonts = {
    android_regular: 'regular',
	android_medium: 'medium',
	android_semi_bold: 'semiBold',
	android_bold: 'bold',
	android_light: 'thin',

    ios_regular: 'Montserrat-Regular',
	ios_medium: 'Montserrat-Medium',
	ios_semi_bold: 'Montserrat-SemiBold',
	ios_bold: 'Montserrat-Bold',
	ios_light: 'Montserrat-Thin',

    //fontsize
	fs_7:  Platform.OS == 'android' ? 7 : 9,
	fs_8:  Platform.OS == 'android' ? 8 : 10,
	fs_10: Platform.OS == 'android' ? 10 : 12,
	fs_11: Platform.OS == 'android' ? 11 : 13,
	fs_12: Platform.OS == 'android' ? 12 : 14,
	fs_13: Platform.OS == 'android' ? 13 : 15,
	fs_14: Platform.OS == 'android' ? 14 : 16,
	fs_15: Platform.OS == 'android' ? 15 : 17,
	fs_16: Platform.OS == 'android' ? 16 : 18,
	fs_17: Platform.OS == 'android' ? 15 : 19,
	fs_18: Platform.OS == 'android' ? 16 : 20,
	fs_20: Platform.OS == 'android' ? 19 : 23,
	fs_25: Platform.OS == 'android' ? 23 : 27,
	fs_27: Platform.OS == 'android' ? 26 : 30,
	fs_30: Platform.OS == 'android' ? 28 : 32,
}