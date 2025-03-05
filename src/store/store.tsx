import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userReducer"
import authReducer from "./authReducer"
import locationReducer from "./locationReducer";
import walletReducer from "./walletReducer";
import User from "../types/User"
import Auth from "../types/Auth"
import Location from "../types/Location";
import { Wallet } from "../types/Wallet";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        location: locationReducer,
        wallet: walletReducer
    }
})

export type StoreStates = {
    auth: Auth,
    user: User,
    location: Location,
    wallet: Wallet
}

export type AppDispatch = typeof store.dispatch;

export default store;