import {Dimensions, Text, View} from 'react-native';
import Imageview from './../components/Imageview';
import Images from '../constants/Images';
import {CSS} from '../constants/CSS';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');

type NoDataProps = {
  isLoading?: boolean
} 

const NoData: React.FC<NoDataProps> = ({isLoading}) => {
  return (
    <View style={CSS.no_data_view}>
      {!isLoading && <Text
        style={{
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: Colors.whitesmoke,
          color: Colors.black,
          borderRadius: 20,
          overflow: 'hidden',
          fontSize: Fonts.fs_14,
          alignSelf: 'center'
        }}
      >{'No Data Found!'}</Text>}
    </View>
  );
};

export default NoData;

/* {!isLoading && <Imageview
        style={{
          width: 250,
          height: 250
        }}
        imageType={'local'}
        url={Images.no_data}
      />} */