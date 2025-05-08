export type Wallet = {
    user_id?: number,
    earned_feather_points: number,
    earned_venue_points: number,
    spent_feather_points: number,
    spent_venue_points: number,
    balance_feather_points: number,
    balance_venue_points: number,
    venue_wallets?: Array<VenueWallet>
}

type VenueWallet = {
    user_id?: number,
    vendor_id: number, 
    earned_venue_points: number,
    spent_venue_points: number,
    balance_venue_points: number,
}

export type WalletLog = {
    user_id: number ,
    txn_type: WalletTxnType,
    last_feather_points: number ,
    last_venue_points: number ,
    feather_points: number ,
    venue_points: number ,
    updated_feather_points: number ,
    updated_venue_points: number ,
    remark?: string ,
    payload?: any,
    created_at: string,
    checkin?: any,
    redemption?: any
}

export type WalletTxnType = 'add' | 'minus';