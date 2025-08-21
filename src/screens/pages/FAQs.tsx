import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import FAQ from "../../types/FAQ";
import Utils from "../../services/Utils";
import MtToast from "../../constants/MtToast";
import PageHeader from "../../navigations/PageHeader";
import { useThemeColors } from "../../constants/useThemeColors";

const FAQs: React.FC<ScreenProps<'FAQs'>> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isIos = Platform.OS === 'ios';
    const [faqs, setFaqs] = useState<Array<FAQ>>();
    const theme = useThemeColors();

    useEffect(() => {
        fetch_faq();

    }, [])

    const fetch_faq = () => {
        setIsLoading(true);

        Request.faq((success, error) => {
            setIsLoading(false);

            if (success) {
                setFaqs(success.data.map(value => ({ ...value, status: 0 })));

            } else {
                MtToast.error(error.message)
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

            <Pressable style={{
                marginBottom: 13, flex: 1
            }}
                pressRetentionOffset={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
                onPress={() => openFAQ(item)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: theme.inputBackground,
                        paddingVertical: isIos ? 20 : 13,
                        paddingHorizontal: isIos ? 20 : 20,
                        borderRadius: 10,
                    }}>
                    <Textview
                        text={item.question}
                        style={{
                            fontFamily: Fonts.regular,
                            color: theme.text,
                            fontSize: Fonts.fs_17
                        }}

                    />

                    <Image
                        source={item.status ? Images.dropUp : Images.dropDown}
                        style={{
                            width: isIos ? 20 : 15,
                            height: isIos ? 20 : 15,
                            backgroundColor: 'transparent'
                        }}
                        resizeMode={"contain"}
                        tintColor={Colors.grey}
                    />
                </View>
                {
                    item.status
                        ?
                        <View
                            style={{
                                backgroundColor: theme.inputBackground,
                                paddingVertical: 13,
                                paddingHorizontal: isIos ? 20 : 20,
                                borderRadius: 10,
                                marginBottom: 10,
                                marginTop: 5
                            }}>

                            <Textview
                                text={item.answer}
                                style={{
                                    fontFamily: Fonts.regular,
                                    color: theme.text,
                                    fontSize: Fonts.fs_15,
                                    marginTop: isIos ? 10 : 0
                                }}

                            />

                        </View>
                        :
                        null
                }

            </Pressable>

        ), [faqs]);
    const keyExtractor_list = (item: FAQ, index: number) => index.toString();

    const styles = StyleSheet.create({
        Favcontainer: {
            flex: 1,
            backgroundColor: theme.background,
        }
    })

    return (
        <View style={styles.Favcontainer}>
            <Loader isLoading={isLoading} />

            <Textview
                text={'Top questions '}
                style={{
                    fontFamily: Fonts.regular,
                    color: theme.text,
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
                    <NoData isLoading={isLoading} />
            }




        </View>
    );
}

export default FAQs;