import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { Offer } from '../../types/Venue';
import Loader from '../../components/Loader';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import NoData from '../../components/NoData';
import OffersList from '../../components/OffersList';
import MtToast from '../../constants/MtToast';
import { useThemeColors } from '../../constants/useThemeColors';

const SavedOffers: React.FC<ScreenProps<'SavedOffers'>> = props => {
  const [offers, setOffers] = useState<Array<Offer>>([]);
  const [loader, setIsLoading] = useState(false);
  const theme = useThemeColors();

  useEffect(() => {
    fetch_offers();
  }, []);

  const fetch_offers = () => {
    setIsLoading(true);

    Request.savedOffers((success, error) => {
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
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Loader isLoading={loader} />

      {offers.length > 0 ?
        <OffersList
          offersData={offers}
          {...props}
          setLoader={setIsLoading}
          columnStyle={{paddingHorizontal: 10}}
        />
        : <NoData isLoading={loader} />}
    </View>
  );
};

export default SavedOffers;