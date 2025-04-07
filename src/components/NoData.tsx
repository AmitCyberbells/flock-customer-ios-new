import {Dimensions, Text, View} from 'react-native';
import Imageview from './../components/Imageview';
import Images from '../constants/Images';
import {CSS} from '../constants/CSS';
const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');

type NoDataProps = {
  isLoading?: boolean
} 

const NoData: React.FC<NoDataProps> = ({isLoading}) => {
  return (
    <View style={CSS.no_data_view}>
      {!isLoading && <Imageview
        style={{
          width: 250,
          height: 250
        }}
        imageType={'local'}
        url={Images.no_data}
      />}
    </View>
  );
};

export default NoData;
