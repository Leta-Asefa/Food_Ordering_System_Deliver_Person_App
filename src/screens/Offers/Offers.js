import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import DeliveryHistory from './DeliveryHistory';
import {useSocketContext} from '../../context_apis/SocketContext';
import axios from 'axios';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import {playNotificationSound} from '../../helpers/constants';
import {useLocationContext} from '../../context_apis/Location';

const Offers = ({navigation}) => {
  const [currentOffer, setCurrentOffer] = useState();
  const [offerExpired, setOfferExpired] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const {authUser, setAuthUser} = useAuthUserContext();
  const {setRealTimeTrackerId, latitude, longitude, setLatitude, setLongitude} =
    useLocationContext();
  const socket = useSocketContext();
  let timeoutId = null;

  useEffect(() => {
    if (socket) {
      socket.on('offer', notification => {
        console.log('offer accepted !');
        setCurrentOffer(notification);
        setOfferExpired(false);
        playNotificationSound();
        // Set a timeout to clear the offer after 45 seconds
        timeoutId = setTimeout(() => {
          console.log('Offer expired after 45 seconds.');
          setOfferExpired(true);
        }, 20000); //20 seconds in milliseconds

        // Cleanup the timeout if the component unmounts or a new offer arrives
        return () => {
          clearTimeout(timeoutId);
        };
      });
      return () => socket.off('offer');
    }
  }, [socket]);

  const handleAcceptOffer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/order/${currentOffer?.orderId}/deliveryperson`,
        {
          deliveryPersonId: authUser.user._id,
          restaurantId: currentOffer.restaurantId,
        },
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );

      if (response.data.message) {
        setCurrentOffer(null);
        Alert.alert(
          'Offer Accepted !',
          'Dear Delivery Person ,you are assigned to the order. Please go to the restaurant and pick it up.',
        );
        setOfferAccepted(true);
        const id = setInterval(async () => {
          const response = await axios.get(
            `http://localhost:4000/gps/realTimeUpdate/${latitude}/${longitude}/${currentOffer.userId}`,
            {
              headers: {'Content-Type': 'application/json'},
              withCredentials: true,
            },
          );
        }, 1000);
        setRealTimeTrackerId(id);
        
        let counter = 0;

      const intId=  setInterval(() => {
          const coordinates = [
            { latitude: 11.59738, longitude: 37.39493 },
            { latitude: 11.5974, longitude: 37.39486 },
            { latitude: 11.59741, longitude: 37.39475 },
            { latitude: 11.59742, longitude: 37.39463 },
            { latitude: 11.59737, longitude: 37.39452 },
            { latitude: 11.59733, longitude: 37.39441 },
            { latitude: 11.5973, longitude: 37.39431 },
            { latitude: 11.59727, longitude: 37.39421 },
            { latitude: 11.59725, longitude: 37.39411 },
            { latitude: 11.59723, longitude: 37.394 },
            { latitude: 11.59719, longitude: 37.3939 },
            { latitude: 11.59714, longitude: 37.39379 },
            { latitude: 11.59712, longitude: 37.3937 },
            { latitude: 11.5971, longitude: 37.3936 },
            { latitude: 11.59706, longitude: 37.39351 },
            { latitude: 11.59701, longitude: 37.39342 },
            { latitude: 11.59699, longitude: 37.39334 },
            { latitude: 11.59697, longitude: 37.39326 },
            { latitude: 11.59695, longitude: 37.39317 },
            { latitude: 11.59694, longitude: 37.39308 },
            { latitude: 11.59693, longitude: 37.39299 },
            { latitude: 11.59693, longitude: 37.39291 },
            { latitude: 11.59694, longitude: 37.39283 },
            { latitude: 11.59696, longitude: 37.39275 },
            { latitude: 11.59697, longitude: 37.39268 },
            { latitude: 11.59699, longitude: 37.39261 },
            { latitude: 11.59701, longitude: 37.39254 },
            { latitude: 11.59704, longitude: 37.39248 },
            { latitude: 11.59707, longitude: 37.39241 },
            { latitude: 11.59709, longitude: 37.39235 },
            { latitude: 11.59711, longitude: 37.39229 },
            { latitude: 11.59713, longitude: 37.39223 },
            { latitude: 11.59714, longitude: 37.39217 },
            { latitude: 11.59714, longitude: 37.39211 },
            { latitude: 11.59714, longitude: 37.39205 },
            { latitude: 11.59714, longitude: 37.39199 },
            { latitude: 11.59713, longitude: 37.39193 },
            { latitude: 11.59711, longitude: 37.39188 },
            { latitude: 11.59709, longitude: 37.39182 },
            { latitude: 11.59706, longitude: 37.39176 },
            { latitude: 11.59703, longitude: 37.3917 },
            { latitude: 11.59699, longitude: 37.39164 },
            { latitude: 11.59695, longitude: 37.39159 },
            { latitude: 11.5969, longitude: 37.39154 },
            { latitude: 11.59685, longitude: 37.39149 },
            { latitude: 11.59679, longitude: 37.39145 },
            { latitude: 11.59674, longitude: 37.3914 },
            { latitude: 11.59668, longitude: 37.39136 },
            { latitude: 11.59661, longitude: 37.39131 },
            { latitude: 11.59655, longitude: 37.39127 },
            { latitude: 11.59649, longitude: 37.39122 },
            { latitude: 11.59642, longitude: 37.39118 },
            { latitude: 11.59636, longitude: 37.39113 },
            { latitude: 11.59629, longitude: 37.39108 },
            { latitude: 11.59622, longitude: 37.39103 },
            { latitude: 11.59615, longitude: 37.39098 },
            { latitude: 11.59608, longitude: 37.39092 },
            { latitude: 11.59601, longitude: 37.39087 },
            { latitude: 11.59594, longitude: 37.39082 },
            { latitude: 11.59587, longitude: 37.39077 },
            { latitude: 11.5958, longitude: 37.39072 },
            { latitude: 11.59573, longitude: 37.39067 },
            { latitude: 11.59566, longitude: 37.39062 },
            { latitude: 11.59559, longitude: 37.39057 },
            { latitude: 11.59552, longitude: 37.39052 },
            { latitude: 11.59545, longitude: 37.39047 },
            { latitude: 11.59538, longitude: 37.39042 },
            { latitude: 11.59531, longitude: 37.39037 },
            { latitude: 11.59524, longitude: 37.39032 }
          ]
          setLatitude(coordinates[counter].latitude);
          setLongitude(coordinates[counter].longitude);
          if(counter===coordinates.length-1){
            clearInterval(intId);
          }
          counter++;
        }, 5000);

        navigation.navigate('currentorder');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const handleDeclineOffer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/order/${currentOffer?.orderId}/deliveryoffer/${currentOffer.restaurantId}`,
        {
          deliveryPersonId: authUser.user._id,
          restaurantId: currentOffer.restaurantId,
        },
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );

      console.log(response);

      if (response.data.message) {
        Alert.alert('Offer Declined !', 'Wait till another offer comes !');
      }

      setCurrentOffer(null);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  useEffect(() => {
    if (offerExpired && !offerAccepted) handleDeclineOffer();
  }, [offerExpired]);

  const updateStatus = async () => {
    const previousStatus = authUser.user.isActive; // Save current state

    // Optimistically update UI
    setAuthUser(prevAuthUser => ({
      ...prevAuthUser,
      user: {
        ...prevAuthUser.user,
        isActive: false,
      },
    }));

    try {
      // Send update request to the backend
      const response = await axios.put(
        `http://localhost:4000/user/${authUser.user._id}`,
        {isActive: false},
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
    <View className="flex-1">
      {/* Offer Notification Section */}
      <View className="p-4 bg-white shadow-sm border-b border-orange-600">
        <Text className="text-xl font-bold mb-2">Current Offer</Text>
        {currentOffer ? (
          <View className="bg-green-100 p-3 rounded-lg">
            <Text className="text-green-700 font-semibold">
              New Offer Available!
            </Text>
            <Text className="text-gray-600 mt-1">
              Pickup: {currentOffer.pickupLocation}
            </Text>
            <Text className="text-gray-600">
              Delivery: {currentOffer.deliveryLocation}
            </Text>
            <Text className="text-gray-600">
              Estimated Time: {currentOffer.eta}
            </Text>

            {/* Accept and Decline Buttons */}
            <View className="flex-row justify-between mt-3">
              <Text
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
                onPress={() => handleAcceptOffer(currentOffer)}>
                Accept
              </Text>
              <Text
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                onPress={() => handleDeclineOffer(currentOffer)}>
                Decline
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-500">No current offer.</Text>
        )}
      </View>

      <DeliveryHistory />
    </View>
  );
};

export default Offers;
