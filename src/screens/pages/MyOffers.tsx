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
import MyOffersList from "../../components/MyOffersList";
import RedeemedOffers from "../../types/RedeemedOffers";

const MyOffers: React.FC<ScreenProps<'MyOffers'>> = (props) => {

    const [offers, setOffers] = useState<Array<RedeemedOffers>>([]);
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
                setOffers(success.data);

            } else {
                MtToast.error(error.message);
            }
        });
    };
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Loader isLoading={loader} />

            {offers.length > 0 ?
                <MyOffersList
                    offersData={offers}
                    setLoader={setIsLoading}
                    {...props}
                    columnStyle={{ paddingHorizontal: 10 }}
                />
                : <NoData isLoading={loader}/>}
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