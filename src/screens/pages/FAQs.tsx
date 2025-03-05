import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import Request from "../../services/Request";
import Loader from "../../components/Loader";
import { CSS } from "../../constants/CSS";
import Imageview from "../../components/Imageview";
import Images from "../../constants/Images";
import Textview from "../../components/Textview";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import NoData from "../../components/NoData";
import Toast from "react-native-toast-message";
import FAQ from "../../types/FAQ";
import Utils from "../../services/Util";

const FAQs: React.FC<ScreenProps<'FAQs'>> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isIos = Platform.OS === 'ios';
    const [faqs, setFaqs] = useState<Array<FAQ>>();

    useEffect(() => {
        fetch_faq();

    }, [])

    const fetch_faq = () => {
        setIsLoading(true);

        Request.faq((success, error) => {
            setIsLoading(false);

            if (success) {
                setFaqs(success.data.map(value => ({...value, status: 0})));

            } else {
                Toast.show({
                    type: 'MtToastError',
                    text1: error.message,
                    position: 'bottom'
                })
            }

        })
    }

    const openFAQ = (item: FAQ) => {
        setFaqs((prevFaqs) =>
            prevFaqs?.map((faq) =>
                faq.id !== item.id && faq.status != 0 ? { ...faq, status: 0 } : faq
            ).map((faq) =>
                faq.id === item.id ? { ...faq, status: faq.status === 1 ? 0 : 1 } : faq
            )
        );
    }

    const renderItem_List = useCallback(
        ({ item, index }: { item: FAQ, index: number }) => (

            <TouchableOpacity activeOpacity={0.8} style={{
                marginBottom: 13, flex: 1
            }}
                onPress={() => openFAQ(item)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: Colors.blue3,
                        paddingVertical: isIos ? 20 : 13,
                        paddingHorizontal: isIos ? 20 : 20,
                        borderRadius: 10,
                    }}>
                    <Textview
                        text={item.question}
                        style={{
                            fontFamily: 'medium',
                            color: Colors.black,
                            fontSize: Fonts.fs_17
                        }}
                        
                    />
                    <Imageview
                        url={item.status ? Images.dropDown : Images.dropUp}
                        style={{
                            width: isIos ? 20 : 15,
                            height: isIos ? 20 : 15,
                        }}
                        imageType={"local"}
                        resizeMode={"contain"}
                    />
                </View>
                {
                    item.status
                        ?
                        <View
                            style={{
                                backgroundColor: Colors.blue3,
                                paddingVertical: 13,
                                paddingHorizontal: isIos ? 20 : 20,
                                borderRadius: 10,
                                marginBottom: 10,
                                marginTop: 5
                            }}>

                            <Textview
                                text={item.answer}
                                style={{
                                    fontFamily: "regular",
                                    color: Colors.black,
                                    fontSize: Fonts.fs_15,
                                    marginTop: isIos ? 10 : 0
                                }}
                                
                            />

                        </View>
                        :
                        null
                }

            </TouchableOpacity>

        ), [faqs]);
    const keyExtractor_list = (item: FAQ, index: number) => index.toString();


    return (
        <View style={CSS.Favcontainer}>
            <Loader isLoading={isLoading} />

            <View style={{
                flexDirection: 'row',
                marginTop: isIos ? 50 : 5,
                alignItems: 'center',
                marginHorizontal: isIos ? 7 : 5
            }}>
                <TouchableOpacity
                    onPress={() => props.navigation?.goBack()}
                >
                    <Imageview
                        url={Images.back}
                        style={{
                            width: isIos ? 55 : 50,
                            height: isIos ? 55 : 50
                        }}
                        imageType={"local"}
                        resizeMode={"contain"}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Textview
                        text={'FAQs'}
                        style={{
                            fontFamily: 'medium',
                            color: Colors.black,
                            textAlign: 'center',
                            fontSize: Fonts.fs_20
                        }}
                    />
                </View>
                <View style={{ height: isIos ? 55 : 50, width: isIos ? 55 : 50 }} />


            </View>
            <Textview
                text={'Top questions '}
                style={{
                    fontFamily: "medium",
                    color: Colors.black,
                    marginTop: 25,
                    fontSize: Fonts.fs_18,
                    marginHorizontal: isIos ? 12 : 10
                }}
            />

            {
                faqs?.length
                    ?
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={faqs}
                        key={Utils.generateUniqueString()}
                        style={{
                            flexGrow: 0,
                            marginTop: isIos ? 18 : 15,
                            marginHorizontal: 10,
                        }}
                        renderItem={renderItem_List}
                        keyExtractor={keyExtractor_list}
                    />

                    :
                    <NoData />
            }




        </View>
    );
}

export default FAQs;