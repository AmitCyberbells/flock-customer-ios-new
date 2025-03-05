import Category from "./Category";
import Venue from "./Venue";

export type OtpParams = {
    screenType: keyof RootStackParamList,
    verifyEmail: boolean,
    verifyPhone: boolean,
    email?: string,
    contact?: string
}

export type WebPageParams = {
    link: string,
    title: string
}

type RootStackParamList = {
    Login: undefined,
    Register: undefined,
    Otp: OtpParams,
    ForgotPassword: undefined,
    ResetPassword: {
        email?: string
    },
    TermsConditionsWebview: undefined,
    Tabs: undefined,
    QrScanner: {
        venue?: Venue,
        action?: 'checkin'
    } | undefined,
    MyOffers: undefined,
    FAQs: undefined,
    Report: undefined,
    SavedOffers: undefined,
    Tutorials: {
        openLink?: boolean
    },
    VenueRequest: undefined,
    Venues: {
        selected_category?: number,
        categories?: Array<Category>
    },
    VenueDetails: {
        venue_id: number
    },
    Map: {
        venues: Array<Venue>
    } | undefined,
    VideoPlayer: {
        link: string,
        title?: string
    },
    WebPage: WebPageParams,
    ChangePassword: undefined,
    HotVenues: undefined,
    QrPreview: {
        data: string
    },
    EditProfile: undefined,
    TransactionHistory: undefined,
    DeleteAccount: undefined,
    SupportList: undefined,
    SupportForm: undefined
};

export default RootStackParamList;