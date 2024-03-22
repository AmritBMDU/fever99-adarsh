import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Animated, ScrollView, ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { toastError } from '../utils/toast.utils';
import { getDoctors } from '../Services/doctor.service';
import { generateFilePath } from '../Services/url.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { Dropdown } from 'react-native-element-dropdown';
import { getUser } from '../Services/user.service';
import { Roles } from '../utils/constant';

const { height, width } = Dimensions.get('window')
const Book_Appointment = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [slctdsec, setSlctdsec] = useState('all')
    const focused = useIsFocused()
    const [userObj, setUserObj] = useState<any>("");

    const [sortType, setSortType] = useState("ASC");

    const [doctorsArr, setDoctorsArr] = useState<any[]>([]);
    const [lastPageReached, setLastPageReached] = useState(false);

    const [specialisationArr, setSpecialisationArr] = useState([]);

    const [specialization, setSpecialisation] = useState("");

    const [isFocus, setIsFocus] = useState(false);
    const [cityIsFocused, setCityIsFocused] = useState(false);

    const [position, setPosition] = useState(0);
    const [gender, setGender] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);
    const [price, setPrice] = useState("");




    const HandleGetStatesAndCities = async () => {
        try {
            let { data: res } = await getstateAndCities();
            if (res.data && res.data.length > 0) {
                setStatesArr([...res.data.map((el: any) => ({ label: el.state, value: el.state, cities: el.city }))])
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const HandleGetDoctorsPaginated = async (pageValue: number) => {
        try {
            let queryString = `page=${pageValue}&limit=${limit}`
            if (query && query != "") {
                queryString = `${queryString}&query=${query}`
            }
            if (city && city != "") {
                queryString = `${queryString}&city=${city}`
            }


            let { data: res } = await getDoctors(queryString);
            if (res.data && res.data.length > 0) {
                setDoctorsArr((prev: any) => [...prev, ...res.data])
                setSpecialisationArr(res.spacility.map((el: any) => ({ label: el, value: el })))
            }
            else {
                setLastPageReached(true)
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const handleSearch = async () => {
        try {
            setPage(1)
            let queryString = `page=${1}&limit=${limit}`
            if (query && query != "") {
                queryString = `${queryString}&query=${query}`
            }
            if (city && city != "") {
                queryString = `${queryString}&city=${city}`
            }
            if (specialization && specialization != "") {
                queryString = `${queryString}&specialization=${specialization}`
            }
            if (price && price != "") {
                queryString = `${queryString}&price=${price}`
            }
            if (gender && gender != "") {
                queryString = `${queryString}&gender=${gender}`
            }
            if (sortType && sortType != "") {
                queryString = `${queryString}&pricesort=${sortType}`
            }
            console.log(queryString, "queryString", city)
            let { data: res } = await getDoctors(queryString);
            if (res.data) {
                setDoctorsArr([...res.data])
            }
            else {
                setLastPageReached(true)
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
            HandleGetStatesAndCities()
        }
    }, [focused])


    useEffect(() => {
        if (focused) {
            HandleGetDoctorsPaginated(1)
        }

        return () => { handleClearAllfilter() }
    }, [focused])


    const handleClearAllfilter = () => {
        setPage(1);
        setCity('');
        setQuery("");
        setPrice("");
        setGender("");
        setSpecialisation("");
        setDoctorsArr([]);
        HandleGetDoctorsPaginated(1)
    }
    const handleOnEndReached = () => {
        if (lastPageReached == false) {
            setPage(prev => prev + 1);
            HandleGetDoctorsPaginated(page + 1)
        }
    }

    return (
        <View style={{ width: width, backgroundColor: '#F1F8FF',flex:1 }}>
            <Headerr secndheader={true} label='Book Appointment' />
            <View style={{ width: wp(95), alignSelf: 'center', marginTop: hp(1) }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignSelf: 'center', flexDirection: 'row', paddingBottom: hp(1) }}>
                    <TouchableOpacity onPress={() => { setSlctdsec('all'); setPosition((prev: any) => prev + 1); handleClearAllfilter() }}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'all' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'all' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'all' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSlctdsec('Doc_name')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'Doc_name' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'Doc_name' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'Doc_name' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Our Doctors</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSlctdsec('spc')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'spc' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'spc' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'spc' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Speacialization</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSlctdsec('gender')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'gender' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'gender' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'gender' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Gender</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSlctdsec('loc')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'loc' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'loc' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'loc' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSlctdsec('price')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'price' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'price' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'price' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Price</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => setSlctdsec('status')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'status' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'status' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'status' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Status</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => setSlctdsec('sort')}
                        style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'sort' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'sort' ? 0 : 0.8 }}>
                        <Text style={{ color: slctdsec == 'sort' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>Sort</Text>
                    </TouchableOpacity>
                </ScrollView>


                {
                    slctdsec == "Doc_name" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                        <TextInput placeholder={`Please search Doctor Name`} value={query} onChangeText={(e) => setQuery(e)} style={{ flex: 1, paddingLeft: 10 }} />
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    slctdsec == "price" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                        <TextInput placeholder={`Please search price`} value={price} onChangeText={(e) => setPrice(e)} style={{ flex: 1, paddingLeft: 10 }} keyboardType="number-pad" />
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    slctdsec == "spc" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                        <Dropdown
                            style={[styles.dropdown, { width: wp(69) }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={specialisationArr}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select One'
                            value={specialization}
                            onChange={(item: any) => {
                                setSpecialisation(item.value);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    slctdsec == "gender" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                        <Dropdown
                            style={[styles.dropdown, { width: wp(69) }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                            ]}
                            // search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select gender'
                            // searchPlaceholder="Search..."
                            value={gender}
                            onChange={(item: any) => {
                                setGender(item.value);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    slctdsec == "sort" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, paddingVertical: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                        <View>
                            <Text style={{ paddingHorizontal: 10, marginBottom: 5 }}>Price</Text>
                            <View style={{ display: "flex", flexDirection: "row", paddingHorizontal: 5, alignItems: "center" }} >

                                <TouchableOpacity
                                    onPress={() => { setSortType("ASC") }}
                                    style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: sortType == "ASC" ? '#50B148' : "gray", borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Ascending</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setSortType("DESC") }}
                                    style={{ paddingHorizontal: 15, paddingVertical: 5, marginLeft: 10, backgroundColor: sortType == "DESC" ? '#50B148' : "gray", borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Descending</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => { handleSearch() }}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    slctdsec == "status" &&
                    <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>

                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{ paddingHorizontal: 15, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                }


                {
                    slctdsec == "loc" &&
                    <View style={{ borderColor: "gray", borderWidth: 1, borderRadius: 10, paddingVertical: 10 }}>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 5, alignItems: "center" }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 0.5, }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={statesArr}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder='Select One'
                                // searchPlaceholder="Search..."
                                value={city}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(item: any) => {
                                    setCityArr([...item.cities.map((el: any) => ({ label: el, value: el }))])
                                    setIsFocus(false);
                                }}
                            />


                            {
                                cityArr && cityArr.length > 0 &&
                                <Dropdown
                                    style={[styles.dropdown, cityIsFocused && { borderColor: 'blue', borderWidth: 0.5, }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={cityArr}
                                    // search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Select One'
                                    // searchPlaceholder="Search..."
                                    value={city}
                                    onFocus={() => setCityIsFocused(true)}
                                    onBlur={() => setCityIsFocused(false)}
                                    onChange={(item: any) => {
                                        setCity(item.value);
                                        setCityIsFocused(false);
                                    }}
                                />
                            }


                        </View>
                        <View style={{ display: "flex", flexDirection: "row", borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>

                            <TouchableOpacity
                                onPress={() => setCity("")}
                                style={{ marginHorizontal: 15, flex: 1, height: hp(5), backgroundColor: 'gray', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleSearch()}
                                style={{ marginHorizontal: 15, flex: 1, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                <View style={{ width: wp(95), marginTop: hp(1), height: height - hp(10) }}>
                    <FlatList
                        data={doctorsArr}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            <>
                                {lastPageReached == false && <ActivityIndicator size={"large"} color={maincolor} />}
                            </>
                        }
                        onEndReached={() => { handleOnEndReached() }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ width: wp(95), padding: 7, backgroundColor: 'white', marginBottom: hp(2), elevation: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%" }}>
                                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                                            <Image source={{ uri: generateFilePath(item.image) }}
                                                style={{ height: wp(18), width: wp(18) }} />
                                            <View style={{ marginLeft: wp(2), minHeight: wp(18), justifyContent: 'center' }}>
                                                <View style={{ display: "flex", flexDirection: "row", maxWidth: wp(25) }}>
                                                    <Text style={{ color: 'black', fontSize: hp(1.8), maxWidth: wp(35), fontFamily: mainFont }}>{item?.name}</Text>
                                                </View>
                                                <Text style={{ color: '#7E7B7B', fontSize: hp(1.5), fontFamily: mainFont, marginTop: hp(0.5) }}>{item?.userExtraDetails?.totalExperience} years of experience</Text>
                                                <Text style={{ color: '#7E7B7B', fontSize: hp(1.5), maxWidth: wp(35), fontFamily: mainFont, marginTop: hp(0.5) }}>{item?.userExtraDetails?.degree}</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ width: wp(25), height: wp(18), alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', maxWidth: wp(35), }}>
                                                <Image source={require('../../assets/images/location.png')} style={{ height: wp(4), width: wp(4) }} />
                                                <Text style={{ color: '#4A4D64', fontSize: hp(1.6), fontFamily: mainFont, marginLeft: wp(1) }}>{item?.city}</Text>
                                            </View>
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
                                                <Text style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: item?.userStatus == "online" ? 'green' : "red" }}></Text>
                                                <Text style={{ marginLeft: 5 }}>{item?.userStatus == "online" ? "Available" : "Not available"}</Text>
                                            </View>
                                            <Text style={{ color: '#7E7B7B', fontSize: hp(1.5), fontFamily: mainFont, marginLeft: wp(1) }}>Fee : ₹{item?.serviceCharge}/- </Text>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'baseline', paddingTop: hp(1.5) }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('BookVdo', { doctor: item })}
                                            style={{ flex: 1, marginRight: 5, height: hp(5), backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: 13 }}>Book Video Consult</Text>
                                        </TouchableOpacity>
                                        {
                                            userObj?.role !== Roles.FRANCHISE &&
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('BookClient', { doctor: item })}
                                                style={{ flex: 1, marginLeft: 5, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: 13 }}>Book Clinic Visit</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>

            </View>

        </View >
    )
}
const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: hp(1),
        width: wp(45),
        backgroundColor: '#F2F2F2E5',
    },
    dropdown1: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
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
export default Book_Appointment