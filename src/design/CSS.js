import { Platform, dimensions } from 'react-native';
import Design from '../design/Design';

export default {
	Splashcontainer: {
		flex: 1,
		backgroundColor: Design.bg_color,

	},

	Homecontainer: {
		flex: 1,
		backgroundColor: Design.white,
		paddingHorizontal: 15,
	},

	Favcontainer: {
		flex: 1,
		backgroundColor: Design.white,
	},

	LoginBackground: {
		height: '100%', width: '100%'
	},

	ForgetPass: {
		flexDirection: 'row', alignSelf: 'flex-end', marginRight: 20, marginTop: Platform.OS == "ios" ? 10 : 13
	},

	SocilaLogin: {
		flexDirection: 'row', marginHorizontal: 40, justifyContent: 'space-evenly', marginTop: 15
	},

	DontHaveAccount: {
		flexDirection: 'row', alignSelf: 'center', marginTop: Platform.OS == "ios" ? 50 : 40,
		marginBottom: 40
	},

	HaveAccount: {
		flexDirection: 'row', alignSelf: 'center', marginTop: Platform.OS == "ios" ? 30 : 40, marginBottom: 30
	},

	tab_container: {
		flexDirection: 'row',
		alignContent: 'center',
		backgroundColor: Design.white,
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
		borderRadius: 10,
		paddingHorizontal: 15,
		alignSelf:'center'
	},

	logout_text_view:
	{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginTop: 10
	},

	home_toolbar:
	{
		flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS == "ios" ? 53 : 15
	},
	home_mapicon:
	{
		flexDirection: 'row', justifyContent: 'flex-end', width: 80
	},

	home_title:
	{
		flexDirection: 'row', alignSelf: 'center', marginTop: Platform.OS == "ios" ? 53 : 30
	},
	cat_list:
	{
		flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15
	},
	home_tab_click:
	{
		flexDirection: 'row', marginTop: Platform.OS == "ios" ? 20 : 17
	},

	hot_button:
	{
		flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffe6cf', flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: Platform.OS == "ios" ? 8 : 5, borderRadius: 10, marginHorizontal: 5
	},
	dot_view:
	{
		position: 'absolute', bottom: 10, right: 15
	},
	active_dot:
	{
		width: 30, height: 6, backgroundColor: Design.white, borderRadius: 10, marginHorizontal: 3
	},
	inactive_dot_view: {
		width: 6, height: 6, backgroundColor: Design.grey, borderRadius: 10, marginHorizontal: 3
	},
	home_value_image:
	{
		width: "100%",
		height: 210,
		borderRadius: 10,
		overflow: 'hidden',
	},
	overlay: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity by changing the last value (0.5 in this case)
	},
	view_detail:
	{
		position: 'absolute', bottom: 15
	},
	no_data_view:
	{
		flex: 1,
		// height: "100%",
		justifyContent: 'center',
		alignItems: 'center'
	},

	qr_code_container: {
		flex: 1,
		backgroundColor: '#0362FF',
	},

	qr_code_toolbar: {
		flexDirection: 'row', marginTop: Platform.OS == "ios" ? 30 : 10, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5
	},

	qr_code_view: {

		height: "60%",
		width: "75%",
		overflow: 'hidden',
		marginTop: 80,
		alignSelf: 'center',
		borderRadius: 20,
		borderColor: Design.primary_color_orange,
		borderWidth: 2
	}

};