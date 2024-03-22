import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, ImageBackground } from 'react-native'
import React, { useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window')

const OTP = () => {

    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const et1: any = useRef();
    const et2: any = useRef();
    const et3: any = useRef();
    const et4: any = useRef();

    return (
        <View style={{ width: width }}>
            <ImageBackground source={require('../../assets/images/background_img.png')} resizeMode='contain' style={{ height: height, width: width, backgroundColor: "#1263AC" }} >
                <View style={{ backgroundColor: 'rgba(0,0,0,.75)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ elevation: 10, paddingTop: hp(1), paddingBottom: hp(1), paddingLeft: wp(2), paddingRight: wp(2) }}>
                    </View>
                    <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: 'AvenirNextLTPro-Regular' }}>Login</Text>
                    <Text style={{ fontSize: hp(2.5), color: 'white', alignSelf: 'center', marginTop: hp(2), fontFamily: 'AvenirNextLTPro-Regular' }}>Verify Mobile Number </Text>
                    <Text style={{ fontSize: hp(1.8), color: 'white', alignSelf: 'center', marginTop: hp(0.5), fontFamily: 'AvenirNextLTPro-Regular' }}>We’ve sent an OTP on input mobile number</Text>
                    <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                        {/* OTP section >>>>>>>>>>>>>>>>>>>>>*/}

                        <View style={{ width: '100%', height: hp(5.5), marginTop: hp(1), flexDirection: 'row', alignItems: 'center', paddingLeft: wp(20) }}>
                            <TextInput ref={et1} style={styles.input}
                                keyboardType='number-pad'
                                maxLength={1}
                                onChangeText={txt => {
                                    if (txt.length >= 1) {
                                        if (et2 && et2.current) {
                                            et2?.current?.focus();
                                        }
                                    }
                                    else if (txt.length < 1) {
                                        et1.current.focus();
                                    }
                                }} />

                            <TextInput ref={et2} style={styles.input}
                                keyboardType='number-pad'
                                maxLength={1}
                                onChangeText={txt => {
                                    if (txt.length >= 1) {
                                        et3.current.focus();
                                    }
                                    else if (txt.length < 1) {
                                        et1.current.focus();
                                    }
                                }} />
                            <TextInput ref={et3} style={styles.input}
                                keyboardType='number-pad'
                                maxLength={1}
                                onChangeText={txt => {
                                    if (txt.length >= 1) {
                                        et4.current.focus();
                                    }
                                    else if (txt.length < 1) {
                                        et2.current.focus();
                                    }
                                }} />

                            <TextInput ref={et4} style={styles.input}
                                keyboardType='number-pad'
                                maxLength={1}
                                onChangeText={txt => {
                                    if (txt.length >= 1) {
                                        et4.current.focus();
                                    }
                                    else if (txt.length < 1) {
                                        et3.current.focus();
                                    }
                                }} />
                        </View>

                        {/* Button section >>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("BottamTab")}
                            style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Verify OTP</Text>
                        </TouchableOpacity>

                        {/* Or Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                        {/* <View style={{marginTop:hp(4), flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{width:wp(40), borderBottomColor:'black', borderBottomWidth:1, }}></View>
                <Text style={{fontSize:hp(2), fontWeight:'600', color:'black'}}>Or</Text>
                <View style={{width:wp(40), borderBottomColor:'black', borderBottomWidth:1, }}></View>
                </View> */}

                        {/* Via OTP Login Button >>>>>>>>>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity style={{ width: '100%', height: hp(6), borderColor: '#fff', borderWidth: 1, marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Resend OTP</Text>
                        </TouchableOpacity>

                        {/* Agreement Text >>>>>>>>>>>>>>>>>>>> */}
                        <Text style={{ color: 'white', marginTop: hp(3), alignItems: 'center', justifyContent: 'center', alignSelf: 'center', fontFamily: mainFont }}>Resend OTP in <Text style={{ color: '#fff', fontWeight: '600' }}>01:56</Text></Text>
                    </View>
                    <View>

                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        width: 40,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E8E8E8',
        marginLeft: 10,
        textAlign: 'center',
        fontSize: hp(2.5),
        fontWeight: '700',
        color: 'gray'
        // marginRight:0,

    }
})

export default OTP