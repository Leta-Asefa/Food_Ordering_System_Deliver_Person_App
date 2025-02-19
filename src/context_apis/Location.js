import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from "react-native";

// Create the context
export const LocationContext = createContext();

// Secure API Key Storage
const apiKey = process.env.HERE_MAPS_API_KEY||'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk' 

// Custom hook to use the Location
export const useLocationContext = () => {
  return useContext(LocationContext);
};

// Provider component to wrap your application and provide the location state
export const LocationContextProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const watchIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks

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
              message: 'We need to access your location to track your movement.',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Permission request failed:', err);
        return false;
      }
    };

    const startWatchingLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      watchIdRef.current = Geolocation.watchPosition(
        async (position) => {
          if (!isMounted) return;
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          try {
            const response = await axios.get(
              `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`
            );

            console.log(`Fetching address for: ${latitude}, ${longitude}`);

            if (response.data.items.length > 0) {
              setAddress(response.data.items[0].address.label);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, distanceFilter: 10,interval:200000 }
      );
    };

    startWatchingLocation();

    return () => {
      isMounted = false; // Cleanup function
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ latitude, setLatitude, longitude, setLongitude, address, setAddress }}>
      {children}
    </LocationContext.Provider>
  );
};
