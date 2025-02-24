import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Image, Text } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { useLocationContext } from "../../context_apis/Location";

const UserInfo = () => {
  const { authUser } = useAuthUserContext();
  const { address } = useLocationContext()
  const [isActive, setIsActive] = useState(authUser.user.isActive)

  const updateStatus = async () => {
      try {
          // Toggle the local state immediately
          const newStatus = !isActive;
          setIsActive(newStatus);
  
          // Send the update request to the backend
          const response = await axios.put(`http://localhost:4000/user/${authUser.user._id}`, { isActive: newStatus });
  
          // Check if the backend response is successful
          if (!response.data.message) {
              // If not successful, reset the state to previous value (optional)
              setIsActive(isActive); // Revert to previous state
          }
      } catch (error) {
          console.error("Error updating status:", error);
          // Optionally, handle errors (like showing a message to the user)
          setIsActive(isActive); // Revert to previous state if error occurs
      }
  };
  


  return (
      <View className='flex-row justify-between bg-orange-600'>

          <Switch
              value={isActive}
              onValueChange={updateStatus}
              trackColor={{ false: "#030", true: "#0b0" }}
              thumbColor={isActive ? "#0f0" : "#000"}
          />

          <View className='flex-row justify-end gap-2 items-center px-2 py-0.5'>
              <Text className=' text-white text-xs'>Welcome ,{authUser?.user?.username} ({address}) </Text>
              <Image
                  source={{ uri: String(authUser.user.image) }}
                  className='w-5 h-5 rounded-lg '
                  resizeMode="cover"
              />
          </View>
      </View>
  );
};


export default UserInfo;
