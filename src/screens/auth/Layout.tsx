import React from 'react';
import { ImageBackground, ScrollView, Platform, TouchableOpacity, ViewStyle } from 'react-native';
import Images from '../../constants/Images';
import { CSS } from '../../constants/CSS';
import Loader from '../../components/Loader';
import Imageview from '../../components/Imageview';
import { isIos } from '../../constants/IsPlatform';
import ScreenProps from '../../types/ScreenProps';
import RootStackParamList from '../../types/RootStackParamList';

type LayoutProps = {
  children: React.ReactNode;
  isLoading: boolean;
  backButton?: boolean;
  scrollViewStyle?: ViewStyle | Array<ViewStyle>
} & ScreenProps<keyof RootStackParamList>

const AuthLayout: React.FC<LayoutProps> = (props) => {
  const { children, isLoading, backButton, navigation, scrollViewStyle } = props;
  
  return (
    <ImageBackground source={Images.login_back} style={[CSS.LoginBackground]}>
      <Loader isLoading={isLoading} />

      {backButton && <TouchableOpacity activeOpacity={0.9} onPress={() => navigation?.goBack()} style={{ marginTop: isIos ? 50 : 10, paddingLeft: 10 }}>
        <Imageview
          url={Images.back}
          style={{
            width: isIos ? 55 : 50,
            height: isIos ? 55 : 50,
            resizeMode: 'contain',
          }}
          imageType={'local'}
        />
      </TouchableOpacity>}

      <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
        <Imageview
          style={{
            width: isIos ? 125 : 113,
            height: isIos ? 125 : 113,
            alignSelf: 'center',
          }}
          imageType={'local'}
          url={Images.splash_logo}
        />
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default AuthLayout;
