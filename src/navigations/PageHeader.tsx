import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import Imageview from '../components/Imageview';
import Images from '../constants/Images';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';

type PageHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string,
  children?: React.ReactNode
};

const PageHeader: React.FC<
  (NativeStackHeaderProps | ScreenProps<keyof RootStackParamList>) & PageHeaderProps
> = props => {
  const { children } = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: props.backgroundColor || 'transparent',
      }}>
      {props.showBackButton ? (
        <TouchableOpacity onPress={() => props.navigation?.goBack()}>
          <Imageview
            url={Images.back}
            style={{
              width: isIos ? 55 : 50,
              height: isIos ? 55 : 50,
              resizeMode: 'contain',
            }}
            imageType={'local'}
          />
        </TouchableOpacity>
      ) : null}

      <Text
        style={{
          fontFamily: 'medium',
          color: props.textColor ?? Colors.black,
          textAlign: 'center',
          fontSize: Fonts.fs_20,
          flex: 1
        }}
      >
        {props?.title || ''}
      </Text>

      {children ? children :
        <View
          style={{
            height: isIos ? 55 : 50,
            width: isIos ? 55 : 50,
          }}
        />}
    </View>
  );
};

export default PageHeader;
