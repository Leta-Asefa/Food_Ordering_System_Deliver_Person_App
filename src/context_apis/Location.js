import {createContext, useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid} from 'react-native';
import {useAuthUserContext} from './AuthUserContext';

// Create the context
export const LocationContext = createContext();

// Custom hook to use the Location
export const useLocationContext = () => {
  return useContext(LocationContext);
};

// Secure API Key Storage
const apiKey =
  process.env.HERE_MAPS_API_KEY ||
  'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';

// Provider component to wrap your application and provide the location state
export const LocationContextProvider = ({children}) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const [realTimeTrackerId, setRealTimeTrackerId] = useState(null);
  const {authUser} = useAuthUserContext();
  const watchIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks

    if (!authUser || !authUser.user || !authUser.user._id) {
      console.log('Waiting for authUser...');
      return;
    }

    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');
          return status === 'granted';
        } else if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'We need to access your location to track your movement.',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Permission request failed:', err);
        return false;
      }
    };

    const sendLocation = async (latitude, longitude) => {
      try {
        const response = await axios.post(
          'http://localhost:4000/gps/update_location',
          {
            userId: authUser.user._id,
            latitude,
            longitude,
            username: authUser.user.username,
            phoneNumber: authUser.user.phoneNumber,
            image: authUser.user.image,
            employer: authUser.user.employer,
            rating: authUser.user.rating,
          },
        );
        console.log('Location sent!', response);
      } catch (error) {
        console.error('Error sending location:', error);
      }
    };

    const startWatchingLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      watchIdRef.current = Geolocation.watchPosition(
        async position => {
          if (!isMounted) return;
          const {latitude, longitude} = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Send location update to the server
          sendLocation(latitude, longitude);

          try {
            const response = await axios.get(
              `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`,
            );

            console.log(`Fetching address for: ${latitude}, ${longitude}`);

            if (response.data.items.length > 0) {
              setAddress(response.data.items[0].address.label);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        error => {
          console.error('Geolocation error:', error);
        },
        {enableHighAccuracy: true, distanceFilter: 10},
      );
    };

    startWatchingLocation();

    return () => {
      isMounted = false; // Cleanup function
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [authUser]); // Only runs when authUser changes

  return (
    <LocationContext.Provider
      value={{
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        address,
        setAddress,
        realTimeTrackerId,
        setRealTimeTrackerId
      }}>
      {children}
    </LocationContext.Provider>
  );
};
