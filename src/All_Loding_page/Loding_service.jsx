import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Loding_service = () => {
    const mainFontBold = 'Montserrat-Bold'
    return (
        <>
            <View style={styles.mainView}>
                <Text style={{ fontFamily: mainFontBold, color: "gray" }}>Loding...</Text>
            </View>
            <View style={styles.mainView}>
                <Text style={{ fontFamily: mainFontBold, color: "gray" }}>Loding...</Text>
            </View>
            <View style={styles.mainView}>
                <Text style={{ fontFamily: mainFontBold, color: "gray" }}>Loding...</Text>
            </View>
            <View style={styles.mainView}>
                <Text style={{ fontFamily: mainFontBold, color: "gray" }}>Loding...</Text>
            </View>
            <View style={styles.mainView}>
                <Text style={{ fontFamily: mainFontBold, color: "gray" }}>Loding...</Text>
            </View>
        </>
    )
}

export default Loding_service;
const styles = StyleSheet.create({
    mainView: {
        height: hp(33),
        width: wp(100),
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp(1),
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})