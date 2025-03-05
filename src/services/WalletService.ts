import { useDispatch } from "react-redux";
import Request from "./Request";
import MtToast from "../constants/MtToast";
import { updateWallet } from "../store/walletReducer";

const WalletService = () => {
    const dispatch = useDispatch();

    const updateWalletBalances = async () => {
        Request.walletBalances((success, error) => {
            if (success) {
                dispatch(updateWallet(success.data));
            } else {
                MtToast.error(error.message)
            }
        })
    }

    return { updateWalletBalances }
}

export default WalletService;