import OfferRedeemBy from "./RedeemBy";
import User from "./User";
import { Offer } from "./Venue";

type RedeemedOffers = {
    id?: number,
    offer_id: number, 
    user_id: number, 
    redeemed_by: OfferRedeemBy, 
    points: number,
    offer?: Offer,
    user?: User
}

export default RedeemedOffers;