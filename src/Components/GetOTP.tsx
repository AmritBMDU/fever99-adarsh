import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { resetPassword } from '../Services/user.service';

const { height, width } = Dimensions.get('window')

const GetOTP = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");



    const handleRegister = async () => {
        try {
            if (!otp || otp == "") {
                toastError("Please enter otp to register !!!");
                return
            }
            if (password == "") {
                toastError("Password is mandatory !!!");
                return
            }
            if (rePassword == "") {
                toastError("Confirm Password is mandatory !!!");
                return
            }
            if (rePassword !== password) {
                toastError("Password and Confirm Password does not match !!!");
                return
            }

            let obj = {
                otp,
                mobile: props.route.params.data,
                password,
                rePassword,
            }

            console.log(obj, "obj")
            let { data: res } = await resetPassword(obj);
            if (res.message) {
                toastSuccess(res.message);
                navigation.navigate("Login")
            }
        }
        catch (err) {
            console.error(JSON.stringify(err))
            toastError(err);
        }
    }
    return (
        <View style={{ width: width }}>
            <ImageBackground source={require('../../assets/images/background_img.png')} resizeMode='contain' style={{ height: height, width: width, backgroundColor: "#1263AC" }} >
                <View style={{ backgroundColor: 'rgba(0,0,0,.75)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: mainFont }}>OTP Verification</Text>
                    <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                        {/* OTP section >>>>>>>>>>>>>>>>>>>>>*/}
                        <Text style={{ color: 'white' }}>OTP</Text>
                        <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                            {/* <Image source={require('../../assets/images/Mail.png')}
                                style={{ height: wp(5.5), width: wp(5.5), resizeMode: 'contain', tintColor: 'grey' }} /> */}
                            <TextInput placeholder='Enter OTP' onChangeText={(e) => setOtp(e)} value={otp} placeholderTextColor="gray"
                                style={{ marginLeft: 5, width: wp(70) }} />

                        </View>
                        <Text style={{ color: 'white', marginTop: 15 }}>Password</Text>
                        <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                            <TextInput placeholder='Enter Password'
                                placeholderTextColor="gray"
                                secureTextEntry
                                onChangeText={(e) => setPassword(e)}
                                value={password}
                                style={{ marginLeft: 5, width: wp(70) }} />

                        </View>
                        <Text style={{ color: 'white', marginTop: 15 }}>Confirm password</Text>
                        <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                            <TextInput placeholder='Enter Confirm Password'
                                placeholderTextColor="gray"
                                onChangeText={(e) => setRePassword(e)}
                                value={rePassword}
                                secureTextEntry
                                style={{ marginLeft: 5, width: wp(70) }} />

                        </View>

                        {/* Button section >>>>>>>>>>>>>>>>>> */}
                        <TouchableOpacity
                            onPress={() => handleRegister()}
                            style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont }}>Submit</Text>
                        </TouchableOpacity>

                    </View>
                    <View>

                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

export default GetOTP