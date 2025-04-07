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
import { getCurrentLocation } from '../../services/GetCurrentLocation';
import { isIos } from '../../constants/IsPlatform';
import Utils from '../../services/Utils';

const QrScanner: React.FC<ScreenProps<'QrScanner'>> = props => {
  const params = props.route?.params ? props.route?.params['venue'] : undefined;
  const [venue, setVenue] = useState<Venue | undefined>(params);

  const device = useCameraDevice('back');
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkinDialog, showCheckinDialog] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const { requestPermission } = useCameraPermission();

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
  })

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {

      if (isActive) {
        const venue_id = codes[0].value;
        processScannedData(Number(venue_id));

      }

      setIsActive(false);
    },
  });

  const processScannedData = (venue_id: number) => {
    if (venue && venue_id) {
      if (venue_id !== venue.id) {
        return MtToast.error('Invalid QR code, not for this venue!');
      }

      checkinApi(venue);
      return;
    }

    if (venue_id) {
      loadVenue(venue_id);
      return;

    }

    MtToast.error('Venue not found, try some time later!');
  }

  const loadVenue = (venue_id: number) => {
    setIsLoading(true);

    Request.fetch_venue(venue_id, (success, error) => {
      setIsLoading(false);

      if (success) {
        setVenue(success.data);
        checkinApi(success.data);

      } else {
        MtToast.error(error.message)
      }
    });
  };

  const checkinApi = async (venue: Venue) => {
    if (!venue) {
      return MtToast.error('Venue not found to checkin, please refresh the page!');
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
          setIsLoading(false);

          if (success) {
            // show checkin modal
            showCheckinDialog(true);

          } else {
            MtToast.error(error.message)

          }
        })

      } else {
        throw new Error('location not found!')
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      MtToast.error('Failed to detect your current location, try sometime later!');
    }
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
              top: isIos ? -10 : -20,
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
                  borderWidth: 1,
                  borderColor: Colors.red,
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

      {venue && <CheckInPopup
        visible={checkinDialog}
        venue={venue}
        onClose={() => {
          showCheckinDialog(false);
          props.navigation?.goBack();
        }} />}
    </View>
  );
};

export default QrScanner;
