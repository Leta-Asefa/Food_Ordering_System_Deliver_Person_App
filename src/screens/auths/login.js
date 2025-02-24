import React, { useState } from 'react'
import { Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ToastAndroid, ImageBackground } from 'react-native'
import validationSchema from '../../validations/login'
import backgroud from '../../assets/background.png'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthUserContext } from '../../context_apis/AuthUserContext'

const header = 'text-center text-3xl font-bold mt-14 text-primary'
const image = 'w-40 h-40 mx-auto rounded-full my-3'
const textinput = 'mt-3 mb-1 text-orange-500 font-bold'
const button = 'w-36 text-xl text-center text-white bg-orange-600 rounded-lg px-3 py-1 mt-3 mx-auto'
const footer = 'text-orange-950 underline text-center mt-2'

export default function Login({ navigation }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isUsernameFocused, setIsUsernameFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const {setAuthUser}=useAuthUserContext()

  const [error, setError] = useState([])

  const validateInputs = async (inputs) => {
    try {

      await validationSchema.validate(inputs);
      setError('');
      return true;
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.message);
      }
      return false;
    }
  };


  const handleSubmit = async () => {
    const isValid = await validateInputs({ username, password })
    if (isValid) {
      const formData = { username, password }
      const response = await axios.post(`http://localhost:4000/user/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.user._id) {
        await AsyncStorage.setItem('authUser', JSON.stringify(response.data))
        setAuthUser(response.data)
        navigation.navigate('bottomTabs')
      } else {
        console.log('response got an error')
      }

    }
    else {

      ToastAndroid.showWithGravity(error, ToastAndroid.LONG, ToastAndroid.TOP)

    }


  }





  return (

    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <ImageBackground
        source={backgroud}
        className='w-full h-full'
      >

        <View className=' flex-1 flex-col items-center justify-between'>

          <Text
            className='text-black font-bold text-2xl text-center mt-5'>Welcome To
            <Text className='text-orange-500'>Let's Eat </Text>Delivery
          </Text>

          <View className='bg-white opacity-90 rounded-3xl w-full'>

            <View className='p-5'>

              <Text className=' text-orange-500 text-xl font-bold text-center'> Login </Text>

              <Text className='mt-3 mb-1 text-orange-500 font-bold'>Username</Text>
              <TextInput
                placeholder="username"
                placeholderTextColor={'#bfbfbf'}
                className={`rounded-md  ${isUsernameFocused ? 'border-orange-600' : 'border-orange-300'}   border-b-2 text-black p-3'`}
                onChangeText={(username) => setUsername(username)}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)} />

              <Text className='mt-3 mb-1 text-orange-500 font-bold'>Password</Text>
              <TextInput
                placeholder="password"
                placeholderTextColor={'#afafaf'}
                className={`rounded-md  ${isPasswordFocused ? 'border-orange-600' : 'border-orange-300'}   border-b-2 text-black p-3'`}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                className='w-40 mx-auto bg-orange-500 mt-3 rounded-lg p-1'>
                <Text className='text-center text-white text-2xl font-bold'>Login</Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text className={footer}>create new account ?</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className={footer}>forgot password ?</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </ImageBackground>

    </TouchableWithoutFeedback>

  )
}
