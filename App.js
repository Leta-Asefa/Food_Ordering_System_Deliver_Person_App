import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Signup from './src/screens/auths/signup';
import Login from './src/screens/auths/login';
import Restaurants from './src/screens/lists/Restaurants';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown:false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
          tabBarActiveBackgroundColor:'darkgray',
          tabBarInactiveBackgroundColor:'#eeeeee'
        }}

        
      >


<Tab.Screen 
          name='restaurants_list' 
          component={Restaurants} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="player-settings" size={size} color={color} />
            ),
            tabBarBadge:3,
            tabBarBadgeStyle:{backgroundColor:'green',color:'white',fontSize:10,padding:0 /*you can set the style to deafult value*/}
          }} 
        />



        <Tab.Screen 
          name='login' 
          component={Login} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="home" size={size} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name='signup' 
          component={Signup} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="player-settings" size={size} color={color} />
            ),
            tabBarBadge:3,
            tabBarBadgeStyle:{backgroundColor:'green',color:'white',fontSize:10,padding:0 /*you can set the style to deafult value*/}
          }} 
        />
       


     



      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
