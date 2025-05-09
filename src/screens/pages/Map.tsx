import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import Imageview from "../../components/Imageview";
import Images from "../../constants/Images";
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Slider from "@react-native-community/slider";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Venue from "../../types/Venue";
import Request from "../../services/Request";
import Loader from "../../components/Loader";
import { Colors } from "../../constants/Colors";
import Icon from "@react-native-vector-icons/fontawesome6";
import 'react-native-get-random-values';
import useLocation, { getCurrentLocation } from "../../services/GetCurrentLocation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreStates } from "../../store/store";
import Location, { GoogleLocation } from "../../types/Location";
import LocationSearch from "../../components/LocationSearch";
import { resetLocation, setLocation } from "../../store/locationReducer";
import { Environment } from "../../../env";
import { isIos } from "../../constants/IsPlatform";
import MtToast from "../../constants/MtToast";
import FallbackSvg from "../../components/FallbackSvg";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import NoData from "../../components/NoData";
import ShadowCard from "../../components/ShadowCard";
import Textview from "../../components/Textview";
import { Fonts } from "../../constants/Fonts";
import RippleLoader from "../../components/RippleLoader";

const { width, height } = Dimensions.get('window');

const Map: React.FC<ScreenProps<'Map'>> = (props) => {
    const { radius: INITIAL_RADIUS } = Environment.Location.Default;
    const { MinRadius: MIN_RADIUS, MaxRadius: MAX_RADIUS } = Environment.Location;
    const { area: AREA_ZOOM } = Environment.Location.Zoom;

    const location = useSelector((state: StoreStates) => state.location);
    const { requestLocationPermission } = useLocation();

    const [venues, setVenues] = useState<Array<Venue>>(props.route?.params ? props.route?.params['venues'] : []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [radius, setRadius] = useState(INITIAL_RADIUS);
    const mapRef = useRef<MapView | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [isRadiusChanging, setIsRadiusChanging] = useState(false);
    const radiusUpdateTimeout = useRef<NodeJS.Timeout>();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        requestLocationPermission();
    }, [])

    useEffect(() => {
        console.log('lets fetch venues: ', location)
        fetch_venues();
    }, [location, radius])

    const navigateToLocation = (data: Venue[]) => {
        console.log('navigating to venues: ', data.map(d => d.name).join(', '))

        /* mapRef.current?.animateToRegion(
            {
                latitude: location.latitude ?? 0,
                longitude: location.longitude ?? 0,
                latitudeDelta: AREA_ZOOM.lat,
                longitudeDelta: AREA_ZOOM.lon
            },
            1000,
        ); */

    };

    const fetch_venues = async () => {
        setIsLoading(true);
        console.log('venues fetching..')

        Request.fetch_venues({ ...location, radius }, (success, error) => {
            setIsLoading(false);

            if (error) {
                MtToast.error(error.message);

            } else if (success.data.length > 0) {
                console.log(success.data.map(venue => venue.name), success.data.length)
                // calculate the each venue distance from user current location
                updateVenues(success.data);
            } else {
                MtToast.success('No venue found for this location!')
            }
        });
    };

    const updateVenues = useCallback((venues: Venue[]) => {
        getCurrentLocation().then(location => {
            setVenues(updateVenuesWithDistance(location.latitude, location.longitude, venues));

        }).catch(error => {
            setVenues(venues)

        }).finally(() => navigateToLocation(venues))
    }, [venues])

    const onMarkerPress = (venue: Venue, index: number) => {
        setSelectedVenue(venue);
        actionSheetRef.current?.show();
    };

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number => {
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toRad = (value: number): number => {
        return (value * Math.PI) / 180;
    };

    const updateVenuesWithDistance = (
        userLat: number,
        userLon: number,
        venues: Venue[]
    ) => {
        const updatedVenues: Venue[] = venues.map(venue => ({
            ...venue,
            distance: calculateDistance(
                userLat,
                userLon,
                parseFloat(venue.lat),
                parseFloat(venue.lon),
            ),
        }));

        return updatedVenues;;
    };

    const onLocationChange = (location: GoogleLocation) => {
        const updatedLocation: Location = {
            latitude: location.coordinates?.lat ?? 0,
            longitude: location.coordinates?.lng ?? 0,
            latitudeDelta: AREA_ZOOM.lat,
            longitudeDelta: AREA_ZOOM.lon,
            location: location.name + ', ' + location.address,
            radius: radius,
            canReset: true,
            current: false
        };
        console.log(updatedLocation, ': on location change')
        dispatch(setLocation(updatedLocation))
    }

    const onResetLocation = () => {
        if (location.canReset) {
            dispatch(resetLocation());
        }
    }

    const onRadiusChange = useCallback((value: number): void => {
        setIsRadiusChanging(true);
        setRadius(value);
        // update radius in the redux store
        console.log(location, value, ': on radius change')
        dispatch(setLocation({ radius: value }))

        // Clear existing timeout
        if (radiusUpdateTimeout.current) {
            clearTimeout(radiusUpdateTimeout.current);
        }

        // Set new timeout for updating locations
        radiusUpdateTimeout.current = setTimeout(() => {
            setIsRadiusChanging(false);
        }, 500);
    }, [radius, location]);

    const navigateToVenue = (venue: Venue) => {
        actionSheetRef.current?.hide();
        
        props.navigation?.navigate('VenueDetails', { venue_id: venue.id });
    }

    const renderVenueCard = (venue: Venue, index: number) => (
        <View>

            {venue.images.length > 0 ?
                <Image source={{ uri: venue.images[venue.images.length-1].large_image }} style={styles.cardImage} />
                : <FallbackSvg
                    wrapperStyle={{ marginTop: 0 }}
                    overlayStyle={{ borderRadius: 0 }}
                    androidHeight={100}
                    iosHeight={100}
                />
            }

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>
                        <Icon name='map-pin' iconStyle="solid" style={{ marginRight: 3 }} /> {venue.location || '-'}
                    </Text>
                    {/* <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>★ 3.5</Text>
                    </View> */}
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={() => navigateToVenue(venue)}>
                    <Text style={styles.cardTitle}>{venue.name}</Text>
                </TouchableOpacity>

                <Text style={styles.cardDescription} numberOfLines={2}>
                    {venue.description}
                </Text>
                {venue.distance && (
                    <Text style={styles.distanceText}>
                        {venue.distance.toFixed(1)} km away
                    </Text>
                )}
                <View style={styles.categoryContainer}>
                    {venue.categories?.map((category, idx) => (
                        <View key={idx} style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{category.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const actionSheetRef = useRef<ActionSheetRef>(null)

    return (
        <View style={styles.container}>
            {isLoading && <RippleLoader />}

            {isLoading && <ShadowCard
                    style={{
                        backgroundColor: Colors.white,
                        height: isIos ? 110 : 90,
                        width: '90%',
                        borderRadius: 10,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: isIos ? 130 : 90,
                        left: '5%',
                        zIndex: 1
                    }}
                >
                    <View>
                        <Textview
                            text={'Hold On !'}
                            style={{
                                fontSize: Fonts.fs_18,
                                color: Colors.black,
                                fontFamily: Fonts.medium,
                                alignSelf: 'center'
                            }}
                        />
                        <Textview
                            text={'We are finding Venues around you'}
                            style={{
                                fontSize: Fonts.fs_15,
                                color: Colors.black,
                                fontFamily: Fonts.medium,
                                alignSelf: 'center',
                                marginTop: isIos ? 10 : 2
                            }}
                        />
                    </View>

                </ShadowCard>}

            <View style={[styles.headerContainer, { zIndex: 999 }]}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => props.navigation?.goBack()} style={{ width: 50 }}>
                    <Imageview
                        url={Images.back}
                        style={{
                            width: isIos ? 55 : 50,
                            height: isIos ? 55 : 50,
                            resizeMode: 'contain',
                        }}
                        imageType={'local'}
                    />
                </TouchableOpacity>

                <LocationSearch onSelect={onLocationChange} onReset={onResetLocation} style={{ flex: 1 }} />

            </View>

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={location as Region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                region={location as Region}
            >
                <Circle
                    center={location}
                    radius={radius}
                    fillColor="rgba(130, 130, 255, 0.2)"
                    strokeColor="rgba(130, 130, 255, 0.5)"
                    strokeWidth={2}
                />

                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    image={Images.flock_marker}
                />
                {/* <Image
                        source={Images.flock_marker} venue_marker
                        style={{ width: 30, height: 30, resizeMode: 'cover' }}
                    /> */}
                {/* </Marker> */}

                {
                    venues.map((venue, index) => {
                        return (
                            <Marker
                                key={venue.id || index}
                                coordinate={{
                                    latitude: parseFloat(venue.lat),
                                    longitude: parseFloat(venue.lon),
                                }}
                                title={venue.name}
                                onPress={() => onMarkerPress(venue, index)}
                                image={Images.venue_marker}
                            />
                        )
                    })
                }
            </MapView>

            <View style={{ flex: 1 }}>
                <View style={styles.radiusControl}>
                    <View style={styles.radiusControl2}>
                        <Text style={styles.radiusLabel}>Search Radius</Text>
                        <View style={styles.radiusValueContainer}>
                            <View
                                style={[
                                    styles.radiusBubble,
                                    isRadiusChanging && styles.radiusBubbleActive,
                                ]}>
                                <Text style={styles.radiusValue}>
                                    {(radius / 1000).toFixed(1)}
                                </Text>
                                <Text style={styles.radiusUnit}>km</Text>
                            </View>
                        </View>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={MIN_RADIUS}
                        maximumValue={MAX_RADIUS}
                        value={radius}
                        onSlidingComplete={onRadiusChange}
                        minimumTrackTintColor="#8282FF"
                        maximumTrackTintColor="#CCCCCC"
                        thumbTintColor="#8282FF"
                    />
                    <View style={styles.radiusRangeLabels}>
                        <Text style={styles.rangeLabel}>{MIN_RADIUS / 1000}km</Text>
                        <Text style={styles.rangeLabel}>{MAX_RADIUS / 1000}km</Text>
                    </View>
                </View>

                <ActionSheet ref={actionSheetRef}>
                    <View style={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        overflow: 'hidden'
                    }}>
                        <Pressable style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            zIndex: 10,
                            backgroundColor: Colors.black,
                            borderRadius: 20
                        }} onPress={() => actionSheetRef.current?.hide()}>
                            <Icon name="circle-xmark" iconStyle="solid" size={30} color={'white'}  />
                        </Pressable>

                        {selectedVenue ? renderVenueCard(selectedVenue, 0) : <NoData />}
                    </View>
                </ActionSheet>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 70
    },
    radiusControl: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        width: 240,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    radiusControl2: {
        position: 'relative',
        width: 160,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Ensures content stays vertically centered
    },
    radiusLabel: {
        fontSize: Fonts.fs_14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        alignSelf: 'center', // Ensures the label is centered within its container
        marginRight: 10,
    },
    radiusValueContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '100%',
    },
    radiusBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 70,
        justifyContent: 'center',
    },
    radiusBubbleActive: {
        backgroundColor: '#8282FF20',
        borderColor: '#8282FF',
        borderWidth: 1,
    },
    radiusValue: {
        fontSize: Fonts.fs_16,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
    },
    radiusUnit: {
        fontSize: Fonts.fs_12,
        color: '#666',
    },
    slider: {
        width: '100%',
        height: 30,
    },
    radiusRangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginTop: 4,
    },
    rangeLabel: {
        fontSize: Fonts.fs_10,
        color: '#666',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: width - 70,
        marginBottom: 15,
        marginRight: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardImage: {
        width: '100%',
        height: 100
    },
    cardContent: {
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        gap: 3
    },
    cardType: {
        fontSize: Fonts.fs_12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: Fonts.fs_18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: Fonts.fs_14,
        color: '#666',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: Fonts.fs_14,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    distanceText: {
        fontSize: Fonts.fs_12,
        color: '#666',
        marginTop: 4,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    categoryTag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: Fonts.fs_12,
        color: '#666',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedMarker: {
        transform: [{ scale: 1.2 }],
    },
    markerContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        borderWidth: 2,
        borderColor: '#8282FF',
    },
    markerIcon: {
        fontSize: Fonts.fs_20,
    },
    currentLocationButton: {
        //marginLeft: 5,
        flex: 1
    },
    locationButton: {
        backgroundColor: 'white',
        width: 35,
        height: 35,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    locationButtonIcon: {
        fontSize: Fonts.fs_18,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingVertical: 5,
        paddingRight: 10,
        justifyContent: 'space-between',
        paddingTop: isIos ? 50 : 10
    },
    headerSearchBox: {
        flexDirection: 'row',
        width: isIos
            ? (Dimensions.get('window').width * 70) / 100
            : (Dimensions.get('window').width * 73) / 100,
        height: isIos ? 50 : 40,
        backgroundColor: Colors.whitesmoke,
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    gpTextInput: {
        height: '100%',
        backgroundColor: '#F6F6F6',
        color: 'black',
        marginVertical: 2,
        borderWidth: 1,
        borderColor: '#eee',

        borderRadius: 15,
        paddingHorizontal: 15,
        shadowColor: '#eee',
        shadowRadius: 8,

    },
    gpTextInputContainer: {
        marginTop: isIos ? 5 : 0,
        marginHorizontal: 10,
    },
    inputText: {
        fontSize: Fonts.fs_16,
        color: Colors.black,
    },
    placeholderText: {
        color: '#999',
    },
    googleContainer: {
        flex: 0,
    },
    googleInput: {
        height: 56,
        backgroundColor: Colors.white,
        borderRadius: 28,
        paddingHorizontal: 20,
        fontSize: Fonts.fs_16,
        color: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    listView: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginTop: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E5E5',
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 200,
    },
});



export default Map;