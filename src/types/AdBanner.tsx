import Venue from "./Venue"

type AdBanner = {
    venue: Venue,
    title: string,
    description: string, 
    image: string,
    status: number,
    position: number
}

export default AdBanner;