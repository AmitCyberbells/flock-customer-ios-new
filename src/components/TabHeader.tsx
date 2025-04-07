import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Imageview from './Imageview';
import {Fonts} from '../constants/Fonts';
import Images from '../constants/Images';
import {CSS} from '../constants/CSS';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import { Colors } from '../constants/Colors';

type TabHeaderProps = {
  title?: string;
  nearByVenues?: () => void;
  hideSideMenuButton?: boolean
};

const TabHeader: React.FC<ScreenProps<keyof RootStackParamList> & TabHeaderProps> = props => {
  const {title, nearByVenues, hideSideMenuButton, navigation} = props;

  return (
    <View style={[CSS.home_toolbar, {zIndex: 1}]}>

      {hideSideMenuButton ? null : 
      <TouchableOpacity onPress={() => navigation?.openDrawer()} style={{flex: 1}}>
        <Imageview
          style={styles.navIcon}
          imageType={'local'}
          url={Images.sideNav}
        />
      </TouchableOpacity>}

      {title ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.medium,
              fontSize: Fonts.fs_20,
              textAlign: 'left',
              marginLeft: hideSideMenuButton ? 0 : -45,
            }}>
            {title || ''}
          </Text>
        </View>
      ) : null}

      {nearByVenues ? (
        <View style={CSS.home_mapicon}>
          <TouchableOpacity onPress={nearByVenues}>
            <Imageview
              style={styles.navIcon}
              imageType={'local'}
              url={Images.location}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  navIcon: {
    width: isIos ? 45 : 30,
    height: isIos ? 45 : 30,
  },
});

export default TabHeader;
