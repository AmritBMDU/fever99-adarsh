import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, TextInput, Animated, StyleSheet, Pressable, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { addAppointments } from '../Services/appointments.service';
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DocumentPicker from 'react-native-document-picker'
import { fileUpload } from '../Services/fileUpload.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { SendNotificationForMeetingCreation } from '../Services/notificationSevice';
import { getWallet } from '../Services/wallet.service';
const { height, width } = Dimensions.get('window')
import { getUser } from '../Services/user.service';
import { Roles } from '../utils/constant';

const BookVideo = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [userObj, setUserObj] = useState<any>("");
    const focused = useIsFocused();
    const [isFocus, setIsFocus] = useState(false);
    const [isGenderFocused, setIsGenderFocused] = useState(false);
    const [dateModal, setDateModal] = useState(false);

    const [page, setPage] = useState(1);


    const [state, setstate] = useState("");
    const [city, setCity] = useState("");

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);

    const [meetingConfirmation, setMeetingConfirmation] = useState(false);

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
    ]


    const [age, setAge] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [gender, setGender] = useState("");
    const [mode, setMode] = useState("");
    const [patientName, setPatientName] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [doctorObj, setDoctorObj] = useState(props?.route?.params?.doctor);

    const [bodyTemperature, setBodyTemperature] = useState("");
    const [bp, setBp] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [oxigne, setOxigne] = useState("");
    const [pulse, setPulse] = useState("");
    const [suger1, setSuger1] = useState("");
    const [suger2, setSuger2] = useState("");
    const [suger3, setSuger3] = useState("");
    const [cityIsFocused, setCityIsFocused] = useState(false);
    const [balance, setBalance] = useState(0);
    const [wallet, setWallet] = useState([]);

    const [timeSlot, setTimeSlot] = useState(props?.route?.params?.doctor.timeSlot);
    const [timeSlotoffline, setTimeSlotoffline] = useState(props?.route?.params?.doctor.timeSlotoffline);
    const defaultOption = { label: "Excluded Doctor", value: "" };
    const modifiedTimeSlot = timeSlot.length === 0 ? [defaultOption] : timeSlot;

    const tempanount = 10;
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData);
        }
    }


    const handleCreateBookin = () => {

        console.log("mishra ju testing", userObj?.role, balance)
        if (userObj?.role == "FRANCHISE" && tempanount <= balance) {
            console.log("hii")
        }
        else {
            console.log("hola");
        }
    }

    const handleCreateBooking = async () => {
        try {
            if (gender == "") {
                setMeetingConfirmation(false)
                setPage(1)
                toastError("Gender is mandatory !!!");
                return;
            }
            if (dateTime == "") {
                setMeetingConfirmation(false)
                setPage(1)
                toastError("Date is mandatory !!!");
                return;
            }
            if (selectedTimeSlot == "") {
                setMeetingConfirmation(false)
                setPage(1)
                toastError("Time Slot is mandatory !!!");
                return;
            }
            if (patientName == "") {
                setMeetingConfirmation(false)
                setPage(1)
                toastError("Patient Name is mandatory !!!");
                return
            }
            let userData = await getUser();
            let obj = {
                age,
                bodyTemperature,
                bp,
                dateTime,
                doctorId: doctorObj?._id,
                expertId: userData._id,
                files,
                gender,
                city,
                state,
                mode: "Video",
                oxigne,
                patientName,
                paymentMode: "Online",
                pulse,
                selectedTimeSlot,
                suger1,
                suger2,
                suger3,
                timeSlot,
                timeSlotoffline,
            }
            let { data: res } = await addAppointments(obj);
            console.log("here 2", JSON.stringify(res, null, 2))
            if (res.appointment.status == "pending") {
                console.log(JSON.stringify(res, null, 2), "res");
                setMeetingConfirmation(false);
                if (!res.status) {
                    setMeetingConfirmation(false)
                    toastError(res.message)
                    return;
                }
                if (userObj?.role == "FRANCHISE" && res.appointment.appointmentCharge <= balance) {
                    await SendNotificationForMeetingCreation({ appointment: res.appointment._id })
                    navigation.navigate("Appointment");
                }
                else if (res.appointment.appointmentCharge) {
                    navigation.navigate("PayementScreen", { amount: res.appointment.appointmentCharge, appointmentId: res.appointment._id })
                }

            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const handleGetWallet = async () => {
        try {
            let { data: res }: any = await getWallet()
            if (res) {
                setWallet(res.transactions);
                setBalance(res?.balance);
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetWallet();
        }
    }, [focused])

    const handleDocumentPicker = async () => {
        try {
            let file: any = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                allowMultiSelection: true,
                type: [DocumentPicker.types.images, DocumentPicker.types.doc, DocumentPicker.types.docx],
            });
            if (file) {

                for (const el of file) {
                    let formData = new FormData();
                    formData.append("file", el)
                    let { data: res } = await fileUpload(formData);
                    if (res.message) {
                        toastSuccess(res.message);
                        setFiles((prev: any) => [...prev, { fileName: res.data }])
                    }
                }
            }
        } catch (error) {
            toastError(error);
        }
    };

    useEffect(() => {
        if (focused) {
            HandleGetStatesAndCities()
        }
    }, [focused])

    useEffect(() => {
        handleGetAndSetUser();
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

    const simplifiedTimeSlot = modifiedTimeSlot.map((slot: any) => ({
        label: slot.value.split(' ')[0],
        value: slot.value.split(' ')[0]
    }));

    return (
        <View style={{ width: width, flex: 1, backgroundColor: 'white' }}>
            <Headerr secndheader={true} label='Appointment Details' />
            <View style={{ width: wp(95), height:height-20, alignSelf: 'center', }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[]}
                    renderItem={null}
                    contentContainerStyle={{ paddingBottom: hp(5) }}
                    ListHeaderComponent={<View>
                        {
                            page == 1 &&
                            <>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Date:</Text>
                                        <Pressable onPress={() => setDateModal(true)}>
                                            <TextInput placeholder='Select Date' editable={false} onChangeText={(e) => setDateTime(e)} value={dateTime} style={{
                                                height: hp(6.7), backgroundColor: '#F2F2F2E5', marginVertical: hp(1), borderRadius: 8, borderColor: 'gray',
                                                borderWidth: 0.5,
                                            }} />
                                        </Pressable>
                                    </View>
                                    <View style={{ width: wp(45) }} >
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Select Slot:</Text>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderWidth: 0.5, }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={simplifiedTimeSlot}
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
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Name:</Text>
                                        <TextInput onChangeText={(e) => setPatientName(e)} value={patientName} placeholderTextColor="#8E8E8E" placeholder='Patient Name' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                    <View style={{ width: wp(45) }} >
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Gender:</Text>
                                        <Dropdown
                                            style={[styles.dropdown, isGenderFocused && { borderWidth: 0.5, }]}
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

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Age:</Text>
                                        <TextInput onChangeText={(e) => setAge(e)} value={age} keyboardType='number-pad' placeholderTextColor="#8E8E8E" placeholder='Patient Age' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>State:</Text>
                                        <Dropdown
                                            style={[styles.dropdown]}
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
                                            onChange={(item: any) => {
                                                setstate(item.value)
                                                setCityArr([...item.cities.map((el: any) => ({ label: el, value: el }))])
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                </View>

                                {
                                    cityArr && cityArr.length > 0 &&
                                    <>
                                        <Text style={{ fontSize: hp(1.8), marginTop: wp(1.8), fontFamily: mainFont, color: 'black' }}>City:</Text>

                                        <Dropdown
                                            style={[styles.dropdown, { width: wp(95) }, cityIsFocused && { borderWidth: 0.5, }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={cityArr}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select City'
                                            searchPlaceholder="Search..."
                                            value={city}
                                            onFocus={() => setCityIsFocused(true)}
                                            onBlur={() => setCityIsFocused(false)}
                                            onChange={(item: any) => {
                                                setCity(item.value);
                                                setCityIsFocused(false);
                                            }}
                                        />
                                    </>
                                }

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(2), width: wp(95) }}>
                                    <View style={{ width: wp(95) }}>
                                        <TouchableOpacity onPress={handleDocumentPicker}>
                                            <Text style={{ color: 'black', fontFamily: mainFontmedium, fontSize: hp(1.8) }}>Upload File</Text>
                                            <View style={{ width: wp(95), height: hp(5.5), borderColor: 'gray', borderWidth: 0.7, marginTop: hp(1), borderStyle: 'dashed', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(2), paddingRight: wp(2), flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: mainFont, fontSize: hp(1.4), color: 'gray' }}>{(files && files.length > 0) ? files.reduce((acc, el, index) => acc + `${el.fileName} ${(index != files.length - 1) ? "," : ""}`, "") : "Select JPG,PDF,PNG Format"}</Text>
                                                <Image source={require('../../assets/images/upld.png')}
                                                    style={{ height: wp(6), width: wp(6), resizeMode: 'contain' }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                        {
                            page == 2 &&
                            <>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>BP <Text style={{ color: "black" }}>mm of Hg</Text></Text>
                                        <TextInput onChangeText={(e) => setBp(e)} value={bp} placeholderTextColor="#8E8E8E" placeholder='Enter BP' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Pulse  <Text style={{ color: "black" }}>Per minute</Text></Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setPulse(e)} value={pulse} placeholderTextColor="#8E8E8E" placeholder='Enter Pulse' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Body Temperature <Text style={{ color: "black" }}>°F</Text></Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setBodyTemperature(e)} value={bodyTemperature} placeholderTextColor="#8E8E8E" placeholder='Enter Temperature' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>SpO2 %</Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setOxigne(e)} value={oxigne} placeholderTextColor="#8E8E8E" placeholder='Enter SpO2' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Fasting Blood Sugar (FBS)<Text style={{ color: "black" }}> mg/dL</Text></Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setSuger1(e)} value={suger1} placeholderTextColor="#8E8E8E" placeholder='Fasting Blood Sugar (FBS)' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>

                                    <View style={{ width: wp(45) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Postprandial Blood Sugar (PPBS)<Text style={{ color: "black" }}> mg/dL</Text></Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setSuger2(e)} value={suger2} placeholderTextColor="#8E8E8E" placeholder='Postprandial (PPBS)' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                    <View style={{ width: wp(95) }}>
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Random Blood Sugar (RBS)<Text style={{ color: "black" }}> mg/dL</Text></Text>
                                        <TextInput keyboardType='numeric' onChangeText={(e) => setSuger3(e)} value={suger3} placeholderTextColor="#8E8E8E" placeholder='Random Blood Sugar' style={{ height: hp(7.1), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, borderColor: 'gray', borderWidth: .5 }} />
                                    </View>
                                </View>
                            </>
                        }

                    </View>}
                />
                <View style={{ flexDirection: 'row', alignSelf: 'baseline', paddingBottom: hp(7), width: wp(95) }}>
                    {
                        page == 1 ?
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{ width: wp(45), height: hp(5), backgroundColor: '#000', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Close</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPage(1)}
                                style={{ width: wp(45), height: hp(5), backgroundColor: '#000', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Go back</Text>
                            </TouchableOpacity>

                    }
                    {
                        page == 1 ?
                            <TouchableOpacity onPress={() => setPage(2)} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Next</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setMeetingConfirmation(true)} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Proceed</Text>
                                {/* <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Random Blood Sugar<Text style={{ color: "black" }}> mg/dL (RBS)</Text> :</Text> */}
                            </TouchableOpacity>
                    }
                </View>


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

            <Modal
                isVisible={meetingConfirmation}
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
                onBackButtonPress={() => setMeetingConfirmation(false)}
                style={{ marginLeft: 0, marginRight: 0  }}
            >
                <View style={{ width: wp(85), height: hp(100), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, }}>
                    <View style={{ height: hp(6), width: wp(85), backgroundColor: maincolor, borderTopRightRadius: 5, borderTopLeftRadius: 5, justifyContent: 'center', paddingLeft: wp(5) }}>
                        <Text style={{ color: 'white', fontSize: hp(1.9), textTransform: "capitalize" }}>CONSENT FORM FOR TELECOMMUNICATION </Text>
                    </View>
                    <ScrollView contentContainerStyle={{ marginTop: 15, width: wp(75), alignSelf: 'center', paddingBottom: 25 }} showsVerticalScrollIndicator={false}>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>1. Fever99 is offering telemedicine or video consultation where patients are not being able to reach the hospital.
                            A video or telemedicine consultation can never be compared to a normal in-hospital consultation where the doctor is able to physically examine the patient.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>2. You are advised to come to the hospital for consults whenever you are in a position for the same. If the consultation cannot wait, then only you should opt for a telemedicine or video consultation. </Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>3. You are advised to confirm the diagnosis, treatment and prescription whenever you are able to come to the hospital for a physical consult. In case your symptoms/condition does not improve, immediately reach the nearest hospital.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>4. ⁠By accepting telemedicine consultation , you agree and accept that the tele-consultants/doctors and all personnel directly or indirectly involved with any part of the Telemedicine set up shall not be held responsible in the unlikely event of an error in diagnosis or management due to the occurrence of sub optimal technical conditions. While every attempt will be made to ensure ideal conditions, unforeseen situations may occur.</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.8), marginBottom: 10 }}>5. Fever99 and/or its doctors shall not be responsible for complete accuracy of telemedicine consultation, limited in its scope as it is, with no physical examination of the patient being possible. While every attempt will be made to ensure comprehensiveness of the consultation, unforeseen situations may arise. Your accepting telemedicine consultation will be taken as your consent for a telemedicine consult with its ingrained limitations.</Text>


                        <View style={{ flexDirection: 'row', marginTop: hp(2), alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => handleCreateBooking()} style={{ width: wp(25), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', }}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        fontSize: hp(1.7),
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'gray',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#8E8E8E'
    },
    dropdown1: {
        height: hp(6.6),
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
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

export default BookVideo;