import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { CSS } from '../../constants/CSS';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import BoxView from '../../components/BoxView';
import ScreenProps from '../../types/ScreenProps';
import Icon from '@react-native-vector-icons/fontawesome6';
import AuthLayout from './Layout';
import Utils from '../../services/Utils';
import { Validator } from '../../services/Validator';
import Request from '../../services/Request';
import MtToast from '../../constants/MtToast';
import { useDispatch } from 'react-redux';
import { updateUserToStore } from '../../store/userReducer';
import { login } from '../../store/authReducer';
import { isIos } from '../../constants/IsPlatform';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentLocation } from '../../services/GetCurrentLocation';
import { useThemeColors } from '../../constants/useThemeColors';
import IsVenueOpened from '../../constants/IsVenueOpened';

const Login: React.FC<ScreenProps<'Login'>> = props => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVenueId, setPendingVenueId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const theme = useThemeColors();

  useEffect(() => {
    console.log('login page');

    const checkStartupAd = async () => {
      const visit = await AsyncStorage.getItem('startupAd');
      if (!visit) {
        props.navigation?.navigate('StartupAd');
      }
    }
    // Check for pending check-in
    const checkPendingCheckin = async () => {
      try {
        const pendingData = await AsyncStorage.getItem('pendingCheckin');
        if (pendingData) {
          const { venue_id } = JSON.parse(pendingData);
          setPendingVenueId(venue_id);
          console.log('[Login] Found pending check-in for venue:', venue_id);
        }
      } catch (error) {
        console.error('[Login] Error checking pending check-in:', error);
      }
    };

    checkStartupAd();
    checkPendingCheckin();
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
    let msg = '';

    if (Utils.isEmpty(value)) {
      msg = 'Email is required';
    } else if (!Validator.email.validate(value)) {
      msg = Validator.email.message;
    }

    setEmailErr(msg);
    return msg;
  };

  const validatePassword = (value: string) => {
    let msg = '';

    if (Utils.isEmpty(value)) {
      msg = 'Password is required';
    }

    setPasswordErr(msg)
    return msg;
  };

  const validForm = () => {
    const error = validateEmail(email);
    const error2 = validatePassword(password);

    return { isValid: Utils.isEmpty(error) && Utils.isEmpty(error2), error: error || error2 };
  };

  // Process pending check-in after successful login
  const processPendingCheckin = async () => {
    try {
      const pendingData = await AsyncStorage.getItem('pendingCheckin');
      
      if (pendingData) {
        const { venue_id } = JSON.parse(pendingData);
        console.log('[Login] Processing pending check-in for venue:', venue_id);
        
        if (venue_id) {
          // Perform the check-in
          await performCheckin(venue_id);
        }
      }
    } catch (error) {
      console.error('[Login] Error processing pending check-in:', error);
    }
  };

  // Perform the actual check-in
  const performCheckin = async (venueId: string) => {
    try {
      console.log('[Login] Starting check-in for venue:', venueId);
      
      // 1. Fetch venue details and check if venue is open
      let venueData: any = null;
      await new Promise<void>((resolve, reject) => {
        Request.fetch_venue(Number(venueId), (success, error) => {
          if (success && success.data) {
            console.log('[Login] Venue found:', success.data);
            venueData = success.data;
            
            // Check if venue is open before allowing check-in
            if (!IsVenueOpened(venueData)) {
              console.log('[Login] Venue is closed, preventing check-in');
              MtToast.error('This venue is currently closed. Please visit during business hours.');
              reject(new Error('Venue is closed'));
              return;
            }
            
            resolve();
          } else {
            console.log('[Login] Venue fetch error:', error);
            MtToast.error(error?.message || 'Venue not found');
            reject(error);
          }
        });
      });

      // 2. Get current location
      console.log('[Login] Getting current location...');
      const location = await getCurrentLocation();
      console.log('[Login] Got location:', location);

      // 3. Call check-in API
      console.log('[Login] Calling check-in API...');
      await new Promise<void>((resolve, reject) => {
        Request.checkin(
          {
            venue_id: Number(venueId),
            lat: location.latitude,
            long: location.longitude,
          },
          (success, error) => {
            if (success) {
              console.log('[Login] Check-in success:', success);
              MtToast.success(success.message || 'Auto check-in successful!');
              
              // Clear any pending check-in data
              AsyncStorage.removeItem('pendingCheckin');
              setPendingVenueId(null);
              resolve();
            } else {
              console.log('[Login] Check-in error:', error);
              MtToast.error(error?.message || 'Auto check-in failed');
              reject(error);
            }
          }
        );
      });
    } catch (err) {
      console.log('[Login] Error in performCheckin:', err);
      // Error already handled by MtToast
    }
  };

  function registerClick() {
    props?.navigation?.navigate('Register');
  }

  function continueClick() {
    const form = validForm();

    if (!form.isValid) {
      MtToast.error(form.error ?? 'Please fill all fields!')
      return;
    }

    setIsLoading(true);
    Request.login({ email, password }, async (success, error) => {
      setIsLoading(false);
      if (success) {
        console.log('login success', success);

        // uncomment the below code if need login via otp
        /* props.navigation?.navigate('Otp', {
          screenType: 'Login',
          verifyEmail: true,
          verifyPhone: false,
          email: email
        }); */

        // comment the below dispatch if need login via otp
        dispatch(updateUserToStore(success.data.user));
        dispatch(
          login({
            accessToken: success.data.access_token,
            tokenType: success.data.token_type,
            isLoggedIn: true
          }),
        );

        // Process any pending check-in after successful login
        setTimeout(async () => {
          await processPendingCheckin();
        }, 1000); // Small delay to ensure login process is complete

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

  const dynamicStyles = StyleSheet.create({
    loginText: {
      fontSize: Fonts.fs_25,
      color: theme.text,
      fontFamily: Fonts.medium,
      alignSelf: 'center',
      marginTop: 35,
    },
    loginSubtitle: {
      fontSize: Fonts.fs_18,
      color: theme.text,
      fontFamily: Fonts.regular,
      alignSelf: 'center',
      marginTop: isIos ? 15 : 5,
    },
    boxViewCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      backgroundColor: theme.inputBackground,
      paddingVertical: isIos ? 10 : 0,
      marginTop: 27,
    },
    boxViewCardPassword: {
      marginHorizontal: 20,
      backgroundColor: theme.inputBackground,
      paddingVertical: isIos ? 5 : 0,
      marginTop: isIos ? 25 : 20,
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: Fonts.fs_14,
      fontFamily: Fonts.regular,
      height: 25
    },
    forgotPasswordText: {
      fontSize: Fonts.fs_12,
      color: theme.muteText,
      fontFamily: Fonts.regular,
      alignSelf: 'center',
      marginTop: isIos ? 15 : 5,
      paddingVertical: 10,
    },
    dontHaveAccountText: {
      fontSize: Fonts.fs_12,
      color: theme.muteText,
      fontFamily: Fonts.regular,
      alignSelf: 'center',
      marginTop: isIos ? 15 : 5,
      paddingVertical: 10,
    },
  });

  return (
    <AuthLayout 
      isLoading={isLoading} 
      scrollViewStyle={{ marginTop: isIos ? 70 : 40 }}
    >
      <Textview text_click={() => { }} text={'Login'} style={dynamicStyles.loginText} />
      <Textview
        text_click={() => { }}
        text={'Login to your account'}
        style={dynamicStyles.loginSubtitle}
      />
      
      {/* Show pending check-in message if exists */}
      {pendingVenueId && (
        <View style={styles.pendingCheckinContainer}>
          <Text style={styles.pendingCheckinText}>
            📍 You'll be automatically checked in after login
          </Text>
        </View>
      )}

      <BoxView
        cardStyle={[
          dynamicStyles.boxViewCard,
          emailErr != '' ? styles.inputError : {},
        ]}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Enter email address"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={theme.placeholder}
          onChangeText={value => handleInputChange('email', value)}
        />
      </BoxView>

      {emailErr != '' ? <Text style={{ fontSize: Fonts.fs_10, color: Colors.red, marginHorizontal: 20 }}>{emailErr}</Text> : ''}

      <BoxView
        cardStyle={[
          
          dynamicStyles.boxViewCardPassword,
          passwordErr != '' ? styles.inputError : {},
        ]}
        bodyStyle={styles.boxViewBody}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Enter password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry={!showPassword}
          onChangeText={value => handleInputChange('password', value)}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.eyeIconContainer}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={!showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={theme.icon}
          />
        </TouchableOpacity>
      </BoxView>

      {passwordErr != '' ? <Text style={{ fontSize: Fonts.fs_10, color: Colors.red, marginHorizontal: 20 }}>{passwordErr}</Text> : ''}

      <View style={CSS.ForgetPass}>
        <Textview
          text_click={() => { }}
          text={'Forgot password? '}
          style={dynamicStyles.forgotPasswordText}
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
          text={'Login'}
          style={styles.continueButton}
        />
      </View>

      <View style={CSS.DontHaveAccount}>
        <Textview
          text_click={() => { }}
          text={"Don't have account? "}
          style={dynamicStyles.dontHaveAccountText}
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
    fontFamily: Fonts.medium,
    alignSelf: 'center',
    marginTop: 35,
  },
  loginSubtitle: {
    fontSize: Fonts.fs_18,
    color: Colors.black,
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
  },
  pendingCheckinContainer: {
    backgroundColor: Colors.primary_color_orange,
    marginHorizontal: 20,
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pendingCheckinText: {
    fontSize: Fonts.fs_12,
    color: Colors.white,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  boxViewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: isIos ? 10 : 0,
    marginTop: 27,
  },
  inputError: {
    borderColor: Colors.red,
    borderBottomWidth: 1,
  },
  boxViewCardPassword: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: isIos ? 10 : 0,
    marginTop: isIos ? 25 : 20,
  },
  boxViewBody: {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    color: Colors.black,
    fontSize: Fonts.fs_14,
    fontFamily: Fonts.regular,
    height: 40
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
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
    paddingVertical: 10,
  },
  resetText: {
    fontSize: Fonts.fs_12,
    color: Colors.primary_color_orange,
    textDecorationLine: 'underline',
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
    paddingVertical: 10,
  },
  continueButtonContainer: {
    marginTop: 20,
  },
  continueButton: {
    fontSize: Fonts.fs_17,
    color: Colors.white,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    backgroundColor: Colors.primary_color_orange,
    marginHorizontal: 17,
    paddingVertical: isIos ? 15 : 10,
    borderRadius: 10,
  },
  dontHaveAccountText: {
    fontSize: Fonts.fs_12,
    color: Colors.grey,
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
    paddingVertical: 10,
  },
  createNewText: {
    fontSize: Fonts.fs_12,
    color: Colors.primary_color_orange,
    textDecorationLine: 'underline',
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: isIos ? 15 : 5,
    paddingVertical: 10,
  },
});

export default Login;