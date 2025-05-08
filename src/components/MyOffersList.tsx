import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import ScreenProps from "../types/ScreenProps";
import RootStackParamList from "../types/RootStackParamList";
import OfferItem from "./OfferItem";
import { Offer } from "../types/Venue";
import { useEffect, useState } from "react";
import RedeemOfferDialog from "./RedeemOfferDialog";
import Toast from "react-native-toast-message";
import Request from "../services/Request";
import OfferRedeemBy from "../types/RedeemBy";
import MtToast from "../constants/MtToast";
import WalletService from "../services/WalletService";
import RedeemedOffers from "../types/RedeemedOffers";
import MyOfferItem from "./MyOfferItem";

type MyOffersListProps = {
    offersData: Array<RedeemedOffers>,
    columnStyle?: StyleProp<ViewStyle>,
    setLoader: (isLoading: boolean) => void
} & ScreenProps<keyof RootStackParamList>;

const MyOffersList: React.FC<MyOffersListProps> = (props) => {
    const { offersData, setLoader, columnStyle } = props;
    const [offers, setOffers] = useState<Array<RedeemedOffers>>(offersData);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer>();
    const {updateWalletBalances} = WalletService();

    useEffect(() => {
        updateWalletBalances();

    }, [offers])

    return (
        <View>
            <FlatList
                horizontal={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={[style.columns, columnStyle]}
                style={{
                    marginTop: 10
                }}
                data={offers}
                renderItem={({ item }) => (
                    <MyOfferItem
                        redeemedOffer={item}
                        onLoader={setLoader}

                        {...props}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />

        </View>
    )
}

export default MyOffersList;

const style = StyleSheet.create({
    columns: {
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        paddingVertical: 5,
        gap: 10
    },
});
