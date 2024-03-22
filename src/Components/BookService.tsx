import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { UserDataContext } from '../../App';
import Headerr from '../ReuseableComp/Headerr';
import { fileUpload } from '../Services/fileUpload.service';
import { addServiceBooking, addServiceBookingHealthInsurance } from '../Services/serviceOrder.service';
import { getServiceByid, getServicesPaginated } from '../Services/services.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { toastError, toastSuccess } from '../utils/toast.utils';

const { height, width } = Dimensions.get('window')
const BookService = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [dateModal, setDateModal] = useState(false);
    const [timeModal, setTimeModal] = useState(false);
    const [isHealthInsurance, setIsHealthInsurance] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [pincodeUnavailable, setPincodeUnavailable] = useState(false);
    const [pincodeUnavailableMessage, setPincodeUnavailableMessage] = useState("");

    const [city, setCity] = useState("");
    const [disctrict, setDisctrict] = useState("");
    const [state, setState] = useState("");
    const [familyArr, setFamilyArr] = useState([
        {
            fname: "",
            age: 0
        }
    ]);
    const [comment, setComment] = useState("");
    const [filesArr, setFilesArr] = useState<any[]>([]);

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [servicesArr, setServicesArr] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [cityIsFocused, setCityIsFocused] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [age, setAge] = useState("");
    const [date, setDate] = useState("");
    const [gender, setGender] = useState("");
    const [medicalProblem, setMedicalProblem] = useState("");
    const [mobile, setMobile] = useState("");
    const [time, setTime] = useState("");
    const [amount, setAmount] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [userData, setUserData] = useContext(UserDataContext)
    const [serviceName, setServiceName] = useState("");
    const [bookmodal, setBookmodal] = useState(false)
    const Dropdwndata = [
        {
            label: 'Male', value: 'Male'
        },
        {
            label: 'Female', value: 'Female'
        },
        {
            label: 'Others', value: 'Others'
        },
    ]



    const focused = useIsFocused();



    const handleGetServices = async () => {
        try {
            let { data: res }: any = await getServicesPaginated("page=1&size=20")
            if (res) {
                setServicesArr(res.data);
                // console.log(JSON.stringify(res, null, 2), "services")
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    useEffect(() => {
        if (focused) {
            if (props.route.params.serviceId && props.route.params.serviceId != "") {
                setServiceId(props.route.params.serviceId);
            }
            else {
                handleGetServices()
            }
        }
        handleGetServiceById(props.route.params.serviceId)
        setCustomerName(userData?.name);
        setMobile(userData?.mobile);
        HandleGetStatesAndCities()
        return () => {
            setServiceId("")
            setServicesArr([])
        }
    }, [focused, props.route.params.serviceId,])


    const handleGetServiceById = async (id: string) => {
        try {
            let { data: res } = await getServiceByid(id);
            if (res) {
                if (`${res.data.name}`.replaceAll(" ", "").toLowerCase().includes("healthinsurance")) {
                    setIsHealthInsurance(true);
                }
                setServiceName(res.data.name);
                setAmount(res.data.price)
            }
        }
        catch (err) {
            toastError(err)
        }
    }




    const handleSubmit = async () => {
        try {
            if (isHealthInsurance) {
                if (age == "") {
                    toastError("Age is mandatory !!!");
                    return
                }
                if (gender == "") {
                    toastError("Age is mandatory !!!");
                    return
                }
                if (medicalProblem == "") {
                    toastError("Medical Problem is mandatory !!!");
                    return
                }
                if (date == "") {
                    toastError("Date is mandatory !!!");
                    return
                }
                if (time == "") {
                    toastError("Time is mandatory !!!");
                    return
                }

                let obj = {
                    name,
                    age,
                    gender,
                    email,
                    state,
                    address,
                    city,
                    disctrict,
                    familyArr,
                    comment,
                    mobile,
                    serviceName,
                    amount,
                }
                let { data: res } = await addServiceBookingHealthInsurance(obj);

                if (res) {
                    setBookmodal(true)
                }
            }
            else {

                if (age == "") {
                    toastError("Age is mandatory !!!");
                    return
                }
                if (gender == "") {
                    toastError("Age is mandatory !!!");
                    return
                }
                if (medicalProblem == "") {
                    toastError("Medical Problem is mandatory !!!");
                    return
                }
                if (date == "") {
                    toastError("Date is mandatory !!!");
                    return
                }
                if (time == "") {
                    toastError("Time is mandatory !!!");
                    return
                }

                let obj = {
                    customerName,
                    age,
                    date: new Date(date),
                    gender,
                    medicalProblem,
                    mobile,
                    time,
                    pin_code: pinCode,
                    state,
                    city,
                    serviceId,
                    serviceName,
                    amount,
                }
                let { data: res } = await addServiceBooking(obj);

                if (res) {
                    console.log(res, "res")
                    if (res.data.status == "pending") {
                        setPincodeUnavailable(true);
                        setPincodeUnavailableMessage(res.message)
                    }
                    else {
                        setBookmodal(true)
                    }
                    console.log(res)
                }
            }


            // 
        } catch (err) {
            toastError(err)
        }
    }


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
                        setFilesArr((prev: any) => [...prev, { fileName: res.data }])
                    }
                }
            }
        } catch (error) {
            toastError(error);
        }
    };



    const handleAddFamilyMember = () => {
        if (familyArr && familyArr.length < 6) {
            setFamilyArr(prev => [...prev, {
                fname: "",
                age: 0
            }])
        }
    }

    const handleRemoveFamilyMember = () => {
        let tempArr = familyArr
        if (tempArr && tempArr.length > 0) {
            tempArr.pop()
            setFamilyArr([...tempArr]);
        }
    }
    const handleEnterFamilyMemberDetails = (value: any, index: any, field: any) => {
        let tempArr: any = familyArr
        tempArr[index][field] = value;
        setFamilyArr([...tempArr]);
    }


    return (
        <ScrollView style={{ width: width, backgroundColor: 'white', height: height }}>
            <Headerr secndheader={true} label='Service Request Details' />
            <View>
                <KeyboardAvoidingView
                    behavior={"padding"}
                    keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 20}
                    style={{ flex: 1 }}
                >
                    <View style={{ width: wp(95), alignSelf: 'center' }}>
                        {
                            isHealthInsurance ?
                                <>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Name:</Text>
                                    <TextInput onChangeText={(e) => setCustomerName(e)} value={customerName} editable={true} placeholder='Enter Your Name' style={styles.textInputFilds} />
                                </>
                                :
                                <>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Name:</Text>
                                    <TextInput onChangeText={(e) => setName(e)} value={name} editable={true} placeholder='Enter Your Name' style={styles.textInputFilds} />
                                </>
                        }
                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Mobile No.:</Text>
                        <TextInput onChangeText={(e) => setMobile(e)} value={mobile} editable={false} placeholder='Enter Your Mobile No.' style={styles.textInputFilds} />
                        <View>
                            {
                                isHealthInsurance &&
                                <>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Email:</Text>
                                    <TextInput placeholder='Enter Your Email' onChangeText={(e) => setEmail(e)} value={email} style={styles.textInputFilds} />
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Address:</Text>
                                    <TextInput placeholder='Enter Your Address' onChangeText={(e) => setEmail(e)} value={email} style={styles.textInputFilds} />
                                </>
                            }
                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>State:</Text>
                            <Dropdown
                                style={[styles.dropdown, { width: wp(95) }, isFocus && { borderColor: 'blue', borderWidth: 0.5, }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={statesArr}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder='Select State'
                                search
                                searchPlaceholder="Search..."
                                value={state}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(item: any) => {
                                    setState(item.value);
                                    setCityArr([...item.cities.map((el: any) => ({ label: el, value: el }))])
                                    setIsFocus(false);
                                }}
                            />


                            {
                                cityArr && cityArr.length > 0 &&
                                <>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>City:</Text>
                                    <Dropdown
                                        style={[styles.dropdown, { width: wp(95) }, cityIsFocused && { borderColor: 'blue', borderWidth: 0.5, }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={cityArr}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder='Select City'
                                        search
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
                            {
                                !isHealthInsurance &&
                                <>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Pincode:</Text>
                                    <TextInput onChangeText={(e) => setPinCode(e)} value={pinCode} editable={true} placeholder='Enter Your Pincode.' style={styles.textInputFilds} />
                                </>

                            }
                            {
                                isHealthInsurance &&
                                <View style={{ width: wp(95) }} >
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>District:</Text>
                                    <TextInput placeholder='Enter Your District' onChangeText={(e) => setDisctrict(e)} value={disctrict} style={styles.textInputFilds} />
                                </View>
                            }
                        </View>



                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: isHealthInsurance ? wp(95) : wp(45) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Age:</Text>
                                <TextInput placeholder='Enter Your age' keyboardType='number-pad' onChangeText={(e) => setAge(e)} value={age} style={styles.textInputFilds} />
                            </View>
                            {
                                isHealthInsurance == false &&
                                <>
                                    <View style={{ width: wp(45) }} >
                                        <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Gender:</Text>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={Dropdwndata}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select One'
                                            value={gender}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setGender(item.value);
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                </>

                            }

                        </View>
                        {
                            isHealthInsurance == false &&
                            <>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Message (Comments/Details):</Text>
                                <TextInput placeholder='Your Message here..' onChangeText={(e) => setMedicalProblem(e)} value={medicalProblem} style={styles.textInputFilds} />
                            </>
                        }

                        {
                            isHealthInsurance == false &&
                            <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                                <View style={{ width: wp(45) }}>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Select Date:</Text>
                                    <Pressable onPress={() => setDateModal(true)}>
                                        <TextInput placeholder='YYYY-MM-DD' editable={false} onChangeText={(e) => setMedicalProblem(e)} value={date} style={styles.dropdown} />
                                    </Pressable>
                                </View>

                                <View style={{ width: wp(45) }}>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Select Time:</Text>
                                    <Pressable onPress={() => setTimeModal(true)}>
                                        <TextInput placeholder='HH:MM' editable={false} value={time} style={styles.dropdown} />
                                    </Pressable>
                                </View>
                            </View>
                        }
                        {
                            isHealthInsurance &&
                            <>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Comment:</Text>
                                <TextInput placeholder='Enter Your Comment' multiline onChangeText={(e) => setComment(e)} value={comment} style={styles.textInputFilds} />
                            </>
                        }


                        {
                            isHealthInsurance &&
                            <>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Family Details:</Text>

                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                        <Pressable onPress={() => handleRemoveFamilyMember()} style={{ paddingHorizontal: 10, paddingVertical: 10, borderWidth: 1, borderColor: "grey", borderRadius: 10, width: 40, marginRight: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Text>-</Text>
                                        </Pressable>
                                        <Pressable onPress={() => handleAddFamilyMember()} style={{ paddingHorizontal: 10, paddingVertical: 10, borderWidth: 1, borderColor: "grey", borderRadius: 10, width: 40, marginRight: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Text>+</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                {
                                    familyArr && familyArr.length > 0 && familyArr.map((el: any, index: any) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp(95) }}>
                                                <View>
                                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Name:</Text>
                                                    <TextInput placeholder='Name ...' onChangeText={(e) => handleEnterFamilyMemberDetails(e, index, "fname")} value={el.fname} style={{ height: hp(6), width: wp(45), borderColor: '#E8E6E6', borderWidth: 0.5, marginTop: hp(1), borderRadius: 8 }} />
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', marginTop: hp(1.5) }}>Age:</Text>
                                                    <TextInput placeholder='Age ...' onChangeText={(e) => handleEnterFamilyMemberDetails(e, index, "age")} value={el.age} style={{ height: hp(6), width: wp(45), borderColor: '#E8E6E6', borderWidth: 0.5, marginTop: hp(1), borderRadius: 8 }} />
                                                </View>
                                            </View>
                                        )
                                    })
                                }

                            </>
                        }
                    </View>

                    <View style={{ width: width, marginTop: 10, flexDirection: 'row', height: hp(8), paddingBottom: hp(1), paddingLeft: wp(1.5), paddingRight: wp(2), justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ width: wp(45), backgroundColor: "#000", borderRadius: wp(1), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: 'white', fontSize: hp(1.9), fontFamily: mainFont }}>Close</Text>
                            <Image source={require('../../assets/images/close.png')}
                                style={{ height: wp(3), width: wp(3), resizeMode: 'contain', marginLeft: wp(2) }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSubmit()}
                            style={{ width: wp(45), backgroundColor: '#50B148', borderRadius: wp(1), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../assets/images/plus.png')} style={{ height: wp(5), width: wp(5), resizeMode: 'contain', marginRight: wp(2) }} />
                            <Text style={{ color: 'white', fontSize: hp(1.9), fontFamily: mainFont }}>Book</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        timeModal &&
                        <DateTimePicker
                            value={new Date()}
                            onChange={(e) => {
                                setTime(`${new Date(e.nativeEvent.timestamp).getHours()}:${new Date(e.nativeEvent.timestamp).getMinutes()}`)
                                setTimeModal(false);
                            }}
                            mode={"time"}
                            is24Hour={true}
                            display="default"
                        />
                    }

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
                                    setDate(day.dateString);
                                    setDateModal(false)
                                }}
                                minDate={`${new Date()}`}
                            />
                        </View>
                    </Modal>


                    <Modal
                        isVisible={bookmodal}
                        animationIn={'zoomIn'}
                        animationOut={'zoomOut'}
                        onBackButtonPress={() => setBookmodal(false)}
                        style={{ marginLeft: 0, marginRight: 0 }}
                    >
                        <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                            <TouchableOpacity
                                onPress={() => setBookmodal(false)}
                                style={{ alignSelf: 'flex-end' }}>
                                <Image source={require('../../assets/images/close.png')}
                                    style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                            </TouchableOpacity>
                            <View style={{ height: wp(14), width: wp(14), backgroundColor: '#D8D8D8E5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: wp(8) }}>
                                <Image source={require('../../assets/images/MP.png')}
                                    style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }} />
                            </View>
                            <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(2), marginTop: hp(3), textAlign: 'center' }}>Your Appointment Has Been
                                Successfully Booked</Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Appointment')}
                                style={{ height: hp(5), marginTop: hp(2), width: wp(35), backgroundColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>View</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>



                    <Modal
                        isVisible={pincodeUnavailable}
                        animationIn={'zoomIn'}
                        animationOut={'zoomOut'}
                        onBackButtonPress={() => setBookmodal(false)}
                        style={{ marginLeft: 0, marginRight: 0 }}
                    >
                        <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                            <TouchableOpacity
                                onPress={() => setPincodeUnavailable(false)}
                                style={{ alignSelf: 'flex-end' }}>
                                <Image source={require('../../assets/images/close.png')}
                                    style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                            </TouchableOpacity>
                            <View style={{ height: wp(14), width: wp(14), backgroundColor: '#D8D8D8E5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: wp(8) }}>
                                <Image source={require('../../assets/images/MP.png')}
                                    style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }} />
                            </View>
                            <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(2), marginTop: hp(3), textAlign: 'center' }}>{pincodeUnavailableMessage}</Text>

                            <TouchableOpacity
                                onPress={() => setPincodeUnavailable(false)}
                                style={{ height: hp(5), marginTop: hp(2), width: wp(35), backgroundColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    textInputFilds: {
        height: hp(6),
        borderWidth: 0.7,
        borderColor: 'gray',
        marginTop: hp(.5),
        borderRadius: wp(.7),
    },
    dropdown: {
        height: hp(6),
        borderColor: 'gray',
        borderWidth: 0.7,
        borderRadius: wp(.7),
        paddingHorizontal: 8,
        marginTop: hp(.5),
        width: wp(45)
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
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
export default BookService