import {
    View, Text, Dimensions, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Pressable
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
// import { styles } from "./styl"

const { height, width } = Dimensions.get('screen')
import { Calendar } from 'react-native-calendars';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { addAppointments } from '../Services/appointments.service';
import { getUser } from '../Services/user.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { SendNotificationForMeetingCreation } from '../Services/notificationSevice';

const BookClient = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const focused = useIsFocused();



    const [state, setstate] = useState("");
    const [city, setCity] = useState("");

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);



    const [isGenderFocused, setIsGenderFocused] = useState(false);
    const [check, setcheck] = useState('online');
    const [dateModal, setDateModal] = useState(false);
    const [doctorObj, setDoctorObj] = useState(props?.route?.params?.doctor);
    const Dropdwndata = [
        {
            label: 'Male', value: 'Male'
        },
        {
            label: 'Female', value: 'Female'
        },
        {
            label: 'Other', value: 'Other'
        },
    ];

    const [age, setAge] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [gender, setGender] = useState("");
    const [mode, setMode] = useState("");
    const [patientName, setPatientName] = useState("");
    const [paymentMode, setPaymentMode] = useState("Online");

    const [timeSlot, setTimeSlot] = useState(props?.route?.params?.doctor.timeSlot);
    const [timeSlotoffline, setTimeSlotoffline] = useState(props?.route?.params?.doctor.timeSlotoffline);

    const defaultOption = { label: "Excluded Doctor", value: " " };
    const modifiedTimeSlot = timeSlotoffline.length === 0 ? [defaultOption] : timeSlotoffline;

    const defaultOption2 = { label: "Not Found", value: "Not found" };
    const modifiedTimeSlot2 = timeSlot.length === 0 ? [defaultOption2] : timeSlot;

    const handleCreateBooking = async () => {
        try {
            if (gender == "") {
                toastError("Gender is mandatory !!!");
                return
            }
            if (dateTime == "") {
                toastError("Date is mandatory !!!");
                return
            }
            if (selectedTimeSlot == "") {
                toastError("Time Slot is mandatory !!!");
                return
            }
            if (patientName == "") {
                toastError("Patient Name is mandatory !!!");
                return
            }

            let userData = await getUser();
            let obj = {
                age,
                dateTime,
                doctorId: doctorObj?._id,
                expertId: userData._id,
                selectedTimeSlot,
                gender,
                city,
                state,
                mode: "Offline",
                patientName,
                paymentMode,
                timeSlot,
                timeSlotoffline,
            }
            let { data: res } = await addAppointments(obj)


            if (res.message) {
                toastSuccess(res.message);
                if (!res.status) {
                    toastError(res.message)
                    return
                }
                await SendNotificationForMeetingCreation({ appointment: res.appointment._id })
                console.log(res.appointment.appointmentCharge, "res.appointment.appointmentCharge")
                if (paymentMode == "Online" && res.appointment.appointmentCharge > 10) {
                    navigation.navigate("PayementScreen", { amount: res.appointment.appointmentCharge, appointmentId: res.appointment._id })
                }
                else {
                    navigation.goBack()
                }
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    useEffect(() => {
        if (focused) {
            HandleGetStatesAndCities()
        }
    }, [focused])
    const HandleGetStatesAndCities = async () => {
        try {
            let { data: res } = await getstateAndCities();
            if (res.data && res.data.length > 0) {
                setStatesArr([...res?.data?.map((el: any) => ({ label: el.state, value: el.state, cities: el.city }))])
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const simplifiedTimeSlot1 = modifiedTimeSlot.map((slot: any) => ({
        label: slot.value.split(' ')[0],
        value: slot.value.split(' ')[0]
    }));
    const simplifiedTimeSlot2 = modifiedTimeSlot2.map((slot: any) => ({
        label: slot.value.split(' ')[0],
        value: slot.value.split(' ')[0]
    }));



    return (
        <ScrollView style={{ backgroundColor: 'white', }}>
            <Headerr secndheader={true} label='Book Client Details' />
            <View style={{ width: wp(95), alignSelf: 'center', height: height - hp(25) }}>
                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(45) }}>
                        <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black' }}>Date:</Text>
                        <Pressable onPress={() => setDateModal(true)}>
                            <TextInput placeholder='Select date' editable={false} onChangeText={(e) => setDateTime(e)} value={dateTime} style={{ height: hp(6.5), backgroundColor: '#F2F2F2E5', borderRadius: 6, borderColor: "gray", borderWidth: .5 }} />
                        </Pressable>
                    </View>
                    <View style={{ width: wp(45) }} >
                        <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black' }}>Select Slot:</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 0.5, }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={paymentMode == "Online" ? simplifiedTimeSlot2 : simplifiedTimeSlot1}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select Slot'
                            searchPlaceholder="Search..."
                            value={selectedTimeSlot}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item: any) => {
                                setSelectedTimeSlot(item.value);
                                setIsFocus(false);
                            }}
                        />

                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(95) }}>
                        <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black' }}>Patient Name:</Text>
                        <TextInput onChangeText={(e) => setPatientName(e)} value={patientName} placeholderTextColor="#8E8E8E" placeholder='Patient name' style={{
                            height: hp(6.5), backgroundColor: '#F2F2F2E5', borderRadius: 7, borderColor: "gray", borderWidth: .5
                        }} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(95) }}>
                        <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black' }}>Patient Age:</Text>
                        <TextInput onChangeText={(e) => setAge(e)} value={age} keyboardType='number-pad' placeholderTextColor="#8E8E8E" placeholder='Patient age' style={{
                            height: hp(6.5), backgroundColor: '#F2F2F2E5', borderRadius: 7, borderColor: "gray", borderWidth: .5
                        }} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(95) }}>
                        <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black', }}>Patient Gender:</Text>
                        <Dropdown
                            style={[styles.dropdown1, isGenderFocused && { borderColor: 'blue', borderWidth: 0.5, }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={Dropdwndata}
                            // search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select Gender'
                            value={gender}
                            onFocus={() => setIsGenderFocused(true)}
                            onBlur={() => setIsGenderFocused(false)}
                            onChange={item => {
                                setGender(item.value);
                                setIsGenderFocused(false);
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: hp(1), justifyContent: 'space-between' }}>

                    <View style={{ width: wp(95) }}>
                        <Text style={{ fontSize: hp(1.9), fontFamily: mainFont, color: 'black' }}>State:</Text>
                        <Dropdown
                            style={[styles.dropdown, { width: wp(95) }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={statesArr}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select State'
                            searchPlaceholder="Search..."
                            value={state}
                            // onFocus={() => setIsFocus(true)}
                            // onBlur={() => setIsFocus(false)}
                            onChange={(item: any) => {
                                setstate(item.value)
                                setCityArr([...item.cities.map((el: any) => ({ label: el, value: el }))])
                                setIsFocus(false);
                            }}
                        />
                    </View>

                    <View style={{ width: wp(95) }}>
                        {
                            cityArr && cityArr.length > 0 &&
                            <>
                                <Text style={{ fontSize: hp(2), marginTop: hp(1), fontFamily: mainFont, color: 'black' }}>City:</Text>

                                <Dropdown
                                    style={[styles.dropdown, { width: wp(95) }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={cityArr}
                                    // search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Select City'
                                    // searchPlaceholder="Search..."
                                    value={city}
                                    onChange={(item: any) => {
                                        setCity(item.value);
                                    }}
                                />
                            </>
                        }
                    </View>
                </View>
                <View style={{ marginTop: hp(2), width: wp(95) }}>
                    <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: 'black' }}>Payment Mode:</Text>
                    <TouchableOpacity
                        onPress={() => { setPaymentMode('Online'); setMode('Online'); setSelectedTimeSlot("") }}
                        style={{ flexDirection: 'row', marginTop: hp(1) }}>
                        {paymentMode == 'Online' ? <Image source={require('../../assets/images/chkd.png')}
                            style={{ height: wp(5), width: wp(5) }} />
                            :
                            <Image source={require('../../assets/images/unchk.png')}
                                style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: paymentMode == 'Online' ? maincolor : '#B0B0B0', marginLeft: wp(2), fontSize: hp(1.8), fontFamily: mainFontmedium }}>Pay Online</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { setPaymentMode('Offline'); setMode('Offline'); setSelectedTimeSlot("") }}
                        style={{ flexDirection: 'row', marginTop: hp(1.5) }}>
                        {paymentMode == 'Offline' ? <Image source={require('../../assets/images/chkd.png')}
                            style={{ height: wp(5), width: wp(5) }} />
                            :
                            <Image source={require('../../assets/images/unchk.png')}
                                style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: paymentMode == 'Offline' ? maincolor : '#B0B0B0', marginLeft: wp(2), fontSize: hp(2), fontFamily: mainFontmedium }}>Pay at Clinic</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingBottom: hp(1), width: wp(95), alignSelf: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: wp(45), height: hp(5), backgroundColor: '#000000', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCreateBooking()} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                    <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Proceed</Text>
                </TouchableOpacity>
            </View>


            <Modal
                isVisible={dateModal}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackButtonPress={() => setDateModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setDateModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Calendar
                        onDayPress={day => {
                            setDateTime(day.dateString);
                            setDateModal(false)
                        }}
                        minDate={`${new Date()}`}
                    />
                </View>
            </Modal>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: hp(6.7),
        borderColor: "gray",
        borderWidth: .5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
    },
    dropdown1: {
        height: hp(6.7),
        borderColor: "gray",
        borderWidth: .5,
        borderRadius: 8,
        paddingHorizontal: 8,
        // marginTop: hp(1),
        width: wp(95),
        backgroundColor: '#F2F2F2E5',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        // left: 22,
        // top: 8,
        // zIndex: 999,
        // paddingHorizontal: 8,
        fontSize: hp(1.7),
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
});

export default BookClient