import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
// import Modal from "react-native-modal";
import DocumentPicker from 'react-native-document-picker';
import { generateFilePath } from '../Services/url.service';
import { getUser, setUser, updatePassword, updateProfile } from '../Services/user.service';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { Roles } from '../utils/constant';
import Feather from "react-native-vector-icons/Feather"
const { height, width } = Dimensions.get('window')

const EditProfile = () => {
    const focused = useIsFocused()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'

    const navigation: any = useNavigation()

    const [profilePhoto, setProfilePhoto] = useState("");
    const [email, setemail] = useState();
    const [gender, setGender] = useState('Male');
    const [image, setImage] = useState<any>("");
    const [serviceCharge, setServiceCharge] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [state, setState] = useState("");
    const [mobile, setMobile] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [abhaid, setAbhaid] = useState("");
    const [userObj, setUserObj] = useState<any>("");


    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");


    const handleGetAndSetUser = async () => {
        let userData = await getUser();

        if (userData) {
            setUserObj(userData)
            setGender(userData?.gender)
            setImage(userData?.image)
            setServiceCharge(userData?.serviceCharge)
            setAddress(userData?.address)
            setName(userData?.name)
            setPinCode(userData?.pinCode)
            setState(userData?.state)
            setMobile(userData?.mobile)
            setSpecialization(userData?.specialization)
            setAbhaid(userData?.abhaid)
            setemail(userData?.email)
            setProfilePhoto(userData?.image)
        }


    }


    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
        }
    }, [focused])




    const handleDocumentPicker = async () => {
        try {
            let file: any = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                type: [DocumentPicker.types.images],
            });
            if (file) {
                setImage(file)
            }
        } catch (error) {
            toastError(error);
        }
    };


    const handleSubmit = async () => {
        try {
            let formData = new FormData();
            // console.log()

            Object.entries(userObj).map((entry) => {
                const [key, value] = entry;
                // forFata.append(key, value);
            });
            formData.append("serviceCharge", serviceCharge)
            formData.append("address", address)
            formData.append("name", name)
            // formData.append("pinCode", pinCode)
            formData.append("state", state)
            formData.append("gender", gender)
            formData.append("mobile", mobile)
            formData.append("specialization", specialization)
            formData.append("image", image)
            if (userObj.role == Roles.DOCTOR) {
                formData.append("abhaid", abhaid)
            }




            let { data: res }: any = await updateProfile(formData)
            if (res) {
                toastSuccess(res.message)
                await setUser(res.data)
                setGender(res.data?.gender)
                setImage(res.data?.image)
                setServiceCharge(res.data?.serviceCharge)
                setAddress(res.data?.address)
                setName(res.data?.name)
                setPinCode(res.data?.pinCode)
                setState(res.data?.state)
                setMobile(res.data?.mobile)
                setSpecialization(res.data?.specialization)
                setAbhaid(res.data?.abhaid)
                setemail(res.data?.email)
                setProfilePhoto(res.data?.image)
                setUserObj(res.data)
                navigation.goBack()
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleRenderProfilePhoto = () => {
        if (image && image?.uri && image?.uri != "") {
            return { uri: image?.uri }
        }
        else if (profilePhoto && profilePhoto != "" && profilePhoto.includes("file")) {
            return { uri: generateFilePath(profilePhoto) }
        }
        else {
            return require('../../assets/images/user_frame.png')
        }
    }

    const handleUpdatePasswordSubmit = async () => {
        try {

            if (newPassword == "") {
                toastError("Please enter new password");
                return
            }
            if (oldPassword == "") {
                toastError("Please enter old password");
                return
            }
            if (confirmPassword == "") {
                toastError("Please enter confirm password");
                return
            }
            if (newPassword != confirmPassword) {
                toastError("Confirm password does not match new password");
                return
            }


            let obj = {
                newPassword,
                oldPassword,
                confirmPassword
            }
            let { data: res }: any = await updatePassword(obj)
            if (res.success) {
                toastSuccess(res.message)
                navigation.goBack()
            }
        } catch (error) {
            toastError(error);
        }
    };



    return (
        <View style={{ width: width, height: height, backgroundColor: 'white' }}>
            <Headerr secndheader={true} label='Edit Profile' />
            <ScrollView style={{ width: wp(95), alignSelf: 'center' }}>
                <Pressable onPress={() => handleDocumentPicker()} style={{position:'relative'}}>
                    <Image source={handleRenderProfilePhoto()}
                        style={{ height: wp(20), width: wp(20), borderRadius:40, alignSelf: 'center', marginTop: hp(3) }} />
                    {/* <Image source={(image && image.uri && image.uri != "")&& { uri:image.uri }}
                        style={{ height: wp(20), width: wp(20), alignSelf: 'center', marginTop: hp(3) }} /> */}
                        {/* <Feather name='edit' color='red' size={13} /> */}
                </Pressable>

                <View style={{ marginTop: hp(3), width: wp(95) }}>
                    <View style={{ width: wp(95) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Name</Text>
                        <TextInput onChangeText={(e) => setName(e)} value={name} placeholder='Enter Your Name' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>
                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Email</Text>
                        <View
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(3), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput value={email} editable={false} placeholder='Enter Your Phone Email' placeholderTextColor={'gray'} />
                        </View>
                    </View>




                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Phone Number</Text>
                        <TextInput onChangeText={(e) => setMobile(e)} value={mobile} placeholder='Enter Your Phone Number' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>
                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Address</Text>
                        <TextInput onChangeText={(e) => setAddress(e)} value={address} placeholder='Enter Your Address' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>
                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>State</Text>
                        <TextInput onChangeText={(e) => setState(e)} value={state} placeholder='Enter Your state' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>
                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Country</Text>
                        <TextInput value={"India"} placeholder='Enter Your Address' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>
                    <View style={{ width: wp(95), marginTop: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Pincode</Text>
                        <TextInput onChangeText={(e) => setPinCode(e)} value={`${pinCode}`} keyboardType='number-pad' maxLength={6} placeholder='Enter Your Pincode' placeholderTextColor={'gray'}
                            style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                    </View>







                    {
                        (userObj.role == Roles.DOCTOR) &&
                        <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Specialization</Text>
                            <TextInput onChangeText={(e) => setSpecialization(e)} value={specialization} placeholder='Enter Your specialization' placeholderTextColor={'gray'}
                                style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View>
                    }
                    {
                        (userObj.role == Roles.DOCTOR) &&
                        <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Abha Id</Text>
                            <TextInput onChangeText={(e) => setAbhaid(e)} value={abhaid} placeholder='Enter Your Abha Id' placeholderTextColor={'gray'}
                                style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View>
                    }
                    <View style={{ marginTop: hp(2), width: wp(95) }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>How do you identify yourself?</Text>
                        <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setGender('Male')}
                                style={{ borderColor: '#686868', borderWidth: gender == 'Male' ? 0 : 0.8, width: wp(30), height: hp(5), borderRadius: 5, backgroundColor: gender == 'Male' ? maincolor : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: gender == 'Male' ? 'white' : '#686868', fontSize: hp(1.8), fontFamily: mainFont }}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('Female')}
                                style={{ borderColor: '#686868', borderWidth: gender == 'Female' ? 0 : 0.8, width: wp(30), height: hp(5), borderRadius: 5, backgroundColor: gender == 'Female' ? maincolor : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: gender == 'Female' ? 'white' : '#686868', fontSize: hp(1.8), fontFamily: mainFont }}>Female</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('Other')}
                                style={{ borderColor: '#686868', borderWidth: gender == 'Other' ? 0 : 0.8, width: wp(30), height: hp(5), borderRadius: 5, backgroundColor: gender == 'Other' ? maincolor : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: gender == 'Other' ? 'white' : '#686868', fontSize: hp(1.8), fontFamily: mainFont }}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </View>




                    {/* <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Change Password</Text>
                            <TextInput onChangeText={(e) => setAbhaid(e)} value={abhaid} placeholder='Enter Your Abha Id' placeholderTextColor={'gray'}
                                style={{ width: wp(95), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View> */}
                    <TouchableOpacity onPress={() => handleSubmit()} style={{ width: wp(90), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', alignSelf: "center", marginVertical: 25 }}>
                        <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Submit</Text>
                    </TouchableOpacity>









                    <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 10, padding: 10 }}>
                        <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Old Password</Text>
                            <TextInput onChangeText={(e) => setOldPassword(e)} value={`${oldPassword}`} secureTextEntry keyboardType='number-pad' maxLength={6} placeholder='Enter Your old password' placeholderTextColor={'gray'}
                                style={{ width: wp(90), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View>
                        <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>New Password</Text>
                            <TextInput onChangeText={(e) => setNewPassword(e)} value={`${newPassword}`} secureTextEntry keyboardType='number-pad' maxLength={6} placeholder='Enter Your new password' placeholderTextColor={'gray'}
                                style={{ width: wp(90), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View>
                        <View style={{ width: wp(95), marginTop: hp(2) }}>
                            <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontmedium }}>Confirm Password</Text>
                            <TextInput onChangeText={(e) => setConfirmPassword(e)} value={`${confirmPassword}`} secureTextEntry keyboardType='number-pad' maxLength={6} placeholder='Confirm Your password' placeholderTextColor={'gray'}
                                style={{ width: wp(90), height: hp(5.5), marginTop: hp(1), backgroundColor: '#F9F9F9', borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2) }} />
                        </View>
                        <TouchableOpacity onPress={() => handleUpdatePasswordSubmit()} style={{ width: wp(90), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', alignSelf: "center", marginVertical: 25 }}>
                            <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Update Password</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
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

export default EditProfile