import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function Paymentsuccess() {
    const mainFont = 'Montserrat-Regular'
    const navigation: any = useNavigation()

    return (
        <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: hp(100), width: wp(100) }}>
            <Image style={{ width: wp(70), height: hp(40) }} resizeMode="contain" source={require("../../assets/images/check.png")} />
            <Text style={{ fontSize: 22 }}>Payment successful</Text>
            <TouchableOpacity onPress={() => navigation.navigate("BottamTab", { screen: "Home" })} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Go to home</Text>
            </TouchableOpacity>
        </View>
    )
}