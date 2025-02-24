import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const MapScreen = ({routeCoordinates,userLocation,destination}) => {
 
  return (
    <View className="border-y-2 border-gray-300">
      <MapView
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        className="w-full h-96"
      >
        <Marker coordinate={userLocation}>
          <View style={styles.userLocationMarker} />
        </Marker>
        <Marker coordinate={destination} title="Destination" />
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={10} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10, // Circle shape
    backgroundColor: 'gray', // Circle color
    borderWidth: 2,
    borderColor: 'white', // Border around the circle
  },
});

export default MapScreen;
