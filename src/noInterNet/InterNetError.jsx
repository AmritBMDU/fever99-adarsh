import { StyleSheet, Text, View } from 'react-native'
import Headerr from '../ReuseableComp/Headerr';
import Wifi_icons from "react-native-vector-icons/Feather";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React from 'react'

const InterNetError = ({ labels }) => {
    return (
        <View style={{ backgroundColor: '#e5efe3' }}>
            <Headerr secndheader={true} label={labels} />
            <View style={{ height: hp(100), justifyContent: "center", alignItems: "center", }}>
                <Wifi_icons name='wifi-off' style={{ color: "gray", fontSize: hp(15) }} />
                <Text style={{ color: "gray", fontSize: hp(3) }}>Verify Your Connection</Text>
            </View>
        </View>
    )
}

export default InterNetError;