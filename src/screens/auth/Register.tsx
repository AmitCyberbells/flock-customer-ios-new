import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
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
import RegisterForm, { FormField, FormFields } from '../../forms/RegisterForm';
import AuthLayout from './Layout';
import MtToast from '../../constants/MtToast';
import { isIos } from '../../constants/IsPlatform';
import { Environment } from '../../../env';
import { API } from '../../services/API';
import { useIsFocused } from '@react-navigation/native';
import { useThemeColors } from '../../constants/useThemeColors';

const Register: React.FC<ScreenProps<'Register'>> = props => {

  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsCondition, setTermsCondition] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);

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
    }

  }, [isFocused])

  const handleInputChange = (field: keyof FormFields, value: any) => {
    const input = form.validate(field, value);
    console.log('after validation:>> ', input);

    setForm(prevForm => ({
      ...prevForm,
      [field]: input,
    }));
  };

  function registerClick() {
    form.validateAll();
    const body = form.getValue();
    console.log('register clicked', body, form);

    setForm(prevForm => ({
      ...prevForm
    }));

    if (form.isValid() === false) {
      MtToast.error(form.getFirstError());
      return;
    }

    if (!termsCondition) {
      MtToast.error('Please accept terms and conditions to proceed');
      return;
    }

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
        props.navigation?.navigate('Login');
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

  const dynamicStyles = StyleSheet.create({
    registerText: {
      fontSize: Fonts.fs_25,
      color: theme.text,
      fontFamily: Fonts.medium,
      alignSelf: 'center',
      marginTop: 35,
    },
    registerSubtitle: {
      fontSize: Fonts.fs_18,
      color: theme.text,
      fontFamily: Fonts.regular,
      alignSelf: 'center',
      marginTop: isIos ? 15 : 5,
    },
    boxViewCard: {
      backgroundColor: theme.inputBackground,
      paddingVertical: isIos ? 10 : 0,
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: Fonts.fs_14,
      fontFamily: Fonts.regular,
      height: 40
    },
    termsText: {
      width: '48%',
      paddingHorizontal: 10,
      color: theme.text,
    },
    termsLink: {
      textDecorationLine: 'underline',
      color: Colors.primary_color_orange,
    },
    haveAccount: {
      fontSize: Fonts.fs_12,
      color: theme.muteText,
      fontFamily: Fonts.regular,
      paddingVertical: 10,
    },
  });

  const errorMsg = (msg: string) => (msg && <Text style={{ fontSize: Fonts.fs_10, color: Colors.red, marginHorizontal: 20 }}>{msg}</Text>)

  return (
    <AuthLayout isLoading={loader} backButton={true} {...props}>
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

      <Text style={dynamicStyles.registerText}>
        Register
      </Text>
      <Text style={dynamicStyles.registerSubtitle}>
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
        <BoxView
          cardStyle={{
            ...dynamicStyles.boxViewCard,
            marginHorizontal: 0,
            width: '47.5%',
            borderColor: form.fields.firstname.isValid() ? Colors.transparent : Colors.red,
            borderBottomWidth: form.fields.firstname.isValid() ? 0 : 1,
          }}>
          <TextInput
            style={dynamicStyles.textInput}
            placeholder="First Name"
            placeholderTextColor={theme.placeholder}
            returnKeyType={'done'}
            onChangeText={value => handleInputChange('firstname', value || '')}
          />
        </BoxView>

        <BoxView
          cardStyle={{
            ...dynamicStyles.boxViewCard,
            width: '47.5%',
            borderColor: form.fields.lastname.isValid()
              ? Colors.transparent
              : Colors.red,
            borderBottomWidth: form.fields.lastname.isValid() ? 0 : 1,
          }}>
          <TextInput
            style={dynamicStyles.textInput}
            placeholder="Last Name"
            placeholderTextColor={theme.placeholder}
            onChangeText={value => handleInputChange('lastname', value || '')}
          />
        </BoxView>
      </View>
      {errorMsg(form.fields.firstname.error || form.fields.lastname.error)}
      <BoxView
        cardStyle={{
          marginHorizontal: 20,
          paddingVertical: isIos ? 16 : 5,
          backgroundColor: theme.inputBackground,
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
          style={{
            flex: 1,
            padding: 5,
            fontSize: Fonts.fs_14,
            color: Utils.isEmpty(form.fields.birthDate.value)
              ? theme.placeholder
              : theme.text,
            fontFamily: Fonts.regular,
          }}
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
          <Icon name={'calendar'} size={15} color={theme.icon} />
        </TouchableOpacity>
      </BoxView>
      {errorMsg(form.fields.birthDate.error)}
      <BoxView
        cardStyle={{
          ...dynamicStyles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.fields.email.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.fields.email.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Enter email address"
          placeholderTextColor={theme.placeholder}
          keyboardType={'email-address'}
          onChangeText={value => handleInputChange('email', value || '')}
        />
      </BoxView>
      {errorMsg(form.fields.email.error)}
      <BoxView
        cardStyle={{
          ...dynamicStyles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.fields.phone.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.fields.phone.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Enter phone number (optional)"
          placeholderTextColor={theme.placeholder}
          keyboardType={'phone-pad'}
          onChangeText={value => handleInputChange('phone', value || '')}
        />
      </BoxView>
      {errorMsg(form.fields.phone.error)}
      <BoxView
        cardStyle={{
          marginHorizontal: 20,
          backgroundColor: theme.inputBackground,
          paddingVertical: isIos ? 10 : 0,
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
          style={dynamicStyles.textInput}
          placeholder="Enter password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry={showPassword === false ? true : false}
          onChangeText={value => handleInputChange('password', value || '')}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 10,
          }}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={!showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={theme.icon}
          />
        </TouchableOpacity>
      </BoxView>
      {errorMsg(form.fields.password.error)}
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginTop: 20,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginHorizontal: '10%',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setTermsCondition(!termsCondition);
          }}>
          <Icon
            name={termsCondition === false ? 'square' : 'square-check'}
            iconStyle={termsCondition === false ? 'regular' : 'solid'}
            size={23}
            color={Colors.primary_color_orange}
          />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} onPress={() => openTermsPage()}>
          <Text style={dynamicStyles.termsText}>
            I confirm that I am of legal age in my jurisdiction and agree to the{' '}
            <Text style={dynamicStyles.termsLink}>
              Terms of Service and Privacy Policy.
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30, marginHorizontal: 17 }}>
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
          <Text style={dynamicStyles.haveAccount}>Have an account? </Text>
          <Textview
            style={[dynamicStyles.haveAccount, styles.haveAccountLink]}
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
    height: 40
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
    paddingVertical: isIos ? 15 : 10,
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
