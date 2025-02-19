import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Signup from './screens/auths/signup';
import Login from './screens/auths/login';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRCodeScanner from "./screens/QRCode/QRcodeScanner";

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
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarActiveBackgroundColor: 'darkgray',
                tabBarInactiveBackgroundColor: '#eeeeee',
                animation: 'shift'
            }}
        >
            <Tab.Screen name='qrcodescanner' component={QRCodeScanner} />
       
        </Tab.Navigator>

    );
};


const RestaurantsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        </Stack.Navigator>
    );
};

