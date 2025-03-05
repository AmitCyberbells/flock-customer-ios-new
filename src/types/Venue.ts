import Category from "./Category"
import User from "./User"

type Venue = {
    id: number,
    user_id: number,
    user: User, 
    name: string, 
    description: string, 
    suburb: string, 
    location: string, 
    lat: string, 
    lon: string, 
    feather_points: number, 
    venue_points: number, 
    status: number, 
    images: Array<Imageable>, 
    notice?: string,
    tags?: Array<Tag>,
    amenities: Array<Amenity>,
    categories: Array<Category>,
    offers?: Array<Offer>,
    checkins?: Array<Checkin>,
    favourite?: any,
    boosted?: any,
    opening_hours?: Array<OpeningHour>,
    distance?: number // distance from user current location
    checkins_count?: number,
    checkedin_count?: number,
    nearest_venues?: Array<NearestVenue>
}

export type NearestVenue = {
    id: number,
    venue_id: number,
    name: string,
    location: string,
    lat: string,
    lon: string,
    distance: number
}

type VenueSummary = Pick<Venue, 'id' | 'user_id' | 'name' | 'location' | 'lat' | 'lon'>;


export type OpeningHour = {
    id: number,
    start_day: string,
    end_day: string,
    start_time: string,
    end_time: string,
    status: number
}

export type Offer = {
    id: number,
    name: string,
    description: string,
    venue_id: number,
    redeem_by: string,
    feather_points: number,
    venue_points: number,
    images: Array<Imageable>,
    status: number,
    redeemed: any,
    favourite: any,
    venue?: VenueSummary
}

export type Amenity = {
    id: number,
    name: string,
    icon: string,
    status: number
}

export type Checkin = {
    venue_id: number,
    user_id: number,
    feather_points: number,
    venue_points: number,
    user?: User,
    venue?: Venue
}

export type Tag = {
    name: string,
    slug: string,
    status: number
}

export type Imageable = {
    file_name: string
}

export default Venue;