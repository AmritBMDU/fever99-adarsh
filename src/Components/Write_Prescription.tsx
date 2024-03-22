import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import { getUser } from '../Services/user.service';
import { addMedicine, getMedicines } from '../Services/MedicinesList.service';
import { toastError, toastSuccess } from '../utils/toast.utils';
import moment from 'moment';
import { addPrescription, editPrescription } from '../Services/prescription.service';
import Modal from "react-native-modal";
import { TimeData, durationCountData, roa, DaysData, doseFormArr } from "../allArrayData/DrArrayDatta"

const { height, width } = Dimensions.get('window')

const Write_Prescription = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation = useNavigation()
    const [userObj, setUserObj] = useState<any>("");
    const [query, setQuery] = useState({ page: 1, size: 10, filter: "" });
    const [isFocus, setIsFocus] = useState(false);

    const [appointMentObj, setAppointMentObj] = useState<any>({});
    const focused = useIsFocused()


    const [drugAllergy, setDrugAllergy] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [investigation, setInvestigation] = useState("");
    const [notes, setNotes] = useState("");
    const [pastHistory, setPastHistory] = useState("");
    const [personalHistory, setPersonalHistory] = useState("");
    const [surgicalHistory, setSurgicalHistory] = useState("");
    const [symptoms, setSymptoms] = useState("");



    const [name, setName] = useState("");
    const [combination, setcombination] = useState("");
    const [company, setCompany] = useState("");
    const [medicineModal, setMedicineModal] = useState(false);


    const [isEditModeOn, setIsEditModeOn] = useState(false);
    const [prescriptionId, setPrescriptionId] = useState("");


    const [medicinesArr, setMedicinesArr] = useState([]);
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }



    const FrequencyData = [
        {
            label: "Once a day",
            value: "Once a day",
        },
        {
            label: "Twice a day",
            value: "Twice a day",
        },
        {
            label: "Thrice a day",
            value: "Thrice a day",
        },
        {
            label: "Four times a day",
            value: "Four times a day",
        },
    ]

    const [medicine, setMedicine] = useState([
        {
            name: "",
            time: "",
            frequency: "",
            duration: "",
            note: "",
            roa: "",
            dose_form: "",
            duration_count: ""
        }
    ]);

    const handleGetMedicines = async () => {
        try {
            let query = "page=1&limit=11500"
            let { data: res } = await getMedicines(query);
            if (res.data) {
                setMedicinesArr(res.data.map((el: any) => ({ label: el.name, value: el.name })))
            }
        } catch (error) {
            toastError(error)
        }
    }
    const handleAddMedicineToDataBase = async () => {
        try {

            if (name == "") {
                toastError("Name is mandatory !!!");
                return
            }

            if (combination == "") {
                toastError("combination is mandatory !!!");
                return
            }

            if (company == "") {
                toastError("Company is mandatory !!!");
                return
            }

            let obj = {
                name,
                combination,
                company,
            }
            let { data: res } = await addMedicine(obj);
            if (res) {
                handleGetMedicines()
                toastSuccess(res.message);
                setMedicineModal(false);
            }
        } catch (error) {
            toastError(error)
        }
    }
    const handleSetDataToEdit = (data: any) => {
        setDrugAllergy(data.drugAllergy);
        setDiagnosis(data.diagnosis);
        setInvestigation(data.investigation);
        setNotes(data.notes);
        setPastHistory(data.pastHistory);
        setPersonalHistory(data.personalHistory);
        setSurgicalHistory(data.surgicalHistory);
        setSymptoms(data.symptoms);
        setMedicine(data.medicine);
        setPrescriptionId(data._id);
    }
    useEffect(() => {
        if (focused && props?.route?.params?.data) {
            handleGetAndSetUser()
            handleGetMedicines()
            setAppointMentObj(props?.route?.params?.data)
            if (props?.route?.params?.editModeOn) {
                setIsEditModeOn(true);
                handleSetDataToEdit(props?.route?.params?.prescriptionObj)
            }
        }
    }, [focused, props?.route?.params?.data]);
    const handleAddMedicine = () => {
        let tempArr = medicine
        tempArr.push({
            name: "",
            time: "",
            frequency: "",
            duration: "",
            note: "",
            roa: "",
            dose_form: "",
            duration_count: ""
        })
        setMedicine([...tempArr])
    }
    const handleDeleteMedicine = () => {

        let tempArr = medicine

        if (tempArr && tempArr.length > 1) {
            tempArr.pop()
            setMedicine([...tempArr])
        }
    }
    const handleUpdateContentForMedicine = (value: any, field: string, index: number) => {
        let tempArr: any = medicine

        tempArr[index][field] = value

        setMedicine([...tempArr])
    }

    const handleAddPrescription = async () => {
        try {


            let obj: any = {

                appointmentId: appointMentObj?._id,
                drugAllergy,
                diagnosis,
                investigation,
                notes,
                pastHistory,
                personalHistory,
                surgicalHistory,
                symptoms,
                medicine
            }


            if (isEditModeOn) {

            }
            else {
                obj.patientId = appointMentObj?.expert?._id
            }

            let res: any
            if (isEditModeOn) {
                res = await editPrescription(prescriptionId, obj);
            }
            else {
                res = await addPrescription(obj);
            }
            if (res.data) {
                toastSuccess(res.data.message);
                navigation.goBack();
            }
        } catch (err) {
            toastError(err)
        }
    }

    return (
        <View style={{ width: width, flex: 1, backgroundColor: 'white' }}>
            <Headerr secndheader={true} label='Prescription' />
            <ScrollView
                contentContainerStyle={{ paddingBottom: hp(.5) }} showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                    <View style={{ width: wp(95), alignSelf: 'center' }}>
                        <View style={{ width: wp(95), marginTop: hp(1), borderColor: '#535353', borderWidth: 0.8, paddingTop: hp(1.5), paddingBottom: hp(1.5), flexDirection: 'row', borderRadius: 5 }}>
                            <View style={{ width: wp(45) }}>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Name       :  <Text style={{ color: '#757474' }}>{appointMentObj?.patientName}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>BP             :  <Text style={{ color: '#757474' }}>{appointMentObj?.bp}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Oxygen    :  <Text style={{ color: '#757474' }}>{appointMentObj?.oxigne}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Sugar       :  <Text style={{ color: '#757474' }}>{appointMentObj?.suger3}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>RR             :  <Text style={{ color: '#757474' }}>{appointMentObj?.respiratoryRate}</Text></Text></View>
                            </View>

                            <View style={{ width: wp(45) }}>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Age                :  <Text style={{ color: '#757474' }}>{appointMentObj?.age}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Body Temp  :  <Text style={{ color: '#757474' }}>{appointMentObj?.bodyTemperature}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Pulse              :  <Text style={{ color: '#757474' }}>{appointMentObj?.pulse}</Text></Text></View>
                                <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(3) }}><Text style={{ fontSize: hp(1.7), fontFamily: mainFont }}>Gender          :  <Text style={{ color: '#757474' }}>{appointMentObj?.gender}</Text></Text></View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Symptoms:</Text>
                                <TextInput onChangeText={(e) => setSymptoms(e)} value={symptoms} placeholderTextColor="#8E8E8E" placeholder='Symptoms' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Diagnosis:</Text>
                                <TextInput onChangeText={(e) => setDiagnosis(e)} value={diagnosis} placeholderTextColor="#8E8E8E" placeholder='Diagnosis' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.7), fontFamily: mainFont, color: 'black' }}>Prescription Date:</Text>
                                <TextInput editable={false} value={moment(new Date()).format("YYYY-MM-DD")} placeholderTextColor="#8E8E8E" placeholder='Prescription' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Drug Allergy:</Text>
                                <TextInput onChangeText={(e) => setDrugAllergy(e)} value={drugAllergy} placeholderTextColor="#8E8E8E" placeholder='Drug Allergy' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Past History:</Text>
                                <TextInput onChangeText={(e) => setPastHistory(e)} value={pastHistory} placeholderTextColor="#8E8E8E" placeholder='Past History' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Personal History:</Text>
                                <TextInput onChangeText={(e) => setPersonalHistory(e)} value={personalHistory} placeholderTextColor="#8E8E8E" placeholder='Personal History' style={styles.inputBoxStyl} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.7), fontFamily: mainFont, color: 'black' }}>Surgical History:</Text>
                                <TextInput onChangeText={(e) => setSurgicalHistory(e)} value={surgicalHistory} placeholderTextColor="#8E8E8E" placeholder='Surgical History' style={styles.inputBoxStyl} />
                            </View>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginVertical: 15 }}>
                            <Text style={{ textTransform: "uppercase", }}>If medicine is not available in the list please add from here.</Text>
                            <TouchableOpacity onPress={() => setMedicineModal(true)} style={{
                                paddingHorizontal: 15,
                                height: hp(5),
                                backgroundColor: '#50B148',
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 15
                            }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Add more medicines +</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            medicine.map((el: any, index: number) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between', flexWrap: "wrap", borderWidth: 1, borderColor: "gray", borderRadius: 10, padding: 10 }}>
                                        <View style={{ width: wp(40) }} >
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Medicine Name:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={medicinesArr}
                                                // search
                                                maxHeight={300}
                                                search
                                                searchPlaceholder="Search..."
                                                labelField="label"
                                                valueField="value"
                                                placeholder='Select Medicine'
                                                value={el.name}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "name", index)
                                                }}
                                            />
                                        </View>
                                        <View style={{ width: wp(40) }} >
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Dose Form:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={doseFormArr}
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder='Select Dose'
                                                search
                                                searchPlaceholder="Search..."
                                                value={el.dose_form}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "dose_form", index)
                                                }}
                                            />
                                        </View>
                                        <View style={{ width: wp(40) }} >
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Frequency:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={DaysData}
                                                maxHeight={300}
                                                labelField="label"
                                                search
                                                searchPlaceholder="Search..."
                                                valueField="value"
                                                placeholder='Select'
                                                value={el.frequency}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "frequency", index)
                                                }}
                                            />
                                        </View>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>ROA:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={roa.map(option => ({ label: option.label, value: option.value }))}
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder='Select ROA'
                                                search
                                                searchPlaceholder="Search..."
                                                value={el.roa}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "roa", index)
                                                }}
                                            />
                                        </View>
                                       
                                        
                                        <View style={{ width: wp(40) }} >
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Duration:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={durationCountData}
                                                maxHeight={300}
                                                // search
                                                // searchPlaceholder="Search..."
                                                labelField="label"
                                                valueField="value"
                                                placeholder='Duration'
                                                value={el.duration}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "duration", index)
                                                }}
                                            />
                                        </View>

                                        <View style={{ width: wp(40) }} >
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Time:</Text>
                                            <Dropdown
                                                style={[styles.dropdown]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={TimeData}
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder='Select Time'
                                                // search
                                                // searchPlaceholder="Search..."
                                                value={el.time}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={(item: any) => {
                                                    handleUpdateContentForMedicine(item.value, "time", index)
                                                }}
                                            />
                                        </View>

                                        {/* <View style={{ width: wp(40) }}>
                                            </View> */}
                                        <View style={{ width: wp(40) }}>
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Duration Count:</Text>
                                            <TextInput onChangeText={(e) => handleUpdateContentForMedicine(e, "duration_count", index)} value={el.duration_count} placeholderTextColor="#8E8E8E" placeholder='Dose' style={styles.inputBoxStyl} />
                                        </View>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Dose:</Text>
                                            <TextInput onChangeText={(e) => handleUpdateContentForMedicine(e, "note", index)} value={el.note} placeholderTextColor="#8E8E8E" placeholder='Dose' style={styles.inputBoxStyl} />
                                        </View>

                                    </View>
                                )
                            })
                        }
                        {/* justifyContent:"flex-end", */}
                        <View style={{ flexDirection: 'row', marginTop: hp(2), alignSelf: 'center', paddingTop: hp(1), paddingBottom: hp(1), width: wp(95), }}>
                            <TouchableOpacity
                                onPress={() => handleDeleteMedicine()}
                                style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#B0B0B0', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>-</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleAddMedicine()} style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                                <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Investigation:</Text>
                                <TextInput onChangeText={(e) => setInvestigation(e)} value={investigation} placeholderTextColor="#8E8E8E" placeholder='Investigation' style={styles.inputBoxStyl} />
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Notes:</Text>
                                <TextInput onChangeText={(e) => setNotes(e)} value={notes} placeholderTextColor="#8E8E8E" placeholder='Notes' style={styles.inputBoxStyl} />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </ScrollView>
            <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: hp(1), paddingBottom: hp(1), width: wp(95), }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: wp(45), height: hp(5), backgroundColor: '#000', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleAddPrescription()} style={{ width: wp(45), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: wp(5) }}>
                    <Text style={{ fontSize: hp(1.8), color: 'white', fontFamily: mainFontmedium }}>{isEditModeOn ? "Update" : "Review"} Prescription</Text>
                </TouchableOpacity>
            </View>


            <Modal
                isVisible={medicineModal}
                animationIn={'bounceIn'}
                animationOut={'slideOutDown'}
                onBackButtonPress={() => setMedicineModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setMedicineModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: 'black', fontFamily: mainFont, fontWeight: "bold" }}>Raise an issue</Text>

                    <TextInput placeholder='Name' style={{ marginTop: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e) => setName(e)} value={name} placeholderTextColor="gray" />
                    <TextInput placeholder='Combination' style={{ marginVertical: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e) => setcombination(e)} value={combination} placeholderTextColor="gray" />
                    <TextInput placeholder='Company' style={{ marginVertical: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e) => setCompany(e)} value={company} placeholderTextColor="gray" />
                    <TouchableOpacity onPress={() => handleAddMedicineToDataBase()} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Raise an issue / complaint</Text>
                    </TouchableOpacity>
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
        borderWidth: 0.7,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginBottom: hp(1.1),
        width: wp(40),
        backgroundColor: '#F2F2F2E5',
    },
    inputBoxStyl: {
        height: hp(6),
        backgroundColor: '#F2F2F2E5',
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 0.7,
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

export default Write_Prescription







