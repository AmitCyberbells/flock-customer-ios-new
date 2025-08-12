import { FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import Venue, { NearestVenue } from "../types/Venue";
import { useCallback, useEffect, useState } from "react";
import Textview from "./Textview";
import { Fonts } from "../constants/Fonts";
import Imageview from "./Imageview";
import Images from "../constants/Images";
import { Colors } from "../constants/Colors";
import MapView, { Marker, Region } from "react-native-maps";
import Utils from "../services/Utils";
import { Environment } from "../../env";
import { isIos } from "../constants/IsPlatform";
import { useThemeColors } from "../constants/useThemeColors";

type NearestVenuesProps = {
    venue: Venue
}

const NearestVenues: React.FC<NearestVenuesProps> = (props) => {

    const { venue } = props;
    const [nearestVenues, setNearestVenues] = useState<Array<NearestVenue>>(venue.nearest_venues || []);
    const { area: AREA_ZOOM } = Environment.Location.Zoom;
    const [region, setRegion] = useState<Region>();
    const [toggleNearest, setToggleNearest] = useState<boolean>(false);
    const theme = useThemeColors();

    useEffect(() => {
        toggleNearestVenueList();
        setRegion({
            latitude: parseFloat(venue.lat),
            longitude: parseFloat(venue.lon),
            latitudeDelta: AREA_ZOOM.lat,
            longitudeDelta: AREA_ZOOM.lon,
        })

        console.log('nearest venues >>>>', venue.nearest_venues?.length)
    }, [])

    const toggleNearestVenueList = () => {
        let toggledVenues = venue.nearest_venues?.filter((v, i) => i <= (nearestVenues.length > 2 ? 1 : (venue.nearest_venues?.length || 1) - 1)) || [];

        setNearestVenues(prev => venue.nearest_venues?.filter((v, i) => i <= (prev.length > 2 ? 1 : (venue.nearest_venues?.length || 1) - 1)) || [])
        setToggleNearest(!toggleNearest);

        //console.log({ toggledVenues })
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
                    text={(item.name?.length || 0) > 30 ? item.name.substring(0, 30) + '...' : item.name}
                    style={{
                        fontFamily: Fonts.regular,
                        color: theme.muteText,
                        fontSize: Fonts.fs_15,
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
                            fontFamily: Fonts.regular,
                            color: theme.muteText,
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
                        tintColor={theme.cyanBlueIcon}
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
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Textview
                    text={'Nearby Spots'}
                    style={{
                        fontSize: Fonts.fs_15,
                        color: theme.text,
                        fontFamily: Fonts.medium,
                        marginTop: isIos ? 25 : 18,
                    }}
                />
                <Textview
                    text={' (Within 5 kms)'}
                    style={{
                        fontSize: Fonts.fs_13,
                        color: theme.muteText,
                        fontFamily: Fonts.medium,
                        marginTop: isIos ? 25 : 18,
                    }}
                />
                </View>

                <TouchableOpacity onPress={openExternalMap} activeOpacity={0.9}>
                    <Imageview
                        style={{
                            width: isIos ? 15 : 22,
                            height: isIos ? 15 : 22,
                            marginTop: isIos ? 25 : 20
                        }}
                        imageType={'local'}
                        url={Images.location}
                        tintColor={Colors.black}
                    />
                </TouchableOpacity>
            </View>

            <MapView
                key={`${venue.name}-${venue.id}`}
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
                    (venue && venue.lat != null && venue.lon != null) ? (
                        <Marker
                            coordinate={{
                                latitude: parseFloat(venue.lat),
                                longitude: parseFloat(venue.lon),
                            }}
                            title={venue.name}
                            pinColor={Colors.primary_color_orange}></Marker>
                    ) : null
                }
                {Array.isArray(venue.nearest_venues) && venue.nearest_venues?.length ? (
                    venue.nearest_venues
                        .filter(item => item && Utils.isValidGeoRange(item.lat, item.lon))
                        .map((nearestVenue, index) => {
                            return (
                                <Marker
                                    key={`${nearestVenue.name}-${index}`}
                                    coordinate={{
                                        latitude: parseFloat(nearestVenue.lat),
                                        longitude: parseFloat(nearestVenue.lon),
                                    }}
                                    title={nearestVenue.name}
                                    pinColor={Colors.primary_color_orange}></Marker>
                            );
                        })
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
                    <TouchableOpacity onPress={() => toggleNearestVenueList()} style={{ flex: 1 }} activeOpacity={0.9}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: Fonts.fs_15,
                                    color: theme.blueFont,
                                    fontFamily: Fonts.regular,
                                }}>
                                {toggleNearest ? 'See all' : 'See less'}
                            </Text>
                            
                            <Image 
                                src={Images.uri(toggleNearest ? Images.blueDropdown : Images.dropUp)} 
                                style={{
                                    marginLeft: 5,
                                    width: isIos ? 15 : 12,
                                    height: isIos ? 15 : 12,
                                }}
                                resizeMode="contain"
                                tintColor={theme.blueIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    : null
            }
        </View>
    )
}

export default NearestVenues;
