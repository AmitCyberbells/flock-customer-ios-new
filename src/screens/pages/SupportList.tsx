
import Loader from "../../components/Loader";
import { CSS } from "../../constants/CSS"
import { FlatList, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PageHeader from "../../navigations/PageHeader";
import ScreenProps from "../../types/ScreenProps";
import { useCallback, useEffect, useState } from "react";
import Imageview from "../../components/Imageview";
import Images from "../../constants/Images";
import { isIos } from "../../constants/IsPlatform";
import SupportRequest from "../../types/SupportRequest";
import { Colors } from "../../constants/Colors";
import ShadowCard from "../../components/ShadowCard";
import { Fonts } from "../../constants/Fonts";
import Request from "../../services/Request";
import MtToast from "../../constants/MtToast";
import Textview from "../../components/Textview";
import NoData from "../../components/NoData";
import Utils from "../../services/Utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../constants/useThemeColors";

const SupportList: React.FC<ScreenProps<'SupportList'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);
    const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
    const theme = useThemeColors();

    useEffect(() => {
        const unsubscribe = props.navigation?.addListener('focus', () => {
            getSupportTickets();
        });

        return unsubscribe;
    }, [props.navigation]);

    const getSupportTickets = () => {
        setLoader(true);

        Request.supportTickets((success, error) => {
            setLoader(false);

            if (success) {
                setSupportRequests(success.data)
            } else {
                MtToast.error(error.message);
            }
        })
    }

    const addSupportRequest = () => {
        props.navigation?.navigate('SupportForm');
    }

    const renderItem_supportReq = useCallback(
        ({ item, index }: { item: SupportRequest, index: number }) => (

            <Pressable onPress={() => props.navigation?.navigate('SupportTicket', { ticket_id: item.id })}>
                <ShadowCard
                    style={{
                        backgroundColor: Colors.white,
                        marginHorizontal: 15,
                        marginTop: 20,
                        paddingVertical: 8,
                        paddingHorizontal: 15
                    }}
                >

                    <Text
                        style={{
                            fontFamily: Fonts.medium,
                            color: Colors.black,
                            fontSize: Fonts.fs_15
                        }}>
                        {item.title}
                    </Text>

                    <Text
                        style={{
                            fontFamily: Fonts.medium,
                            color: Colors.black,
                            fontSize: Fonts.fs_13

                        }} numberOfLines={4} >

                        {item.description}
                    </Text>


                    <Textview
                        text={item.created_at}
                        style={{
                            fontFamily: Fonts.regular,
                            color: Colors.grey,
                            textAlign: 'right',
                            marginTop: 15,
                            fontSize: Fonts.fs_12
                        }}
                    />

                </ShadowCard>
            </Pressable>

        ), [supportRequests]);

    const keyExtractor_supportReq = (item: SupportRequest, index: number) => index.toString();


    const styles = StyleSheet.create({
        Favcontainer: {
            flex: 1,
            backgroundColor: theme.background,
        },
    })

    return (
        <View style={styles.Favcontainer}>
            <Loader isLoading={loader} />

            <PageHeader
                showBackButton={true}
                title="Support"
                {...props}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={addSupportRequest}
                >
                    <Imageview
                        url={Images.add}
                        style={{
                            width: isIos ? 55 : 50,
                            height: isIos ? 55 : 50
                        }}
                        imageType={"local"}
                        resizeMode={"contain"}
                    />
                </TouchableOpacity>
            </PageHeader>


            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
                {
                    supportRequests.length
                        ?
                        <FlatList
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            data={supportRequests}
                            contentContainerStyle={{ paddingBottom: 15, }}
                            style={{ paddingBottom: isIos ? 10 : 5, }}
                            renderItem={renderItem_supportReq}
                            keyExtractor={keyExtractor_supportReq}

                        />

                        :
                        <View style={{ height: (Utils.DEVICE_HEIGHT - 250) }}>
                            <NoData isLoading={loader} />
                        </View>

                }
            </SafeAreaView>
        </View>
    )
}

export default SupportList;