type Location = {
    latitude: number,
    longitude: number,
    latitudeDelta?: number,
    longitudeDelta?: number,
    location?: string,
    radius?: number,
    canReset?: boolean,
    current?: boolean // is it user's current location
}

export interface GoogleLocation {
    address: string;
    name: string;
    coordinates?: { lat: number; lng: number }
}

export default Location;