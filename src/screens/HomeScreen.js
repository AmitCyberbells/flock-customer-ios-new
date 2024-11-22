// import React,{useEffect,useState} from "react";
// import { View,Text ,Dimensions} from 'react-native'
// import { createStackNavigator } from 'react-navigation-stack';
// import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
// import {
//   createBottomTabNavigator,
//   createMaterialTopTabNavigator,
//   BottomTabBar,
// } from 'react-navigation-tabs';
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// import TabHome from './TabHome';
// import TabNotification from './TabNotification';
// import TabFavorites from './TabFavorites';
// import TabProfile from './TabProfile';
// import TabInu from './TabInu';
// import CustomTabBar from './CustomTabBar';
// import SideNavigation from './SideNavigation';

// import Stars from '../screens/Stars';
// import Hot from '../screens/Hot';
// import Search from '../screens/Search';
// import Categories from "../screens/Categories"

// const Home = createStackNavigator({
//     TabHome: {
//       screen: TabHome,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//     Stars: {
//       screen: Stars,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//     Hot: {
//       screen: Hot,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//     Search: {
//       screen: Search,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//     Categories: {
//       screen: Categories,
//       navigationOptions: {
//         headerShown: false // this will do your task
//       }
//     },
//   });
//   const Notification = createStackNavigator({
//     TabNotification: {
//       screen: TabNotification,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//   });
//   const Favorites = createStackNavigator({
//     TabFavorites: {
//       screen: TabFavorites,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//   });
//   const Profile = createStackNavigator({
//     TabProfile: {
//       screen: TabProfile,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//   });
//   const Inu = createStackNavigator({
//     TabInu: {
//       screen: TabInu,
//       navigationOptions: ({ navigation }) => ({
//         headerShown: false,
//       }),
//     },
//   });
//   const bottomTabNavigator = createMaterialTopTabNavigator(
//     {
//       Home: {
//         screen: Home,
//         navigationOptions: ({ navigation }) => ({}),
//       },
//       Notification: {
//         screen: Notification,
//         navigationOptions: ({ navigation }) => ({}),
//       },
//       Favorites: {
//         screen: Favorites,
//         navigationOptions: ({ navigation }) => ({}),
//       },
//       Profile: {
//         screen: Profile,
//         navigationOptions: ({ navigation }) => ({}),
//       },
//       Inu: {
//         screen: Inu,
//         navigationOptions: ({ navigation }) => ({}),
//       },
  
//     },
//     {
//       lazy: true,
//       tabBarComponent: ({ navigation, focused }) => (
//         <CustomTabBar navigation={navigation} focused={focused} />
//       ),
//       initialRouteName: 'Home',
//       tabBarPosition: 'bottom',
//       swipeEnabled: false,
//       tabBarOptions: {},
//     }
//   );
//   const RootNavigator = createDrawerNavigator({ bottomTabNavigator }, {
//     contentComponent: SideNavigation,
//     drawerWidth: Dimensions.get('window').width * 0.96,
//     drawerBackgroundColor: 'transparent',
//     edgeWidth: -100,
//     // drawerType: 'slide',
//     drawerPosition: 'left',
//   }
//   );
//   export default createAppContainer(RootNavigator);