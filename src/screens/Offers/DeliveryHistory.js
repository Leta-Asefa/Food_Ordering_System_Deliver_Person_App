import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";

const DeliveryHistory = () => {
    const { authUser } = useAuthUserContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/order/deliveryhistory/${authUser.user._id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                setOrders(response.data); // Assuming the response contains an "orders" array
                setLoading(false);
            } catch (error) {
                console.error("Error fetching delivery history:", error);
                setError("Failed to fetch delivery history. Please try again later.");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-lg">{error}</Text>
            </View>
        );
    }

    if (orders?.length === 0) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500 text-lg">No delivery history found.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 p-4 bg-gray-50">

 

            <Text className="text-2xl font-bold mb-6">Delivery History</Text>

            {orders?.map((order, index) => (
                <View
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm mb-4"
                >
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-lg font-semibold">
                            Order #{index + 1}
                        </Text>
                        <Text
                            className={`text-sm font-medium ${
                                order.status === "Delivered"
                                    ? "text-green-600"
                                    : order.status === "Pending"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                        >
                            {order.status}
                        </Text>
                    </View>

                    <Text className="text-gray-600 mb-1">
                        <Text className="font-semibold">Customer:</Text> {order.userId.username}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                        <Text className="font-semibold">Delivery Address:</Text> {order.shippingAddress.address}
                    </Text>
                    <Text className="text-gray-600">
                        <Text className="font-semibold">ETA:</Text> {order.eta}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default DeliveryHistory;