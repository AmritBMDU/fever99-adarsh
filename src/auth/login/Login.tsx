import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, StatusBar, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../../App';
import { toastError } from '../../utils/toast.utils';
import Mail_icons from "react-native-vector-icons/Entypo";
const { height, width } = Dimensions.get('window');
import { useNetInfo } from '@react-native-community/netinfo';


const Login = () => {
    // checking internet connection
    const netInfo = useNetInfo();
    const isConnected = netInfo.isConnected;
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [agree, setAgree] = useState(false)
    const [user, setUser] = useContext(LoginContext)
    const [email, setEmail] = useState("");



    const handleRedirectToNextScreen = () => {
        if (email == "") {
            toastError("Email is mandatory !!!")
            return
        }
        navigation.navigate("Password", { data: email })
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <View>
                <StatusBar backgroundColor={isConnected ? "#102D47" : "#cc5933"} />
                <View style={{ backgroundColor: isConnected ? "#8f4608" : "#cc5933", width: wp(100), alignItems: "center" }}>
                    {!isConnected && <Text style={{ fontSize: wp(4), color: "#fff" }}>Verify Your Connection</Text>}
                </View>
            </View>
            <ImageBackground source={require('../../../assets/images/background_img.png')} resizeMode='contain' style={{ flex: 1, width: width, backgroundColor: "#1263AC" }} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={{ backgroundColor: 'rgba(0,0,0,.65)', flex: 1, width: width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.login_Text, { fontFamily: mainFont }]}>Login</Text>
                        <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                            {/* Email section >>>>>>>>>>>>>>>>>>>>>*/}
                            <Text style={{ color: 'white' }}>Mobile Number/Email</Text>
                            <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}>
                                <Mail_icons name='mail' style={{ height: wp(5.5), width: wp(5.5), color: 'grey', fontSize: hp(2.80) }} />

                                <TextInput placeholder='Enter Mobile Number or Email'
                                    placeholderTextColor="gray"
                                    onChangeText={(e) => setEmail(e)}
                                    value={email}
                                    style={{ marginLeft: 5, width: wp(70) }}
                                />
                            </View>

                            {/* Button section >>>>>>>>>>>>>>>>>> */}
                            <TouchableOpacity onPress={() => handleRedirectToNextScreen()} style={[styles.both_reg_continew_BTN, { backgroundColor: '#1263AC', borderColor: "#1263AC" }]}>
                                <Text style={styles.register_And_Continew}>Continue</Text>
                            </TouchableOpacity>
                            {/* Or Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                            <View style={{ marginTop: hp(4), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={styles.Both_small_Line}></View>
                                <Text style={{ fontSize: hp(2), fontWeight: '600', color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Or</Text>
                                <View style={styles.Both_small_Line}></View>
                            </View>

                            {/* Via OTP Login Button >>>>>>>>>>>>>>>>>>>>>>>>> */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Register")}
                                style={[styles.both_reg_continew_BTN, { borderColor: '#fff' }]}>
                                <Text style={styles.register_And_Continew}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </View>
    )
}

export default Login;
const styles = StyleSheet.create({
    login_Text: {
        fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7)
    },
    register_And_Continew: {
        color: 'white',
        fontFamily: 'AvenirNextLTPro-Regular'
    },
    Both_small_Line: {
        width: wp(40),
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    both_reg_continew_BTN: {
        width: '100%',
        height: hp(6),
        borderWidth: 1,
        marginTop: hp(4),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

});