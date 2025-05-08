import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import VirtualizedList from "../components/VirtualizedList";
import { isIos } from "../constants/IsPlatform";
import { useCallback, useEffect, useState } from "react";
import { WalletLog } from "../types/wallet";
import ShadowCard from "../components/ShadowCard";
import { Colors } from "../constants/Colors";
import { Fonts } from "../constants/Fonts";
import Textview from "../components/Textview";
import Icon from "@react-native-vector-icons/fontawesome6";
import Loader from "../components/Loader";
import Request from "../services/Request";
import Toast from "react-native-toast-message";
import NoData from "./NoData";
import Imageview from "./Imageview";
import Images from "../constants/Images";
import Utils from "../services/Utils";
import MtToast from "../constants/MtToast";
import { CSS } from "../constants/CSS";

type TransactionListProps = {
    setLoader: (isLoading: boolean) => void,
    recordLimit?: number,
    windowHeight?: number,
}

const TransactionList: React.FC<TransactionListProps> = (props) => {
    const { setLoader, recordLimit, windowHeight } = props;
    const [transactions, setTransactions] = useState<Array<WalletLog>>([]);
    const [loading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        loadTransactions();
    }, [])

    const loadTransactions = () => {
        setLoader(true);
        setIsLoading(true);

        const body = recordLimit ? { record_limit: recordLimit } : {};

        Request.walletLogs(body, (success, error) => {
            setLoader(false);
            setIsLoading(false);

            if (success) {
                setTransactions(success.data);
                console.log('transaction log: ', success.data)
            } else {
                MtToast.error(error.message)
            }
        })
    }

    const renderItem_transactionList = useCallback(
        ({ item, index }: { item: WalletLog, index: number }) => {
            const venue = item.checkin ? item.checkin?.venue : (item.redemption ? item.redemption.offer?.venue : null)
            const offer = item.redemption ? item.redemption.offer : null;

            return (<View>
                <View style={styles.transactionItem}>
                    <ShadowCard
                        style={styles.transactionImage}>
                        <Imageview
                            url={Images.FlockBird}
                            style={{
                                height: 40,
                                width: 40,
                            }}
                        />
                    </ShadowCard>

                    <View style={styles.transactionDetails}>
                        <Textview
                            text={item?.remark || ''}
                            style={styles.transactionName}
                            lines={2}
                        />
                        {offer ? <View style={{ marginBottom: isIos ? 5 : 3 }}><Text style={{ fontSize: Fonts.fs_13 }} numberOfLines={1}>{offer.name}</Text></View> : null}
                        {venue ? <View style={{ flexDirection: 'row', gap: isIos ? 4 : 2 }}>
                            <Image src={Images.uri(Images.VenueOffer)}
                                style={styles.pointIcon}
                            />
                            <Text style={{ fontSize: Fonts.fs_13 }} numberOfLines={1}>{venue.name}</Text>
                        </View>: null}
                        <View style={{ flexDirection: 'row', gap: 2, marginTop: isIos ? 5 : 3 }}>
                            <Icon name="clock" color={Colors.light_grey} />
                            <Text style={{ fontSize: Fonts.fs_10 }}>{item.created_at}</Text>
                        </View>

                    </View>

                    {item.txn_type === 'add' ?
                        <View>
                            <Textview
                                text={'+' + item.feather_points + ' fts'}
                                style={[
                                    styles.transactionAmount,
                                    { color: Colors.primary_color_orange },
                                ]}
                            />
                            <Textview
                                text={'+' + item.venue_points + ' pts'}
                                style={[
                                    styles.transactionAmount,
                                    { color: Colors.primary_color_orange },
                                ]}
                            />
                        </View>
                        : (item.feather_points > 0 ?
                            <Textview
                                text={'-' + item.feather_points + ' fts'}
                                style={[
                                    styles.transactionAmount,
                                    { color: Colors.crimson },
                                ]}
                            /> : <Textview
                                text={'-' + item.venue_points + ' pts'}
                                style={[
                                    styles.transactionAmount,
                                    { color: Colors.crimson },
                                ]}
                            />)
                    }
                </View>
                <View style={styles.divider} />
            </View>)
        },
        [transactions],
    );

    const keyExtractor_transactionList = (item: WalletLog, index: number) => index.toString();

    return (
        <View style={{ flex: 1 }}>
            {transactions.length > 0 ?
                <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={transactions}
                    nestedScrollEnabled={false}
                    style={styles.transactionsList}
                    renderItem={renderItem_transactionList}
                    keyExtractor={keyExtractor_transactionList}
                /> :
                <View style={{ height: windowHeight ?? Utils.DEVICE_HEIGHT - 100 }}>
                    <NoData isLoading={loading} />
                </View>
            }
        </View>
    )
}

export default TransactionList;

const styles = StyleSheet.create({
    divider: {
        borderColor: Colors.grey,
        borderWidth: isIos ? 0.6 : 0.3,
        marginVertical: isIos ? 10 : 5,
    },
    transactionsList: {
        flexGrow: 0,
        marginTop: isIos ? 18 : 15,
        marginHorizontal: 10,
        marginBottom: isIos ? 80 : 85,
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isIos ? 20 : 15,
    },
    transactionsTitle: {
        fontFamily: Fonts.medium,
        color: Colors.black,
        fontSize: Fonts.fs_18,
        marginHorizontal: isIos ? 17 : 15,
    },
    seeAllText: {
        fontFamily: Fonts.regular,
        color: Colors.light_grey,
        fontSize: Fonts.fs_14,
        marginHorizontal: isIos ? 17 : 15,
    },
    transactionItem: {
        marginVertical: 10,
        flexDirection: 'row',
        marginHorizontal: isIos ? 5 : 2,
        alignItems: 'center',
    },
    transactionImage: {
        backgroundColor: Colors.white,
        width: 45,
        height: 45,
        padding: 2,
        borderRadius: 100,
        justifyContent: 'center',
    },
    transactionAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    transactionDetails: {
        marginHorizontal: 10,
        flex: 1,
    },
    transactionName: {
        fontFamily: Fonts.medium,
        color: Colors.black,
        fontSize: Fonts.fs_14,
    },
    transactionDate: {
        fontFamily: Fonts.regular,
        color: Colors.grey,
        fontSize: Fonts.fs_13,
        marginTop: isIos ? 5 : 0,
    },
    transactionAmount: {
        fontFamily: Fonts.medium,
        fontSize: Fonts.fs_16,
    },
    pointIcon: {
        width: isIos ? 20 : 20,
        height: isIos ? 17 : 15
    }
})