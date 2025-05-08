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

const ForgotPassword: React.FC<ScreenProps<'ForgotPassword'>> = props => {
  const [email, setemail] = useState('');
  const [loader, setLoader] = useState(false);

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

  return (
    <AuthLayout isLoading={loader} backButton={true} {...props}>
      <Textview
        text={'Forgot Password'}
        style={CSS.title}
        text_click={() => {}}
      />

      <BoxView cardStyle={styles.boxView}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter email address"
          placeholderTextColor={Colors.grey}
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
  boxView: {
    paddingVertical: isIos ? 10 : 0,
    marginTop: 30,
  },
  textInput: {
    height: 40,
  },
});

export default ForgotPassword;
