import Utils from "../services/Utils";
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
	fs_7: Utils.rwdSize(isAndroid ? 7 : 9),
	fs_8: Utils.rwdSize(isAndroid ? 8 : 10),
	fs_9: Utils.rwdSize(isAndroid ? 9 : 11),
	fs_10: Utils.rwdSize(isAndroid ? 10 : 12),
	fs_11: Utils.rwdSize(isAndroid ? 11 : 13),
	fs_12: Utils.rwdSize(isAndroid ? 12 : 14),
	fs_13: Utils.rwdSize(isAndroid ? 13 : 15),
	fs_14: Utils.rwdSize(isAndroid ? 14 : 16),
	fs_15: Utils.rwdSize(isAndroid ? 15 : 17),
	fs_16: Utils.rwdSize(isAndroid ? 16 : 18),
	fs_17: Utils.rwdSize(isAndroid ? 17 : 19),
	fs_18: Utils.rwdSize(isAndroid ? 18 : 20),
	fs_19: Utils.rwdSize(isAndroid ? 19 : 21),
	fs_20: Utils.rwdSize(isAndroid ? 20 : 22),
	fs_21: Utils.rwdSize(isAndroid ? 21 : 23),
	fs_22: Utils.rwdSize(isAndroid ? 22 : 24),
	fs_23: Utils.rwdSize(isAndroid ? 23 : 25),
	fs_24: Utils.rwdSize(isAndroid ? 24 : 26),
	fs_25: Utils.rwdSize(isAndroid ? 25 : 27),
	fs_26: Utils.rwdSize(isAndroid ? 26 : 28),
	fs_27: Utils.rwdSize(isAndroid ? 27 : 29),
	fs_28: Utils.rwdSize(isAndroid ? 28 : 30),
	fs_29: Utils.rwdSize(isAndroid ? 29 : 31),
	fs_30: Utils.rwdSize(isAndroid ? 30 : 32),

}