import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Login from '../screens/auth/Login';
import CustomTabBar from '../screens/CustomTabBar';
import OTPScreen from '../screens/auth/Otp';
import MyOffers from '../screens/pages/MyOffers';
import SavedOffers from '../screens/pages/SavedOffers';
import FAQs from '../screens/pages/FAQs';
import Report from '../screens/pages/Report';
import Tutorials from '../screens/pages/Tutorials';
import VenueRequest from '../screens/pages/VenueRequest';
import QrScanner from '../screens/pages/QrScanner';
import Venues from '../screens/pages/Venues';
import PageHeader from './PageHeader';
import { View } from 'react-native';
import VenueDetails from '../screens/pages/VenueDetails';
import { Colors } from '../constants/Colors';
import Map from '../screens/pages/Map';
import VideoPlayer from '../screens/pages/VideoPlayer';
import WebPage from '../screens/pages/WebPage';
import ChangePassword from '../screens/pages/ChangePassword';
import QrPreview from '../screens/pages/QrPreview';
import EditProfile from '../screens/pages/EditProfile';
import HotVenues from '../screens/pages/HotVenues';
import TransactionHistory from '../screens/pages/TransactionHistory';
import DeleteAccount from '../screens/pages/DeleteAccount';
import SupportList from '../screens/pages/SupportList';
import SupportForm from '../screens/pages/SupportForm';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Otp"
        component={OTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={CustomTabBar}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyOffers" component={MyOffers} options={{
        header: props => (
          <PageHeader
            {...props}
            title="My Offers"
            showBackButton
            backgroundColor={Colors.white}
          />
        ),
      }} />
      <Stack.Screen
        name="SavedOffers"
        component={SavedOffers}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Saved Offers"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen name="FAQs" component={FAQs} options={{
        headerShown: false,
      }} />
      <Stack.Screen name="Report" component={Report}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Report a venue"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen name="Tutorials" component={Tutorials} options={{
        header: props => (
          <PageHeader
            {...props}
            title="Tutorials"
            showBackButton
            backgroundColor={Colors.white}
          />
        ),
      }} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
      <Stack.Screen name="WebPage" component={WebPage} options={{ headerShown: false }} />
      <Stack.Screen name="VenueRequest" component={VenueRequest} options={{
        header: props => (
          <PageHeader
            {...props}
            title="Request a venue"
            showBackButton
            backgroundColor={Colors.white}
          />
        ),
      }} />
      <Stack.Screen name="Map" component={Map} options={{
        headerShown: false
      }} />
      <Stack.Screen
        name="VenueDetails"
        component={VenueDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QrScanner"
        component={QrScanner}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Scan QR Code"
              showBackButton
              backgroundColor="#0362FF"
              textColor="white"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Venues"
        component={Venues}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Categories"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Change Password"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HotVenues"
        component={HotVenues}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Hot Venues"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="QrPreview"
        component={QrPreview}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="QR Code Preview"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Edit Profile"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Transaction History"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Delete Account"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SupportList"
        component={SupportList}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Support"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SupportForm"
        component={SupportForm}
        options={{
          header: props => (
            <PageHeader
              {...props}
              title="Support"
              showBackButton
              backgroundColor={Colors.white}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
