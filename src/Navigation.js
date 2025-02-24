import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Signup from './screens/auths/signup';
import Login from './screens/auths/login';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRScanner from "./screens/QRCode/QRcodeScanner";
import CurrentOrder from "./screens/CurrentOrder/CurrentOrder";
import UserSettings from "./screens/Settings/Settings";
import UserInfo from "./screens/Partials/UserInfo";
import Offers from "./screens/Offers/Offers";
import Ionicons from 'react-native-vector-icons/Ionicons'; 

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
        screenOptions={({ route }) => ({
          header: () => <UserInfo />, // Custom header
          headerShown: true,
          tabBarShowLabel: true,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
          tabBarActiveBackgroundColor: 'darkgray',
          tabBarInactiveBackgroundColor: '#eeeeee',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Set icons based on route name
            if (route.name === 'settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'qrcodescanner') {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            } else if (route.name === 'currentorder') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'offers') {
              iconName = focused ? 'pricetag' : 'pricetag-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="settings" component={UserSettings} />
        <Tab.Screen name="qrcodescanner" component={QRScanner} />
        <Tab.Screen name="currentorder" component={CurrentOrder} />
        <Tab.Screen name="offers" component={Offers} />
      </Tab.Navigator>
    );
};


const RestaurantsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        </Stack.Navigator>
    );
};




