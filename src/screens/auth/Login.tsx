import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CSS } from '../../constants/CSS';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import BoxView from '../../components/BoxView';
import ScreenProps from '../../types/ScreenProps';
import Icon from '@react-native-vector-icons/fontawesome6';
import AuthLayout from './Layout';
import Utils from '../../services/Util';
import { Validator } from '../../services/Validator';
import Request from '../../services/Request';
import MtToast from '../../constants/MtToast';
import { useDispatch } from 'react-redux';
import { updateUserToStore } from '../../store/userReducer';
import { login } from '../../store/authReducer';

const Login: React.FC<ScreenProps<'Login'>> = props => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //const dispatch = useDispatch();

  useEffect(() => {
    console.log('login page');
  }, []);

  const handleInputChange = (field: string, value: any) => {
    if (field == 'email') {
      validateEmail(value);
      setEmail(value);
    } else if (field == 'password') {
      validatePassword(value);
      setPassword(value);
    }
  };

  const validateEmail = (value: string) => {
    if (Utils.isEmpty(value)) {
      setEmailErr('Email is required');
    } else if (!Validator.email.validate(value)) {
      setEmailErr(Validator.email.message);
    } else {
      setEmailErr('');
    }
  };

  const validatePassword = (value: string) => {
    if (Utils.isEmpty(value)) {
      setPasswordErr('Password is required');
    } else {
      setPasswordErr('');
    }
  };

  const validForm = () => {
    validateEmail(email);
    validatePassword(password);

    return emailErr == '' && passwordErr == '';
  };

  function registerClick() {
    props?.navigation?.navigate('Register');
  }

  function continueClick() {
    if (!validForm()) {
      MtToast.error('Please fill all required fields')
      return;
    }

    setIsLoading(true);
    Request.login({ email, password }, (success, error) => {
      setIsLoading(false);
      if (success) {
        console.log('login success', success);

        // uncomment the below code if need login via otp
        props.navigation?.navigate('Otp', {
          screenType: 'Login',
          verifyEmail: true,
          verifyPhone: false,
          email: email
        });

        // comment the below dispatch if need login via otp
        /* dispatch(updateUserToStore(success.data.user));
        dispatch(
          login({
            accessToken: success.data.access_token,
            tokenType: success.data.token_type,
            isLoggedIn: true
          }),
        ); */

        
      } else {
        console.log('login error', error);
        MtToast.error(error.message)
      }
    });
  }

  function forgotPassword() {
    console.log('click');
    props?.navigation?.navigate('ForgotPassword');
  }

  return (
    <AuthLayout isLoading={isLoading}>
      <Textview text_click={() => { }} text={'Login'} style={styles.loginText} />
      <Textview
        text_click={() => { }}
        text={'Login to your account'}
        style={styles.loginSubtitle}
      />
      <BoxView
        cardStyle={styles.boxViewCard}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter email address"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.grey}
          onChangeText={value => handleInputChange('email', value)}
        />
      </BoxView>
      <BoxView
        cardStyle={[
          styles.boxViewCardPassword,
          passwordErr != '' ? styles.inputError : {},
        ]}
        bodyStyle={styles.boxViewBody}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          placeholderTextColor={Colors.grey}
          secureTextEntry={!showPassword}
          onChangeText={value => handleInputChange('password', value)}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={Colors.grey}
          />
        </TouchableOpacity>
      </BoxView>
      <View style={CSS.ForgetPass}>
        <Textview
          text_click={() => { }}
          text={'Forgot password? '}
          style={styles.forgotPasswordText}
        />
        <Textview
          text_click={forgotPassword}
          text={'Reset here'}
          style={styles.resetText}
        />
      </View>
      <View style={styles.continueButtonContainer}>
        <Textview
          text_click={continueClick}
          text={'Continue'}
          style={styles.continueButton}
        />
      </View>

      <View style={CSS.DontHaveAccount}>
        <Textview
          text_click={() => { }}
          text={"Don't have account? "}
          style={styles.dontHaveAccountText}
        />
        <Textview
          text_click={registerClick}
          text={'Create New'}
          style={styles.createNewText}
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  loginText: {
    fontSize: Fonts.fs_25,
    color: Colors.black,
    fontFamily: 'medium',
    alignSelf: 'center',
    marginTop: 35,
  },
  loginSubtitle: {
    fontSize: Fonts.fs_18,
    color: Colors.black,
    fontFamily: 'regular',
    alignSelf: 'center',
    marginTop: Platform.OS == 'ios' ? 15 : 5,
  },
  boxViewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: Platform.OS == 'ios' ? 17 : 0,
    marginTop: 27,
  },
  inputError: {
    borderColor: Colors.red,
    borderBottomWidth: 1,
  },
  boxViewCardPassword: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: Platform.OS == 'ios' ? 17 : 0,
    marginTop: Platform.OS == 'ios' ? 25 : 20,
  },
  boxViewBody: {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    color: Colors.black,
    fontSize: Fonts.fs_14,
    fontFamily:
      Platform.OS == 'ios' ? Fonts.ios_regular : Fonts.android_regular,
  },
  eyeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 10,
  },
  forgotPasswordText: {
    fontSize: Fonts.fs_12,
    color: Colors.grey,
    fontFamily: 'regular',
    alignSelf: 'center',
    marginTop: Platform.OS == 'ios' ? 15 : 5,
    paddingVertical: 10,
  },
  resetText: {
    fontSize: Fonts.fs_12,
    color: Colors.primary_color_orange,
    textDecorationLine: 'underline',
    fontFamily: 'regular',
    alignSelf: 'center',
    marginTop: Platform.OS == 'ios' ? 15 : 5,
    paddingVertical: 10,
  },
  continueButtonContainer: {
    marginTop: 20,
  },
  continueButton: {
    fontSize: Fonts.fs_17,
    color: Colors.white,
    fontFamily: 'regular',
    textAlign: 'center',
    backgroundColor: Colors.primary_color_orange,
    marginHorizontal: 17,
    paddingVertical: Platform.OS == 'ios' ? 15 : 10,
    borderRadius: 10,
  },
  dontHaveAccountText: {
    fontSize: Fonts.fs_12,
    color: Colors.grey,
    fontFamily: 'regular',
    alignSelf: 'center',
    marginTop: Platform.OS == 'ios' ? 15 : 5,
    paddingVertical: 10,
  },
  createNewText: {
    fontSize: Fonts.fs_12,
    color: Colors.primary_color_orange,
    textDecorationLine: 'underline',
    fontFamily: 'regular',
    alignSelf: 'center',
    marginTop: Platform.OS == 'ios' ? 15 : 5,
    paddingVertical: 10,
  },
});

export default Login;
