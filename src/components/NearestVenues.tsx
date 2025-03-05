import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import Venue, { NearestVenue } from "../types/Venue";
import { useCallback, useEffect, useState } from "react";
import Textview from "./Textview";
import { Fonts } from "../constants/Fonts";
import Imageview from "./Imageview";
import Images from "../constants/Images";
import { Colors } from "../constants/Colors";
import MapView, { Marker, Region } from "react-native-maps";
import Utils from "../services/Util";
import { Environment } from "../../env";
import { isIos } from "../constants/IsPlatform";

type NearestVenuesProps = {
    venue: Venue
}

const NearestVenues: React.FC<NearestVenuesProps> = (props) => {

    const { venue } = props;
    const [nearestVenues, setNearestVenues] = useState<Array<NearestVenue>>(venue.nearest_venues || []);
    const { area: AREA_ZOOM } = Environment.Location.Zoom;
    const [mapKey, setMapKey] = useState<string>();
    const [region, setRegion] = useState<Region>();

    useEffect(() => {
        setMapKey(Utils.generateUniqueString())
        setRegion({
            latitude: parseFloat(venue.lat),
            longitude: parseFloat(venue.lon),
            latitudeDelta: AREA_ZOOM.lat,
            longitudeDelta: AREA_ZOOM.lon,
        })
    }, [])

    const toggleNearestVenueList = () => {
        setNearestVenues(prev => venue.nearest_venues?.filter((v, i) => i <= (prev.length > 2 ? 1 : (venue.nearest_venues?.length || 1) - 1)) || [])
    }

    const openExternalMap = () => {
        const { lat, lon, name } = venue;
        const scheme = isIos ? 'maps:' : 'geo:';
        const query = isIos
            ? `daddr=${lat},${lon}&dirflg=d`
            : `?q=${lat},${lon}(${name})&mode=d`;

        const url = scheme + (isIos ? '?' : '') + query;
        Linking.openURL(url);
    }

    const renderItem_nearestVenue = useCallback(
        ({ item, index }: { item: NearestVenue, index: number }) => (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: isIos ? 10 : 5,
            }}>
                <Textview
                    text={item.name}
                    style={{
                        fontFamily: 'regular',
                        color: '#616161',
                        fontSize: Fonts.fs_15,
                        flex: 1,
                        maxWidth: '70%'
                    }}
                    lines={1}
                />
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Textview
                        text={item.distance.toFixed(3) + 'km'}
                        style={{
                            fontFamily: 'regular',
                            color: '#103E5B',
                            fontSize: Fonts.fs_12
                        }}
                        lines={1}
                    />
                    <Imageview
                        url={Images.directionArrow}
                        style={{
                            width: isIos ? 20 : 15,
                            height: isIos ? 20 : 15,
                            marginLeft: 10
                        }}
                        imageType={"local"}
                        resizeMode={"cover"}
                    />
                </View>
            </View>
        ), [venue.nearest_venues]);

    const keyExtractor_nearestVenue = (item: NearestVenue, index: number) => index.toString();

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Textview
                    text={'Nearby Spots'}
                    style={{
                        fontSize: Fonts.fs_15,
                        color: Colors.black,
                        fontFamily: Fonts.android_medium,
                        marginTop: isIos ? 25 : 18,
                    }}
                />

                <TouchableOpacity onPress={openExternalMap}>
                    <Imageview
                        style={{
                            width: isIos ? 15 : 20,
                            height: isIos ? 15 : 20,
                            marginTop: isIos ? 25 : 20,
                        }}
                        imageType={'local'}
                        url={Images.location}
                        tintColor={Colors.black}
                    />
                </TouchableOpacity>
            </View>

            <MapView
                key={mapKey}
                showsUserLocation
                style={{
                    height: 225,
                    width: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginTop: 15,
                }}
                initialRegion={region}>
                {
                    venue && (
                        <Marker
                            coordinate={{
                                latitude: parseFloat(venue.lat),
                                longitude: parseFloat(venue.lon),
                            }}
                            title={venue.name}
                            pinColor={Colors.primary_color_orange}></Marker>
                    )
                }
                {venue.nearest_venues?.length ? (
                    <View>
                        {venue.nearest_venues.map((nearestVenue, index) => {
                            return (
                                <Marker
                                    key={Utils.generateUniqueString() + index}
                                    coordinate={{
                                        latitude: parseFloat(nearestVenue.lat),
                                        longitude: parseFloat(nearestVenue.lon),
                                    }}
                                    title={nearestVenue.name}
                                    pinColor={Colors.primary_color_orange}></Marker>
                            );
                        })}
                    </View>
                ) : null}
            </MapView>


            <FlatList
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={nearestVenues}
                style={{ marginVertical: 13 }}
                renderItem={renderItem_nearestVenue}
                keyExtractor={keyExtractor_nearestVenue}
            />

            {
                (venue.nearest_venues?.length || 0) > 2 ?
                    <TouchableOpacity onPress={() => toggleNearestVenueList()} style={{ flex: 1 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: Fonts.fs_15,
                                    color: Colors.light_blue,
                                    fontFamily: Fonts.android_regular,
                                }}>
                                {'See all'}
                            </Text>
                            <Imageview
                                style={{
                                    marginLeft: 5,
                                    width: isIos ? 15 : 12,
                                    height: isIos ? 15 : 12,
                                }}
                                imageType={'local'}
                                url={nearestVenues.length <= 1 ? Images.blueDropdown : Images.dropUp}
                                resizeMode={'contain'}
                                tintColor={Colors.light_blue}
                            />
                        </View>
                    </TouchableOpacity>
                    : null
            }
        </View>
    )
}

export default NearestVenues;
