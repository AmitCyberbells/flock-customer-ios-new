import { View } from 'react-native';
import ScreenProps from '../../../types/ScreenProps';
import Venue from '../../../types/Venue';
import Textview from '../../../components/Textview';
import { Fonts } from '../../../constants/Fonts';
import { Colors } from '../../../constants/Colors';

import OffersList from '../../../components/OffersList';
import RootStackParamList from '../../../types/RootStackParamList';
import NoData from '../../../components/NoData';

type VenueOfferProps = {
  venue: Venue,
  setLoader: (isLoading: boolean) => void
}

const VenueOffers: React.FC<
  ScreenProps<keyof RootStackParamList> & VenueOfferProps
> = props => {

  const { offers } = props.venue;

  return (
    <View>

      <Textview
        text={offers?.length + ' Active offers'}
        style={{
          fontFamily: Fonts.android_medium,
          color: Colors.grey,
          fontSize: Fonts.fs_12,
          marginTop: 15,
        }}
      />
      <View>
        {(offers?.length || 0) > 0 ?
          <OffersList offersData={offers || []} {...props} /> :
          <NoData />
        }
      </View>


    </View>
  );
};

export default VenueOffers;