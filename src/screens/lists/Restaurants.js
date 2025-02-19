import React, { useState } from 'react'
import { ImageBackground, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import backgroud from '../../assets/background.png'

export default function Restaurants({navigation}) {

    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [isNameFocused, setIsNameFocused] = useState(false)


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

                    <View className='bg-white opacity-90 rounded-3xl'>
                        <View className='p-5'>

                            <Text className=' text-orange-500 text-xl font-bold text-center'> Sign up </Text>

                            <Text className='mt-3 mb-1 text-orange-500 font-bold'>Phone Number</Text>
                            <TextInput className={`rounded-md  ${isPhoneFocused ? 'border-orange-600' : 'border-orange-300'}   border-b-2 text-black p-3'`}
                                placeholder='E.g 091245678'
                                placeholderTextColor={'#b1b5bb'}
                                keyboardType='phone-pad'
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                            />


                            <Text className='mt-3 mb-1 text-orange-500 font-bold'>Full Name</Text>
                            <TextInput className={`rounded-md ${isNameFocused ? 'border-orange-600' : 'border-orange-300'} border-b-2 text-black p-3`}
                                placeholder='Full Name'
                                placeholderTextColor={'#b1b5bb'}
                                onFocus={() => setIsNameFocused(true)}
                                onBlur={() => setIsNameFocused(false)}
                            />



                            <TouchableOpacity className='w-40 mx-auto bg-orange-500 mt-3 rounded-lg p-1'>
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
