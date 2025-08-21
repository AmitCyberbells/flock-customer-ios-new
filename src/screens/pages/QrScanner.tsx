
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import ScreenProps from '../../types/ScreenProps';
import { Platform, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CSS } from '../../constants/CSS';
import Images from '../../constants/Images';
import Imageview from '../../components/Imageview';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import Venue from '../../types/Venue';
import Request from '../../services/Request';
import { useEffect, useState } from 'react';
import CheckInPopup from '../../components/CheckInPopup';
import Loader from '../../components/Loader';
import MtToast from '../../constants/MtToast';
import useLocation, { getCurrentLocation } from '../../services/GetCurrentLocation';
import { isIos } from '../../constants/IsPlatform';
import Utils from '../../services/Utils';
import WalletService from '../../services/WalletService';

const QrScanner: React.FC<ScreenProps<'QrScanner'>> = props => {
  const params = props.route?.params ? props.route?.params['venue'] : undefined;
  const [venue, setVenue] = useState<Venue | undefined>(params);

  const device = useCameraDevice('back');
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkinDialog, showCheckinDialog] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { updateWalletBalances } = WalletService();

  const { requestPermission } = useCameraPermission();
  const { requestLocationPermission } = useLocation();

  useEffect(() => {
    const checkCameraPermission = async () => {
      const hasPermission = await requestPermission();
      setCameraPermission(hasPermission);

      if (!hasPermission) {
        MtToast.error('Please allow camera permission to this app!');
        Utils.openPhoneSetting("Allow camera permission!");
        return;
      }
    }
    checkCameraPermission();
    requestLocationPermission();
  }, [venue])
  const isVenueOpen = (opening_hours: any[]): { isOpen: boolean; message: string } => {
    if (!opening_hours || opening_hours.length === 0) {
      console.log('[QrScanner] No opening hours provided, assuming venue is open');
      return { isOpen: true, message: '' };
    }
  
    const now = new Date(); // Current time: 07:44 PM IST, Saturday
    const currentDay = now.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[currentDay];
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
  
    // Filter schedules that include the current day
    const relevantSchedules = opening_hours.filter(schedule => {
      const isInDayRange = isDayInSchedule(currentDayName, schedule.start_day, schedule.end_day);
      console.log(`[QrScanner] Schedule ID ${schedule.id}: isInDayRange=${isInDayRange}, status=${schedule.status}, closed=${schedule.closed}`);
      return isInDayRange && schedule.status === 1 && schedule.closed === 0;
    });
  
    if (relevantSchedules.length === 0) {
      console.log('[QrScanner] No active schedules found for today');
      const firstSchedule = opening_hours.find(s => s.start_day?.toLowerCase() === currentDayName.toLowerCase()) || opening_hours[0];
      return {
        isOpen: false,
        message: firstSchedule
          ? `This venue is currently closed. Today's hours: ${firstSchedule.start_time || ''} - ${firstSchedule.end_time || ''}`
          : 'This venue is currently closed. Please check the opening hours and visit during business hours.'
      };
    }
  
    // Check if current time is within any schedule's time range
    for (const schedule of relevantSchedules) {
      const startTime = schedule.start_time;
      const endTime = schedule.end_time;
      const startMinutes = parseTimeToMinutes(startTime);
      const endMinutes = parseTimeToMinutes(endTime);
  
      if (startMinutes === null || endMinutes === null) {
        console.log(`[QrScanner] Invalid time format for schedule ID ${schedule.id}`);
        continue;
      }
  
      const isSameDaySchedule = schedule.start_day.toLowerCase() === schedule.end_day.toLowerCase();
      let isOpenNow = false;
  
      if (isSameDaySchedule) {
        // Same-day schedule (e.g., Saturday 12:00 AM to 08:00 PM)
        isOpenNow = nowMinutes >= startMinutes && nowMinutes < endMinutes;
      } else {
        // Multi-day schedule (e.g., Friday to Saturday)
        const startDayIndex = dayNames.findIndex(day => day.toLowerCase() === schedule.start_day.toLowerCase());
        const endDayIndex = dayNames.findIndex(day => day.toLowerCase() === schedule.end_day.toLowerCase());
        const currentDayIndex = currentDay;
  
        if (currentDayIndex === startDayIndex) {
          // Current day is start_day, check if time is after start_time
          isOpenNow = nowMinutes >= startMinutes;
        } else if (currentDayIndex === endDayIndex) {
          // Current day is end_day, check if time is before end_time
          isOpenNow = nowMinutes < endMinutes;
        } else if (startDayIndex < endDayIndex) {
          // Current day is between start_day and end_day
          isOpenNow = currentDayIndex > startDayIndex && currentDayIndex < endDayIndex;
        } else {
          // Cross-week schedule (e.g., Friday to Monday)
          isOpenNow = currentDayIndex > startDayIndex || currentDayIndex < endDayIndex;
        }
      }
  
      console.log(`[QrScanner] Schedule ID ${schedule.id}: isOpenNow=${isOpenNow}, start=${startTime}, end=${endTime}`);
  
      if (isOpenNow) {
        console.log(`[QrScanner] Found active schedule for today:`, schedule);
        return { isOpen: true, message: '' };
      }
    }
  
    // No open schedule found, use the first relevant schedule for the message
    const firstRelevant = relevantSchedules[0] || opening_hours[0];
    console.log('[QrScanner] No open schedule found, using first relevant schedule for message:', firstRelevant);
    return {
      isOpen: false,
      message: firstRelevant
        ? `This venue is currently closed. Today's hours: ${firstRelevant.start_time || ''} - ${firstRelevant.end_time || ''}`
        : 'This venue is currently closed. Please check the opening hours and visit during business hours.'
    };
  };
  
  // Helper function to parse time string to minutes
  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr) return null;
    
    // Handle 12-hour format with AM/PM (e.g., "11:00 PM", "01:00 AM")
    const twelveHourMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHourMatch) {
      let hours = parseInt(twelveHourMatch[1], 10);
      const minutes = parseInt(twelveHourMatch[2], 10);
      const period = twelveHourMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    }
    
    // Handle 24-hour format (e.g., "23:00", "01:00")
    const timeParts = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!timeParts) return null;
    
    const hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    
    return hours * 60 + minutes;
  };

  // Helper function to check if current day falls within schedule days
  const isDayInSchedule = (currentDay: string, startDay: string, endDay: string): boolean => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const currentDayIndex = dayNames.findIndex(day => day.toLowerCase() === currentDay.toLowerCase());
    const startDayIndex = dayNames.findIndex(day => day.toLowerCase() === startDay.toLowerCase());
    const endDayIndex = dayNames.findIndex(day => day.toLowerCase() === endDay.toLowerCase());

    console.log('[QrScanner] Day indices - Current:', currentDayIndex, 'Start:', startDayIndex, 'End:', endDayIndex);

    if (currentDayIndex === -1 || startDayIndex === -1 || endDayIndex === -1) {
      console.log('[QrScanner] Invalid day name found');
      return false;
    }

    // Handle range that crosses week boundary (e.g., Friday–Monday)
    if (startDayIndex <= endDayIndex) {
      const inRange = currentDayIndex >= startDayIndex && currentDayIndex <= endDayIndex;
      console.log('[QrScanner] Normal day range check:', inRange);
      return inRange;
    } else {
      const inRange = currentDayIndex >= startDayIndex || currentDayIndex <= endDayIndex;
      console.log('[QrScanner] Cross-week day range check:', inRange);
      return inRange;
    }
  };

  // Helper to extract venue id from QR code (same logic as Branch params)
  const getVenueIdFromQrCode = (qrValue: string): string | null => {
    console.log('[QrScanner] Extracting venue_id from QR value:', qrValue);
    
    // 1. Direct venue_id (just a number)
    if (/^\d+$/.test(qrValue)) {
      console.log('[QrScanner] Direct venue_id found:', qrValue);
      return qrValue;
    }
  
    // 2. From URL like: https://flockloyalty.app.link/?venue_id=123
    if (qrValue.includes('flockloyalty.app.link') || qrValue.includes('http')) {
      try {
        const urlObj = new URL(qrValue);
        const fromQuery = urlObj.searchParams.get('venue_id');
        if (fromQuery) {
          console.log('[QrScanner] Venue_id from URL query:', fromQuery);
          return fromQuery;
        }
  
        const pathMatch = urlObj.pathname.match(/\/(\d+)$/);
        if (pathMatch) {
          console.log('[QrScanner] Venue_id from URL path:', pathMatch[1]);
          return pathMatch[1];
        }
      } catch (e) {
        console.warn('[QrScanner] Failed to parse URL:', e);
      }
    }
  
    // 3. From JSON object like: {"venue_id": 60}
    try {
      const jsonData = JSON.parse(qrValue);
      if (jsonData.venue_id) {
        console.log('[QrScanner] Venue_id from JSON:', jsonData.venue_id);
        return String(jsonData.venue_id);
      }
    } catch (e) {
      // Not JSON, continue to next check
    }
  
    // 4. Try to extract any number from the string
    const numberMatch = qrValue.match(/(\d+)/);
    if (numberMatch) {
      console.log('[QrScanner] Venue_id extracted from number pattern:', numberMatch[1]);
      return numberMatch[1];
    }
  
    console.log('[QrScanner] No venue_id found in QR code');
    return null;
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (isActive) {
        console.log('[QrScanner] ======= QR CODE SCAN DETAILS =======');
        console.log('[QrScanner] Full codes array:', JSON.stringify(codes, null, 2));
        console.log('[QrScanner] Number of codes detected:', codes.length);
        
        const qrValue = codes[0].value;
        console.log('[QrScanner] Raw QR value:', qrValue);
        console.log('[QrScanner] QR value type:', typeof qrValue);
        console.log('[QrScanner] QR value length:', qrValue?.length);
        console.log('[QrScanner] Code type:', codes[0].type);
        
        if (qrValue) {
          const venue_id = getVenueIdFromQrCode(qrValue);
          console.log('[QrScanner] Extracted venue_id:', venue_id);
          console.log('[QrScanner] Current venue state:', venue);
          
          if (venue_id) {
            processScannedData(Number(venue_id));
          } else {
            console.log('[QrScanner] No venue_id extracted from QR code');
            MtToast.error('Invalid QR code format. Please scan a valid venue QR code.');
          }
        } else {
          console.log('[QrScanner] QR code value is empty or null');
          MtToast.error('QR code value is empty. Please try again.');
        }
        console.log('[QrScanner] ======= END QR SCAN DETAILS =======');
      }
      setIsActive(false);
    },
  });

  const processScannedData = (venue_id: number) => {
    console.log('[QrScanner] ======= PROCESSING SCANNED DATA =======');
    console.log('[QrScanner] Received venue_id:', venue_id);
    console.log('[QrScanner] Current venue state:', JSON.stringify(venue, null, 2));
    console.log('[QrScanner] Venue exists:', !!venue);
    console.log('[QrScanner] Venue ID (if exists):', venue?.id);
    console.log('[QrScanner] Venue name (if exists):', venue?.name);
    
    if (venue && venue_id) {
      console.log('[QrScanner] Venue already loaded, checking if IDs match');
      if (venue_id !== venue.id) {
        console.log('[QrScanner] Venue ID mismatch:', venue_id, 'vs', venue.id);
        return MtToast.error('Invalid QR code, not for this venue!');
      }

      // Check if venue is open before proceeding with check-in
      const openingStatus = isVenueOpen(venue.opening_hours || []);
      if (!openingStatus.isOpen) {
        console.log('[QrScanner] Venue is closed, preventing check-in');
        setIsActive(true); // Reactivate scanner
        return MtToast.error(openingStatus.message);
      }

      console.log('[QrScanner] Venue IDs match and venue is open, proceeding with check-in');
      checkinApi(venue);
      return;
    }

    if (venue_id) {
      console.log('[QrScanner] 🔄 No venue loaded, performing direct check-in for venue_id:', venue_id);
      // Direct check-in without fetching venue details first
      directCheckinApi(venue_id);
      return;
    }

    console.log('[QrScanner] No venue_id found in QR code');
    MtToast.error('Venue not found, try some time later!');
  }

  const directCheckinApi = async (venue_id: number) => {
    console.log('[QrScanner] Starting direct check-in for venue_id:', venue_id);
    setIsLoading(true);

    try {
      // First fetch venue details to check opening hours
      console.log('[QrScanner] Fetching venue details to check opening hours...');
      
      Request.fetch_venue(venue_id, async (venueSuccess, venueError) => {
        if (venueSuccess && venueSuccess.data) {
          console.log('[QrScanner] Venue details fetched:', venueSuccess.data);
          
          // Check if venue is open
          const openingStatus = isVenueOpen(venueSuccess.data.opening_hours || []);
          if (!openingStatus.isOpen) {
            console.log('[QrScanner] Venue is closed, preventing check-in');
            setIsLoading(false);
            setIsActive(true); // Reactivate scanner
            return MtToast.error(openingStatus.message);
          }

          console.log('[QrScanner] Venue is open, proceeding with check-in');
          
          // Proceed with check-in if venue is open
          const currentLocation = await getCurrentLocation();

          if (currentLocation) {
            console.log('[QrScanner] Location obtained:', currentLocation);
            console.log('[QrScanner] Calling check-in API with data:', {
              venue_id: venue_id,
              lat: currentLocation.latitude,
              long: currentLocation.longitude
            });

            Request.checkin({
              venue_id: venue_id,
              lat: currentLocation.latitude,
              long: currentLocation.longitude
            }, (success, error) => {
              setIsLoading(false);
              
              if (success) {
                console.log('[QrScanner] Check-in successful:', success);
                // Set venue data for the popup
                setVenue(venueSuccess.data);
                showCheckinDialog(true);
                updateWalletBalances();
              } else {
                console.log('[QrScanner] Check-in failed:', error);
                setIsActive(true); // Reactivate scanner on error
                MtToast.error(error.message);
              }
            });
          } else {
            throw new Error('location not found!');
          }
        } else {
          setIsLoading(false);
          setIsActive(true); // Reactivate scanner
          console.log('[QrScanner] Failed to fetch venue details:', venueError);
          MtToast.error('Unable to fetch venue information. Please try again.');
        }
      });
      
    } catch (error) {
      setIsLoading(false);
      setIsActive(true); // Reactivate scanner
      console.log('[QrScanner] Error in direct check-in:', error);
      MtToast.error('Failed to detect your current location, try sometime later!');
    }
  }

  const checkinApi = async (venue: Venue) => {
    if (!venue) {
      setIsActive(true); // Reactivate scanner
      return MtToast.error('Venue not found, please refresh the page!');
    }

    // Double-check opening hours before API call
    const openingStatus = isVenueOpen(venue.opening_hours || []);
    if (!openingStatus.isOpen) {
      console.log('[QrScanner] Venue is closed, preventing check-in');
      setIsActive(true); // Reactivate scanner
      return MtToast.error(openingStatus.message);
    }

    setIsLoading(true);

    try {
      const currentLocation = await getCurrentLocation();

      if (currentLocation) {
        Request.checkin({
          venue_id: venue?.id,
          lat: currentLocation.latitude,
          long: currentLocation.longitude
        }, (success, error) => {
          if (success) {
            // Fetch updated venue details to get latest information including points
            Request.fetch_venue(venue.id, (venueSuccess, venueError) => {
              setIsLoading(false);
              
              if (venueSuccess && venueSuccess.data) {
                console.log('[QrScanner] Updated venue details fetched:', venueSuccess.data);
                // Update venue with latest data
                setVenue(venueSuccess.data);
                showCheckinDialog(true);
                updateWalletBalances();
              } else {
                console.log('[QrScanner] Failed to fetch updated venue details:', venueError);
                // Use existing venue data
                showCheckinDialog(true);
                updateWalletBalances();
              }
            });
            
          } else {
            setIsLoading(false);
            setIsActive(true); // Reactivate scanner on error
            MtToast.error(error.message);
          }
        });
      } else {
        throw new Error('location not found!');
      }
    } catch (error) {
      setIsLoading(false);
      setIsActive(true); // Reactivate scanner
      console.log(error);
      MtToast.error('Failed to detect your current location, try sometime later!');
    }
  }

  // Test function to debug QR code extraction (for development)
  const testQrExtraction = (testValue: string) => {
    console.log('[QrScanner] Testing QR extraction with:', testValue);
    const venue_id = getVenueIdFromQrCode(testValue);
    console.log('[QrScanner] Extracted venue_id:', venue_id);
    return venue_id;
  };

  // Add test functions to global scope for debugging
  if (__DEV__) {
    (global as any).testQrExtraction = testQrExtraction;
    (global as any).getVenueIdFromQrCode = getVenueIdFromQrCode;
    (global as any).isVenueOpen = isVenueOpen;
    (global as any).isDayInSchedule = isDayInSchedule;
    (global as any).parseTimeToMinutes = parseTimeToMinutes;
  }

  return (
    <View style={CSS.qr_code_container}>
      <Loader isLoading={isLoading} />

      <Textview
        text={
          'Please place the QR code within the frame. Avoid shaking for best results.'
        }
        style={{
          fontFamily: Fonts.regular,
          color: Colors.white,
          textAlign: 'center',
          fontSize: Fonts.fs_15,
          marginHorizontal: 30,
          marginTop: 50,
        }}
      />

      <View style={{ flex: 1 }}>
        <View style={CSS.qr_code_view}>
          <View
            style={{
              width: '100%',
              position: 'absolute',
              top: -20,
              zIndex: 1
            }}>
            <Imageview
              style={{
                width: 50,
                height: 50,
                alignSelf: 'center',
              }}
              imageType={'local'}
              url={Images.FlockBird}
            />
          </View>

          {cameraPermission && device ? (
            <View style={{
              borderRadius: 20,
              borderColor: Colors.primary_color_orange,
              borderWidth: 2,
              overflow: 'hidden'
            }}>
              <Camera
                style={{
                  borderWidth: 0,
                  // borderColor: Colors.red,
                  width: '100%',
                  height: '100%',
                }}
                {...props}
                device={device}
                isActive={isActive}
                codeScanner={codeScanner}
              />
            </View>
          ) : (
            ''
          )}
        </View>

        <Textview
          text={
            "If you can't find the QR code, please ask a staff member for assistance."
          }
          style={{
            fontFamily: Fonts.regular,
            color: Colors.white,
            textAlign: 'center',
            fontSize: Fonts.fs_14,
            marginHorizontal: 30
          }}
        />
      </View>

      {venue ? <CheckInPopup
        visible={checkinDialog}
        venue={venue}
        onClose={() => {
          showCheckinDialog(false);
          props.navigation?.navigate('VenueDetails', {venue_id: venue.id});
        }} /> : null}
    </View>
  );
};

export default QrScanner;