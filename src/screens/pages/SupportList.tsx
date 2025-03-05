
import Loader from "../../components/Loader";
import { CSS } from "../../constants/CSS"
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const SupportList: React.FC<ScreenProps<'SupportList'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);
    const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);

    useEffect(() => {
        getSupportTickets();

    }, [])

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
                        fontFamily: "medium",
                        color: Colors.black,
                        fontSize: Fonts.fs_15
                    }}>
                    {item.title}
                </Text>

                <Text
                    style={{
                        fontFamily: "medium",
                        color: Colors.black,
                        fontSize: Fonts.fs_13

                    }} numberOfLines={4} >

                    {item.description}
                </Text>


                <Textview
                    text={item.created_at}
                    style={{
                        fontFamily: "regular",
                        color: Colors.grey,
                        textAlign: 'right',
                        marginTop: 15,
                        fontSize: Fonts.fs_12
                    }}
                />

            </ShadowCard>

        ), [supportRequests]);

    const keyExtractor_supportReq = (item: SupportRequest, index: number) => index.toString();

    return (
        <View style={CSS.Favcontainer}>
            <Loader isLoading={loader} />

            <PageHeader>
                <TouchableOpacity
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


            <View>


                {
                    supportRequests.length
                        ?
                        <FlatList
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            data={supportRequests}
                            contentContainerStyle={{ height: '100%', paddingBottom: 15, }}
                            style={{ paddingBottom: isIos ? 10 : 5, }}
                            renderItem={renderItem_supportReq}
                            keyExtractor={keyExtractor_supportReq}

                        />

                        :

                        <NoData />

                }
            </View>
        </View>
    )
}

export default SupportList;