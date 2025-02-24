import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useLocationContext } from "../../context_apis/Location";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapScreen from "./MapScreen";


const CurrentOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuthUserContext();
    const { address, longitude, latitude } = useLocationContext()
    const routeCoordinates = [
        {
            latitude: 9.18759536743164,
            longitude: 38.763946533203125
        },
        {
            latitude: 9.187566757202148,
            longitude: 38.763954162597656
        },
        {
            latitude: 9.1875581741333,
            longitude: 38.763362884521484
        }
    ];

    const userLocation = {
        latitude: 9.18759536743164,
        longitude: 38.763946533203125
    }
    const destination = {
        latitude: 9.1875581741333,
        longitude: 38.763362884521484
    } // Destination: Summit



    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/order/deliveryperson/${authUser.user._id}`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order:", error);
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
                <Text className="text-lg text-gray-500">No current order available</Text>
            </View>
        );
    }

    return (
        <View >

            <MapScreen routeCoordinates={routeCoordinates} userLocation={userLocation} destination={destination} />

            <View className="bg-white rounded-xl px-6 py-11">


                <View className="border-b border-gray-300 pb-3 mb-3 flex-row items-center">
                    <Icon name="map-marker-outline" size={20} color="#555" />
                    <Text className="text-gray-600 ml-2 font-semibold">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                    </Text>
                </View>

                <View className="flex-row items-center mb-2">
                    <Icon name="progress-clock" size={20} color="#555" />
                    <Text className="text-gray-700 ml-2"><Text className="font-semibold">Status:</Text> {order.status}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                    <Icon name="human" size={20} color="#555" />
                    <Text className="text-gray-700 ml-2"><Text className="font-semibold">Customer:</Text> {order.userId.username}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                    <Icon name="phone-outline" size={20} color="#555" />
                    <Text className="text-gray-700 ml-2"><Text className="font-semibold">Contact:</Text> {order.userId.phoneNumber}</Text>
                </View>

                <View className="flex-row items-center">
                    <Icon name="clock-outline" size={20} color="#555" />
                    <Text className="text-gray-700 ml-2"><Text className="font-semibold">ETA:</Text> {order.eta} minutes</Text>
                </View>
            </View>




        </View>
    );
};

export default CurrentOrder;
