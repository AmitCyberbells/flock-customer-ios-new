import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, ViewComponent } from 'react-native'
import ScreenProps from "../../types/ScreenProps";
import ShadowCard from "../../components/ShadowCard";
import { Colors } from "../../constants/Colors";
import Imageview from "../../components/Imageview";
import Textview from "../../components/Textview";
import { isIos } from "../../constants/IsPlatform";
import { Fonts } from "../../constants/Fonts";
import Images from "../../constants/Images";
import { CSS } from "../../constants/CSS";
import FeatherHistoryType from "../../types/FeatherHistoryType";
import Request from "../../services/Request";
import MtToast from "../../constants/MtToast";
import Loader from "../../components/Loader";
import Icon from "@react-native-vector-icons/fontawesome6";
import NoData from "../../components/NoData";
import Utils from "../../services/Utils";

const FeathersHistory: React.FC<ScreenProps<'FeathersHistory'>> = (props) => {
    const { navigation } = props;
    const [loader, setLoader] = useState(false);
    const [FeathersList, setFeathersList] = useState<Array<FeatherHistoryType>>([]);

    const colors = ['#FEF2BF', '#CAD2F7', '#C3CED6', '#CAD2F7', "#FBDFC3"];
    const imgColor = ['#FACC48', '#2B4CE0', '#103E5B', '#2B4CE0', '#F1813A'];

    useEffect(() => {

        console.log('Feather Data')
        loadTransactions();

    }, []);

    const loadTransactions = () => {
        setLoader(true);

        Request.feathersHistory((success, error) => {
            setLoader(false);

            if (success) {
                setFeathersList(success.data);
            } else {
                MtToast.error(error.message)
            }
        })
    }

    const renderItem_List = useCallback(
        ({ item, index }: { item: FeatherHistoryType, index: number }) => (

            <ShadowCard style={{
                backgroundColor: Colors.white,
                paddingHorizontal: isIos ? 10 : 7,
                paddingVertical: isIos ? 10 : 7,
                height: Dimensions.get("window").height * 21.5 / 100,
                marginBottom: isIos ? 10 : 5,
                marginTop: isIos ? 10 : 5,
                marginHorizontal: isIos ? 17 : 15,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{
                        width: 70, height: 70, justifyContent: 'center',
                        alignItems: 'center', borderRadius: 60, backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 5

                    }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 60, backgroundColor: colors[index % colors.length] }}>
                            <Imageview
                                url={item.category_icon}
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                                imageType={"local"}
                                resizeMode={"contain"}
                                tintColor={imgColor[index % imgColor.length]}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Textview
                            text={item.category_name}
                            style={{
                                fontFamily: Fonts.medium,
                                color: Colors.black,
                                fontSize: Fonts.fs_17
                            }}
                        />
                        <Textview
                            text={'Lorem Ipsum is simply dummy text'}
                            lines={3}
                            style={{
                                fontFamily: Fonts.regular,
                                color: Colors.light_grey,
                                fontSize: Fonts.fs_13,
                                marginTop: isIos ? 10 : 2
                            }}
                        />

                    </View>

                </View>

                <View style={{ borderColor: Colors.light_grey, borderWidth: isIos ? 0.6 : 0.3, marginVertical: isIos ? 10 : 8, }} />
                <View style={{ flexDirection: 'row', marginVertical: isIos ? 12 : 5, paddingHorizontal: isIos ? 10 : 7, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {/*  <Imageview
                            url={Images.available}
                            style={{
                                width: isIos ? 40 : 30,
                                height: isIos ? 40 : 30
                            }}
                            imageType={"local"}
                            resizeMode={"contain"}
                        /> */}
                        <Icon name='circle-check' color={Colors.primary_color_orange} iconStyle="solid" size={isIos ? 40 : 30} />

                        <View style={{ paddingHorizontal: 10 }}>
                            <Textview
                                text={'Available Feathers'}
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.light_grey,
                                    fontSize: Fonts.fs_12,
                                    marginBottom: isIos ? 5 : 0
                                }}
                            />
                            <Textview
                                text={(item.total_earned_points - item.total_spent_points).toString()}
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.black,
                                    fontSize: Fonts.fs_17,
                                    marginTop: isIos ? 2 : 0
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: isIos ? 25 : 18 }}>
                        <Imageview
                            url={Images.spend}
                            style={{
                                width: isIos ? 40 : 30,
                                height: isIos ? 40 : 30
                            }}
                            imageType={"local"}
                            resizeMode={"contain"}
                        />
                        <View style={{ paddingHorizontal: 10 }}>
                            <Textview
                                text={'Last Spent'}
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.light_grey,
                                    fontSize: Fonts.fs_12,
                                    marginTop: isIos ? 5 : 0
                                }}

                            />
                            <Textview
                                text={item.total_spent_points.toString()}
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.black,
                                    fontSize: Fonts.fs_17,
                                    marginTop: isIos ? 2 : 0
                                }}

                            />
                        </View>
                    </View>

                </View>

            </ShadowCard>

        ), [FeathersList]);

    const keyExtractor_list = (item: FeatherHistoryType, index: number) => index.toString();

    function click_back() {
        navigation?.goBack()
    }

    return (
        <View style={CSS.Favcontainer}>
            <Loader isLoading={loader} />
            <View style={{ marginTop: 40 }}>

                {FeathersList.length > 0 ? <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={FeathersList}
                    style={{ flexGrow: 0, }}
                    renderItem={renderItem_List}
                    keyExtractor={keyExtractor_list}
                /> :
                    <View style={{height: Utils.DEVICE_HEIGHT/2 }}>
                        <NoData />
                    </View>

                }
            </View>

        </View>
    )
}

export default FeathersHistory;