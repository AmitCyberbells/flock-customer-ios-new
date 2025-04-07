import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import AuthLayout from './Layout';
import Textview from '../../components/Textview';
import { Colors } from '../../constants/Colors';
import { CSS } from '../../constants/CSS';
import { useEffect, useState } from 'react';
import Request from '../../services/Request';
import MtToast from '../../constants/MtToast';
import { Validator } from '../../services/Validator';
import { isIos } from '../../constants/IsPlatform';
import ShadowCard from '../../components/ShadowCard';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Fonts } from '../../constants/Fonts';

const ResetPassword: React.FC<ScreenProps<'ResetPassword'>> = props => {
  const [loader, setLoader] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErr, setPasswordErr] = useState<string>('');

  useEffect(() => {
    if (props.route?.params.email) {
      setEmail(props.route?.params.email);
    }

  }, []);

  const continueClick = () => {
    if (!Validator.password.validate(password)) {
      MtToast.error(Validator.password.message)
      return;
    }

    setLoader(true);

    Request.resetPassword({ email, password }, (success, error) => {
      setLoader(false);

      if (success) {
        props.navigation?.navigate('Login');
      } else {
        MtToast.error(error.message)
      }

    })
  };

  const onChangeInput = (value: string) => {
    if (!Validator.password.validate(value)) {
      setPasswordErr(Validator.password.message);
    } else {
      setPasswordErr('');
    }

    setPassword(value);
  }

  return (
    <AuthLayout isLoading={loader} scrollViewStyle={{ marginTop: isIos ? 70 : 40 }} backButton={true} {...props}>
      <Textview
        text={'Reset Password'}
        style={CSS.title}
        text_click={() => { }}
      />
      <View style={{
        paddingVertical: 10,
      }}>
        <Text style={{
          color: Colors.primary_color_orange, textAlign: 'center'
        }}>{email}</Text>
      </View>

      <ShadowCard style={[styles.forgetPass, passwordErr != '' ? styles.inputError : {}]}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          placeholderTextColor={Colors.grey}
          secureTextEntry={!showPassword}
          onChangeText={value => onChangeInput(value)}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={!showPassword ? 'eye-slash' : 'eye'}
            size={15}
            color={Colors.grey}
          />
        </TouchableOpacity>
      </ShadowCard>

      {passwordErr != '' ? <Text style={{ marginTop: 4, fontSize: Fonts.fs_10, color: Colors.red, marginHorizontal: 20 }}>{passwordErr}</Text> : ''}

      <Textview
        text={'Continue'}
        style={[CSS.themeButton, { marginTop: 30 }]}
        text_click={continueClick}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  boxView: {
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    marginTop: 30,
  },
  textInput: {
    flex: 1,
    height: 50
  },
  forgetPass: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: isIos ? 10 : 0,
    marginTop: isIos ? 25 : 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputError: {
    borderColor: Colors.red,
    borderBottomWidth: 1,
  },
  eyeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 10,
  },
});

export default ResetPassword;
