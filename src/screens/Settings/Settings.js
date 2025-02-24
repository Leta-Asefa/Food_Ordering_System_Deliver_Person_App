import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, Switch, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { launchImageLibrary } from "react-native-image-picker"; // Import image picker
import axios from "axios";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dpavrc7wd/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';


const UserSettings = () => {
  const { authUser, setAuthUser } = useAuthUserContext();
  const [editable, setEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(authUser?.user?.image ?? "");
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [form, setForm] = useState({
    username: authUser?.user?.username ?? "",
    phoneNumber: authUser?.user?.phoneNumber ?? "",
    vehicle: authUser?.user?.vehicle ?? "",
  });

  // Function to update profile photo
  const updatePhoto = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        return;
      }
      if (response.errorCode) {
        console.log("Image picker error: ", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const { uri, type, fileName } = response.assets[0];

        // Prepare image for upload
        const formData = new FormData();
        formData.append("file", {
          uri,
          type: type || "image/jpeg", // Fallback to "image/jpeg" if type is missing
          name: fileName || "upload.jpg", // Fallback name
        });
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);


        try {
          // Upload to Cloudinary
          const cloudinaryResponse = await axios.post(CLOUDINARY_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const uploadedImageUrl = cloudinaryResponse.data.secure_url;

          // Send image URL to backend to update user profile
          await axios.put(`http://localhost:4000/user/${authUser.user._id}`, {
            image: uploadedImageUrl,
          });

          // Update state
          setProfileImage(uploadedImageUrl);
          setAuthUser({ ...authUser, user: { ...authUser.user, image: uploadedImageUrl } });
          Alert.alert("Profile Updated", "Your profile picture has been updated.");
        } catch (error) {
          console.log("Upload error:", error);
          Alert.alert("Upload Failed", "Could not update profile picture. Try again.");
        }
      }
    });
  };

  const updateUserInfo = async () => {

    try {
      const response = await axios.put(`http://localhost:4000/user/${authUser.user._id}`, {
        username: form.username,
        phoneNumber: form.phoneNumber,
        vehicle: form.vehicle
      });

      if (response.data.message) {
        setEditable(false)
        Alert.alert("Profile Updated", "Your personal info has been updated.");
        setAuthUser({ ...authUser, user: { ...authUser.user, username: form.username, phoneNumber: form.phoneNumber, vehicle: form.vehicle } });
      }



    } catch (error) {
      console.log(error)
    }
  }

  const updatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/user/changePassword`, {
        username: authUser.user.username,
        oldPassword,
        newPassword,
      });

      if (response.data.message) {
        Alert.alert("Success", "Your password has been updated.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update password. Check your old password.");
    }
  };



  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>

      <ScrollView>


        <View className="flex-1 p-4 bg-white">
          {/* Toggle Editing */}
          <View className="flex-row items-center mb-3">
            <Switch
              value={editable}
              onValueChange={(value) => setEditable(value)}
              trackColor={{ false: "black", true: "orange" }}
              thumbColor={editable ? "orange" : "black"}
            />
            <Text className="ml-2 text-gray-800">Enable Editing</Text>
          </View>

          {/* Profile Picture */}
          <TouchableOpacity disabled={!editable} onPress={updatePhoto} className="items-center ">
            <Image
              source={profileImage ? { uri: profileImage } : require("../../assets/default_profile_pic.png")}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
            <Text className={`text-blue-500 ${editable ? 'visible' : 'hidden'}`}>Change Profile Picture</Text>
          </TouchableOpacity>

          {/* User Details */}
          <View className="bg-white p-4 rounded-lg shadow-md">
            <Text className="text-lg font-semibold mb-2 text-gray-800">User Details</Text>

            {/* Username Input */}
            <TextInput
              className="border border-gray-300 bg-white p-3 rounded-md mb-3 text-gray-800"
              placeholder="Enter Username"
              placeholderTextColor="gray"
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
              editable={editable}
            />

            {/* Phone Number Input */}
            <TextInput
              className="border border-gray-300 bg-white p-3 rounded-md mb-3 text-gray-800"
              placeholder="Enter Phone Number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
              editable={editable}
            />

            {/* Vehicle Input */}
            <TextInput
              className="border border-gray-300 bg-white p-3 rounded-md text-gray-800"
              placeholder="Enter Vehicle"
              placeholderTextColor="gray"
              value={form.vehicle}
              onChangeText={(text) => setForm({ ...form, vehicle: text })}
              editable={editable}
            />

            <TouchableOpacity className={`${editable ? "visible" : 'hidden'}`} onPress={updateUserInfo}>
              <Text className='text-white bg-orange-500 text-center py-1.5 font-bold rounded-lg mt-1'>Update</Text>
            </TouchableOpacity>

            <View className="bg-white rounded-lg shadow-md mt-4">
              <Text className="text-lg font-semibold mb-2 text-gray-800">Change Password</Text>

              {/* Old Password Input */}
              <TextInput
                className="border border-gray-300 bg-white p-2 rounded-md mb-3 text-gray-800"
                placeholder="Enter Old Password"
                placeholderTextColor="gray"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />

              {/* New Password Input */}
              <TextInput
                className="border border-gray-300 bg-white p-2 rounded-md mb-3 text-gray-800"
                placeholder="Enter New Password"
                placeholderTextColor="gray"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              {/* Confirm Password Input */}
              <TextInput
                className="border border-gray-300 bg-white p-2 rounded-md text-gray-800"
                placeholder="Confirm New Password"
                placeholderTextColor="gray"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {/* Update Button */}
              <TouchableOpacity onPress={updatePassword}>
                <Text className="text-white bg-orange-500 text-center py-1.5 font-bold rounded-lg mt-1">Update Password</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default UserSettings;
