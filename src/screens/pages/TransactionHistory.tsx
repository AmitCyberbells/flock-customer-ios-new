import { useState } from "react";
import ScreenProps from "../../types/ScreenProps";
import VirtualizedList from "../../components/VirtualizedList";
import Loader from "../../components/Loader";
import TransactionList from "../../components/TransactionList";
import { View } from "react-native";


const TransactionHistory: React.FC<ScreenProps<'TransactionHistory'>> = (props) => {
    const [loader, setLoader] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Loader isLoading={loader} />

            <VirtualizedList>

                <TransactionList setLoader={setLoader} />
            </VirtualizedList>
        </View>
    )
}

export default TransactionHistory;
