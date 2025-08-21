import { useState } from "react";
import ScreenProps from "../../types/ScreenProps";
import VirtualizedList from "../../components/VirtualizedList";
import Loader from "../../components/Loader";
import TransactionList from "../../components/TransactionList";
import { Dimensions, View } from "react-native";
import Utils from "../../services/Utils";

const TransactionHistory: React.FC<ScreenProps<'TransactionHistory'>> = (props) => {
    const [loader, setLoader] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Loader isLoading={loader} />

            <VirtualizedList>
                <View style={{ flex: 1 }}>
                    <TransactionList setLoader={setLoader} />
                </View> 
            </VirtualizedList>
        </View>
    )
}

export default TransactionHistory;
