import { useDispatch } from "react-redux";
import Request from "./Request";
import MtToast from "../constants/MtToast";
import { updateWallet } from "../store/walletReducer";

const WalletService = () => {
    const dispatch = useDispatch();

    const updateWalletBalances = async (setLoader?: (isLoading: boolean) => void) => {
        if (setLoader) {
            setLoader(true);
        }
        Request.walletBalances((success, error) => {
            if (success) {
                dispatch(updateWallet(success.data));
            } else {
                MtToast.error('Update Balance: '+error.message)
            }

            if (setLoader) {
                setLoader(false);
            }
        })
    }

    return { updateWalletBalances }
}

export default WalletService;