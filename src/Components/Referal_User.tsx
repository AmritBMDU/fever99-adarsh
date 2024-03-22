import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';

const { height, width } = Dimensions.get('window')

const Referal_User = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation = useNavigation()
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white' }}>
            <Headerr secndheader={true} label='Service Request' btn={true} btnlbl='Copy Link ZS10' />
            <View style={{ width: wp(95), alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(45) }}>
                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Name:</Text>
                        <TextInput placeholderTextColor="#8E8E8E" placeholder='enter name' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                    </View>

                    <View style={{ width: wp(45) }}>
                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Email:</Text>
                        <TextInput placeholderTextColor="#8E8E8E" placeholder='enter email' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                    </View>

                </View>

                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(45) }}>
                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Gender:</Text>
                        <TextInput placeholderTextColor="#8E8E8E" placeholder='gender' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                    </View>

                    <View style={{ width: wp(45) }}>
                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Service Used:</Text>
                        <TextInput placeholderTextColor="#8E8E8E" placeholder='service' style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }} />
                    </View>

                </View>
            </View>
        </View>
    )
}

export default Referal_User