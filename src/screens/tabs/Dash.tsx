import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { CSS } from '../../constants/CSS';
import Loader from '../../components/Loader';
import Textview from '../../components/Textview';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import BoxView from '../../components/BoxView';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import VirtualizedList from '../../components/VirtualizedList';
import TransactionList from '../../components/TransactionList';
import { isIos } from '../../constants/IsPlatform';
import WalletService from '../../services/WalletService';
import Utils from '../../services/Utils';
import ShadowCard from '../../components/ShadowCard';
import OfferRedeemBy from '../../types/RedeemBy';

const Dash: React.FC<ScreenProps<'Tabs'>> = (props) => {
  const [loader, setLoader] = useState(false);
  const wallet = useSelector((state: StoreStates) => state.wallet)
  const { updateWalletBalances } = WalletService();

  useEffect(() => {
    updateWalletBalances();

  }, []);

  const settingClick = () => {
    props.navigation?.navigate('EditProfile');
  };

  const openFeathers = () => {
    props.navigation?.navigate('FeathersHistory');
  };

  const openRewardPointHistory = (type: OfferRedeemBy) => {
    props.navigation?.navigate('VenuePointsHistory', {rewardType: type});
  };

  const seeAllTransactions = () => {
    props.navigation?.navigate('TransactionHistory');
  };

  return (
    <View style={CSS.Favcontainer}>
      <Loader isLoading={loader} />
      <View style={styles.header}>
        <Textview
          text={'My Dashboard'}
          style={styles.headerTitle}
        />
        <TouchableOpacity activeOpacity={0.9} onPress={settingClick}>
          <Imageview
            style={styles.settingIcon}
            url={Images.setting}
            imageType={'local'}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>

      <VirtualizedList>
        <ShadowCard style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Textview
              text={'Total Balance'}
              style={styles.balanceLabel}
            />
            <TouchableOpacity activeOpacity={0.9} onPress={() => openRewardPointHistory('venue_points')}>
              <Imageview
                style={styles.arrowIcon}
                url={Images.sideArrow}
                imageType={'local'}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 10 }}>
            <View style={[styles.statButton, {
              backgroundColor: Colors.primary_color_orange,
            }]}>
              <Text style={styles.balanceAmount}>
                {(wallet.balance_feather_points) + ' fts'}
              </Text>
            </View>

            <View style={[styles.statButton, {
              backgroundColor: Colors.venueIconColor 
            }]}>
              <Text style={styles.balanceAmount}>
                {(wallet.balance_venue_points) + ' pts'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsContainer}>
            {/* Earned Section */}
            <View style={styles.statSection}>
              <Imageview
                style={styles.statIcon}
                url={Images.earned}
                imageType={'local'}
                resizeMode={'contain'}
              />
              <View style={styles.statDetails}>
                <Text
                  style={styles.statLabel}
                >{'Earned'}</Text>
                <View style={styles.pointsRow}>
                  <Imageview
                    style={styles.pointIcon}
                    url={Images.AppOffer}
                    imageType={'local'}
                    resizeMode={'contain'}
                  />
                  <Textview
                    text={(wallet.earned_feather_points) + ' fts'}
                    style={styles.pointsText}
                  />
                </View>
                <View style={styles.pointsRow}>
                  <Imageview
                    style={styles.pointIcon}
                    url={Images.VenueOffer}
                    imageType={'local'}
                    resizeMode={'contain'}
                  />
                  <Textview
                    text={(wallet.earned_venue_points) + ' pts'}
                    style={styles.pointsText}
                  />
                </View>
              </View>
            </View>

            {/* Spent Section */}
            <View style={styles.statSection}>
              <Imageview
                style={styles.statIcon}
                url={Images.spend}
                imageType={'local'}
                resizeMode={'contain'}
              />
              <View style={styles.statDetails}>
                <Text
                  style={styles.statLabel}
                >{'Spent'}</Text>
                <View style={styles.pointsRow}>
                  <Imageview
                    style={styles.pointIcon}
                    url={Images.AppOffer}
                    imageType={'local'}
                    resizeMode={'contain'}
                  />
                  <Textview
                    text={(wallet.spent_feather_points) + ' fts'}
                    style={styles.pointsText}
                  />
                </View>
                <View style={styles.pointsRow}>
                  <Imageview
                    style={styles.pointIcon}
                    url={Images.VenueOffer}
                    imageType={'local'}
                    resizeMode={'contain'}
                  />
                  <Textview
                    text={(wallet.spent_venue_points) + ' pts'}
                    style={styles.pointsText}
                  />
                </View>
              </View>
            </View>
          </View>
        </ShadowCard>

        <View style={styles.transactionsHeader}>
          <Textview
            text={'Transactions'}
            style={styles.transactionsTitle}
          />
          <Textview
            text={'See all'}
            style={styles.seeAllText}
            text_click={seeAllTransactions}
          />
        </View>

        <TransactionList setLoader={setLoader} recordLimit={2} windowHeight={Utils.DEVICE_HEIGHT - 450} />

      </VirtualizedList>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: isIos ? 50 : 10,
    marginBottom: isIos ? 30 : 20,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_25,
  },
  settingIcon: {
    width: isIos ? 52 : 47,
    height: isIos ? 52 : 47,
  },
  balanceCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: isIos ? 20 : 15,
    paddingVertical: isIos ? 20 : 15,
    marginTop: isIos ? 5 : 5,
    marginHorizontal: isIos ? 17 : 15,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    textAlign: 'center',
    fontSize: Fonts.fs_14,
  },
  balanceAmount: {
    fontFamily: Fonts.medium,
    color: Colors.white,
    fontSize: Fonts.fs_20
  },
  arrowIcon: {
    width: isIos ? 22 : 22,
    height: isIos ? 22 : 22,
  },
  divider: {
    borderColor: Colors.grey,
    borderWidth: isIos ? 0.6 : 0.3,
    marginTop: 10,
  },
  statButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: isIos ? 10 : 5,
  },
  statSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: isIos ? 40 : 30,
    height: isIos ? 40 : 30,
  },
  statDetails: {
    paddingHorizontal: 15,
  },
  statLabel: {
    fontFamily: Fonts.medium,
    color: Colors.light_grey,
    fontSize: Fonts.fs_14,
    marginBottom: isIos ? 5 : 0,
  },
  pointsRow: {
    flexDirection: 'row',
  },
  pointIcon: {
    width: isIos ? 22 : 18,
    height: isIos ? 22 : 18,
    marginTop: isIos ? 2 : 3,
  },
  pointsText: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_17,
    marginTop: isIos ? 2 : 0,
    marginLeft: 5,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: isIos ? 20 : 15,
  },
  transactionsTitle: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_18,
    marginHorizontal: isIos ? 17 : 15,
  },
  seeAllText: {
    fontFamily: Fonts.regular,
    color: Colors.light_grey,
    fontSize: Fonts.fs_14,
    marginHorizontal: isIos ? 17 : 15,
  },
  transactionsList: {
    flexGrow: 0,
    marginTop: isIos ? 18 : 15,
    marginHorizontal: 10,
    marginBottom: isIos ? 80 : 85,
  },
  transactionItem: {
    marginVertical: 10,
    flexDirection: 'row',
    marginHorizontal: isIos ? 5 : 2,
    alignItems: 'center',
  },
  transactionImage: {
    backgroundColor: Colors.white,
    width: isIos ? 70 : 45,
    height: isIos ? 70 : 45,
    padding: 2,
    borderRadius: 100,
    justifyContent: 'center',
  },
  transactionAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  transactionDetails: {
    marginHorizontal: 20,
    flex: 1,
  },
  transactionName: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_17,
  },
  transactionAmount: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.fs_16,
  },
});

export default Dash;
