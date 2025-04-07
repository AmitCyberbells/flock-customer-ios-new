import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import Loader from "../../components/Loader";
import { Colors } from "../../constants/Colors";
import NoData from "../../components/NoData";
import { Offer } from "../../types/Venue";
import Request from "../../services/Request";
import OffersList from "../../components/OffersList";
import MtToast from "../../constants/MtToast";

const MyOffers: React.FC<ScreenProps<'MyOffers'>> = (props) => {

    const [offers, setOffers] = useState<Array<Offer>>([]);
    const isIos = Platform.OS === 'ios';
    const [loader, setIsLoading] = useState(false);

    useEffect(() => {
        fetch_offers();
    }, []);

    const fetch_offers = () => {
        setIsLoading(true);

        Request.redeemedOffers((success, error) => {
            setIsLoading(false);
            console.log(success, error);

            if (success) {

                let offers: Array<Offer> = [];
                success.data.map((redeemedOffer) => {
                    if (redeemedOffer.offer) {
                        offers.push(redeemedOffer.offer);
                    }
                });
                setOffers(offers);

            } else {
                MtToast.error(error.message);
            }
        });
    };
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Loader isLoading={loader} />

            {offers.length > 0 ?
                <OffersList
                    offersData={offers}
                    setLoader={setIsLoading}
                    {...props}
                    columnStyle={{ paddingHorizontal: 10 }}
                />
                : <NoData />}
        </View>
    );
}

export default MyOffers;

const style = StyleSheet.create({
    columns: {
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
});