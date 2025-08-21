import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CSS } from '../../constants/CSS';
import DatePicker from 'react-native-date-picker';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import BoxView from '../../components/BoxView';
import ScreenProps from '../../types/ScreenProps';
import Icon from '@react-native-vector-icons/fontawesome6';
import Request from '../../services/Request';
import Utils from '../../services/Utils';
import RegisterForm, { FormFields } from '../../forms/RegisterForm';
import AuthLayout from './Layout';
import MtToast from '../../constants/MtToast';
import { isIos } from '../../constants/IsPlatform';
import { API } from '../../services/API';
import { useIsFocused } from '@react-navigation/native';
import { useThemeColors } from '../../constants/useThemeColors';

const Register: React.FC<ScreenProps<'Register'>> = props => {

  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsCondition, setTermsCondition] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [fieldsTouched, setFieldsTouched] = useState<{[key: string]: boolean}>({});
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const current_date = new Date();

  const maxDate = new Date(current_date);
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const minDate = new Date(1940, 0, 1);
  const [datePickerDate, setDatePickerDate] = useState(maxDate);

  const [form, setForm] = useState(RegisterForm);
  const isFocused = useIsFocused();
  const theme = useThemeColors();

  useEffect(() => {
    if (isFocused) {
      setForm(prevForm => {
        const updatedForm = { ...prevForm };

        Object.keys(updatedForm.fields).forEach((fieldKey: string) => {
          updatedForm.fields[fieldKey as keyof FormFields].value = '';
          updatedForm.fields[fieldKey as keyof FormFields].error = '';
        });

        return updatedForm;
      });
      
      // Reset validation states
      setFieldsTouched({});
      setHasTriedSubmit(false);
      setShowTermsError(false);
    }

  }, [isFocused])

  const handleInputChange = (field: keyof FormFields, value: any) => {
    // Update the field value first
    setForm(prevForm => {
      const updatedForm = { ...prevForm };
      updatedForm.fields[field].value = value;
      
      // Only validate and show error if field was touched and has error, or user tried to submit
      if (hasTriedSubmit || (fieldsTouched[field] && updatedForm.fields[field].error)) {
        updatedForm.validate(field, value);
      } else {
        // Clear error if field was corrected and user is typing
        if (updatedForm.fields[field].error && value) {
          updatedForm.fields[field].error = '';
        }
      }
      
      return updatedForm;
    });
  };

  const handleFieldBlur = (field: keyof FormFields) => {
    setFieldsTouched(prev => ({ ...prev, [field]: true }));
    setForm(prevForm => {
      const updatedForm = { ...prevForm };
      // Only validate on blur if user has typed something
      const fieldValue = updatedForm.fields[field].value.trim();
      if (fieldValue.length > 0) {
        updatedForm.validate(field, updatedForm.fields[field].value);
      }
      return updatedForm;
    });
  };

  function registerClick() {
    setHasTriedSubmit(true);
    
    // Mark all fields as touched
    setFieldsTouched({
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      password: true,
      birthDate: true
    });
    
    // Always validate all fields
    form.validateAll();

    // Set error for terms and conditions
    if (!termsCondition) {
      setShowTermsError(true);
    } else {
      setShowTermsError(false);
    }

    setForm(prevForm => ({
      ...prevForm
    }));

    // If any field is invalid or terms not accepted, show the first error as a toast
    if (form.isValid() === false || !termsCondition) {
      if (!termsCondition) {
        MtToast.error('Please accept terms and conditions to proceed');
      } else {
        MtToast.error(form.getFirstError());
      }
      return;
    }

    const body = form.getValue();
    setLoader(true);

    Request.signup(body, (success, error) => {
      setLoader(false);
      //console.log('validation failed wali error> ', error)
      if (error) {
        if (error.errors) {
          const firstErrorKey = Object.keys(error.errors)[0];
          const firstErrorMessage = error.errors[firstErrorKey];

          MtToast.error(firstErrorMessage)
        } else {
          MtToast.error(error.message)
        }
      } else {
        MtToast.success(success.message);

        console.log(success.data);
        // props.navigation?.navigate('Login');
        props.navigation?.navigate('Otp', {
          screenType: 'Login',
          verifyEmail: true,
          verifyPhone: false,
          email: form.fields.email.value
        });
      }
    });
  }

  function confirmDateTime(date: Date) {
    if (!date) return;

    setOpenDatePicker(false);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const isoDateString = `${year}-${month}-${day}`; // local time, not UTC

    setForm(prevForm => {
      const updatedForm = { ...prevForm };
      updatedForm.fields.birthDate.value = isoDateString;
      return updatedForm;
    });

    setDatePickerDate(date);
  }

  function loginClick() {
    props?.navigation?.navigate('Login');
  }

  function openTermsPage() {
    props?.navigation?.navigate('WebPage', { title: 'Terms & Conditions', link: API.terms });
  }

  function openPrivacyPolicyPage() {
    props?.navigation?.navigate('WebPage', { title: 'Privacy Policy', link: API.privacy_policy });
  }

  const errorMsg = (msg: string, fieldName: keyof FormFields) => {
    const shouldShowError = hasTriedSubmit || fieldsTouched[fieldName];
    return (
      <Text
        style={{ fontSize: Fonts.fs_10, color: Colors.red, marginHorizontal: 20, minHeight: 10 }}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {(shouldShowError && msg) ? msg : ' '}
      </Text>
    );
  };

  // Create themed styles
  const themedStyles = StyleSheet.create({
    title: {
      fontSize: Fonts.fs_25,
      color: theme.text,
      fontFamily: Fonts.medium,
      alignSelf: 'center' as const,
      marginTop: 35,
    },
    subtitle: {
      fontSize: Fonts.fs_18,
      color: theme.text,
      fontFamily: Fonts.regular,
      alignSelf: 'center' as const,
      marginTop: isIos ? 15 : 5,
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: Fonts.fs_14,
      fontFamily: Fonts.regular,
      height: 35
    },
    boxViewCard: {
      backgroundColor: theme.inputBackground,
      paddingVertical: isIos ? 5 : 0,
    },
    dateText: {
      flex: 1,
       padding: 10,
      fontSize: Fonts.fs_14,
      color: theme.placeholder,
      fontFamily: Fonts.regular,
 
    },
    dateTextFilled: {
      color: theme.text,
    },
    termsText: {
      paddingHorizontal: 10,
      color: theme.text,
      lineHeight: 20,
    },
    termsLink: {
      textDecorationLine: 'underline' as const,
      color: Colors.primary_color_orange,
    },
    privacyLink: {
      textDecorationLine: 'underline' as const,
      color: Colors.primary_color_orange,
    },
    haveAccountText: {
      fontSize: Fonts.fs_12,
      color: theme.text,
      fontFamily: Fonts.regular,
      paddingVertical: 10,
      marginBottom:40
    },
  });

  return (
    <AuthLayout isLoading={loader} backButton={false} {...props} scrollViewStyle={{ paddingVertical: isIos ? 70 : 40 }}>
      <DatePicker
        modal
        open={openDatePicker}
        date={datePickerDate}
        minimumDate={minDate}
        maximumDate={maxDate}
        onConfirm={confirmDateTime}
        mode={'date'}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />

      <Text style={themedStyles.title}>
        Register
      </Text>
      <Text style={themedStyles.subtitle}>
        Create your account
      </Text>

      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: isIos ? 15 : 5
        }}>
        <View style={{ width: '47.5%' }}>
          <BoxView
            cardStyle={{
              ...themedStyles.boxViewCard,
              marginHorizontal: 0,
              width: '100%',
              borderColor: form.fields.firstname.isValid() ? Colors.transparent : Colors.red,
              borderBottomWidth: form.fields.firstname.isValid() ? 0 : 1,
            }}>
            <TextInput
              style={themedStyles.textInput}
              placeholder="First Name"
              placeholderTextColor={theme.placeholder}
              returnKeyType={'done'}
              onChangeText={value => handleInputChange('firstname', value || '')}
              onBlur={() => handleFieldBlur('firstname')}
            />
          </BoxView>
          {errorMsg(form.fields.firstname.error, 'firstname')}
        </View>

        <View style={{ width: '47.5%' }}>
          <BoxView
            cardStyle={{
              ...themedStyles.boxViewCard,
              marginHorizontal: 0,
              width: '100%',
              borderColor: form.fields.lastname.isValid()
                ? Colors.transparent
                : Colors.red,
              borderBottomWidth: form.fields.lastname.isValid() ? 0 : 1,
            }}>
            <TextInput
              style={themedStyles.textInput}
              placeholder="Last Name"
              placeholderTextColor={theme.placeholder}
              onChangeText={value => handleInputChange('lastname', value || '')}
              onBlur={() => handleFieldBlur('lastname')}
            />
          </BoxView>
          {errorMsg(form.fields.lastname.error, 'lastname')}
        </View>
      </View>
      <BoxView
        cardStyle={{
          ...themedStyles.boxViewCard,
          marginHorizontal: 20,
          backgroundColor: theme.inputBackground,
          // paddingVertical: isIos ? 16 : 5,
          borderColor: form.fields.birthDate.isValid()
            ? Colors.transparent
            : Colors.red,
          borderBottomWidth: form.fields.birthDate.isValid() ? 0 : 1,
        }}
        bodyStyle={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={[
            themedStyles.dateText,
            !Utils.isEmpty(form.fields.birthDate.value) && themedStyles.dateTextFilled
          ]}
          onPress={() => setOpenDatePicker(!openDatePicker)}>
          {Utils.isEmpty(form.fields.birthDate.value)
            ? 'Date of Birth (optional)'
            : form.fields.birthDate.value}
        </Text>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
          activeOpacity={0.9}
          onPress={() => setOpenDatePicker(!openDatePicker)}>
          <Icon name={'calendar'} size={15} color={theme.placeholder} />
        </TouchableOpacity>
      </BoxView>
      {errorMsg(form.fields.birthDate.error, 'birthDate')}
      <BoxView
        cardStyle={{
          ...themedStyles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.fields.email.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.fields.email.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={themedStyles.textInput}
          placeholder="Enter email address"
          placeholderTextColor={theme.placeholder}
          keyboardType={'email-address'}
          onChangeText={value => handleInputChange('email', value || '')}
          onBlur={() => handleFieldBlur('email')}
        />
      </BoxView>
      {errorMsg(form.fields.email.error, 'email')}
      <BoxView
        cardStyle={{
          ...themedStyles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.fields.phone.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.fields.phone.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={themedStyles.textInput}
          placeholder="Enter phone number (optional)"
          placeholderTextColor={theme.placeholder}
          keyboardType={'phone-pad'}
          onChangeText={value => handleInputChange('phone', value || '')}
          onBlur={() => handleFieldBlur('phone')}
        />
      </BoxView>
      {errorMsg(form.fields.phone.error, 'phone')}
      <BoxView
        cardStyle={{
          ...themedStyles.boxViewCard,
          marginHorizontal: 20,
          backgroundColor: theme.inputBackground,
          // paddingVertical: isIos ? 5 : 0,
          borderColor: form.fields.password.isValid()
            ? Colors.transparent
            : Colors.red,
          borderBottomWidth: form.fields.password.isValid() ? 0 : 1,
        }}
        bodyStyle={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <TextInput
          style={themedStyles.textInput}
          placeholder="Enter password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry={showPassword === false ? true : false}
          onChangeText={value => handleInputChange('password', value || '')}
          onBlur={() => handleFieldBlur('password')}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            // padding: 10,
          }}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={!showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={theme.text}
          />
        </TouchableOpacity>
      </BoxView>
      {errorMsg(form.fields.password.error, 'password')}
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginTop: 20,
          alignSelf: 'center',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginHorizontal: '10%',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            paddingTop: 2,
          }}
          onPress={() => {
            setTermsCondition(!termsCondition);
            if (!termsCondition) setShowTermsError(false);
          }}>
          <Icon
            name={termsCondition === false ? 'square' : 'square-check'}
            iconStyle={termsCondition === false ? 'regular' : 'solid'}
            size={22}
            color={(!termsCondition && showTermsError) ? Colors.red : Colors.primary_color_orange}
          />
        </TouchableOpacity>

       
          <Text style={themedStyles.termsText}>
            I confirm that I am of legal age in my jurisdiction and agree to the{' '}
            <Text onPress={openTermsPage} style={themedStyles.termsLink}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text onPress={openPrivacyPolicyPage} style={themedStyles.privacyLink}>
              Privacy Policy
            </Text>
            .
          </Text>
        
      </View>
      {showTermsError && (
        <Text
          style={{
            fontSize: Fonts.fs_10,
            color: Colors.red,
            marginHorizontal: 20,
            minHeight: 14,
            lineHeight: 14,
            paddingBottom: 16,
            marginTop: 4,
            marginBottom: 5,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Please accept terms and conditions to proceed
        </Text>
      )}

      <View style={{ marginTop: 20, marginHorizontal: 17 }}>
        <Textview
          text={'Sign Up'}
          style={styles.button}
          text_click={registerClick}
        />
      </View>

      <View style={CSS.HaveAccount}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={themedStyles.haveAccountText}>Have an account? </Text>
          <Textview
            style={[themedStyles.haveAccountText, styles.haveAccountLink]}
            text="Login"
            text_click={loginClick}
          />
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    color: Colors.black,
    fontSize: Fonts.fs_14,
    fontFamily: Fonts.regular,
    height: 35
  },
  boxViewCard: {
    backgroundColor: Colors.white,
    paddingVertical: isIos ? 10 : 0,
  },
  boxViewCardError: {
    borderColor: Colors.red,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: Fonts.fs_14,
    color: Colors.grey,
    fontFamily: Fonts.regular,
  },
  textError: {
    color: Colors.red,
  },
  button: {
    fontSize: Fonts.fs_17,
    color: Colors.white,
    fontFamily: Fonts.regular,
    textAlign: 'center' as 'center',
    backgroundColor: Colors.primary_color_orange,
    paddingVertical: isIos ? 15 : 13,
    borderRadius: 10,
  },
  haveAccount: {
    fontSize: Fonts.fs_12,
    color: Colors.grey,
    fontFamily: Fonts.regular,
    paddingVertical: 10,
  },
  haveAccountLink: {
    color: Colors.primary_color_orange,
  },
  boxViewBody: {
    flex: 1,
    flexDirection: 'row',
  },
});