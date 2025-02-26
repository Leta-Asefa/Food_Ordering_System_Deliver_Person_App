import React, { useState, useEffect } from "react";
import { Alert, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";
import { playNotificationSound } from "../../helpers/constants";

const QRScanner = () => {
  const { authUser } = useAuthUserContext()
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);
  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      setScannedValue(codes[0].value)
      verifyOrderId(codes[0].value)
    }
  });


  const verifyOrderId = async (newScannedValue) => {
    try {


      if (scannedValue !== newScannedValue) {

        const response = await axios.get(`http://localhost:4000/order/verify/${newScannedValue}/${authUser.user._id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log(response.data)

        if (response.data.verified) {
          Alert.alert("Order Id is correct", 'The order id is correct. Order status is changed to "Delivered".')
          playNotificationSound()
        } else
          Alert.alert("Oops! Invalid Id", 'This is not your delivery order id.')


      }


    } catch (error) {

    }
  }




  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera.requestCameraPermission ", permission);
      setHasPermission(permission === "granted");
    };

    requestCameraPermission();
  }, []);

  if (device == null || !hasPermission) {
    return (
      <View className=''>
        <Text style={{ backgroundColor: "white" }}>
          Camera not available or not permitted
        </Text>
      </View>
    );
  }

  return (

    <View className='p-5 h-screen'>

      <View className='border-2 mx-auto border-black w-72 h-72'>

        <Camera
          codeScanner={codeScanner}
          device={device}
          isActive={true}
          className='w-full h-full'
        />

      </View>

      <View className=' mt-20 px-2 py-4 rounded-lg bg-slate-200'>

        {scannedValue ? (
          <Text className='text-center py-1'>Scanned Result : {scannedValue}</Text>
        ) : (
          <Text className='text-center py-1'>Scan a QR code</Text>
        )}


        <TouchableOpacity
          className=''
          onPress={() => setScannedValue(null)}
        >
          <Text className='text-center p-3 bg-red-500 text-white font-semibold mt-2 rounded-lg'>Clear</Text>
        </TouchableOpacity>
      </View>

    </View>

  );
};

export default QRScanner;


