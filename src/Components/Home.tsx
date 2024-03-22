import messaging from '@react-native-firebase/messaging';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AuthContext, LoginContext } from '../../App';
import Headerr from '../ReuseableComp/Headerr';
import { useNetInfo } from '@react-native-community/netinfo';

import {
    LineChart
} from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import { getDashboard } from '../Services/dashboard.service';
import { getDoctors } from '../Services/doctor.service';
import { getServicesPaginated } from '../Services/services.service';
import { getstateAndCities } from '../Services/stateCity.service';
import { generateFilePath } from '../Services/url.service';
import { getUser, saveTokenToDatabase } from '../Services/user.service';
import { getWallet } from '../Services/wallet.service';
import { Roles } from '../utils/constant';
import { toastError } from '../utils/toast.utils';

const { height, width } = Dimensions.get('window')

const Home = () => {
    // checking internet connection
    const netInfo = useNetInfo();
    const isConnected = netInfo.isConnected;
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const [dashboardData, setDashboardData] = useState({});
    const navigation: any = useNavigation();
    const [user, setuser] = useContext(LoginContext)
    const [servicesArr, setServicesArr] = useState([]);
    const [userObj, setUserObj] = useState<any>("");
    const [doctorSearchModal, setDoctorSearchModal] = useState(false);
    const [wallet, setWallet] = useState({});

    const [monthlyIncomeData, setMonthlyIncomeData] = useState<any[]>([]);
    const [appointmentData, setAppointmentData] = useState<any[]>([]);
    const [sortType, setSortType] = useState("ASC");
    const [isAuthorized, setIsAuthorized] = useContext(AuthContext)

    const [lastPageReached, setLastPageReached] = useState(false);

    const [specialisationArr, setSpecialisationArr] = useState([]);

    const [specialization, setSpecialisation] = useState("");

    const [isFocus, setIsFocus] = useState(false);
    const [cityIsFocused, setCityIsFocused] = useState(false);

    const [position, setPosition] = useState(0);
    const [gender, setGender] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [city, setCity] = useState("");

    const [statesArr, setStatesArr] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);
    const [price, setPrice] = useState("");
    const [slctdsec, setSlctdsec] = useState('all')

    const [doctorHomeVisit, setDoctorHomeVisit] = useState<any>({});



    const [query, setQuery] = useState("");
    const [doctorsArr, setDoctorsArr] = useState<any[]>([]);





    async function registerAppWithFCM() {
        await messaging().registerDeviceForRemoteMessages();
    }
    useEffect(() => {
        messaging()
            .getToken()
            .then(token => {
                return saveTokenToDatabase(token);
            });
        registerAppWithFCM();
    }, []);


    const chartConfig = {
        backgroundGradientFrom: "#F1F8FF",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#F1F8FF",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(142, 142, 142, 1)`,
        // color:'gray',
        strokeWidth: 2, // optional, default 3
        barPercentage: 1,
        useShadowColorFromDataset: false // optional
    };
    const [docData, setDocData] = useState([
        {
            img: require('../../assets/images/icn7.png'),
            title: 'Total Consultation',
            data: '0',
            url: "Appointment",
            roleArr: [Roles.DOCTOR, Roles.FRANCHISE],
        },
        {
            img: require('../../assets/images/icn8.png'),
            title: 'Today Consultation',
            data: '0',
            url: "Appointment",
            roleArr: [Roles.DOCTOR, Roles.FRANCHISE],
        },
        {
            img: require('../../assets/images/icn9.png'),
            title: 'Pending Consultation',
            data: '0',
            url: "Appointment",
            roleArr: [Roles.DOCTOR, Roles.FRANCHISE],
        },
        {
            img: require('../../assets/images/icn10.png'),
            title: 'Total Earning',
            data: '0',
            url: "Appointment",
            roleArr: [Roles.DOCTOR],
        },
        {
            img: require('../../assets/images/icn10.png'),
            title: 'Wallet Amount',
            data: '0',
            url: "Transaction",
            roleArr: [Roles.FRANCHISE],
        },
    ]);

    const focused = useIsFocused();

    const handleGetServices = async () => {
        try {
            let { data: res }: any = await getServicesPaginated("page=1&size=120")
            if (res) {
                setServicesArr(res?.data.filter((el: any) => el.name != "Doctor Video Consultation"));
                let tempObj = res.data.find((el: any) => el.name == "Doctor at Home")
                if (tempObj) {
                    setDoctorHomeVisit(tempObj)
                }
            }
        }
        catch (err) {
            toastError(err)
        }

    }


    const handleGetDashboard = async () => {
        try {
            let { data: res }: any = await getDashboard()
            if (res) {
                setDashboardData(res?.data);
                console.log(JSON.stringify(res, null, 2), "dashbpard")
                let tempDocData: any = docData
                // console.log("before total appointment")
                if (res?.data?.totalAppointmentMonthly) {
                    // console.log("inside total appointment")
                    setAppointmentData([...res?.data?.totalAppointmentMonthly.map((el: any) => el.y)])
                }
                if (res?.data?.totalMonthlyIncome) {
                    setMonthlyIncomeData([...res?.data?.totalMonthlyIncome.map((el: any) => el.y)])
                }

                let totalConsultation = tempDocData.findIndex((el: any) => el?.title == "Total Consultation")
                let todayConsultation = tempDocData.findIndex((el: any) => el?.title == "Today Consultation")
                let pendingConsultation = tempDocData.findIndex((el: any) => el?.title == "Pending Consultation")
                let totalEarning = tempDocData.findIndex((el: any) => el.title == "Total Earning")
                console.log(totalConsultation, "totalConsultation")
                tempDocData[totalConsultation].data = res?.data?.totalApointment ? res?.data?.totalApointment : 0
                tempDocData[todayConsultation].data = res?.data?.todayAppointment ? res?.data?.todayAppointment : 0
                tempDocData[pendingConsultation].data = res?.data?.pendingAppointment ? res?.data?.pendingAppointment : 0
                tempDocData[totalEarning].data = res?.data?.totalEarnings ? res?.data?.totalEarnings : 0
                setDocData([...tempDocData])

            }

        }
        catch (err) {
            // toastError(err)
        }

    }
    const handleGetWallet = async () => {
        try {
            let { data: res }: any = await getWallet()
            if (res) {
                setWallet(res?.balance);
                let tempDocData = docData
                let walletAmount = tempDocData.findIndex(el => el.title == "Wallet Amount")
                tempDocData[walletAmount].data = res?.balance
                setDocData([...tempDocData]);
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

            if (userData.role == Roles.PATIENT) {
                handleGetServices()
            }
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
            handleGetDashboard()
            handleGetWallet()
            HandleGetStatesAndCities()
        }
        return () => setDoctorsArr([])
    }, [focused])


    const renderDoctor = ({ item, index }: any) => {
        return (
            <View style={{ width: wp(90), padding: 7, backgroundColor: 'white', marginBottom: hp(2), elevation: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%" }}>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: generateFilePath(item.image) }}
                            style={{ height: wp(18), width: wp(18) }} />
                        <View style={{ marginLeft: wp(2), minHeight: wp(18), justifyContent: 'center' }}>
                            <View style={{ display: "flex", flexDirection: "row", maxWidth: wp(25) }}>
                                <Text style={{ color: 'black', fontSize: hp(1.8), maxWidth: wp(35), fontFamily: mainFont }}>{item?.name}</Text>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
                                    <Text style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: item?.userStatus == "online" ? 'green' : "red" }}></Text>
                                    <Text style={{ marginLeft: 5 }}>{item?.userStatus == "online" ? "Available" : "Not available"}</Text>
                                </View>
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
                            // onPress={() => setBookmodal(true)} BookClient
                            onPress={() => navigation.navigate('BookClient', { doctor: item })}
                            style={{ flex: 1, marginLeft: 5, height: hp(5), backgroundColor: '#50B148', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontFamily: mainFont, fontSize: 13 }}>Book Client Visit</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
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

    const HandleGetDoctorsPaginated = async (pageValue: number) => {
        try {

            let queryString = `page=${pageValue}&limit=${1500}`

            if (query && query != "") {
                queryString = `${queryString}&query=${query}`
            }

            if (city && city != "") {
                queryString = `${queryString}&city=${city}`
            }

            console.log(isAuthorized, "asdasd")

            let { data: res } = await getDoctors(queryString);
            if (res.data && res.data.length > 0) {
                setDoctorsArr(res?.data)
                setSpecialisationArr(res?.spacility.map((el: any) => ({ label: el, value: el })))
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
            let { data: res } = await getDoctors(queryString);
            if (res.data) {
                setDoctorsArr([...res?.data])
            }
            else {
                setLastPageReached(true)
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    useEffect(() => {
        if (focused && isAuthorized) {
            HandleGetDoctorsPaginated(1)
        }

        return () => { handleClearAllfilterOnLeave() }
    }, [focused, isAuthorized, userObj?._id])


    const handleClearAllfilterOnLeave = () => {
        setPage(1);
        setCity('');
        setQuery("");
        setPrice("");
        setGender("");
        setSpecialisation("");
        setDoctorsArr([]);
    }
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

    return (
        <View style={{ height: height, width: width, backgroundColor: '#F1F8FF' }}>
            <Headerr user={true} height={true} />
            {user == 'PATIENT' ? <FlatList
                data={[]}
                renderItem={null}
                removeClippedSubviews
                // style={{paddingBottom:hp(10)}}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                ListHeaderComponent={<>
                    <View style={{ width: width, backgroundColor: '#F1F8FF', paddingBottom: hp(5), }}>
                        <TouchableOpacity onPress={() => { Linking.openURL("fever99://app/PAC") }} style={{ width: wp(95), alignSelf: 'center', marginTop: hp(1) }}>
                            <Image source={require('../../assets/images/homebnnr.jpg')}
                                style={{ width: wp(95), height: hp(18), resizeMode: 'contain' }} />
                        </TouchableOpacity>

                        <View style={{ width: wp(95), height: hp(17), backgroundColor: 'white', alignSelf: 'center', position: "relative", marginTop: hp(2), elevation: 3, borderRadius: wp(2), paddingTop: hp(1.5), paddingLeft: wp(2) }}>
                            <View style={{ width: wp(92), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingRight: wp(3) }}>
                                <Image source={require('../../assets/images/img1.png')}
                                    style={{ height: hp(5), width: wp(12), resizeMode: 'contain' }} />
                                <Text onPress={() => navigation.navigate("BookAppt")} style={{ fontSize: hp(1.8), color: maincolor, fontFamily: mainFontBold }}>Book an Appointment</Text>
                            </View>

                            <TouchableOpacity onPress={() => setDoctorSearchModal(true)} style={{ width: wp(85), height: hp(6), backgroundColor: '#EEF7FF', alignSelf: 'center', marginTop: hp(2), borderRadius: wp(1.5), flexDirection: 'row', paddingRight: wp(2), paddingLeft: wp(2), justifyContent: 'space-between' }}>
                                <TextInput editable={false} placeholder='Search Doctor' style={{ color: 'gray' }}
                                    placeholderTextColor="gray" />
                                <Image source={require('../../assets/images/srch.png')}
                                    style={{ height: wp(11), width: wp(11) }} />
                            </TouchableOpacity>

                        </View>

                        {/* Book Home Healthcare Service >>>>>>>>>>>>>>>>>>>> */}
                        <View style={{ width: wp(95), alignSelf: 'center', paddingTop: hp(2), marginTop: hp(1), zIndex: -1 }}>
                            <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: maincolor }}>Book Doctor Appointment</Text>
                            <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => navigation.navigate("BookAppt")} style={{ width: wp(45.5), backgroundColor: 'white', elevation: 3, height: hp(13), borderRadius: wp(2), justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../assets/images/icn1.png')}
                                        style={{ height: wp(11), width: wp(11) }} />
                                    <Text style={{ fontSize: hp(1.65), color: 'black', fontFamily: mainFont, marginTop: hp(1.5) }}>Book New Appointment</Text>
                                </TouchableOpacity>
                                {
                                    doctorHomeVisit && doctorHomeVisit._id &&
                                    <TouchableOpacity onPress={() => navigation.navigate("CategoryStack", { screen: 'CategoryDetail', params: { data: doctorHomeVisit._id } })} style={{ width: wp(45.5), backgroundColor: 'white', elevation: 3, height: hp(13), borderRadius: wp(2), justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ borderWidth: 1, borderRadius: 150, borderColor: maincolor, padding: 5 }}>
                                            <Entypo name="home" color={maincolor} size={30} />
                                        </View>
                                        <Text style={{ fontSize: hp(1.65), color: 'black', fontFamily: mainFont, marginTop: hp(1.5) }}>Doctor Home Visit</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>

                        {/* Last View >>>>>>>>>>> */}
                        <View style={{ width: wp(95), alignSelf: 'center', paddingTop: hp(2), marginTop: hp(1) }}>
                            <Text style={{ fontSize: hp(2), fontFamily: mainFont, color: maincolor }}>Book Home Healthcare Service </Text>
                            <View style={{ width: wp(95), marginTop: hp(2), }}>
                                <FlatList
                                    data={servicesArr}
                                    // horizontal
                                    numColumns={2}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    // contentContainerStyle={{ justifyContent: "space-between" }}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }: any) => {
                                        return (
                                            <Pressable onPress={() => navigation.navigate("CategoryStack", { screen: 'CategoryDetail', params: { data: item._id } })} style={{
                                                width: wp(46),
                                                minHeight: hp(18),
                                                backgroundColor: 'white',
                                                elevation: 2,
                                                marginTop: hp(1),
                                                borderRadius: 5,
                                                marginBottom: hp(1),
                                                alignItems: 'center',
                                                paddingVertical: 25
                                            }}>
                                                <FastImage source={{ uri: generateFilePath(item.image), priority: FastImage.priority.normal }}
                                                    style={{ height: hp(15), width: wp(30), }} resizeMode={FastImage.resizeMode.cover} />
                                                <Text style={{ fontSize: hp(1.8), width: wp(35), alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: mainFont, marginTop: hp(0.5) }}>{item.name}</Text>
                                            </Pressable>
                                        )
                                    }}
                                />

                            </View>
                        </View>
                    </View>
                </>}
            />
                :
                <FlatList
                    data={[]}
                    renderItem={null}
                    removeClippedSubviews
                    contentContainerStyle={{ paddingBottom: hp(10) }}
                    ListHeaderComponent={<>
                        <View style={{ width: wp(95), alignSelf: 'center' }}>
                            <View style={{ width: wp(95), paddingTop: hp(2), paddingBottom: hp(2) }}>
                                <FlatList
                                    data={[...docData.filter((el: any) => el.roleArr.some((ele: string) => ele == userObj?.role))]}
                                    numColumns={2}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable onPress={() => navigation.navigate(item.url)} style={{ width: wp(46), height: hp(15), backgroundColor: 'white', marginRight: wp(3), marginBottom: hp(2), elevation: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={item.img}
                                                    style={{ height: wp(9), width: wp(9) }} />
                                                <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>{item?.title}</Text>
                                                <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>{item?.data}</Text>
                                            </Pressable>
                                        )
                                    }}
                                />
                            </View>
                            <View style={{ width: wp(95) }}>
                                <Text style={{ color: 'black', fontFamily: mainFont, alignSelf: 'center', marginBottom: hp(2), fontSize: hp(1.8) }}>Number of Appointment</Text>
                                {
                                    appointmentData && appointmentData.length > 0 &&
                                    <LineChart
                                        data={{
                                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                            datasets: [
                                                {
                                                    data: [...appointmentData],
                                                },
                                            ],
                                        }}
                                        width={wp(95)}
                                        height={220}
                                        chartConfig={chartConfig}
                                    />
                                }
                            </View>

                            <View style={{ width: wp(95) }}>
                                <Text style={{ color: 'black', fontFamily: mainFont, alignSelf: 'center', marginBottom: hp(2), fontSize: hp(1.8), marginTop: hp(2) }}>Total Income</Text>
                                {
                                    monthlyIncomeData && monthlyIncomeData.length > 0 &&
                                    <LineChart
                                        data={{
                                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                            datasets: [
                                                {
                                                    data: [...monthlyIncomeData],
                                                },
                                            ],
                                        }}
                                        width={wp(95)}
                                        height={220}
                                        chartConfig={chartConfig}
                                    />
                                }
                            </View>
                        </View>
                    </>}
                />}
            <Modal
                isVisible={doctorSearchModal}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackButtonPress={() => setDoctorSearchModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
            >
                <View style={{ width: wp(100), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                    <TouchableOpacity
                        onPress={() => setDoctorSearchModal(false)}
                        style={{ alignSelf: 'flex-end' }}>
                        <Image source={require('../../assets/images/close.png')}
                            style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                    </TouchableOpacity>

                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ alignSelf: 'center', flexDirection: 'row', paddingBottom: hp(1), marginVertical: 15 }}>
                        <TouchableOpacity onPress={() => { setSlctdsec('all'); setPosition((prev: any) => prev + 1); handleClearAllfilter() }}
                            style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'all' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'all' ? 0 : 0.8 }}>
                            <Text style={{ color: slctdsec == 'all' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSlctdsec('Doc_name')}
                            style={{ height: hp(5), marginRight: 10, paddingLeft: wp(3), paddingRight: wp(3), backgroundColor: slctdsec == 'Doc_name' ? maincolor : '#F1F8FF', justifyContent: 'center', borderRadius: 5, borderColor: maincolor, borderWidth: slctdsec == 'Doc_name' ? 0 : 0.8 }}>
                            <Text style={{ color: slctdsec == 'Doc_name' ? 'white' : maincolor, fontFamily: mainFont, fontSize: hp(1.8) }}> Doctor Name</Text>
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
                        slctdsec == "spc" &&
                        <View style={{ display: "flex", flexDirection: "row", borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "space-between", paddingHorizontal: 5, alignItems: "center" }}>
                            <Dropdown
                                style={[styles.dropdown, { width: wp(69) }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={specialisationArr}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder='Select One'
                                // searchPlaceholder="Search..."
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
                    <FlatList
                        contentContainerStyle={{ backgroundColor: "white", marginTop: 30 }}
                        style={{ maxHeight: hp(40) }}
                        data={doctorsArr}
                        keyExtractor={(itemX, indexX) => `${indexX}`}
                        renderItem={renderDoctor}
                        ListEmptyComponent={<Text>No data at the moment</Text>}
                    />

                </View>
            </Modal>

        </View>
    )
}



const styles = StyleSheet.create({
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
export default Home