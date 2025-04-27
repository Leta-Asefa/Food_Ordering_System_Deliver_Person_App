import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  InteractionManager,
  Image,
} from 'react-native';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE,AnimatedRegion, Animated as AnimatedMap} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSocketContext} from '../../context_apis/SocketContext';
import {useLocationContext} from '../../context_apis/Location';

const {width, height} = Dimensions.get('window');

const MapScreen = ({
  routeCoordinates,
  userLocation,
  destination,
  restaurantLocation,
}) => {


  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const {latitude, longitude} = useLocationContext();
  const driverPosition = useRef(
    new AnimatedRegion({
      latitude: latitude || 0,
      longitude: longitude || 0,
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005,
    })
  ).current;
  
  useEffect(() => {
    if (!latitude || !longitude) return;
  
    const newCoordinate = {
      latitude,
      longitude,
      latitudeDelta: 0.0008,
      longitudeDelta: 0.0008,
    };

    driverPosition.stopAnimation(); // cancel previous animation

  
    driverPosition.timing({
      ...newCoordinate,
      duration: 5000,
      useNativeDriver: false, // must be false for Android
    }).start();

  }, [latitude, longitude]);
  
  useEffect(() => {
    if (polylineRef.current && routeCoordinates.length > 1) {
      polylineRef.current.setNativeProps({coordinates: routeCoordinates});
    }
  }, [routeCoordinates]);

  useEffect(() => {
    if (
      mapRef.current &&
      Array.isArray(routeCoordinates) &&
      routeCoordinates.length > 1
    ) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(routeCoordinates, {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          animated: true,
        });
      }, 1000); // delay gives map time to layout
    }
  }, [JSON.stringify(routeCoordinates)]);

  //auto center on the driver 
  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,
      }, 1000);
    }
  }, [latitude, longitude]);
  


  return (
    <View className="h-[500px] w-full">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="w-full h-full"
        showsUserLocation>
        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            ref={polylineRef}
            key={`polyline_${routeCoordinates.length}`} // Force re-render
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}

        {/* User Location Marker */}
        {userLocation?.latitude && userLocation?.longitude && (
          <Marker coordinate={userLocation} title="You are here"  anchor={{ x: 0.2, y: 0.2 }}>
            <Ionicons name="location" size={20} color="blue" />
          </Marker>
        )}

        {/* Restaurant Location Marker */}
        {restaurantLocation?.latitude && restaurantLocation?.longitude && (
          <Marker coordinate={restaurantLocation} title="You are here"  anchor={{ x: 0.2, y: 0.2 }}>
            <Ionicons name="restaurant" size={20} color="blue" />
          </Marker>
        )}

        {latitude && longitude ? (
          <Marker.Animated
          coordinate={driverPosition}
           title="Delivery Vehicle"
           anchor={{ x: 0.2, y: 0.2 }}
           >
            <Ionicons name="square" size={20} color="blue" />
          </Marker.Animated>
        ) : (
          <Marker coordinate={userLocation} title="Waiting to move"  anchor={{ x: 0.2, y: 0.2 }}>
            <Ionicons name="car" size={20} color="gray" />
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.latitude && destination?.longitude && (
          <Marker coordinate={destination} title="You are here"  anchor={{ x: 0.2, y: 0.2 }}>
            <Ionicons name="home" size={20} color="blue" />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;
