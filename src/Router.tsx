import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import toastConfig from './types/ToastConfig';
import { useDispatch, useSelector } from 'react-redux';
import { StoreStates } from './store/store';
import SideMenu from './navigations/SideMenu';
import AuthNavigator from './navigations/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './store/authReducer';
import { updateUserToStore } from './store/userReducer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, Linking, Platform, StatusBar } from 'react-native';
import { Colors } from './constants/Colors';
import BootSplash from 'react-native-bootsplash';
import { setDevicePermissions } from './store/devicePermissionReducer';
import { useCameraPermission } from 'react-native-vision-camera';
import useLocation from './services/GetCurrentLocation';
import Firebase, { notifeeSettings } from './services/Firebase';
// import SpInAppUpdates, { IAUUpdateKind, StartUpdateOptions } from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import Request from './services/Request';
import { createLog } from './services/AppLog';
import { isAndroid, isIos } from './constants/IsPlatform';
import branch from 'react-native-branch'; // Branch.io SDK import (uncomment after installing SDK)
import MtToast from './constants/MtToast';
import { getCurrentLocation } from './services/GetCurrentLocation';
import axios from 'axios';
import CheckInPopup from './components/CheckInPopup';
import Venue from './types/Venue';

const Router = () => {
  const isLoggedIn = useSelector((state: StoreStates) => state.auth.isLoggedIn);
  const devicePermission = useSelector(
    (state: StoreStates) => state.devicePermission,
  );

  const { requestPermission } = useCameraPermission();
  const { requestLocationPermission } = useLocation();
  const { getNotificationPermission } = notifeeSettings();
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);
  const [hasCheckedForUpdates, setHasCheckedForUpdates] = React.useState(false);

  // CheckInPopup state
  const [checkinDialog, showCheckinDialog] = React.useState<boolean>(false);
  const [checkinVenue, setCheckinVenue] = React.useState<Venue | null>(null);

  // const inAppUpdates = new SpInAppUpdates(false); // isDebug
  const dispatch = useDispatch();

  // Initialize Firebase
  const firebaseInstance = Firebase();

  // Track last checked-in venue to avoid duplicate check-ins
  const lastCheckedInVenueIdRef = React.useRef<string | null>(null);

  // Flag to prevent multiple Firebase initializations
  const firebaseInitializedRef = React.useRef(false);

  // --- Static URL test for debugging ---
  // React.useEffect(() => {
  //   // Simulate a static Branch deep link hit
  //   const staticUrl = "https://flockloyalty.app.link/g7uTnMWEsUb";

  //   // Simulate what Branch would return if this link had been created properly
  //   const params = {
  //     $canonical_url: staticUrl,
  //     $deeplink_path: "60",      // Optional, but Branch often includes this
  //     venue_id: "60",
  //     "auto_checkin": true,          // This is what your app expects
  //   };

  //   const venueId = getVenueIdFromBranchParams(params);

  //   if (venueId) {
  //     console.log("[Static URL Test] Venue ID from static URL:", venueId);
  //   } else {
  //     console.log("[Static URL Test] No venue ID found in static URL");
  //   }
  // }, []);

  React.useEffect(() => {
    // Initialize Firebase first (only once)
    if (!firebaseInitializedRef.current) {
      firebaseInstance.firebaseConfig((initialized) => {
        console.log('Firebase initialized:', initialized);
        if (initialized) {
          // Update device token after Firebase is initialized
          firebaseInstance.updateDeviceToken();
        }
      });
      firebaseInitializedRef.current = true;
    }

    checkUser();
    updateDevicePermissions();

    // Only check for updates if user is logged in and not already checked
    if (isLoggedIn && !hasCheckedForUpdates) {
      checkForAppUpdates();
      setHasCheckedForUpdates(true);
    }

    // Process any pending check-ins after login
    if (isLoggedIn) {
      processPendingCheckin();
    }

    // Cleanup function to reset check-in state when user logs out
    return () => {
      if (!isLoggedIn) {
        lastCheckedInVenueIdRef.current = null;
        showCheckinDialog(false);
        setCheckinVenue(null);
      }
    };
  }, [isLoggedIn]);

  const callCheckInApi = async (venueId: string) => {
    // Prevent duplicate check-ins
    if (lastCheckedInVenueIdRef.current === venueId) {
      console.log('[callCheckInApi] Already checked in to this venue:', venueId);
      return;
    }

    try {
      const auth = await AsyncStorage.getItem('auth');
      const token = auth ? JSON.parse(auth).token : null;
  
      if (!token) {
        console.warn('[callCheckInApi] No token found, user not logged in');
        return;
      }
  
      // Fetch location
      let location;
      try {
        console.log('[callCheckInApi] Getting location...');
        location = await getCurrentLocation();
      } catch (e) {
        console.warn('[callCheckInApi] Location error, using fallback:', e);
        location = { latitude: 0, longitude: 0 };
      }
  
      // Use Request.checkin (like performCheckin does)
      Request.checkin(
        {
          venue_id: Number(venueId),
          lat: location.latitude,
          long: location.longitude,
        },
        (success, error) => {
          if (success) {
            console.log('[callCheckInApi] Check-in successful:', success);
            
            // Fetch venue details to show in popup
            Request.fetch_venue(Number(venueId), (venueSuccess, venueError) => {
              if (venueSuccess && venueSuccess.data) {
                console.log('[callCheckInApi] Venue details fetched:', venueSuccess.data);
                setCheckinVenue(venueSuccess.data);
                showCheckinDialog(true);
              } else {
                console.log('[callCheckInApi] Failed to fetch venue details:', venueError);
                // Fallback: create minimal venue object
                setCheckinVenue({
                  id: Number(venueId),
                  name: `Venue ${venueId}`,
                  feather_points: 10, // Default feather points
                  venue_points: 5,    // Default venue points
                } as Venue);
                showCheckinDialog(true);
              }
            });
          } else {
            console.log('[callCheckInApi] Check-in failed:', error);
            
            // Use the actual API response message (like QrScanner does)
            MtToast.error(error?.message || 'Check-in failed');
            
            // Reset the ref so user can try again manually
            lastCheckedInVenueIdRef.current = null;
          }
        }
      );
    } catch (err) {
      console.error('[callCheckInApi] Fatal error:', err);
      MtToast.error('Check-in failed!');
      // Reset the ref so user can try again manually
      lastCheckedInVenueIdRef.current = null;
    }
  };
  
 
  // Helper to extract venue id from Branch params or path
  const getVenueIdFromBranchParams = (params: any): string | null => {
    // 1. Direct venue_id param
    if (params?.venue_id) return String(params.venue_id);
  
    // 2. From canonical URL like: https://flockloyalty.app.link/?venue_id=123
    if (params?.$canonical_url) {
      try {
        const urlObj = new URL(params.$canonical_url);
        const fromQuery = urlObj.searchParams.get('venue_id');
        if (fromQuery) return fromQuery;
  
        const pathMatch = urlObj.pathname.match(/\/(\d+)$/);
        if (pathMatch) return pathMatch[1];
      } catch (e) {
        console.warn('[Branch] Failed to parse $canonical_url:', e);
      }
    }
  
    // 3. From $deeplink_path
    if (params?.$deeplink_path) {
      const pathMatch = params.$deeplink_path.match(/^(\d+)$/);
      if (pathMatch) return pathMatch[1];
    }
  
    return null;
  };
  

  // Enhanced check-in function with login state handling
  const handleVenueCheckin = async (venueId: string) => {
    if (!venueId || lastCheckedInVenueIdRef.current === venueId) {
      console.log('[HandleCheckin] Skipping, no venueId or already checked in:', venueId);
      return;
    }

    try {
      // Immediately try to check in (don't wait for login state)
      const userToken = await AsyncStorage.getItem('auth');

      if (userToken) {
        // User is logged in, proceed with check-in immediately
        await performCheckin(venueId);
      } else {
        // Store pending check-in and proceed to login
        await AsyncStorage.setItem('pendingCheckin', JSON.stringify({
          venue_id: venueId,
          action: 'checkin',
          timestamp: Date.now()
        }));

        console.log('[HandleCheckin] User not logged in, storing pending check-in:', venueId);
        // The AuthNavigator will be shown automatically since isLoggedIn is false
      }
    } catch (error) {
      console.error('[HandleCheckin] Error:', error);
    }
  };

  // Perform the actual check-in
  const performCheckin = async (venueId: string) => {
    if (lastCheckedInVenueIdRef.current === venueId) {
      console.log('[PerformCheckin] Already checked in to this venue:', venueId);
      return;
    }

    lastCheckedInVenueIdRef.current = venueId;

    try {
      console.log('[PerformCheckin] Starting check-in for venue:', venueId);

      // 1. Fetch venue details first
      let venueData: Venue | null = null;
      await new Promise<void>((resolve, reject) => {
        Request.fetch_venue(Number(venueId), (success, error) => {
          if (success && success.data) {
            console.log('[PerformCheckin] Venue found:', success.data);
            venueData = success.data;
            resolve();
          } else {
            console.log('[PerformCheckin] Venue fetch error:', error);
            MtToast.error(error?.message || 'Venue not found');
            reject(error);
          }
        });
      });

      // 2. Get current location with retry logic
      let location;
      try {
        console.log('[PerformCheckin] Getting current location...');
        location = await getCurrentLocation();
        console.log('[PerformCheckin] Got location:', location);
      } catch (locationError) {
        console.log('[PerformCheckin] Location error, using default coordinates:', locationError);
        // Use default coordinates if location fails
        location = { latitude: 0, longitude: 0 };
      }

      // 3. Call check-in API
      console.log('[PerformCheckin] Calling check-in API...');
      await new Promise<void>((resolve, reject) => {
        Request.checkin(
          {
            venue_id: Number(venueId),
            lat: location.latitude,
            long: location.longitude,
          },
          (success, error) => {
            if (success) {
              console.log('[PerformCheckin] Check-in success:', success);
              
              // Show CheckInPopup with venue details
              if (venueData) {
                console.log('[PerformCheckin] Setting venue data for popup:', venueData);
                setCheckinVenue(venueData);
                showCheckinDialog(true);
                console.log('[PerformCheckin] CheckInPopup state set - venue:', venueData.name, 'dialog:', true);
              } else {
                console.log('[PerformCheckin] Using fallback venue data for popup');
                // Fallback: create minimal venue object
                const fallbackVenue = {
                  id: Number(venueId),
                  name: `Venue ${venueId}`,
                  feather_points: 10, // Default feather points
                  venue_points: 5,    // Default venue points
                } as Venue;
                setCheckinVenue(fallbackVenue);
                showCheckinDialog(true);
                console.log('[PerformCheckin] CheckInPopup state set - fallback venue:', fallbackVenue.name, 'dialog:', true);
              }

              // Clear any pending check-in data
              AsyncStorage.removeItem('pendingCheckin');
              resolve();
            } else {
              console.log('[PerformCheckin] Check-in error:', error);
              
              // Use the actual API response message (like QrScanner does)
              MtToast.error(error?.message || 'Check-in failed');
              
              // Reset the ref so user can try again manually
              lastCheckedInVenueIdRef.current = null;
              reject(error);
            }
          }
        );
      });
    } catch (err) {
      console.log('[PerformCheckin] Error in performCheckin:', err);
      // Reset the ref so user can try again manually
      lastCheckedInVenueIdRef.current = null;
      
      // Don't retry automatically - let user try again manually
      console.log('[PerformCheckin] Check-in failed, user can try again manually');
    }
  };

  // Process pending check-in after successful login
  const processPendingCheckin = async () => {
    try {
      const pendingData = await AsyncStorage.getItem('pendingCheckin');

      if (pendingData) {
        const { venue_id } = JSON.parse(pendingData);
        console.log('[ProcessPending] Found pending check-in for venue:', venue_id);

        if (venue_id && isLoggedIn) {
          // Small delay to ensure login process is complete
          setTimeout(() => {
            processPendingCheckinSilently(venue_id);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('[ProcessPending] Error processing pending check-in:', error);
    }
  };

  // Silent version of check-in for pending check-ins (no error messages)
  const processPendingCheckinSilently = async (venueId: string) => {
    if (lastCheckedInVenueIdRef.current === venueId) {
      console.log('[ProcessPendingSilent] Already checked in to this venue:', venueId);
      // Clear pending check-in data
      AsyncStorage.removeItem('pendingCheckin');
      return;
    }

    lastCheckedInVenueIdRef.current = venueId;

    try {
      console.log('[ProcessPendingSilent] Processing pending check-in for venue:', venueId);

      // 1. Fetch venue details first
      let venueData: Venue | null = null;
      await new Promise<void>((resolve, reject) => {
        Request.fetch_venue(Number(venueId), (success, error) => {
          if (success && success.data) {
            console.log('[ProcessPendingSilent] Venue found:', success.data);
            venueData = success.data;
            resolve();
          } else {
            console.log('[ProcessPendingSilent] Venue fetch error:', error);
            reject(error);
          }
        });
      });

      // 2. Get current location
      let location;
      try {
        console.log('[ProcessPendingSilent] Getting current location...');
        location = await getCurrentLocation();
        console.log('[ProcessPendingSilent] Got location:', location);
      } catch (locationError) {
        console.log('[ProcessPendingSilent] Location error, using default coordinates:', locationError);
        location = { latitude: 0, longitude: 0 };
      }

      // 3. Call check-in API silently
      console.log('[ProcessPendingSilent] Calling check-in API...');
      await new Promise<void>((resolve, reject) => {
        Request.checkin(
          {
            venue_id: Number(venueId),
            lat: location.latitude,
            long: location.longitude,
          },
          (success, error) => {
            if (success) {
              console.log('[ProcessPendingSilent] Check-in success:', success);
              
              // Show CheckInPopup with venue details
              if (venueData) {
                setCheckinVenue(venueData);
                showCheckinDialog(true);
              } else {
                // Fallback: create minimal venue object
                setCheckinVenue({
                  id: Number(venueId),
                  name: `Venue ${venueId}`,
                  feather_points: 10, // Default feather points
                  venue_points: 5,    // Default venue points
                } as Venue);
                showCheckinDialog(true);
              }

              // Clear pending check-in data regardless of error type
              AsyncStorage.removeItem('pendingCheckin');
              resolve();
            } else {
              console.log('[ProcessPendingSilent] Check-in error:', error);
              
              // For pending check-ins, don't show error messages for "already checked in"
              if (error?.message?.includes('already checked in') || 
                  error?.message?.includes('tomorrow')) {
                console.log('[ProcessPendingSilent] Already checked in - silently clearing pending data');
                // Don't show error message, just clear the pending data
              } else {
                // Only show error for other types of errors
                MtToast.error(error?.message || 'Check-in failed');
              }
              
              // Clear pending check-in data regardless of error type
              AsyncStorage.removeItem('pendingCheckin');
              
              // Reset the ref so user can try again manually
              lastCheckedInVenueIdRef.current = null;
              reject(error);
            }
          }
        );
      });
    } catch (err) {
      console.log('[ProcessPendingSilent] Error in processPendingCheckinSilently:', err);
      // Reset the ref so user can try again manually
      lastCheckedInVenueIdRef.current = null;
      
      // Clear pending check-in data on any error
      AsyncStorage.removeItem('pendingCheckin');
    }
  };

  // Legacy autoCheckIn function for backward compatibility - now calls handleVenueCheckin
  const autoCheckIn = async (venueId: string) => {
    await handleVenueCheckin(venueId);
  };

  // Single Branch useEffect with proper duplicate prevention
  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeBranch = async () => {
      try {
        console.log('[Branch] Starting Branch initialization...');

        if (!branch) {
          console.error('[Branch] Branch module not available');
          return;
        }

        console.log('[Branch] Initializing session...');
        console.log('[Branch] Session initialized');

        // Get referring params
        console.log('[Branch] Fetching latest referring params...');
        const latestParams = await branch.getLatestReferringParams();
        console.log('[Branch] Latest params:', JSON.stringify(latestParams, null, 2));

        console.log('[Branch] Fetching first referring params...');
        const firstParams = await branch.getFirstReferringParams();
        console.log('[Branch] First params:', JSON.stringify(firstParams, null, 2));

        if (!latestParams || Object.keys(latestParams).length === 0) {
          console.log('[Branch] Latest params are empty. Possible reasons:');
          console.log('- App was not launched from a Branch link');
          console.log('- Branch SDK not properly initialized');
          console.log('- Testing on simulator (some features may not work)');
          console.log('- Missing Branch keys in app configuration');
        }

        // Set up subscription for deep links with duplicate prevention
        unsubscribe = branch.subscribe(({ error, params }) => {
          console.log('[Branch] Subscribe event received');
          if (error) {
            console.error('[Branch] Error in subscription:', error);
            return;
          }

          console.log('[Branch] Subscription params:', JSON.stringify(params, null, 2));
          
          // Check if this is a Branch link click (important for iPhone camera scanner)
          if (params && params['+clicked_branch_link']) {
            console.log('[Branch] Branch link clicked, processing...');
            const venueId = getVenueIdFromBranchParams(params);
            console.log('[Branch] Extracted venueId from subscription:', venueId);

            if (venueId && lastCheckedInVenueIdRef.current !== venueId) {
              console.log('[Branch] Calling handleVenueCheckin for venue:', venueId);
              handleVenueCheckin(venueId);
            } else if (venueId) {
              console.log('[Branch] Skipping duplicate check-in for venue:', venueId);
            } else {
              console.log('[Branch] No venueId found in params');
            }
          } else {
            console.log('[Branch] Not a Branch link click, skipping...');
          }
        });

        // Handle cold start (app launched from link) with duplicate prevention
        const coldVenueId = getVenueIdFromBranchParams(firstParams);
        console.log('[Branch] Cold start extracted venueId:', coldVenueId);
        if (coldVenueId && lastCheckedInVenueIdRef.current !== coldVenueId) {
          handleVenueCheckin(coldVenueId);
        } else if (coldVenueId) {
          console.log('[Branch] Skipping duplicate cold start check-in for venue:', coldVenueId);
        }
      } catch (error) {
        console.error('[Branch] Initialization error:', error);
      }
    };

    initializeBranch();

    return () => {
      if (unsubscribe) {
        console.log('[Branch] Cleaning up subscription');
        unsubscribe();
      }
    };
  }, []);

  // Helper function to compare versions semantically               
  const compareVersions = (version1: string, version2: string): number => {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);

    // Pad arrays to same length
    const maxLength = Math.max(v1parts.length, v2parts.length);
    while (v1parts.length < maxLength) v1parts.push(0);
    while (v2parts.length < maxLength) v2parts.push(0);

    for (let i = 0; i < maxLength; i++) {
      if (v1parts[i] > v2parts[i]) return 1;
      if (v1parts[i] < v2parts[i]) return -1;
    }
    return 0;
  };

  // Helper function to validate version format
  const isValidVersion = (version: string): boolean => {
    return /^\d+(\.\d+)*$/.test(version);
  };

  const updateDevicePermissions = async () => {
    console.log({ devicePermission });

    if (devicePermission.camera === false) {
      const camera = await requestPermission();
      dispatch(setDevicePermissions({ camera: camera }));
    }

    if (devicePermission.notifications === false) {
      const notifications = await getNotificationPermission();
      dispatch(setDevicePermissions({ notifications: notifications }));
    }

    if (devicePermission.location === false) {
      const location = await requestLocationPermission();
      dispatch(setDevicePermissions({ location: location ?? false }));
    }
  }

  const checkUser = async () => {
    const auth = await AsyncStorage.getItem('auth');

    if (auth) {
      const authx = JSON.parse(auth);
      dispatch(login({ ...authx }));
    }

    setIsAuthChecked(true);
    const user = await AsyncStorage.getItem('user');

    if (auth && user) {
      const userx = JSON.parse(user);
      dispatch(updateUserToStore(userx));
    }
  };

  const checkForAppUpdates = async () => {
    const currentVersion = DeviceInfo.getVersion();
    console.log('Checking for app updates. Current version:', currentVersion);

    try {
      // First check with API
      const apiResponse = await new Promise<{ version: string } | null>((resolve) => {
        // Request.getAppVersion((success, error) => {
        //   if (success && success.data) {
        //     resolve(success.data);
        //   } else {
        //     console.log('API version check failed:', error);
        //     resolve(null);
        //   }
        // });
      });

      if (apiResponse && apiResponse.version) {
        const serverVersion = apiResponse.version.trim();

        // Validate both versions
        if (!isValidVersion(currentVersion) || !isValidVersion(serverVersion)) {
          console.log('Invalid version format detected:', { currentVersion, serverVersion });
          return; // Don't proceed with invalid version formats
        }

        console.log('Version comparison:', { currentVersion, serverVersion });

        // Use semantic version comparison
        const comparison = compareVersions(serverVersion, currentVersion);

        if (comparison > 0) {
          // Server version is higher - update needed
          console.log('Update needed: Server version is newer');
          showUpdateAlert(DeviceInfo.getBundleId());
          return;
        } else {
          // Current version is up to date or newer
          console.log('App is up to date or newer than server version');
          return; // Don't fall back to in-app updates if API check was successful
        }
      }

      // Only fall back to in-app update check if API check completely failed
      console.log('API check failed, falling back to in-app update check');
      // const result = await inAppUpdates.checkNeedsUpdate({ curVersion: currentVersion });
      // createLog('checkForAppUpdates', JSON.stringify(result));

      // console.log('In-app update check result:', result);
      // if (result.shouldUpdate) {
      //   const updateOptions: StartUpdateOptions | undefined = Platform.select({
      //     ios: {
      //       title: 'Update available',
      //       message: "There is a new version of the app available on the App Store, do you want to update it?",
      //       buttonUpgradeText: 'Update',
      //       buttonCancelText: 'Cancel'
      //     },
      //     android: {
      //       updateType: IAUUpdateKind.IMMEDIATE,
      //     },
      //   });

      //   if (updateOptions) {
      //     inAppUpdates.startUpdate(updateOptions);
      //   }
      // }
    } catch (error) {
      console.log('Error in checkForAppUpdates:', error);
      createLog('checkForAppUpdates_error', JSON.stringify(error));
    }
  }

  const showUpdateAlert = (bundleId: string) => {
    Alert.alert(
      "Update available!",
      "Confirm to update the application.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Please",
          onPress: () => openAppStore(bundleId),
          style: "destructive",
        },
      ]
    );
  }

  const openAppStore = async (bundleId: string) => {
    let url = '';
    let fallbackUrl = '';
    console.log('bundleid..........>>>>>>', bundleId);
    if (isAndroid) {
      url = `market://details?id=${bundleId}`;
      fallbackUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;

    } else if (isIos) {
      url = `itms-apps://apps.apple.com/app/id${bundleId}`;
      fallbackUrl = `https://apps.apple.com/app/id${bundleId}`;

    } else {
      Alert.alert('Unsupported platform');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to open the store link');
      console.error('Error opening store link:', err);
    }
  };

  // Utility to extract venue_id from URL
  function extractVenueIdFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      // The venue_id is the last part of the pathname
      const pathParts = parsedUrl.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (/^\\d+$/.test(lastPart)) {
        return lastPart;
      }
      return null;
    } catch {
      return null;
    }
  }

  const handleInitialUrl = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      const venueId = extractVenueIdFromUrl(url);
      if (venueId) {
        const auth = await AsyncStorage.getItem('auth');
        const token = auth ? JSON.parse(auth).token : null;
        if (token) {
          await axios.post(
            'https://api.getflock.io/api/checkin',
            { venue_id: venueId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    }
  };

  // React component me useEffect ke andar call karein
  React.useEffect(() => {
    handleInitialUrl();
  }, []);

  if (!isAuthChecked) {
    return null; // or splash screen
  }

  return (
    <GestureHandlerRootView>
      <StatusBar
        barStyle="default"
        backgroundColor={Colors.primary_color_orange}
      />
      <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
        {isLoggedIn ? <SideMenu /> : <AuthNavigator />}

        <Toast config={toastConfig} />
        
        {/* CheckInPopup for Universal Link check-ins */}
        {checkinVenue && (
          <CheckInPopup
            visible={checkinDialog}
            venue={checkinVenue}
            onClose={() => {
              showCheckinDialog(false);
              setCheckinVenue(null);
            }}
          />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default Router;