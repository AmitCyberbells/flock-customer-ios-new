import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Text, TextStyle, TouchableOpacity, View } from 'react-native';
import Imageview from '../components/Imageview';
import Images from '../constants/Images';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import { CSS } from '../constants/CSS';
import { useThemeColors } from '../constants/useThemeColors';

type PageHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string,
  children?: React.ReactNode,
  titleStyle?: TextStyle
};

const PageHeader: React.FC<
  (NativeStackHeaderProps | ScreenProps<keyof RootStackParamList>) & PageHeaderProps
> = props => {
  const { children, titleStyle } = props;

  const theme = useThemeColors();

  return (
    <View
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: props.backgroundColor || 'transparent',
        paddingHorizontal: isIos ? 18 : 8,
        paddingTop: isIos ? 50 : 0,
        //paddingBottom: isIos ? 20 : 0,
        justifyContent: 'space-between',
      }]}>

      {props.showBackButton ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => props.navigation?.goBack()}
          style={{ width: isIos ? 55 : 50 }} // Fixed width instead of flex: 1
        >
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
      ) : (
        <View style={{ width: isIos ? 55 : 50 }} /> // Placeholder for alignment
      )}

      <Text
        style={[{
          fontFamily: Fonts.medium,
          color: props.textColor ?? theme.text,
          textAlign: 'center',
          fontSize: Fonts.fs_20,
          paddingHorizontal: 10,
          flex: 1
        }, titleStyle]}
        numberOfLines={1}
      >
        {props?.title || ''}
      </Text>

      {children ? children :
        <View
          style={{
            width: isIos ? 55 : 50,
            height: isIos ? 55 : 50,
          }}
        />}
    </View>
  );
};

export default PageHeader;
