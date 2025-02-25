import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Image, Text } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { useLocationContext } from "../../context_apis/Location";
import { useSocketContext } from "../../context_apis/SocketContext";
import axios from "axios";

const UserInfo = () => {
  const { authUser,setAuthUser } = useAuthUserContext();
  const { address } = useLocationContext()
  const [isActive, setIsActive] = useState(authUser.user.isActive)

    const socket = useSocketContext()
  
      useEffect(() => {
          if (socket) {
  
              socket.on('updateAvailablity', (status) => {
                  console.log("order from io ",status)
                  setAuthUser((prevAuthUser) => ({
                    ...prevAuthUser, // Keep other fields unchanged
                    user: {
                        ...prevAuthUser.user, // Keep other user fields unchanged
                        isActive: status, // Update only the isActive field
                    },
                }));

                setIsActive(status)

              }
              )
              return () => socket.off('updateAvailablity')
          }
      }, [socket])



  const updateStatus = async () => {
      try {
          // Toggle the local state immediately
          const newStatus = !isActive;
          setIsActive(newStatus);
  
          // Send the update request to the backend
          const response = await axios.put(`http://localhost:4000/user/${authUser.user._id}`, { isActive: newStatus });
  console.log(response.data)
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
