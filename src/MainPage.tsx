import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../App';
const { height, width } = Dimensions.get('window')

const MainPage = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation = useNavigation()
    const [user, setUser]=useContext(LoginContext)
  return (
    <View style={{width:width, height:height, backgroundColor:'#F1F8FF', justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../assets/images/Logo.png')} 
        style={{height:hp(15), width:wp(55), resizeMode:'contain'}}/>
        <Text style={{color:'black', fontSize:hp(3), fontFamily:mainFontmedium, marginTop:hp(10)}}>Who You Are?</Text>
      <TouchableOpacity 
      onPress={()=>{setUser('PATIENT')
    navigation.navigate('Login')
    }}
      style={{marginTop:hp(3), width:wp(70), height:hp(7), backgroundColor:maincolor, borderRadius:8, justifyContent:'center', alignItems:'center'}}>
        <Text style={{color:'white', fontFamily:mainFontmedium, fontSize:hp(2)}}>Patient</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={()=>{setUser('DOCTOR')
      navigation.navigate('Login')}}
      style={{marginTop:hp(3), width:wp(70), height:hp(7), backgroundColor:maincolor, borderRadius:8, justifyContent:'center', alignItems:'center'}}>
        <Text style={{color:'white', fontFamily:mainFontmedium, fontSize:hp(2)}}>Doctor</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={()=>{setUser('Expert')
      navigation.navigate('Login')}}
      style={{marginTop:hp(3), width:wp(70), height:hp(7), backgroundColor:maincolor, borderRadius:8, justifyContent:'center', alignItems:'center'}}>
        <Text style={{color:'white', fontFamily:mainFontmedium, fontSize:hp(2)}}>Expert</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MainPage