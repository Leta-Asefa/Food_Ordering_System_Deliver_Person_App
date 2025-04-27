import React, {useState, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import axios from 'axios';
import {playNotificationSound} from '../../helpers/constants';
import {useLocationContext} from '../../context_apis/Location';

const QRScanner = () => {
  const {authUser} = useAuthUserContext();
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);
  const {realTimeTrackerId} = useLocationContext();
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      setScannedValue(codes[0].value);
      verifyOrderId(codes[0].value);
    },
  });

  const verifyOrderId = async newScannedValue => {
    try {
      if (scannedValue !== newScannedValue) {
        const response = await axios.get(
          `http://localhost:4000/order/verify/${newScannedValue}/${authUser.user._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        );
        console.log(response.data);

        if (response.data.verified) {
          Alert.alert(
            'Order Id is correct',
            'The order id is correct. Order status is changed to "Delivered".',
          );
          clearInterval(realTimeTrackerId);
          playNotificationSound();
        } else
          Alert.alert(
            'Oops! Invalid Id',
            'This is not your delivery order id.',
          );
      }
    } catch (error) {}
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log('Camera.requestCameraPermission ', permission);
      setHasPermission(permission === 'granted');
    };

    requestCameraPermission();
  }, []);

  if (device == null || !hasPermission) {
    return (
      <View className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center space-x-3">
        <Icon name="timer" size={22} color="#DC2626" />
        <Text className="text-gray-800 font-medium  text-center">
          For the time being, Camera not available or permission denied.
        </Text>
      </View>
    );
  }

  return (
    <View className="p-0 h-screen">
      <View className=" w-full h-[500] ">
        <Camera
          codeScanner={codeScanner}
          device={device}
          isActive={true}
          className="w-full h-full"
        />
      </View>

      <View className=" mt-0 px-2 py-2 rounded-lg bg-white">
        {scannedValue ? (
          <Text className="text-center py-1">
            Scanned Result : {scannedValue}
          </Text>
        ) : (
          <Text className="text-center py-1">Scan a QR code</Text>
        )}

        <TouchableOpacity className="" onPress={() => setScannedValue(null)}>
          <Text className="text-center p-3 bg-orange-500 text-white font-semibold mt-2 rounded-lg">
            Clear
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QRScanner;
