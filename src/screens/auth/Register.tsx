import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {CSS} from '../../constants/CSS';
import DatePicker from 'react-native-date-picker';
import Textview from '../../components/Textview';
import {Fonts} from '../../constants/Fonts';
import {Colors} from '../../constants/Colors';
import BoxView from '../../components/BoxView';
import ScreenProps from '../../types/ScreenProps';
import Icon from '@react-native-vector-icons/fontawesome6';
import Toast from 'react-native-toast-message';
import Request from '../../services/Request';
import Utils from '../../services/Util';
import RegisterForm from '../../forms/RegisterForm';
import AuthLayout from './Layout';
import { useDispatch } from 'react-redux';

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

  const handleInputChange = (field: string, value: any) => {
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

    if (form.isValid() === false) {
      Toast.show({
        type: 'MtToastError',
        text1: form.getFirstError(),
        position: 'bottom',
      });
      return;
    }

    if (!termsCondition) {
      Toast.show({
        type: 'MtToastError',
        text1: 'Please accept terms and conditions to proceed',
        position: 'bottom',
      });
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
          Toast.show({
            type: 'MtToastError',
            text1: firstErrorMessage,
            position: 'bottom',
          });
        } else {
          Toast.show({
            type: 'MtToastError',
            text1: error.message,
            position: 'bottom',
          });
        }
      } else {
        Toast.show({
          type: 'MtToastSuccess',
          text1: success.message,
          position: 'bottom',
        });

        console.log(success.data);
        props.navigation?.navigate('Otp', {
          screenType: 'Login',
          verifyEmail: true,
          verifyPhone: false,
          email: form.email.value
        });
      }
    });
  }

  function OTPApi() {}

  function confirmDateTime(date: Date) {
    if (!date) return;

    setOpenDatePicker(false);
    const isoDateString = date.toISOString().split('T')[0];
    setForm(prevForm => {
      const updatedForm = {...prevForm};
      updatedForm.birthDate.value = isoDateString;
      return updatedForm;
    });

    setDatePickerDate(date);
  }

  function loginClick() {
    props?.navigation?.navigate('Login');
  }

  function openTermsPage() {
    props?.navigation?.navigate('TermsConditionsWebview');
  }

  useEffect(() => {}, []);

  return (
    <AuthLayout isLoading={loader}>
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

      <Text
        style={{
          fontSize: Fonts.fs_25,
          color: Colors.black,
          fontFamily: Fonts.android_medium,
          alignSelf: 'center',
          marginTop: 35,
        }}>
        Register
      </Text>
      <Text
        style={{
          fontSize: Fonts.fs_18,
          color: Colors.black,
          fontFamily: Fonts.android_regular,
          alignSelf: 'center',
          marginTop: Platform.OS == 'ios' ? 15 : 5,
        }}>
        Create your account
      </Text>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <BoxView
          cardStyle={{
            ...styles.boxViewCard,
            marginTop: 25,
            marginHorizontal: 0,
            width: '47.5%',
            borderColor: form.firstname.isValid()
              ? Colors.transparent
              : Colors.red,
            borderBottomWidth: form.firstname.isValid() ? 0 : 1,
          }}>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor={Colors.grey}
            returnKeyType={'done'}
            onChangeText={value => handleInputChange('firstname', value || '')}
          />
        </BoxView>

        <BoxView
          cardStyle={{
            ...styles.boxViewCard,
            marginTop: 25,
            width: '47.5%',
            borderColor: form.lastname.isValid()
              ? Colors.transparent
              : Colors.red,
            borderBottomWidth: form.lastname.isValid() ? 0 : 1,
          }}>
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor={Colors.grey}
            onChangeText={value => handleInputChange('lastname', value || '')}
          />
        </BoxView>
      </View>
      <BoxView
        cardStyle={{
          marginHorizontal: 20,
          paddingVertical: Platform.OS == 'ios' ? 16 : 5,
          borderColor: form.birthDate.isValid()
            ? Colors.transparent
            : Colors.red,
          borderBottomWidth: form.birthDate.isValid() ? 0 : 1,
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
            color: Utils.isEmpty(form.birthDate.value)
              ? Colors.grey
              : Colors.black,
            fontFamily: Fonts.android_regular,
          }}
          onPress={() => setOpenDatePicker(!openDatePicker)}>
          {Utils.isEmpty(form.birthDate.value)
            ? 'Date of Birth'
            : form.birthDate.value}
        </Text>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}
          onPress={() => setOpenDatePicker(!openDatePicker)}>
          <Icon name={'calendar'} size={15} color={Colors.grey} />
        </TouchableOpacity>
      </BoxView>

      <BoxView
        cardStyle={{
          ...styles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.email.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.email.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter email address"
          placeholderTextColor={Colors.grey}
          keyboardType={'email-address'}
          onChangeText={value => handleInputChange('email', value || '')}
        />
      </BoxView>

      <BoxView
        cardStyle={{
          ...styles.boxViewCard,
          marginHorizontal: 20,
          borderColor: form.phone.isValid() ? Colors.transparent : Colors.red,
          borderBottomWidth: form.phone.isValid() ? 0 : 1,
        }}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter phone number"
          placeholderTextColor={Colors.grey}
          keyboardType={'phone-pad'}
          onChangeText={value => handleInputChange('phone', value || '')}
        />
      </BoxView>

      <BoxView
        cardStyle={{
          marginHorizontal: 20,
          backgroundColor: Colors.white,
          paddingVertical: Platform.OS == 'ios' ? 17 : 0,
          marginTop: Platform.OS == 'ios' ? 25 : 20,
          borderColor: form.password.isValid()
            ? Colors.transparent
            : Colors.red,
          borderBottomWidth: form.password.isValid() ? 0 : 1,
        }}
        bodyStyle={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          placeholderTextColor={Colors.grey}
          secureTextEntry={showPassword === false ? true : false}
          onChangeText={value => handleInputChange('password', value || '')}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 10,
          }}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={Colors.grey}
          />
        </TouchableOpacity>
      </BoxView>

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

        <TouchableOpacity onPress={() => openTermsPage()}>
          <Text
            style={{
              width: '48%',
              paddingHorizontal: 10,
              color: Colors.black,
            }}>
            I am 18 years of age and agree to the{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: Colors.primary_color_orange,
              }}>
              Terms and Conditions
            </Text>{' '}
            as set out by the{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: Colors.primary_color_orange,
              }}>
              User Agreement.
            </Text>{' '}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 30, marginHorizontal: 17}}>
        <Textview
          text={'Continue'}
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
          <Text style={styles.haveAccount}>Have an account? </Text>
          <Textview
            style={[styles.haveAccount, styles.haveAccountLink]}
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
    fontFamily:
      Platform.OS == 'ios' ? Fonts.ios_regular : Fonts.android_regular,
  },
  boxViewCard: {
    backgroundColor: Colors.white,
    paddingVertical: Platform.OS == 'ios' ? 17 : 0,
  },
  boxViewCardError: {
    borderColor: Colors.red,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: Fonts.fs_14,
    color: Colors.grey,
    fontFamily: 'regular',
  },
  textError: {
    color: Colors.red,
  },
  button: {
    fontSize: Fonts.fs_17,
    color: Colors.white,
    fontFamily: 'regular',
    textAlign: 'center' as 'center',
    backgroundColor: Colors.primary_color_orange,
    paddingVertical: Platform.OS == 'ios' ? 15 : 10,
    borderRadius: 10,
  },
  haveAccount: {
    fontSize: Fonts.fs_12,
    color: Colors.grey,
    fontFamily: Fonts.android_regular,
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
