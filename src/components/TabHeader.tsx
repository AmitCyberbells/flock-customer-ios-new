import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Imageview from './Imageview';
import {Fonts} from '../constants/Fonts';
import Images from '../constants/Images';
import {CSS} from '../constants/CSS';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';

type TabHeaderProps = {
  title?: string;
  nearByVenues?: () => void;
};

const TabHeader: React.FC<ScreenProps<keyof RootStackParamList> & TabHeaderProps> = props => {
  return (
    <View style={[CSS.home_toolbar]}>
      <TouchableOpacity onPress={() => props?.navigation?.openDrawer()} style={{flex: 1}}>
        <Imageview
          style={styles.navIcon}
          imageType={'local'}
          url={Images.sideNav}
        />
      </TouchableOpacity>

      {props.title ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: Fonts.fs_20,
              textAlign: 'left',
              marginLeft: -45,
            }}>
            {props.title || ''}
          </Text>
        </View>
      ) : null}

      {props.nearByVenues ? (
        <View style={CSS.home_mapicon}>
          <TouchableOpacity onPress={props.nearByVenues}>
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
    width: Platform.OS === 'ios' ? 45 : 40,
    height: Platform.OS === 'ios' ? 45 : 40,
  },
});

export default TabHeader;
