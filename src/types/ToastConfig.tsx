import {Text, View} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {Colors} from '../constants/Colors';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Fonts } from '../constants/Fonts';

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: Fonts.fs_15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: Fonts.fs_17,
      }}
      text2Style={{
        fontSize: Fonts.fs_15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  MtToastError: (props: any) => (
    <ToastView bgColor={Colors.indianRed} icon={'circle-xmark'} text1={props.text1 || ''} text2={props.text2 || ''}/>
  ),
  MtToastSuccess: (props: any) => (
    <ToastView bgColor={Colors.success} icon={'circle-check'} text1={props.text1 || ''} text2={props.text2 || ''}/>
  ),
};

export default toastConfig;

export const ToastView = (props: any) => {
  return (
    <View
      style={{
        width: '90%',
        backgroundColor: props.bgColor,
        margin: 'auto',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Icon name={props.icon} color={Colors.white} size={15} />
      <View style={{marginLeft: 5, flex: 1}}>
        <Text
          style={{
            color: Colors.white,
          }}>
          {props.text1 || 'Something went wrong!'}
        </Text>
        {props.text2 != '' ? <Text>{props.text2}</Text> : ''}
      </View>
    </View>
  );
}