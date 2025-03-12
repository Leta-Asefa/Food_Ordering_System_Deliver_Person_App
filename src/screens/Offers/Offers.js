import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import DeliveryHistory from "./DeliveryHistory";
import { useSocketContext } from "../../context_apis/SocketContext";
import axios from "axios";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { playNotificationSound } from "../../helpers/constants";

const Offers = ({ navigation }) => {

    const [currentOffer, setCurrentOffer] = useState();
    const [offerExpired, setOfferExpired] = useState(false)
    const [offerAccepted, setOfferAccepted] = useState(false)
    const { authUser, setAuthUser } = useAuthUserContext()
    const socket = useSocketContext()
    let timeoutId=null



    useEffect(() => {
        if (socket) {

            socket.on('offer', (notification) => {
                console.log("offer accepted !")
                setCurrentOffer(notification)
                setOfferExpired(false)
                playNotificationSound()
                // Set a timeout to clear the offer after 45 seconds
                 timeoutId = setTimeout(() => {
                    console.log("Offer expired after 45 seconds.");
                    setOfferExpired(true)
                }, 20000); //20 seconds in milliseconds

                // Cleanup the timeout if the component unmounts or a new offer arrives
                return () => {
                    clearTimeout(timeoutId);
                };
            }
            )
            return () => socket.off('offer')
        }
    }, [socket])

    const handleAcceptOffer = async () => {

        try {
            const response = await axios.put(`http://localhost:4000/order/${currentOffer?.orderId}/deliveryperson`, { deliveryPersonId: authUser.user._id, restaurantId: currentOffer.restaurantId }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.message) {
                setCurrentOffer(null)
                Alert.alert("Offer Accepted !", "Dear Delivery Person ,you are assigned to the order. Please go to the restaurant and pick it up.")
                updateStatus()
                setOfferAccepted(true)
                navigation.navigate('currentorder')
            }


        } catch (error) {
            console.error("Error fetching order:", error);
        }

    }

    const handleDeclineOffer = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/order/${currentOffer?.orderId}/deliveryoffer/${currentOffer.restaurantId}`, { deliveryPersonId: authUser.user._id, restaurantId: currentOffer.restaurantId }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            console.log(response)

            if (response.data.message) {
                Alert.alert("Offer Declined !", "Wait till another offer comes !")
            }

            setCurrentOffer(null)

        } catch (error) {
            console.error("Error fetching order:", error);
        }

    }


    useEffect(() => {
        if (offerExpired && !offerAccepted)
            handleDeclineOffer()

    }, [offerExpired])

    const updateStatus = async () => {
        const previousStatus = authUser.user.isActive; // Save current state

        // Optimistically update UI
        setAuthUser((prevAuthUser) => ({
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
                { isActive: false }
            );

            // If API call fails, revert state
            if (!response.data.message) {
                setAuthUser((prevAuthUser) => ({
                    ...prevAuthUser,
                    user: {
                        ...prevAuthUser.user,
                        isActive: previousStatus,
                    },
                }));
            }
        } catch (error) {
            console.error("Error updating status:", error);

            // Revert state on error
            setAuthUser((prevAuthUser) => ({
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
