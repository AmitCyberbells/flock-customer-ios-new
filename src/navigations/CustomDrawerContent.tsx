import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authReducer';
import Imageview from '../components/Imageview';
import { Alert, View } from 'react-native';
import { Colors } from '../constants/Colors';
import Images from '../constants/Images';
import {
  useNavigationState,
} from '@react-navigation/native';
import { useEffect } from 'react';
import UserCard from '../components/UserCard';
import { isIos } from '../constants/IsPlatform';
import { resetWallet } from '../store/walletReducer';
import { resetLocation } from '../store/locationReducer';
import { resetUserToStore } from '../store/userReducer';
import { useThemeColors } from '../constants/useThemeColors';

export default function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const dispatch = useDispatch();
  const theme = useThemeColors();

  const currentRoute = useNavigationState(
    state => state?.routes[state.index]?.state?.routes,
  );

  const routeName: any = currentRoute
    ? currentRoute[currentRoute?.length - 1]?.name
    : '';

  useEffect(() => { }, []);

  const navigate = (screen: string) => {
    props.navigation.navigate('Main', { screen });
  };

  const confirmLogout = (done: () => void) => {
    Alert.alert(
      "Confirm logout", // Title
      "Are you sure you want to logout?", // Message
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Please",
          onPress: () => { done() },
          style: "destructive",
        },
      ]
    );
  }

  const signOut = () => {
    // take confirmation before logout
    // api to revoke server sessions
    dispatch(logout());
    dispatch(resetWallet());
    resetLocation();
    dispatch(resetUserToStore());
  };

  return (
    <DrawerContentScrollView {...props}>
      <UserCard />

      {SideMenuList.map((item, index) => {
        return (
          <DrawerItem
            key={index}
            icon={() => (
              <View>
                {item.slug !== 'VenueRequest' ? <Imageview
                  style={{
                    width: isIos ? 27 : 23,
                    height: isIos ? 27 : 23,
                  }}
                  url={item.img}
                  imageType={'local'}
                  resizeMode={'contain'}
                  tintColor={routeName === item.slug ? Colors.white : Colors.grey}
                /> : <Imageview
                  style={{
                    width: isIos ? 27 : 23,
                    height: isIos ? 27 : 23,
                  }}
                  url={routeName === item.slug ? Images.FlockBird : item.img}
                  imageType={'local'}
                  resizeMode={'contain'}
                />}
              </View>
            )}
            label={item.title}
            onPress={() => {
              if (item.slug === 'logout') {
                confirmLogout(signOut)
              } else {
                navigate(item.slug);
              }
            }}
            activeBackgroundColor={Colors.primary_color_orange}
            activeTintColor={Colors.white}
            focused={routeName === item.slug}
            labelStyle={{ color: theme.text }}
          />
        );
      })}


    </DrawerContentScrollView>
  );
}

const SideMenuList = [
  {
    img: Images.discount,
    title: 'My Offers',
    slug: 'MyOffers',
  },
  {
    img: Images.favourite,
    title: 'Saved Offers',
    slug: 'SavedOffers',
  },
  {
    img: Images.navFaq,
    title: 'FAQs',
    slug: 'FAQs',
  },
  {
    img: Images.navReport,
    title: 'Report',
    slug: 'Report',
  },
  {
    img: Images.tutorials,
    title: 'How To',
    slug: 'Tutorials',
  },
  {
    img: Images.venue_request,
    title: 'Request Venue',
    slug: 'VenueRequest',
  },
  {
    img: Images.support,
    title: 'Support',
    slug: 'SupportList',
  },
  {
    img: Images.navLogout,
    title: 'Logout',
    slug: 'logout',
  },
];
