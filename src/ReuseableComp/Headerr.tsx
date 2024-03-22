import { View, Text, Dimensions, Image, TouchableOpacity, StatusBar, Pressable, TextInput } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LanguageContext, LoginContext, UserDataContext } from '../../App';
import Modal from "react-native-modal";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { generateFilePath } from '../Services/url.service';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { getProfile, getUser } from '../Services/user.service';
const { height, width } = Dimensions.get('window')
const Headerr = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation();

    const { confirmPayment } = useStripe();


    const { initPaymentSheet, presentPaymentSheet } = useStripe()

    const focused = useIsFocused()
    const [language, setLanguage] = useContext(LanguageContext);
    const [user, setUser] = useContext(LoginContext)
    const [userData, setUserData] = useContext(UserDataContext)
    const [lmodal, setLmodal] = useState(false)
    const [greeting, setGreeting] = useState('');
    const [paymentModal, setPaymentModal] = useState(false);

    const [amount, setAmount] = useState("");

    const handleGetProfile = async () => {
        try {
            let res = await getUser();
            if (res) {
                setUserData(res)
            }
        } catch (error) {
            toastError(error)
        }
    }


    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        let message = '';
        if (currentHour >= 3 && currentHour < 12) {
            message = 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 17) {
            message = 'Good Afternoon';
        } else {
            message = 'Good Evening';
        }
        setGreeting(message);
    }, []);


    useEffect(() => {
        if (focused) {
            handleGetProfile()
        }
    }, [focused])


    const handleServiceBooking = () => {
        navigation.navigate('BookService', { serviceId: props.serviceId })
    }


    const HandleAddAmountToWallet = async () => {
        try {

            let tempAmount = parseInt(`${amount}`) || 0
            if (tempAmount && tempAmount <= 10) {
                toastError("Amount should be more than 10 rupees !!!")
                return
            }
            setPaymentModal(false);
            navigation.navigate("PayementScreen", { amount: tempAmount })
        }
        catch (error) {
            toastError(error)
        }
    }
    return (
        <View style={{ width: width, backgroundColor: '#1263AC', alignItems: 'center', }}>
            <StatusBar backgroundColor="#1263AC" />

            {props.user && props.height &&
                <View style={{ width: width, flexDirection: 'row', paddingLeft: wp(2), paddingRight: wp(3), alignItems: 'center', height: hp(10), justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={userData.image ? { uri: generateFilePath(userData.image) } : require('../../assets/images/user_frame.png')}
                            style={{ height: wp(15), width: wp(15), resizeMode: 'contain' }} />
                        <View style={{ marginLeft: wp(2), height: wp(15), justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: hp(2), fontFamily: mainFontBold, textTransform: "capitalize" }}>Hello {userData?.name}</Text>
                            <Text style={{ color: 'white', fontSize: hp(1.8), fontFamily: mainFont }}>{greeting}</Text>
                        </View>
                    </View>
                </View>
            }
            {props.secndheader &&
                <View style={{ width: width, height: hp(8), flexDirection: 'row', paddingRight: wp(3), paddingLeft: wp(2), alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/images/back.png')}
                                style={{ height: wp(6), width: wp(6), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: hp(1.9), color: 'white', fontFamily: mainFont, marginLeft: wp(1.5) }}>{props.label ? props.label : ""}</Text>
                    </View>
                    {props.btn && <TouchableOpacity
                        onPress={() => {
                            { props.btnlbl == "Book Service" ? handleServiceBooking() : (props.btnlbl == "Book Appointment" ? navigation.navigate("BookAppt") : console.log("else clicked")) }
                        }}
                        style={{ paddingHorizontal: 10, height: hp(4.5), backgroundColor: 'white', borderRadius: wp(1), alignItems: 'center', justifyContent: 'center', elevation: 2 }}>
                        <Text style={{ fontSize: hp(1.6), color: 'black', fontFamily: mainFont }}>{props.btnlbl ? props.btnlbl : ""}</Text>
                    </TouchableOpacity>}
                    {
                        props.referalCode &&
                        <Pressable onPress={() => {
                            Clipboard.setString(props.referalCode);
                            toastSuccess("coppied to clipboard !!!")
                        }
                        }>
                            <Text style={{ fontSize: hp(1.6), fontFamily: mainFont, color: "white" }}>Referal code : {props.referalCode}</Text>
                        </Pressable>
                    }
                    {
                        props.secondText &&
                        <Pressable onPress={() => setPaymentModal(true)}>
                            <Text style={{ fontSize: hp(1.6), fontFamily: mainFont, color: "white" }}>{props.secondText}</Text>
                        </Pressable>
                    }
                </View>
            }





            <Modal
                isVisible={paymentModal}
                animationIn={'bounceIn'}
                animationOut={'slideOutDown'}
                onBackButtonPress={() => setPaymentModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setPaymentModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: 'black', fontFamily: mainFont, fontWeight: "bold" }}>Add Wallet Amount</Text>

                    <TextInput placeholder='Amount' keyboardType='number-pad' style={{ marginTop: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e: any) => setAmount(e)} value={`${amount}`} placeholderTextColor="gray" />
                    <TouchableOpacity onPress={() => HandleAddAmountToWallet()} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Add now</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default Headerr