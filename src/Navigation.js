import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Signup from './screens/auths/signup';
import Login from './screens/auths/login';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRScanner from "./screens/QRCode/QRcodeScanner";
import CurrentOrder from "./screens/CurrentOrder/CurrentOrder";
import { Image, Settings, Switch, Text, View } from "react-native";
import UserSettings from "./screens/Settings/Settings";
import { useAuthUserContext } from "./context_apis/AuthUserContext";
import { useLocationContext } from "./context_apis/Location";
import { useState } from "react";
import axios from "axios";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {


    return (
        <NavigationContainer>

            <Stack.Navigator>
                <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='signup' component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name='bottomTabs' component={TabNavigation} options={{ headerShown: false }} />
            </Stack.Navigator>

        </NavigationContainer>

    );
};

export default Navigation;




const TabNavigation = () => {

    return (

        <Tab.Navigator
            screenOptions={{
                header: () => <UserInfo />,
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarActiveBackgroundColor: 'darkgray',
                tabBarInactiveBackgroundColor: '#eeeeee',
                animation: 'shift'
            }}
        >

            <Tab.Screen name='settings' component={UserSettings} />
            <Tab.Screen name='qrcodescanner' component={QRScanner} />
            <Tab.Screen name='currentorder' component={CurrentOrder} />

        </Tab.Navigator>

    );
};


const RestaurantsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        </Stack.Navigator>
    );
};




const UserInfo = () => {
    const { authUser } = useAuthUserContext();
    const { address } = useLocationContext()
    const [isActive, setIsActive] = useState(authUser.user.isActive)

    const updateStatus = async () => {
        try {
            // Toggle the local state immediately
            const newStatus = !isActive;
            setIsActive(newStatus);
    
            // Send the update request to the backend
            const response = await axios.put(`http://localhost:4000/user/${authUser.user._id}`, { isActive: newStatus });
    
            // Check if the backend response is successful
            if (!response.data.message) {
                // If not successful, reset the state to previous value (optional)
                setIsActive(isActive); // Revert to previous state
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Optionally, handle errors (like showing a message to the user)
            setIsActive(isActive); // Revert to previous state if error occurs
        }
    };
    


    return (
        <View className='flex-row justify-between bg-orange-600'>

            <Switch
                value={isActive}
                onValueChange={updateStatus}
                trackColor={{ false: "#030", true: "#0b0" }}
                thumbColor={isActive ? "#0f0" : "#000"}
            />

            <View className='flex-row justify-end gap-2 items-center px-2 py-0.5'>
                <Text className=' text-white text-xs'>Welcome ,{authUser?.user?.username} ({address}) </Text>
                <Image
                    source={{ uri: String(authUser.user.image) }}
                    className='w-5 h-5 rounded-lg '
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};