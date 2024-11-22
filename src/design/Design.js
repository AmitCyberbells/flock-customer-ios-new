
import { Platform } from 'react-native';

export default {
	bg_color: '#F5F5F5',
    primary_color_orange: '#FF8210',
	light_color_orange: '#ffe6cf',
	
	better_blue: '#98c1d9',

    black:'#000000',
	red:'#ff0000',
    grey:'#8E8E8E',
	light_grey:'#B4B4B4',
    dark_blue:'#103E5B',
    light_blue:'#2B4CE0',
	white:'#fff',
	text_light_grey:'#CCCCCC',
    grey_line:'#D9D9D9',
	edit_text:'#EDEDED',
	light_purple:'#d5dbf9',
	very_light_grey:'#F6F6F6',
	grey_tab:'#ececec',
	light_pink:'#ffccd8',
    very_light_blue:'#dfe4fa',
	android_regular: 'regular',
	android_medium: 'medium',
	android_semi_bold: 'semiBold',
	android_bold: 'bold',
	android_light: 'thin',

	
	
	color_one:'#ffdfc3',
	color_two:'#cad2f7',
	color_three:'#c3ced6',
	color_four:'#fff2be',
	color_five:'#ffdfc3',



	ios_regular: 'Montserrat-Regular',
	ios_medium: 'Montserrat-Medium',
	ios_semi_bold: 'Montserrat-SemiBold',
	ios_bold: 'Montserrat-Bold',
	ios_light: 'Montserrat-Thin',

	//fontsize
	font_7: Platform.OS == 'android' ? 7 : 9,
	font_8: Platform.OS == 'android' ? 8 : 10,
	font_10: Platform.OS == 'android' ? 10 : 12,
	font_11: Platform.OS == 'android' ? 11 : 13,
	font_12: Platform.OS == 'android' ? 12 : 14,
	font_13: Platform.OS == 'android' ? 13 : 15,
	font_14: Platform.OS == 'android' ? 14 : 16,
	font_15: Platform.OS == 'android' ? 15 : 17,
	font_16: Platform.OS == 'android' ? 16 : 18,

	font_17: Platform.OS == 'android' ? 15 : 19,

	font_18: Platform.OS == 'android' ? 16 : 20,
	font_20: Platform.OS == 'android' ? 19 : 23,
	font_25: Platform.OS == 'android' ? 23 : 27,
	font_27: Platform.OS == 'android' ? 26 : 30,
	font_30: Platform.OS == 'android' ? 28 : 32,


	//
	empty_text:Platform.OS=="android" ?'regular':"Montserrat-Regular",
	not_empty_text:Platform.OS=="android" ?'bold':"Montserrat-Bold",
};
