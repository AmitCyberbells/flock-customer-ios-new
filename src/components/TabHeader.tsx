import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Imageview from './Imageview';
import {Fonts} from '../constants/Fonts';
import Images from '../constants/Images';
import {CSS} from '../constants/CSS';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import { Colors } from '../constants/Colors';
import { useThemeColors } from '../constants/useThemeColors';

type TabHeaderProps = {
  title?: string;
  nearByVenues?: () => void;
  hideSideMenuButton?: boolean
  backgroundColor?: string;
};

const TabHeader: React.FC<ScreenProps<keyof RootStackParamList> & TabHeaderProps> = props => {
  const {title, nearByVenues, hideSideMenuButton, navigation} = props;
  const theme = useThemeColors();

  const styles = StyleSheet.create({
    navIcon: {
      width: isIos ? 35 : 30,
      height: isIos ? 35 : 30,
    },
  });

  return (
    <View style={[CSS.home_toolbar, {zIndex: 1, backgroundColor: props.backgroundColor || theme.background  }]}>

      {hideSideMenuButton ? null : 
      <TouchableOpacity activeOpacity={0.9} onPress={() => navigation?.openDrawer()} style={{flex: 1}}>
        <Imageview
          style={styles.navIcon}
          imageType={'local'}
          url={Images.sideNav}
          tintColor={theme.text}
        />
      </TouchableOpacity>}

      {title ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: theme.text,
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
          <TouchableOpacity activeOpacity={0.9} onPress={nearByVenues}>
            <Imageview
              style={styles.navIcon}
              imageType={'local'}
              url={Images.location}
              tintColor={theme.cyanBlueIcon}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default TabHeader;
