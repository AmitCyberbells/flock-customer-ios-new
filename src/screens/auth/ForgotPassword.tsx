import React, {useState, useEffect} from 'react';
import { TextInput } from 'react-native';
import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';
import {CSS} from '../../constants/CSS';
import Textview from '../../components/Textview';
import BoxView from '../../components/BoxView';
import AuthLayout from './Layout';
import ScreenProps from '../../types/ScreenProps';
import Request from '../../services/Request';
import MtToast from '../../constants/MtToast';
import { isIos } from '../../constants/IsPlatform';
import { useThemeColors } from '../../constants/useThemeColors';
import { Fonts } from '../../constants/Fonts';

const ForgotPassword: React.FC<ScreenProps<'ForgotPassword'>> = props => {
  const [email, setemail] = useState('');
  const [loader, setLoader] = useState(false);
  const theme = useThemeColors();

  useEffect(() => {}, []);

  function continueClick() {
    setLoader(true);

    Request.forgotPassword({email}, (success, error) => {
      setLoader(false);
      
      if (success) {
        MtToast.success(success.message)

        props.navigation?.navigate('Otp', {
          screenType: 'ForgotPassword',
          verifyEmail: true,
          verifyPhone: false,
          email: email,
        });
      } else {
        MtToast.error(error.message);
      }
    });
  }

  const dynamicStyles = StyleSheet.create({
    forgotTitle: {
      fontSize: Fonts.fs_25,
      color: theme.text,
      fontFamily: Fonts.medium,
      alignSelf: 'center',
      marginTop: 35,
    },
    boxView: {
      paddingVertical: isIos ?5 : 0,
      marginTop: 30,
      backgroundColor: theme.inputBackground,
    },
    textInput: {
      height: 35,
      color: theme.text,
      fontSize: Fonts.fs_14,
      fontFamily: Fonts.regular,
    },
  });

  return (
    <AuthLayout isLoading={loader} backButton={true} {...props}>
      <Textview
        text={'Forgot Password'}
        style={dynamicStyles.forgotTitle}
        text_click={() => {}}
      />

      <BoxView cardStyle={dynamicStyles.boxView}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Enter email address"
          placeholderTextColor={theme.placeholder}
          keyboardType="email-address"
          onChangeText={value => setemail(value)}
        />
      </BoxView>

      <Textview
        text={'Continue'}
        style={[CSS.themeButton, {marginTop: 30}]}
        text_click={continueClick}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  // Static styles that don't need theme changes
});

export default ForgotPassword;
