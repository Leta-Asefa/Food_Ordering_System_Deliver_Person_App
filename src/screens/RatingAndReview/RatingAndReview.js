import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";

const RatingAndReview = () => {
    const {authUser}=useAuthUserContext()
    const [reviews,setReviews]=useState()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/delivery_person_rating/${authUser.user._id}/all`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });


                if (response.data)
                    setReviews(response.data)
                
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    return (
        <View className="flex-1 bg-white">
        {/* Header */}
        <View className="py-2 bg-gray-100 border-b border-gray-200">
          <Text className="text-lg font-bold text-center">Your Rating: {authUser.user.rating}</Text>
        </View>
  
        {/* Reviews List */}
        <ScrollView className="p-4">
          {reviews?.map((review) => (
            <View key={review._id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              {/* Username and Rating */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-md font-semibold">{review.user.username}</Text>
                <Text className="text-md text-yellow-500 font-semibold">Rating: {review.rating}</Text>
              </View>
  
              {/* Review Text */}
              <Text className="text-gray-700">{review.review}</Text>
  
              {/* Date */}
              <Text className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
};

export default RatingAndReview;
