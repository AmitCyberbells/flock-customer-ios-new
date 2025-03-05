import { FlatList, View, ViewProps } from "react-native";
import { Colors } from "../constants/Colors";

const VirtualizedList: React.FC<ViewProps> = ({children}) => {
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
                backgroundColor: Colors.white
            }}
        />
    )
}

export default VirtualizedList;