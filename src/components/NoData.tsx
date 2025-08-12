import {Text, View} from 'react-native';
import {CSS} from '../constants/CSS';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { useThemeColors } from '../constants/useThemeColors';

type NoDataProps = {
  isLoading?: boolean
} 

const NoData: React.FC<NoDataProps> = ({isLoading}) => {
  const theme = useThemeColors();
   
  return (
    <View style={CSS.no_data_view}>
      {!isLoading && <Text
        style={{
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: theme.inputBackground,//Colors.whitesmoke,
          color: theme.text,
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