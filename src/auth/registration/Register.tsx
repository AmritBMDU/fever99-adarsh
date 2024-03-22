import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../../App';
import { toastError, toastSuccess } from '../../utils/toast.utils';
import { Dropdown } from 'react-native-element-dropdown';
import { registerUser, sendOtp } from '../../Services/user.service';
const { height, width } = Dimensions.get('window')

const Register = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [agree, setAgree] = useState(false)
    const [user, setUser] = useContext(LoginContext)
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [otp, setOtp] = useState("");

    const [showOtpInput, setShowOtpInput] = useState(true);

    const [isAggreed, setIsAggreed] = useState(false);

    const handleRegister = async () => {
        try {

            if (name == "") {
                toastError("Name is mandatory !!!");
                return
            }
            if (email == "") {
                toastError("Email is mandatory !!!");
                return
            }
            if (mobile == "") {
                toastError("Mobile number is mandatory !!!");
                return
            }
            if (!otp || otp == "") {
                toastError("Please enter otp to register !!!");
                return
            }
            if (gender == "") {
                toastError("Gender is mandatory !!!");
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
                email,
                name,
                gender,
                mobile,
                otp,
                password,
                rePassword,
            }

            let { data: res } = await registerUser(obj);
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
    const handleSendOtp = async () => {
        try {
            if (!mobile || mobile == "" || mobile.length != 10) {
                toastError("Please enter a valid mobile number");
                return
            }
            let obj = {
                mobile: mobile,
            }
            let { data: res } = await sendOtp(obj)
            if (res.message) {
                toastSuccess(res.message);
                setShowOtpInput(false)
            }
        } catch (error) {
            toastError(error)
        }
    }

    const handleRedirectToNextScreen = () => {
        if (email == "") {
            toastError("Email is mandatory !!!")
            return
        }
        navigation.navigate("Password", { data: email })
    }
    return (
        <ScrollView contentContainerStyle={{ width: width, alignItems: 'center', justifyContent: 'center', minHeight: height }}>
            <ImageBackground source={require('../../../assets/images/background_img.png')} resizeMode='contain' style={{ height: height, width: width, backgroundColor: "#1263AC" }} >
                <KeyboardAvoidingView
                    behavior={"padding"}
                    keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 50}
                    style={{ flex: 1 }}
                >
                    <View style={{ backgroundColor: 'rgba(0,0,0,.65)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: mainFont }}>Register</Text>
                        <View style={{ width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 20, borderRadius: 10, paddingBottom: 10 }}>

                            {/* Email section >>>>>>>>>>>>>>>>>>>>>*/}
                            <Text style={styles.common_Text_Styl}>Name</Text>
                            <View style={styles.input_fild_parent_View}>
                                <TextInput placeholder='Enter Name'
                                    placeholderTextColor="gray"
                                    onChangeText={(e) => setName(e)}
                                    value={name}
                                    style={styles.all_input_BOx_ctyl} />
                            </View>
                            <Text style={styles.common_Text_Styl}>Email</Text>
                            <View style={styles.input_fild_parent_View}>
                                <TextInput placeholder='Enter Email Address'
                                    placeholderTextColor="gray"
                                    onChangeText={(e) => setEmail(e)}
                                    value={email}
                                    style={styles.all_input_BOx_ctyl} />

                            </View>
                            <Text style={styles.common_Text_Styl}>Mobile number</Text>

                            {/* <View > */}
                            <View style={{
                                display: "flex", flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <TextInput placeholder='Enter Mobile Number'
                                    placeholderTextColor="gray"
                                    keyboardType={"number-pad"}
                                    maxLength={10}
                                    onChangeText={(e) => setMobile(e)}
                                    value={mobile}
                                    style={{ flex: 1, height: hp(5.5), backgroundColor: '#E8E8E8', borderRadius: 5, alignItems: 'center', paddingLeft: wp(4), flexDirection: 'row' }}
                                />
                                <TouchableOpacity onPress={() => handleSendOtp()} style={{ width: wp(25), height: hp(6), backgroundColor: '#1263AC', marginLeft: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>{showOtpInput == false ? "Resend OTP" : "Request OTP"}</Text>
                                </TouchableOpacity>


                            </View>
                            {
                                !showOtpInput &&
                                <>
                                    <Text style={styles.common_Text_Styl}>OTP</Text>
                                    <View style={styles.input_fild_parent_View}>
                                        <TextInput placeholder='Enter OTP'
                                            placeholderTextColor="gray"
                                            onChangeText={(e) => setOtp(e)}
                                            value={otp}
                                            style={styles.all_input_BOx_ctyl} />
                                    </View>
                                </>
                            }
                            <Text style={styles.common_Text_Styl}>Gender</Text>
                            <View style={{ width: '100%' }}>
                                <Dropdown
                                    style={[styles.dropdown, { width: "100%" }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={[
                                        { label: "Male", value: "Male" },
                                        { label: "Female", value: "Female" },
                                        { label: "Others", value: "Others" },
                                    ]}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Select Gender'
                                    value={gender}
                                    onChange={(item: any) => {
                                        setGender(item.value);
                                    }}
                                />
                            </View>
                            <Text style={styles.common_Text_Styl}>Password</Text>
                            <View style={styles.input_fild_parent_View}>
                                <TextInput placeholder='Enter Password'
                                    placeholderTextColor="gray"
                                    secureTextEntry
                                    onChangeText={(e) => setPassword(e)}
                                    value={password}
                                    style={styles.all_input_BOx_ctyl} />

                            </View>
                            <Text style={styles.common_Text_Styl}>Confirm password</Text>
                            <View style={styles.input_fild_parent_View}>
                                <TextInput placeholder='Enter Confirm Password'
                                    placeholderTextColor="gray"
                                    onChangeText={(e) => setRePassword(e)}
                                    value={rePassword}
                                    secureTextEntry
                                    style={styles.all_input_BOx_ctyl} />

                            </View>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginVertical: 20 }}>
                                <Pressable onPress={() => setIsAggreed((prev) => !prev)} style={{ padding: 2, borderRadius: 5, backgroundColor: "white", marginRight: 5 }}>
                                    <View style={{ height: 15, width: 15, borderRadius: 5, backgroundColor: isAggreed ? "#1263AC" : "white", }}>
                                    </View>
                                </Pressable>
                                <Text style={{ color: 'white', alignItems: 'center', justifyContent: 'center', fontFamily: 'AvenirNextLTPro-Regular' }}>
                                    I accept Fever99
                                </Text>
                                <Pressable onPress={() => navigation.navigate("PAC")}>
                                    <Text style={{ color: '#fff', fontWeight: "800" }}> Privacy Policy{" "}</Text>
                                </Pressable>
                                <Text style={{ color: 'white', alignItems: 'center', justifyContent: 'center', fontFamily: 'AvenirNextLTPro-Regular' }}>
                                    and
                                </Text>
                                <Pressable style={{ marginLeft: 5 }} onPress={() => navigation.navigate("TAC")}>
                                    <Text style={{ color: '#fff', fontWeight: "800" }}>T&C </Text>
                                </Pressable>
                            </View>

                            {/* Button section >>>>>>>>>>>>>>>>>> */}
                            <TouchableOpacity onPress={() => handleRegister()} style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Continue</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    common_Text_Styl: {
        color: 'white',
        marginTop: 15
    },
    all_input_BOx_ctyl: {
        marginLeft: 5,
        width: wp(70)
    },
    input_fild_parent_View: {
        width: '100%',
        height: hp(5.5),
        backgroundColor: '#E8E8E8',
        marginTop: hp(1),
        borderRadius: 5,
        alignItems: 'center',
        paddingLeft: wp(4),
        flexDirection: 'row'
    },
    dropdown: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
    },
    dropdown1: {
        height: 50,

        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(95),
        backgroundColor: '#F2F2F2E5',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#8E8E8E',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#8E8E8E'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#8E8E8E'
    },
})
export default Register