import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  LogBox,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { CSS } from '../../constants/CSS';
import AuthLayout from './Layout';
import Request from '../../services/Request';
import { updateUserToStore } from '../../store/userReducer';
import { login } from '../../store/authReducer';
import RootStackParamList from '../../types/RootStackParamList';
import MtToast from '../../constants/MtToast';

const OTPScreen: React.FC<ScreenProps<'Otp'>> = (props) => {
  const { route, navigation } = props;
  const [loader, setLoader] = useState(false);

  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState(false);
  const [screenType, setScreenType] = useState<keyof RootStackParamList>('Login');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const otpRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const dispatch = useDispatch();

  const backButton = () => {
    navigation?.goBack();
  };

  useEffect(() => {
    if (route?.params?.verifyEmail) {
      setVerifyEmail(true);
    }

    if (route?.params?.verifyPhone) {
      setVerifyPhone(true);
    }

    if (route?.params?.email) {
      setEmail(route.params.email);
    }

    if (route?.params?.contact) {
      setPhone(route.params.contact);
    }

    if (route?.params?.screenType) {
      setScreenType(route?.params?.screenType);
    }
  }, []);

  const handleTextChange = (text: string, index: number) => {
    console.log(text, index, otpRefs.current.length);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input if text is entered
    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    // If the text is cleared, move to the previous input
    else if (!text && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.otpContainer}>
      <TextInput
        ref={ref => (otpRefs.current[index] = ref)}
        style={[
          styles.textInput,
          focusedIndex === index && styles.focusedTextInput,
        ]}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="number-pad"
        caretHidden
        placeholder="__"
        placeholderTextColor={Colors.light_grey}
        maxLength={1}
        onChangeText={text => handleTextChange(text, index)}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === 'Backspace') {
            handleBackspace(index);
          }
        }}
        onFocus={() => setFocusedIndex(index)}
        value={item}
      />
    </View>
  );

  const handleVerifyOTP = () => {
    const body = { otp: otp.join(''), email };

    if (screenType === 'Login' || screenType === 'Register') {
      loginOtp(body);

    } else if (screenType === 'ForgotPassword') {
      forgotPasswordOtp(body);

    } else if (screenType === 'EditProfile') {
      verifyEmail ? verifyEmailWithOtp() : verifyContactWithOtp();
    }
  };

  const loginOtp = (body: any) => {
    setLoader(true);

    Request.loginWithOtp(body, (success, error) => {
      setLoader(false);
      console.log('verification finished...')

      if (success) {
        dispatch(updateUserToStore(success.data.user));
        dispatch(
          login({
            accessToken: success.data.access_token,
            tokenType: success.data.token_type,
            isLoggedIn: true
          }),
        );

      } else {
        MtToast.error(error.message)
      }
    });
  }

  const forgotPasswordOtp = (body: any) => {
    setLoader(true);

    Request.verifyEmail(body, (success, error) => {
      setLoader(false);

      if (success) {
        navigation?.navigate('ResetPassword', { email });

      } else {
        MtToast.error(error.message);
      }
    });
  }

  const verifyContactWithOtp = () => {
    setLoader(true);

    const body = {
      otp: otp.join(''),
      contact: phone
    }
    console.log('start email verification....')
    Request.verifyContact(body, (success, error) => {
      setLoader(false);
      console.log('verification finished...')

      if (success) {
        dispatch(updateUserToStore(success.data));
        if (screenType === 'EditProfile') {
          navigation?.goBack();
        }

      } else {
        MtToast.error(error.message);
      }
    });
  }

  const verifyEmailWithOtp = () => {
    setLoader(true);

    const body = {
      otp: otp.join(''),
      email
    }
    console.log('start email verification....')
    Request.verifyEmail(body, (success, error) => {
      setLoader(false);
      console.log('verification finished...')

      if (success) {
        dispatch(updateUserToStore(success.data));

        if (screenType === 'EditProfile') {
          navigation?.goBack();
        }

      } else {
        MtToast.error(error.message);
      }
    });
  }

  const resendOTP = () => {
    verifyEmail ? sendEmailOtp() : sendContactOtp();
  };

  const sendEmailOtp = () => {
    setLoader(true);

    Request.sendEmailOtp({ email }, (success, error) => {
      setLoader(false);

      if (success) {
        MtToast.success(success.message);
      } else {
        MtToast.error(error.message);
      }
    });
  }

  const sendContactOtp = () => {
    setLoader(true);

    Request.sendContactOtp({ contact: phone }, (success, error) => {
      setLoader(false);

      if (success) {
        MtToast.success(success.message);
      } else {
        MtToast.error(error.message);
      }
    });
  }

  return (
    <AuthLayout isLoading={loader} backButton={true} {...props}>

      <View>
        <Textview
          text={'Verify ' + (verifyEmail ? 'email' : 'phone')}
          style={styles.verifyText}
          text_click={() => { }}
        />
      </View>

      <View style={styles.otpInfoContainer}>
        <Textview
          text={`OTP code sent to `}
          style={styles.otpInfoText}
          text_click={() => { }}
        />

        <Textview
          text={verifyPhone ? phone + ' and ' + email : email}
          style={styles.otpInfoDetailText}
          text_click={() => { }}
        />
      </View>

      <View style={styles.otpInputContainer}>
        <FlatList
          data={otp}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.resendContainer}>
        <Textview
          text={`Didn't receive code?  `}
          style={styles.resendText}
          text_click={() => { }}
        />

        <Textview
          text={` Request Again`}
          style={styles.resendLinkText}
          text_click={resendOTP}
          active_opacity={0}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleVerifyOTP}
        style={[CSS.buttonView, styles.verifyButton]}>
        <Text style={styles.verifyButtonText}>
          {'Verify'}
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  textInput: {
    fontSize: Fonts.fs_22,
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: 40,
    height: 40,
    borderRadius: 8,
    borderColor: Colors.light_grey,
    borderWidth: 1,
    color: Colors.black
  },

  focusedTextInput: {
    borderWidth: 1,
    borderColor: Colors.primary_color_orange,
  },

  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },

  submitButtonText: {
    color: 'white',
    fontSize: Fonts.fs_18,
  },

  otpContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 0,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  backButton: {
    position: 'absolute',
    alignItems: 'flex-start',
    marginHorizontal: Platform.OS == 'ios' ? 7 : 5,
    padding: 10,
  },

  verifyText: {
    fontSize: Fonts.fs_25,
    color: Colors.black,
    fontFamily: Fonts.medium,
    alignSelf: 'center',
    marginTop: 35,
  },

  otpInfoContainer: {
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },

  otpInfoText: {
    color: Colors.black,
    fontSize: Fonts.fs_15,
    fontFamily: Fonts.semi_bold,
    marginTop: '15%',
  },

  otpInfoDetailText: {
    color: Colors.primary_color_orange,
    fontSize: Fonts.fs_16,
    fontFamily: Fonts.semi_bold,
    marginTop: 5,
    textAlign: 'center'
  },

  otpInputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  resendContainer: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },

  resendText: {
    color: Colors.black,
    fontSize: Fonts.fs_15,
    fontFamily: Fonts.semi_bold,
    textAlign: 'center',
    alignSelf: 'center',
  },

  resendLinkText: {
    color: Colors.primary_color_orange,
    fontSize: Fonts.fs_15,
    fontFamily: Fonts.semi_bold,
    textAlign: 'center',
    alignSelf: 'center',
  },

  verifyButton: {
    backgroundColor: Colors.primary_color_orange,
    justifyContent: 'center',
  },

  verifyButtonText: {
    color: Colors.white,
    textAlign: 'center',
  },
});
