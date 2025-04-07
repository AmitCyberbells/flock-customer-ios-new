import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import FormLayout from "./layouts/FormLayout";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import Utils from "../../services/Utils";
import { Fonts } from "../../constants/Fonts";
import { Colors } from "../../constants/Colors";
import Request from "../../services/Request";
import ShadowCard from "../../components/ShadowCard";
import Imageview from "../../components/Imageview";
import { useDispatch, useSelector } from "react-redux";
import { StoreStates } from "../../store/store";
import Images from "../../constants/Images";
import ImagePickerDialog from "../../components/ImagePicker";
import { Asset } from "react-native-image-picker";
import { updateUserToStore } from "../../store/userReducer";
import { OtpParams } from "../../types/RootStackParamList";
import MtToast from "../../constants/MtToast";
import { isIos } from "../../constants/IsPlatform";
import { createLog, LOG_ACTIVITIES } from "../../services/AppLog";

const EditProfile: React.FC<ScreenProps<'EditProfile'>> = props => {
    const [loader, setLoader] = useState<boolean>(false);
    const [imagePicker, showImagePicker] = useState<boolean>(false);
    const user = useSelector((state: StoreStates) => state.user);

    const [first_name, setFirstName] = useState<string>(user.first_name);
    const [last_name, setLastName] = useState<string>(user.last_name);
    const [email, setEmail] = useState<string>(user.email);
    const [contact, setContact] = useState<string | undefined>(user.contact);
    const [image, setImage] = useState<string | undefined>(user.image);
    const [uploadedImage, setUploadedImage] = useState<Asset | undefined>();
    const dispatch = useDispatch();

    const isFormValid = () => (!Utils.anyEmpty([first_name, email, contact]));

    const OtpPageParams: OtpParams = {
        screenType: 'EditProfile',
        verifyEmail: false,
        verifyPhone: false,
        email: user.email,
        contact: user.contact
    }

    useEffect(() => {
        console.log(user.image)
        setImage(user.image);

    }, [user])

    const submit = () => {
        if (!isFormValid()) {
            return MtToast.error('Invalid information!');
        }

        const body = new FormData();

        if (!Utils.isEmpty(first_name)) {
            body.append('first_name', first_name);
        }

        if (!Utils.isEmpty(last_name)) {
            body.append('last_name', last_name);
        }


        if (image !== user.image && uploadedImage) {
            body.append('image', {
                uri: uploadedImage.uri,
                name: uploadedImage.fileName,
                type: uploadedImage.type
            });
        }

        setLoader(true)

        createLog(LOG_ACTIVITIES.PROFILE_UPDATE, body);

        Request.updateProfile(body, (success, error) => {
            setLoader(false)

            if (success) {
                MtToast.success(success.message);
                dispatch(updateUserToStore(success.data))

            } else {
                MtToast.error(error.message);
            }
        })
    }

    const confirm = (done: () => void) => {
        Alert.alert(
            "Confirm Verify", // Title
            "We are going to send you an OTP.", // Message
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK, Sure",
                    onPress: () => { done() },
                    style: "destructive",
                },
            ]
        );
    }

    const verifyEmail = () => {

        if (!email) {
            return MtToast.error('Email is required!');
        };

        setLoader(true);

        Request.sendEmailOtp({ email }, (success, error) => {
            setLoader(false);

            if (success) {
                OtpPageParams.verifyEmail = true;
                OtpPageParams.verifyPhone = false;
                props.navigation?.navigate('Otp', OtpPageParams)

            } else {
                MtToast.error(error.message);
            }
        });
    }

    const verifyContact = () => {
        
        if (!contact) {
            return MtToast.error('Contact is required');
        };

        setLoader(true);

        Request.sendContactOtp({ contact: contact }, (success, error) => {
            setLoader(false);

            if (success) {
                OtpPageParams.verifyEmail = false;
                OtpPageParams.verifyPhone = true;

                props.navigation?.navigate('Otp', OtpPageParams)
            } else {
                MtToast.error(error.message);
            }
        });
    }

    const onSelectImage = (sources: Asset[]) => {
        console.log(sources[0])
        setImage(sources[0].uri)
        setUploadedImage(sources[0])
        showImagePicker(false);
    }

    return (
        <FormLayout>
            <Loader isLoading={loader} />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                <Pressable onPress={() => showImagePicker(true)} style={{ flex: 1 }}>
                    <ShadowCard
                        style={{
                            backgroundColor: Colors.white,
                            width: isIos ? 135 : 115,
                            height: isIos ? 135 : 115,
                            padding: 0,
                            alignSelf: 'center',
                            marginTop: 20,
                            borderRadius: isIos ? 80 : 100,
                        }}
                    >
                        <Imageview
                            url={image || Images.profileImg}
                            style={{
                                width: isIos ? 135 : 115,
                                height: isIos ? 135 : 115,
                                alignSelf: 'center'
                            }}
                            imageStyle={{ borderRadius: isIos ? 135 : 115 }}
                            imageType={"server"}
                            resizeMode={"cover"}
                        />
                    </ShadowCard>

                    <Text
                        style={{
                            fontFamily: Fonts.medium,
                            color: Colors.grey,
                            textAlign: 'center',
                            fontSize: Fonts.fs_14,
                            marginTop: 10
                        }}
                    >
                        {"Upload Photo"}
                    </Text>
                </Pressable>

                <View style={{ paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', gap: 10 }}>
                        <ShadowCard
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.white,
                                paddingVertical: isIos ? 17 : 0,
                                paddingHorizontal: 15,
                                flex: 1,
                                borderBottomColor: Colors.red,
                                borderBottomWidth: Utils.isName(first_name || '') ? 0 : 0.5
                            }}
                        >

                            <TextInput
                                style={{
                                    width: '100%',
                                    color: Colors.black,
                                    fontSize: Fonts.fs_14,
                                    fontFamily: Fonts.regular
                                }}
                                placeholder="First Name"
                                editable={true}
                                placeholderTextColor={Colors.grey}
                                returnKeyType={"done"}
                                value={first_name}
                                onChangeText={value => {
                                    setFirstName(value)
                                }}

                            />
                        </ShadowCard>

                        <ShadowCard
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.white,
                                paddingVertical: isIos ? 17 : 0,
                                borderBottomColor: Colors.red,
                                borderBottomWidth: !Utils.isEmpty(last_name) && !Utils.isName(last_name || '') ? 0.5 : 0
                            }}
                        >

                            <TextInput
                                style={{
                                    flex: 1,
                                    color: Colors.black,
                                    fontSize: Fonts.fs_14,
                                    fontFamily: Fonts.regular
                                }}
                                placeholder="Last Name"
                                editable={true}
                                placeholderTextColor={Colors.grey}
                                value={last_name}
                                onChangeText={value => {
                                    setLastName(value)
                                }}
                            />
                        </ShadowCard>

                    </View>

                    <ShadowCard
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: Colors.whitesmoke,
                            paddingHorizontal: 10,
                            paddingVertical: isIos ? 17 : 0,
                            marginTop: isIos ? 25 : 20,
                            borderBottomColor: Colors.red,
                            borderBottomWidth: Utils.isEmail(email || '') ? 0 : 0.5
                        }}
                    >
                        <TextInput
                            style={{
                                color: Colors.black,
                                fontSize: Fonts.fs_14,
                                fontFamily: Fonts.regular,
                                flex: 1
                            }}
                            placeholder="Enter email address"
                            editable={false}
                            keyboardType='email-address'
                            placeholderTextColor={Colors.grey}
                            value={email}
                            onChangeText={value => {
                                setEmail(value)
                            }}
                        />

                        {
                            !Utils.isEmpty(user.email_verified_at) ?
                                <Imageview
                                    url={Images.verifyBadge}
                                    style={{
                                        width: isIos ? 25 : 20,
                                        height: isIos ? 25 : 20,
                                    }}
                                    imageType={"local"}
                                    resizeMode={"contain"}
                                />

                                :

                                <TouchableOpacity onPress={() => confirm(verifyEmail)} style={{ padding: 5 }}>
                                    <Text style={{ color: Colors.primary_color_orange }}>
                                        {"Verify"}
                                    </Text>
                                </TouchableOpacity>

                        }

                    </ShadowCard>

                    <ShadowCard
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: Colors.whitesmoke,
                            paddingVertical: isIos ? 17 : 0,
                            marginTop: isIos ? 25 : 20,
                            borderBottomColor: Colors.red,
                            borderBottomWidth: Utils.isPhone(contact || '') ? 0 : 0.5
                        }}
                    >
                        <TextInput
                            style={{
                                color: Colors.black,
                                fontSize: Fonts.fs_14,
                                fontFamily: Fonts.regular,
                                flex: 1
                            }}
                            placeholder="Enter phone number"
                            placeholderTextColor={Colors.grey}
                            keyboardType={'phone-pad'}
                            editable={false}
                            value={contact}
                            onChangeText={value => {
                                setContact(value)
                            }}
                        />

                        {
                            !Utils.isEmpty(user.contact_verified_at) ?

                                <Imageview
                                    url={Images.verifyBadge}
                                    style={{
                                        width: isIos ? 25 : 20,
                                        height: isIos ? 25 : 20,
                                    }}
                                    imageType={"local"}
                                    resizeMode={"contain"}
                                />
                                :
                                <TouchableOpacity onPress={() => confirm(verifyContact)} style={{ padding: 5 }}>
                                    <Text
                                        style={{
                                            color: Colors.primary_color_orange,
                                        }}
                                    >
                                        {"Verify"}
                                    </Text>
                                </TouchableOpacity>
                        }

                    </ShadowCard>

                    <TouchableOpacity onPress={submit} disabled={!isFormValid()} style={{
                        backgroundColor: Colors.primary_color_orange,
                        marginTop: 40,
                        paddingVertical: isIos ? 15 : 10,
                        borderRadius: 10,
                        height: 50,
                        justifyContent: 'center',
                        opacity: isFormValid() ? 1 : 0.5
                    }}>
                        <Text
                            style={{
                                fontSize: Fonts.fs_17,
                                color: Colors.white,
                                fontFamily: Fonts.regular,
                                textAlign: 'center',
                            }}
                        > {'Update'} </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {imagePicker && <ImagePickerDialog onCancel={() => showImagePicker(false)} onImageSelect={onSelectImage} />}
        </FormLayout>
    )
}

export default EditProfile;