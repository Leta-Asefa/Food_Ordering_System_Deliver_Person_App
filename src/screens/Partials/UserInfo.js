import React, {useEffect} from 'react';
import {View, Switch, Image, Text, TouchableOpacity} from 'react-native';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import {useLocationContext} from '../../context_apis/Location';
import {useSocketContext} from '../../context_apis/SocketContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const UserInfo = () => {
  const {authUser, setAuthUser} = useAuthUserContext();
  const {address} = useLocationContext();
  const navigation = useNavigation();
  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on('updateAvailablity', status => {
        console.log('order from io ', status);
        setAuthUser(prevAuthUser => ({
          ...prevAuthUser,
          user: {
            ...prevAuthUser.user,
            isActive: status,
          },
        }));
      });
      return () => socket.off('updateAvailablity');
    }
  }, [socket, setAuthUser]);

  const updateStatus = async () => {
    const previousStatus = authUser.user.isActive; // Save current state
    const newStatus = !previousStatus; // Toggle state

    // Optimistically update UI
    setAuthUser(prevAuthUser => ({
      ...prevAuthUser,
      user: {
        ...prevAuthUser.user,
        isActive: newStatus,
      },
    }));

    try {
      // Send update request to the backend
      const response = await axios.put(
        `http://localhost:4000/user/${authUser.user._id}`,
        {isActive: newStatus},
      );

      // If API call fails, revert state
      if (!response.data.message) {
        setAuthUser(prevAuthUser => ({
          ...prevAuthUser,
          user: {
            ...prevAuthUser.user,
            isActive: previousStatus,
          },
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);

      // Revert state on error
      setAuthUser(prevAuthUser => ({
        ...prevAuthUser,
        user: {
          ...prevAuthUser.user,
          isActive: previousStatus,
        },
      }));
    }
  };

  return (
    <View className="flex-row justify-end bg-orange-600">
      {/* <Switch
                    value={authUser.user.isActive}
                    onValueChange={updateStatus}
                    trackColor={{ false: "#030", true: "#0b0" }}
                    thumbColor={authUser.user.isActive ? "#0f0" : "#000"}
                /> */}
      <TouchableOpacity onPress={() => navigation.navigate('settings')}>
        <View className="flex-row justify-end gap-2 items-center px-2 py-0.5">
          <Text
            className="text-white text-xs w-64 text-right"
            numberOfLines={1}>
            Welcome, {authUser?.user?.username} ({address})
          </Text>
          <Image
            source={{uri: String(authUser.user.image)}}
            className="w-5 h-5 rounded-lg"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserInfo;
