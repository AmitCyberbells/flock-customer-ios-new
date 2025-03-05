import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
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

type TransactionListProps = {
    setLoader: (isLoading: boolean) => void,
    recordLimit?: number
}

const {height, width} = Dimensions.get('window');

const TransactionList: React.FC<TransactionListProps> = (props) => {
    const { setLoader, recordLimit } = props;
    const [transactions, setTransactions] = useState<Array<WalletLog>>([]);

    useEffect(() => {
        loadTransactions();
    }, [])

    const loadTransactions = () => {
        setLoader(true);
        const body = recordLimit ? { record_limit: recordLimit } : {};

        Request.walletLogs(body, (success, error) => {
            setLoader(false);

            if (success) {
                setTransactions(success.data);
            } else {
                Toast.show({
                    type: 'MtToastError',
                    text1: error.message,
                    position: 'bottom'
                })
            }
        })
    }

    const renderItem_transactionList = useCallback(
        ({ item, index }: { item: WalletLog, index: number }) => (
            <View>
                <View style={styles.transactionItem}>
                    <ShadowCard
                        style={styles.transactionImage}>
                        {
                            item.txn_type === 'add' ?
                                <Icon name='circle-plus' iconStyle='solid' size={40} color={Colors.primary_color_orange} /> :
                                <Icon name='circle-minus' iconStyle='solid' size={40} color={Colors.crimson} />
                        }
                    </ShadowCard>

                    <View style={styles.transactionDetails}>
                        <Textview
                            text={item?.remark || ''}
                            style={styles.transactionName}
                        />
                        <Textview
                            text={item.created_at}
                            style={styles.transactionDate}
                        />
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
            </View>
        ),
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
                <View style={{
                    height: height,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <NoData />
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
        fontFamily: 'medium',
        color: Colors.black,
        fontSize: Fonts.fs_18,
        marginHorizontal: isIos ? 17 : 15,
    },
    seeAllText: {
        fontFamily: 'regular',
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
        width: isIos ? 70 : 45,
        height: isIos ? 70 : 45,
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
        marginHorizontal: 20,
        flex: 1,
    },
    transactionName: {
        fontFamily: 'medium',
        color: Colors.black,
        fontSize: Fonts.fs_17,
    },
    transactionDate: {
        fontFamily: 'regular',
        color: Colors.grey,
        fontSize: Fonts.fs_13,
        marginTop: isIos ? 5 : 0,
    },
    transactionAmount: {
        fontFamily: 'medium',
        fontSize: Fonts.fs_16,
    },
})