import RootStackParamList from "./RootStackParamList";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type ScreenProps<RouteName extends keyof RootStackParamList> = {
    navigation?: DrawerNavigationProp<RootStackParamList, RouteName>;
    route?: RouteProp<RootStackParamList, RouteName>;
};

export default ScreenProps;