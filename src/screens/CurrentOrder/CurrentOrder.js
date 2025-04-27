import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLocationContext} from '../../context_apis/Location';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapScreen from './MapScreen';
import {useSocketContext} from '../../context_apis/SocketContext';

const CurrentOrder = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const {authUser} = useAuthUserContext();
  const {address, longitude, latitude,setLatitude,setLongitude} = useLocationContext();
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState({});
  const [restaurantLocation, setRestaurantLocation] = useState({});
  const [destination, setDestination] = useState({});
  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on('currentOrder', data => {
        console.log('order from io ', data.order);
        setOrder(data.order);
      });
      return () => socket.off('currentOrder');
    }
  }, [socket]);

  useEffect(() => {

    const getDeliveryRoute = async () => {

      console.log("end point ",`http://localhost:4000/gps/deliveryRoute
            /${latitude}/${longitude}
            /${order.restaurantId.location.coordinates[1]}/${order.restaurantId.location.coordinates[0]}
            /${order.shippingAddress.latitude}/${order.shippingAddress.longitude}`);
            try {
              
              const response = await axios.get(
                `http://localhost:4000/gps/deliveryRoute/${latitude}/${longitude}/${order.restaurantId.location.coordinates[1]}/${order.restaurantId.location.coordinates[0]}/${order.shippingAddress.latitude}/${order.shippingAddress.longitude}`,
                {
                  headers: {'Content-Type': 'application/json'},
                  withCredentials: true,
                },
              );
              console.log('Route Coordinates ', response);
        
              setRouteCoordinates(response.data.routeCoordinates);
              setUserLocation(response.data.userLocation);
              setRestaurantLocation(response.data.restaurantLocation);
              setDestination(response.data.destination);

            } catch (error) {
              console.error('Error fetching delivery route:', error);
              
            }
    };

    if (order) getDeliveryRoute();

  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/order/assignedorder/${authUser.user._id}`,
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
          },
        );

        console.log("Assigned order",response.data);
        if (response.data) setOrder(response.data);

        let counter = 0;

        const intId=  setInterval(() => {
            const coordinates =[
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
            ];
            setLatitude(coordinates[counter].latitude);
            setLongitude(coordinates[counter].longitude);
            if(counter===coordinates.length-1){
              clearInterval(intId);
            }
            counter++;
          }, 5000);

      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">
          No current order available
        </Text>
      </View>
    );
  }

  return (
    <View>
      <MapScreen
        routeCoordinates={routeCoordinates}
        userLocation={userLocation}
        restaurantLocation={restaurantLocation}
        destination={destination}
      />

<View className="bg-gray-50 rounded-2xl px-4 py-2 shadow-md space-y-2 border-black border">
  {/* Address */}
  <View className="flex-row items-start space-x-3 border-b border-gray-200 pb-3">
    <Icon name="map-marker-outline" size={22} color="#9CA3AF" />
    <View className="flex-1">
      <Text className="text-gray-900 font-semibold">Delivery Address</Text>
      <Text className="text-gray-600 text-sm leading-snug">
        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
      </Text>
    </View>
  </View>

  {/* Status and ETA */}
  <View className="flex-row items-center space-x-6">
    <View className="flex-row items-center flex-1 space-x-2">
      <Icon name="progress-clock" size={20} color="#9CA3AF" />
      <Text className="text-gray-800 text-sm">
        <Text className="font-semibold">Status: </Text>{order.status}
      </Text>
    </View>
    <View className="flex-row items-center space-x-2">
      <Text className="text-gray-800 text-sm">
        <Text className="font-semibold">ETA: </Text>{order.eta} min
      </Text>
      <Icon name="clock-outline" size={20} color="#9CA3AF" />
    </View>
  </View>

  {/* Customer and Contact */}
  <View className="flex-row items-center space-x-6">
    <View className="flex-row items-center flex-1 space-x-2">
      <Icon name="human" size={20} color="#9CA3AF" />
      <Text className="text-gray-800 text-sm">
        <Text className="font-semibold">Customer: </Text>{order.userId.username}
      </Text>
    </View>
    <View className="flex-row items-center space-x-2">
      <Text className="text-gray-800 text-sm">
        <Text className="font-semibold">Contact: </Text>{order.userId.phoneNumber}
      </Text>
      <Icon name="cellphone" size={20} color="#9CA3AF" />
    </View>
  </View>
</View>
    </View>
  );
};

export default CurrentOrder;
