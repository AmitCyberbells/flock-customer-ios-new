import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ShadowCard from "../../components/ShadowCard";
import { Colors } from "../../constants/Colors";
import ScreenProps from "../../types/ScreenProps";
import Icon from "@react-native-vector-icons/fontawesome6";
import { useEffect, useState } from "react";
import Utils from "../../services/Utils";
import Toast from "react-native-toast-message";
import Request from "../../services/Request";
import { Fonts } from "../../constants/Fonts";
import FormLayout from "./layouts/FormLayout";
import Loader from "../../components/Loader";
import MtToast from "../../constants/MtToast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducer";
import { StoreStates } from "../../store/store";

const ChangePassword: React.FC<ScreenProps<'ChangePassword'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);

    const [old_password, setOldPassword] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [password_confirmation, setPasswordConfirmation] = useState<string>();

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const dispatch = useDispatch();
    const auth = useSelector((state: StoreStates) => state.auth);

    useEffect(() => {
        console.log('access tkn: ', auth.accessToken)
    }, [])

    const isFormValid = () => {
        return (old_password && Utils.isPassword(password || '') && password === password_confirmation);
    }

    const submit = () => {

        if (!isFormValid()) {
            return MtToast.error('Password must contain 8 chars inluding at least 1 number, 1 capital letter and 1 special char!');
        }

        setLoader(true);

        Request.changePassword({ old_password, password, password_confirmation }, (success, error) => {
            setLoader(false);

            if (success) {
                resetForm();
                dispatch(logout());

            } else {
                MtToast.error(error.message);
            }

        })
    }

    const resetForm = () => {
        setOldPassword(undefined);
        setPassword(undefined);
        setPasswordConfirmation(undefined);
    }

    return (
        <FormLayout>
            <Loader isLoading={loader} />
            <View style={styles.formContainer}>

                <ShadowCard
                    style={[
                        styles.inputCard
                    ]}
                >
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Enter old password'}
                        placeholderTextColor={Colors.grey}
                        secureTextEntry={!showPassword.old}
                        value={old_password}
                        onChangeText={value => setOldPassword(value)}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                    >
                        <Icon
                            name={!showPassword.old ? 'eye-slash' : 'eye'}
                            size={15}
                            color={Colors.grey}
                        />
                    </TouchableOpacity>
                </ShadowCard>

                <ShadowCard
                    style={[
                        styles.inputCard,
                        {
                            borderBottomColor: Colors.red,
                            borderBottomWidth: !Utils.isEmpty(password) && !Utils.isPassword(password || '') ? 0.5 : 0,
                        }
                    ]}
                >
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Enter new password'}
                        placeholderTextColor={Colors.grey}
                        secureTextEntry={!showPassword.new}
                        value={password}
                        onChangeText={value => setPassword(value)}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    >
                        <Icon
                            name={!showPassword.new ? 'eye-slash' : 'eye'}
                            size={15}
                            color={Colors.grey}
                        />
                    </TouchableOpacity>
                </ShadowCard>

                <ShadowCard
                    style={[
                        styles.inputCard,
                        {
                            borderBottomColor: Colors.red,
                            borderBottomWidth: !Utils.isEmpty(password_confirmation) && (password !== password_confirmation) ? 0.5 : 0,
                        }
                    ]}
                >
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Confirm password'}
                        placeholderTextColor={Colors.grey}
                        secureTextEntry={!showPassword.confirm}
                        value={password_confirmation}
                        onChangeText={value => setPasswordConfirmation(value)}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    >
                        <Icon
                            name={!showPassword.confirm ? 'eye-slash' : 'eye'}
                            size={15}
                            color={Colors.grey}
                        />
                    </TouchableOpacity>
                </ShadowCard>

                <TouchableOpacity onPress={submit} disabled={!isFormValid()} style={{
                    opacity: isFormValid() ? 1 : 0.5,
                    marginTop: 30,
                    flexDirection: 'row'
                }}>
                    <Text
                        style={{
                            fontSize: Fonts.fs_17,
                            color: Colors.white,
                            fontFamily: Fonts.regular,
                            textAlign: 'center',
                            backgroundColor: Colors.primary_color_orange,
                            padding: 10,
                            borderRadius: 8,
                            flex: 1
                        }}
                    > {'Update'} </Text>
                </TouchableOpacity>
            </View>
        </FormLayout>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        marginHorizontal: 15,
        alignItems: "center"
    },
    inputCard: {
        backgroundColor: Colors.white,
        paddingVertical: Platform.OS == 'ios' ? 17 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    textInput: {
        flex: 1,
        color: Colors.black,
        fontSize: Fonts.fs_14,
        fontFamily: Fonts.regular,
    },
    eyeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    }
});

export default ChangePassword;