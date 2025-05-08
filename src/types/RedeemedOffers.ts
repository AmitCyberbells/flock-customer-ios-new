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
    user?: User,
    expired_at?: string | null,
    valid_till?: string,
    confirmed?: boolean,
    coupon_code?: string
}

export default RedeemedOffers;