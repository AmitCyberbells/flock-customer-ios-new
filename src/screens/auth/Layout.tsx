import React from 'react';
import {ImageBackground, ScrollView, Platform} from 'react-native';
import Images from '../../constants/Images';
import {CSS} from '../../constants/CSS';
import Loader from '../../components/Loader';
import Imageview from '../../components/Imageview';

interface LayoutProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const AuthLayout: React.FC<LayoutProps> = ({children, isLoading}) => {
  return (
    <ImageBackground source={Images.login_back} style={CSS.LoginBackground}>
      <Loader isLoading={isLoading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Imageview
          style={{
            width: Platform.OS == 'ios' ? 125 : 113,
            height: Platform.OS == 'ios' ? 125 : 113,
            alignSelf: 'center',
            marginTop: Platform.OS == 'ios' ? 80 : 45,
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
