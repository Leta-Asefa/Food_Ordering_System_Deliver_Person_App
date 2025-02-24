import React, { useState } from "react";
import { View, Text } from "react-native";
import DeliveryHistory from "./DeliveryHistory";

const Offers = () => {

    const [currentOffer, setCurrentOffer] = useState({pickupLocation:"Megenagna, Romina Cafe",
        deliveryLocation:"Gurdshola, Around Telecom",
        eta: "30 Minutes"

    });

    const handleAcceptOffer=async () => {
        
    }

    const handleDeclineOffer=async () => {
        
    }


    return (
        <View className="flex-1">

          {/* Offer Notification Section */}
<View className="p-4 bg-white shadow-sm border-b border-orange-600">
    <Text className="text-xl font-bold mb-2">Current Offer</Text>
    {currentOffer ? (
        <View className="bg-green-50 p-3 rounded-lg">
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
                    onPress={() => handleAcceptOffer(currentOffer)}
                >
                    Accept
                </Text>
                <Text
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onPress={() => handleDeclineOffer(currentOffer)}
                >
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
