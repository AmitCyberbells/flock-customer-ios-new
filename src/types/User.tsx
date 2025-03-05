type User = {
    first_name: string,
    last_name: string,
    email: string,
    password?: string,
    contact?: string,
    image?: string,
    dob?: string,
    location?: string,
    lat?: string,
    lon?: string,
    email_verified_at?: string,
    contact_verified_at?: string,
    last_notif_at?: string,
}

export default User;