type Auth = {
    accessToken: string,
    tokenType: string,
    isLoggedIn: boolean,
    deviceToken?: string,
    notificationSubs?: boolean
    locationSubs?: boolean
}

export default Auth;