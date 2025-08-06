import { FlatList, View, ViewProps } from "react-native";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../constants/useThemeColors";

const VirtualizedList: React.FC<ViewProps> = ({children}) => {
    const theme = useThemeColors();

    return (
        <FlatList
            data={[]}
            keyExtractor={() => "key2340"}
            renderItem={null}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View>{children}</View>
            }
            style={{
                backgroundColor: theme.background
            }}
        />
    )
}

export default VirtualizedList;