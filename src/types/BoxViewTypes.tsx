import { ReactNode } from "react";
import { ImageSourcePropType, ViewStyle } from "react-native";

type BoxViewTypes = {
  title?: string;
  subtitle?: string;
  image?: ImageSourcePropType;
  cardStyle?: ViewStyle | Array<ViewStyle>;
  children?: ReactNode;
  bodyStyle?:  ViewStyle | Array<ViewStyle>;
  imageStyle?: any;
  titleStyle?: any;
  subtitleStyle?:any,
  cardElevation?: number;
  cornerRadius?: number;
}
 
export default BoxViewTypes;