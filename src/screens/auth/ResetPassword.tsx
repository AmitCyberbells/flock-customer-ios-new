import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import AuthLayout from './Layout';
import Textview from '../../components/Textview';
import BoxView from '../../components/BoxView';
import {Colors} from '../../constants/Colors';
import {CSS} from '../../constants/CSS';
import {useEffect, useState} from 'react';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import MtToast from '../../constants/MtToast';
import Utils from '../../services/Util';
import { Validator } from '../../services/Validator';

const ResetPassword: React.FC<ScreenProps<'ResetPassword'>> = props => {
  const [loader, setLoader] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

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

    Request.resetPassword({email, password}, (success, error) => {
        setLoader(false);

        if (success) {
            props.navigation?.navigate('Login');
        } else {
            MtToast.error(error.message)
        }

    })
  };

  return (
    <AuthLayout isLoading={loader}>
      <Textview
        text={'Reset Password'}
        style={CSS.title}
        text_click={() => {}}
      />
      <View style={{
        paddingVertical: 10,
      }}>
        <Text style={{
        color: Colors.primary_color_orange, textAlign: 'center' }}>{email}</Text>
      </View>
      <BoxView cardStyle={styles.boxView}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter new password"
          placeholderTextColor={Colors.grey}
          keyboardType="email-address"
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
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
    paddingVertical: Platform.OS == 'ios' ? 17 : 0,
    marginTop: 30,
  },
  textInput: {
    height: 40,
  },
});

export default ResetPassword;
