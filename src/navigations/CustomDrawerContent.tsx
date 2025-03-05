import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/authReducer';
import Imageview from '../components/Imageview';
import {Image, Platform, View} from 'react-native';
import {Colors} from '../constants/Colors';
import Images from '../constants/Images';
import {
  useNavigationState,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import UserCard from '../components/UserCard';
import Dialog from 'react-native-dialog';
import { isIos } from '../constants/IsPlatform';

export default function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const dispatch = useDispatch();

  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);

  const currentRoute = useNavigationState(
    state => state?.routes[state.index]?.state?.routes,
  );

  const routeName: any = currentRoute
    ? currentRoute[currentRoute?.length - 1]?.name
    : '';

  useEffect(() => {}, []);

  const navigate = (screen: string) => {
    props.navigation.navigate('Main', {screen});
  };

  const signOut = () => {
    // take confirmation before logout
    // api to revoke server sessions
    dispatch(logout());

  };

  return (
    <DrawerContentScrollView {...props}>
      <UserCard />

      {SideMenuList.map((item, index) => {
        return (
          <DrawerItem
            key={index}
            icon={() => (
              <Imageview
                style={{
                  width: isIos ? 27 : 23,
                  height: isIos ? 27 : 23,
                }}
                url={item.img}
                imageType={'local'}
                resizeMode={'contain'}
                tintColor={routeName === item.slug ? Colors.white : Colors.grey}
              />
            )}
            label={item.title}
            onPress={() => {
              if (item.slug === 'logout') {
                setConfirmLogout(true);
              } else {
                navigate(item.slug);
              }
            }}
            activeBackgroundColor={Colors.primary_color_orange}
            activeTintColor={Colors.white}
            focused={routeName === item.slug}
          />
        );
      })}

      <Dialog.Container visible={confirmLogout}>
        <Dialog.Title>{'Confirmation'}</Dialog.Title>
        <Dialog.Description>{'Are you sure to logout?'}</Dialog.Description>
        <Dialog.Button
          label={'No'}
          onPress={() => setConfirmLogout(false)}
        />
        <Dialog.Button
          label={'Yes'}
          onPress={() => {
            setConfirmLogout(false);
            signOut();
          }}
        />
      </Dialog.Container>
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
    img: Images.bird,
    title: 'Request venue',
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
