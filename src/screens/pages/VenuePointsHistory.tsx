import { useCallback, useEffect, useState } from "react";
import ScreenProps from "../../types/ScreenProps";
import Loader from "../../components/Loader";
import { Dimensions, FlatList, Text, View } from "react-native";
import Utils from "../../services/Utils";
import Request from "../../services/Request";
import VenuePointsHistoryType from "../../types/VenuePointsHistoryType";
import MtToast from "../../constants/MtToast";
import NoData from "../../components/NoData";
import ShadowCard from "../../components/ShadowCard";
import { Colors } from "../../constants/Colors";
import { isIos } from "../../constants/IsPlatform";
import Imageview from "../../components/Imageview";
import { Fonts } from "../../constants/Fonts";
import Icon from "@react-native-vector-icons/fontawesome6";
import Images from "../../constants/Images";
import PageHeader from "../../navigations/PageHeader";

type VenueHistoryProps = {
} & ScreenProps<'VenuePointsHistory'>;

const VenuePointsHistory: React.FC<VenueHistoryProps> = (props) => {
    const { route } = props;
    const rewardType = route?.params.rewardType || 'venue_points';

    const [loader, setLoader] = useState(false);
    const [transactions, setTransactions] = useState<VenuePointsHistoryType[]>([]);

    useEffect(() => {

        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoader(true);

        try {
            Request.venuePointsHistory((success, error) => {
                setLoader(false)
                if (success) {
                    console.log(success.data)
                    setTransactions(success.data);

                } else {
                    MtToast.error(error.message);
                }
            });

        } catch (error) {
            setLoader(false);
            console.error("Error fetching transactions:", error);
        }
    };

    const renderItem_List = useCallback(
        ({ item, index }: { item: VenuePointsHistoryType, index: number }) => (

            <ShadowCard style={{
                backgroundColor: Colors.white,
                paddingHorizontal: isIos ? 10 : 7,
                paddingVertical: isIos ? 10 : 7,
                //height: Utils.DEVICE_HEIGHT * 21.5 / 100,
                marginBottom: isIos ? 10 : 5,
                marginTop: isIos ? 10 : 5,
                marginHorizontal: isIos ? 17 : 15,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{
                        width: 70, height: 70, justifyContent: 'center',
                        alignItems: 'center', backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 5
                    }}>

                        {item.venue_image ? <Imageview
                            url={item.venue_image}
                            style={{
                                width: 68,
                                height: 68
                            }}
                            imageType={"local"}
                            resizeMode={"contain"}
                        />: null}

                    </View>

                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text
                            style={{
                                fontFamily: Fonts.medium,
                                color: Colors.black,
                                fontSize: Fonts.fs_17
                            }}
                        >{item.venue_name}</Text>
                        <Text
                            style={{
                                fontFamily: Fonts.regular,
                                color: Colors.light_grey,
                                fontSize: Fonts.fs_13,
                                marginTop: isIos ? 10 : 2
                            }}
                        >{item.venue_location}</Text>

                    </View>

                </View>

                <View style={{ borderColor: Colors.light_grey, borderWidth: isIos ? 0.6 : 0.3, marginTop: 12, }} />

                <View style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: isIos ? 10 : 7 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                        <Icon name='circle-check' color={Colors.primary_color_orange} iconStyle="solid" size={isIos ? 40 : 30} />

                        <View style={{ paddingHorizontal: 10 }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.light_grey,
                                    fontSize: Fonts.fs_12,
                                    marginBottom: isIos ? 5 : 0
                                }}
                            >{'Available'}</Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.black,
                                    fontSize: Fonts.fs_17,
                                    marginTop: isIos ? 2 : 0
                                }}
                            >{rewardType === 'feather_points' ? (item.earned_feather_points - item.spent_feather_points).toString() : (item.earned_venue_points - item.spent_venue_points).toString()}</Text>
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
                            <Text
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.light_grey,
                                    fontSize: Fonts.fs_12,
                                    marginTop: isIos ? 5 : 0
                                }}
                            >{'Last Spent'}</Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.medium,
                                    color: Colors.black,
                                    fontSize: Fonts.fs_17,
                                    marginTop: isIos ? 2 : 0
                                }}

                            >{rewardType === 'feather_points' ? item.spent_feather_points.toString() : item.spent_venue_points.toString()}</Text>
                        </View>
                    </View>

                </View>

            </ShadowCard>

        ), [transactions]);

    const keyExtractor_list = (item: VenuePointsHistoryType, index: number) => index.toString();


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <PageHeader
              {...props}
              title={(rewardType === 'feather_points' ? 'Feathers' : 'Venue Points') + " History"}
              showBackButton
              backgroundColor={Colors.white}
              titleStyle={{
                fontSize: Fonts.fs_18
              }}
            />

            <Loader isLoading={loader} />

            <View style={{ flex: 1 }}>
                {transactions.length > 0 ? <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={transactions}
                    style={{ flexGrow: 0, }}
                    renderItem={renderItem_List}
                    keyExtractor={keyExtractor_list}
                /> :
                    <View style={{ height: Utils.DEVICE_HEIGHT / 2 }}>
                        <NoData isLoading={loader} />
                    </View>

                }
            </View>
        </View>
    )
}

export default VenuePointsHistory;
