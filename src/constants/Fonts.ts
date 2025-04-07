import { isAndroid } from "./IsPlatform";

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

	regular: isAndroid ? 'regular' : 'Montserrat-Regular',
	medium: isAndroid ? 'medium' : 'Montserrat-Medium',
	semi_bold: isAndroid ? 'semiBold' : 'Montserrat-SemiBold',
	bold: isAndroid ? 'bold' : 'Montserrat-Bold',
	light: isAndroid ? 'thin' : 'Montserrat-Thin',

	empty_text: isAndroid ? 'regular' : "Montserrat-Regular",
	not_empty_text: isAndroid ? 'bold' : "Montserrat-Bold",

	//fontsize
	fs_7: isAndroid ? 7 : 9,
	fs_8: isAndroid ? 8 : 10,
	fs_10: isAndroid ? 10 : 12,
	fs_11: isAndroid ? 11 : 13,
	fs_12: isAndroid ? 12 : 14,
	fs_13: isAndroid ? 13 : 15,
	fs_14: isAndroid ? 14 : 16,
	fs_15: isAndroid ? 15 : 17,
	fs_16: isAndroid ? 16 : 18,
	fs_17: isAndroid ? 15 : 19,
	fs_18: isAndroid ? 16 : 20,
	fs_20: isAndroid ? 19 : 23,
	fs_25: isAndroid ? 23 : 27,
	fs_27: isAndroid ? 26 : 30,
	fs_30: isAndroid ? 28 : 32,
}