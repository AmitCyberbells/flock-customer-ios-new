import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import ScreenProps from "../types/ScreenProps";
import RootStackParamList from "../types/RootStackParamList";
import OfferItem from "./OfferItem";
import { Offer } from "../types/Venue";
import { useEffect, useState } from "react";
import RedeemOfferDialog from "./RedeemOfferDialog";
import Request from "../services/Request";
import OfferRedeemBy from "../types/RedeemBy";
import MtToast from "../constants/MtToast";
import WalletService from "../services/WalletService";
import RedeemedOffers from "../types/RedeemedOffers";
import RedeemOfferSuccess from "./RedeemSuccess";

type OffersListProps = {
    offersData: Array<Offer>,
    columnStyle?: StyleProp<ViewStyle>,
    setLoader: (isLoading: boolean) => void
} & ScreenProps<keyof RootStackParamList>;

const OffersList: React.FC<OffersListProps> = (props) => {
    const { offersData, setLoader, columnStyle } = props;
    const [offers, setOffers] = useState<Array<Offer>>(offersData);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer>();
    const {updateWalletBalances} = WalletService();

    useEffect(() => {
        updateWalletBalances();

    }, [offers])

    const showRedeemDialog = (offer: Offer) => {
        setSelectedOffer(offer);
        setModalVisible(true);
    }

    const redeemOffer = (redeemBy: OfferRedeemBy) => {
        setModalVisible(false);
        setLoader(true);

        if (!selectedOffer) {
            return MtToast.error('Please select offer first!');
        }

        Request.redeemOffer(
            { offer_id: selectedOffer.id, redeem_by: redeemBy },
            (success, error) => {
                setLoader(false);

                if (success) {
                    // show success dialog
                    MtToast.success(success.message);
                    const redeemedOffer: RedeemedOffers = success.data;

                    const updatedOffer = {
                        ...selectedOffer,
                        redeemed: selectedOffer.redeemed ? [...selectedOffer.redeemed, redeemedOffer] : [redeemedOffer],
                        last_redeem: redeemedOffer
                    };

                    setOffers(prevOffers =>
                        prevOffers.map(offer =>
                            offer.id === updatedOffer.id ? updatedOffer : offer,
                        ),
                    );
                    
                } else {

                    MtToast.error(error.message);
                }
            })

    }

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
                extraData={offers}
                renderItem={({ item }) => (
                    <OfferItem
                        offer={item}
                        onToggleOffer={updatedOffer => {
                            setOffers(prevOffers =>
                                prevOffers.map(offer =>
                                    offer.id === updatedOffer.id ? updatedOffer : offer,
                                ),
                            );
                        }}
                        redeemOffer={() => showRedeemDialog(item)}
                        onLoader={setLoader}

                        {...props}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <RedeemOfferDialog
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                offer={selectedOffer}
                onRedeem={redeemOffer}
            />

            {/* <RedeemOfferSuccess /> */}
        </View>
    )
}

export default OffersList;

const style = StyleSheet.create({
    columns: {
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        paddingVertical: 5,
        gap: 10
    },
});
