import React, { useState } from 'react'
import { ImageBackground, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import backgroud from '../../assets/background.png'
import axios from 'axios'

export default function Signup({ navigation }) {
    const [phone, setPhone] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [isUsernameFocused, setIsUsernameFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)

    const handleSubmit = async () => {
        try {

            const formData = { username, phoneNumber: phone, password }

            const response = await axios.post(`http://localhost:4000/user/signup`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log(response)

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <ImageBackground
                source={backgroud}
                className='w-full h-full'
            >
                <View className=' flex-1 flex-col items-center  justify-between'>
                    <Text
                        className='text-black font-bold text-2xl text-center mt-5'>Welcome To
                        <Text className='text-orange-500'>Let's Eat </Text>Delivery
                    </Text>

                    <View className='bg-white opacity-90  w-full rounded-3xl'>
                        <View className='p-5'>

                            <Text className=' text-orange-500 text-xl font-bold text-center'> Sign up </Text>

                            <Text className='mt-3 mb-1 text-orange-500 font-bold'>Phone Number</Text>
                            <TextInput className={`rounded-md  ${isPhoneFocused ? 'border-orange-600' : 'border-orange-300'}   border-b-2 text-black p-3'`}
                                placeholder='E.g 091245678'
                                placeholderTextColor={'#b1b5bb'}
                                keyboardType='phone-pad'
                                value={phone}
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                                onChangeText={(phone) => setPhone(phone)}
                            />


                            <Text className='mt-3 mb-1 text-orange-500 font-bold'>Username</Text>
                            <TextInput className={`rounded-md ${isUsernameFocused ? 'border-orange-600' : 'border-orange-300'} border-b-2 text-black p-3`}
                                placeholder='Username'
                                placeholderTextColor={'#b1b5bb'}
                                value={username}
                                onFocus={() => setIsUsernameFocused(true)}
                                onBlur={() => setIsUsernameFocused(false)}
                                onChangeText={(name) => setUsername(name)}
                            />

                            <Text className='mt-3 mb-1 text-orange-500 font-bold'>Password</Text>
                            <TextInput className={`rounded-md ${isPasswordFocused ? 'border-orange-600' : 'border-orange-300'} border-b-2 text-black p-3`}
                                placeholder='Password'
                                placeholderTextColor={'#b1b5bb'}
                                value={password}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                onChangeText={(password) => setPassword(password)}
                            />



                            <TouchableOpacity className='w-40 mx-auto bg-orange-500 mt-3 rounded-lg p-1' onPress={handleSubmit}>
                                <Text className='text-center text-white text-2xl font-bold'>Send SMS </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                                <Text className='text-orange-950 underline text-center mt-2'>Go to Login Screen</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )

}
