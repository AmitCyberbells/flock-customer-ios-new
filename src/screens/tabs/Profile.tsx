import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { CSS } from '../../constants/CSS';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import { Pressable } from 'react-native-gesture-handler';
import Imageview from '../../components/Imageview';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import Images from '../../constants/Images';
import VirtualizedList from '../../components/VirtualizedList';
import RootStackParamList from '../../types/RootStackParamList';
import ShadowCard from '../../components/ShadowCard';
import TabHeader from '../../components/TabHeader';
import { isIos } from '../../constants/IsPlatform';
import WalletService from '../../services/WalletService';
import Loader from '../../components/Loader';

type ProfileMenuItem = {
  id: number,
  title: string,
  route: keyof RootStackParamList
}

const Profile: React.FC<ScreenProps<'Tabs'>> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: StoreStates) => state.user);
  const wallet = useSelector((state: StoreStates) => state.wallet);
  const profileMenu: ProfileMenuItem[] = [
    {
      id: 1,
      title: 'Profile Settings',
      route: 'EditProfile'
    },
    {
      id: 2,
      title: 'Change Password',
      route: 'ChangePassword'
    },
    {
      id: 3,
      title: 'Transaction History',
      route: 'TransactionHistory'
    },
    {
      id: 4,
      title: 'Delete Account',
      route: 'DeleteAccount'
    },
  ];

  const { updateWalletBalances } = WalletService();

  useEffect(() => {
    updateWalletBalances(setIsLoading);
  }, [])

  const renderItem_profileMenu = useCallback(
    ({ item, index }: { item: ProfileMenuItem, index: number }) => (
      <Pressable onPress={() => { props.navigation?.navigate(item.route as any) }} style={{ flex: 1 }}>
        <ShadowCard
          style={styles.menuItemCard}>
          <View style={styles.menuItemContainer}>
            <Textview
              text={item.title}
              style={styles.menuItemText}
            />
            <Imageview
              url={Images.blackArrow}
              style={styles.menuItemArrow}
              imageType={'local'}
            />
          </View>
        </ShadowCard>
      </Pressable>
    ),
    [profileMenu],
  );

  const keyExtractor_profileMenu = (item: any, index: number) => index.toString();

  return (
    <View style={[CSS.Favcontainer]}>
      <Loader isLoading={isLoading} />
      <View style={[styles.container]}>
        <TabHeader {...props} title='My Profile' />
        <VirtualizedList>
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              <Imageview
                url={user.image || Images.profileImg}
                style={styles.profileImage}
                imageStyle={{ borderRadius: isIos ? 80 : 70 }}
                imageType={'server'}
                resizeMode='cover'
              />
            </View>

            <Textview
              text={user.first_name + ' ' + (user.last_name ?? '')}
              style={styles.userName}
            />
            <Textview
              text={user.email}
              style={styles.userEmail}
            />
          </View>

          <ShadowCard style={styles.feathersCard}>
            <View style={styles.rowSpaceBetween}>
              <Textview
                text={'Feathers'}
                style={styles.feathersTitle}
              />
            </View>

            <Textview
              text={wallet.balance_feather_points + ' fts'}
              style={styles.feathersCount}
            />

            <View style={styles.divider} />

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Imageview
                  url={Images.earned}
                  style={styles.statIcon}
                  imageType={'local'}
                />
                <View style={styles.statTextContainer}>
                  <Textview
                    text={'Earned'}
                    style={styles.statLabel}
                  />
                  <Textview
                    text={wallet.earned_feather_points + ' fts'}
                    style={styles.statValue}
                  />
                </View>
              </View>
              <View style={styles.statItem}>
                <Imageview
                  url={Images.spend}
                  style={styles.spendIcon}
                  imageType={'local'}
                />
                <View style={styles.statTextContainer}>
                  <Textview
                    text={'Spent'}
                    style={styles.statLabel}
                  />
                  <Textview
                    text={wallet.spent_feather_points + ' fts'}
                    style={styles.statValue}
                  />
                </View>
              </View>
            </View>
          </ShadowCard>

          <ShadowCard
            style={styles.pointsCard}>
            <View style={styles.rowSpaceBetween}>
              <Textview
                text={'Venue Points'}
                style={styles.pointsTitle}
              />
            </View>

            <Textview
              text={wallet.balance_venue_points + ' pts'}
              style={styles.pointsCount}
            />

            <View style={styles.divider} />

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Imageview
                  url={Images.earned}
                  style={styles.spendIcon}
                  imageType={'local'}
                />
                <View style={styles.statTextContainer}>
                  <Textview
                    text={'Earned'}
                    style={styles.statLabel}
                  />
                  <Textview
                    text={wallet.earned_venue_points + ' pts'}
                    style={styles.statValue}
                  />
                </View>
              </View>
              <View style={styles.statItem}>
                <Imageview
                  url={Images.spend}
                  style={styles.spendIcon}
                  imageType={'local'}
                />
                <View style={styles.statTextContainer}>
                  <Textview
                    text={'Spent'}
                    style={styles.statLabel}
                  />
                  <Textview
                    text={wallet.spent_venue_points + ' pts'}
                    style={styles.statValue}
                  />
                </View>
              </View>
            </View>
          </ShadowCard>

          <Textview
            text={'General'}
            style={styles.generalTitle}
          />

          <FlatList
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={profileMenu}
            contentContainerStyle={styles.menuListContent}
            style={styles.menuList}
            renderItem={renderItem_profileMenu}
            keyExtractor={keyExtractor_profileMenu}
          />
        </VirtualizedList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
    marginHorizontal: 15
  },

  profileImageContainer: {
    alignItems: 'center',
    marginTop: isIos ? 35 : 25,
  },
  imageWrapper: {
    height: isIos ? 160 : 140,
    width: isIos ? 160 : 140,
    borderWidth: 0.4,
    borderColor: Colors.grey,
    borderRadius: isIos ? 80 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: isIos ? 135 : 125,
    height: isIos ? 135 : 125,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  userName: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    textAlign: 'center',
    fontSize: Fonts.fs_18,
    marginTop: isIos ? 15 : 7,
  },
  userEmail: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    textAlign: 'center',
    fontSize: Fonts.fs_14,
    marginTop: isIos ? 5 : 0,
  },
  feathersCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: isIos ? 20 : 15,
    paddingVertical: isIos ? 10 : 7,
    marginTop: isIos ? 30 : 20,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feathersTitle: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    textAlign: 'center',
    fontSize: Fonts.fs_14,
  },
  feathersCount: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_25,
    marginTop: isIos ? 10 : 0,
  },
  divider: {
    borderColor: Colors.grey,
    borderWidth: isIos ? 0.6 : 0.3,
    marginVertical: isIos ? 10 : 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginVertical: isIos ? 12 : 5,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: isIos ? 40 : 30,
    height: isIos ? 40 : 30,
  },
  spendIcon: {
    width: isIos ? 40 : 30,
    height: isIos ? 40 : 30,
    resizeMode: 'contain',
  },
  statTextContainer: {
    paddingHorizontal: 15,
  },
  statLabel: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    fontSize: Fonts.fs_14,
    marginBottom: isIos ? 5 : 0,
  },
  statValue: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_17,
    marginTop: isIos ? 2 : 0,
  },
  pointsCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: isIos ? 20 : 15,
    paddingVertical: isIos ? 10 : 7,
    marginTop: isIos ? 30 : 20,
  },
  pointsTitle: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    textAlign: 'center',
    fontSize: Fonts.fs_14,
  },
  pointsCount: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_25,
    marginTop: isIos ? 10 : 0,
  },
  generalTitle: {
    fontFamily: Fonts.medium,
    color: Colors.grey,
    fontSize: Fonts.fs_18,
    fontWeight: '600',
    marginTop: isIos ? 15 : 10,
  },
  menuList: {
    flexGrow: 0,
    marginBottom: 10,
    marginTop: isIos ? 10 : 2,
    paddingBottom: isIos ? 70 : 5,
  },
  menuListContent: {
    paddingBottom: 30,
  },
  menuItemCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: isIos ? 20 : 15,
    paddingVertical: 15,
    marginVertical: isIos ? 7 : 5,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: Fonts.fs_17,
  },
  menuItemArrow: {
    resizeMode: 'contain',
    width: isIos ? 12 : 10,
    height: isIos ? 12 : 10,
  },
});

export default Profile;
