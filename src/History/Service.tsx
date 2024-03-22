import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import { getServiceBookings } from '../Services/serviceOrder.service';
import { generateFilePath } from '../Services/url.service';
import { toastError } from '../utils/toast.utils';
import InterNetError from '../noInterNet/InterNetError';

import Profiles_setting_icons from "react-native-vector-icons/AntDesign"
import Money_icons from "react-native-vector-icons/FontAwesome";
import Mans_icons from "react-native-vector-icons/Entypo";
import Status_icons from "react-native-vector-icons/FontAwesome6";
import Calendar_icons from 'react-native-vector-icons/FontAwesome5';

const { height, width } = Dimensions.get('window');
import { useNetInfo } from '@react-native-community/netinfo';  // <--- internet connection


const Service = () => {
    // checking internet connection
    const netInfo = useNetInfo();
    const isConnected = netInfo.isConnected;

    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'

    const [actvbtn, setActvbtn] = useState('used')

    const [serviceRequests, setServiceRequests] = useState([]);
    const focused = useIsFocused();
    const handleGetServiceBookings = async () => {
        try {
            let { data: res } = await getServiceBookings()
            if (res.data) {
                setServiceRequests(res.data);
            }
        } catch (error) {
            toastError(error)
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetServiceBookings();
        }
    }, [focused])
    if (isConnected == false) {
        return (
            <InterNetError labels={"Recent Service Used"} />
        )
    } else {
        return (
            <View style={{ width: width, height: height, backgroundColor: '#F1F8FF' }}>
                <Headerr secndheader={true} label='Recent Service Used' />

                <View style={{ width: wp(95), alignSelf: 'center', paddingTop: hp(1.5), paddingBottom: hp(0.8), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => setActvbtn('used')}
                        style={{ height: hp(5.5), width: wp(44), backgroundColor: actvbtn == 'used' ? maincolor : 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'center', elevation: 2, borderColor: maincolor, borderWidth: actvbtn == 'used' ? 0 : 0.8 }}>
                        <Text style={{ color: actvbtn == 'used' ? 'white' : maincolor, fontSize: hp(1.8), fontFamily: mainFont }}>Service Used</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActvbtn('request')}
                        style={{ height: hp(5.5), width: wp(44), backgroundColor: actvbtn == 'request' ? maincolor : 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'center', elevation: 2, borderColor: maincolor, borderWidth: actvbtn == 'request' ? 0 : 0.8 }}>
                        <Text style={{ color: actvbtn == 'request' ? 'white' : maincolor, fontSize: hp(1.8), fontFamily: mainFont }}>Service Request</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {actvbtn == 'used' &&
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={serviceRequests.filter((el: any) => `${el.status}`.toLowerCase() === "completed")}
                            contentContainerStyle={{ paddingBottom: hp(10) }}
                            renderItem={({ item }: any) => {
                                return (
                                    <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                                        <View style={{ width: wp(95), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={{ uri: generateFilePath(item?.doctor?.image) }}
                                                    style={{ height: wp(15), width: wp(15) }} />
                                            </View>

                                            <View style={{ paddingHorizontal: 10, backgroundColor: '#E9AC111F', height: hp(4), borderRadius: 5, marginTop: hp(3), alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: hp(1.7), color: '#DB9E00', fontFamily: mainFont, textTransform: "uppercase" }}>{item?.status}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: width, flexDirection: 'row' }}>
                                            <View style={{ width: wp(43), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Profiles_setting_icons name='profile' style={styles.iconsStyls} />
                                                        <Text>Patient Name:</Text>
                                                    </View>
                                                    <Text style={styles.itmsData}>{item?.customerName}</Text>
                                                </View>

                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Profiles_setting_icons name='setting' style={styles.iconsStyls} />
                                                        <Text>Service Booked:</Text>
                                                    </View>
                                                    <Text style={styles.itmsData}>{item?.serviceName}</Text>
                                                </View>

                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Mans_icons name='man' style={styles.iconsStyls} />
                                                        <Text>Age:</Text>
                                                    </View>
                                                    <Text style={styles.itmsData}>{item?.age}</Text>
                                                </View>

                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Status_icons name="money-bill" style={styles.iconsStyls} />
                                                        <Text>Payment Status:</Text>
                                                    </View>
                                                    <Text style={{ color: item.paymentStatus == 'Pending' ? '#50B148' : '#DB9E00', textTransform: "capitalize" }}>{item?.paymentStatus}</Text>
                                                </View>

                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Money_icons name='money' style={styles.iconsStyls} />
                                                        <Text>Price:</Text>
                                                    </View>
                                                    <Text style={styles.itmsData}>{item?.amount}</Text>
                                                </View>

                                                <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                    <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                        <Calendar_icons name='calendar-day' style={styles.iconsStyls} />
                                                        <Text>Request Date:</Text>
                                                    </View>
                                                    <Text style={styles.itmsData}>{moment(item?.requestDate).format("YYYY-MM-DD")} | {item.requestTime}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                            ListEmptyComponent={
                                <View style={{ height: height - 100, justifyContent: "center", alignContent: "center" }}>
                                    <Text style={{ color: "black", fontSize: 18, textAlign: "center" }}>No data found</Text>
                                </View>
                            }
                        />
                    }

                    {actvbtn == 'request' && <FlatList
                        showsVerticalScrollIndicator={false}
                        data={serviceRequests.filter((el: any) => `${el.status}`.toLowerCase() !== "completed")}
                        contentContainerStyle={{ paddingBottom: hp(10) }}
                        renderItem={({ item, index }: any) => {
                            return (
                                <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                                    <View style={{ width: wp(95), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ paddingHorizontal: 10, backgroundColor: '#E9AC111F', height: hp(4), borderRadius: 5, marginTop: hp(3), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: hp(1.7), color: '#DB9E00', fontFamily: mainFont, textTransform: "uppercase" }}>{item?.status}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: width, flexDirection: 'row' }}>
                                        <View style={{ width: wp(43), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Profiles_setting_icons name='profile' style={styles.iconsStyls} />
                                                    <Text>Patient Name:</Text>
                                                </View>
                                                <Text style={styles.itmsData}>{item?.customerName}</Text>
                                            </View>

                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Profiles_setting_icons name='setting' style={styles.iconsStyls} />
                                                    <Text>Service Booked:</Text>
                                                </View>
                                                <Text style={styles.itmsData}>{item?.serviceName}</Text>
                                            </View>

                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Mans_icons name='man' style={styles.iconsStyls} />
                                                    <Text>Age:</Text>
                                                </View>
                                                <Text style={styles.itmsData}>{item?.age}</Text>
                                            </View>

                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Status_icons name="money-bill" style={styles.iconsStyls} />
                                                    <Text>Payment Status:</Text>
                                                </View>
                                                <Text style={{ color: item.paymentStatus == 'Pending' ? '#50B148' : '#DB9E00', textTransform: "capitalize" }}>{item?.paymentStatus}</Text>
                                            </View>

                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Money_icons name='money' style={styles.iconsStyls} />
                                                    <Text>Price:</Text>
                                                </View>
                                                <Text style={styles.itmsData}>{item?.amount}</Text>
                                            </View>

                                            <View style={[styles.common_displayFlex, { justifyContent: "space-between" }]}>
                                                <View style={[styles.common_displayFlex, { width: wp(45) }]}>
                                                    <Calendar_icons name='calendar-day' style={styles.iconsStyls} />
                                                    <Text>Request Date:</Text>
                                                </View>
                                                <Text style={styles.itmsData}>{moment(item?.requestDate).format("YYYY-MM-DD")} || {item.requestTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                        ListEmptyComponent={
                            <Text style={{ color: "black", margin: 30, fontSize: 18, textAlign: "center" }}>No data found</Text>
                        }
                    />}
                </View>
            </View>
        )
    }
}
export default Service;
const styles = StyleSheet.create({
    common_displayFlex: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    iconsStyls: {
        color: "#1263AC",
        fontSize: hp(2.2),
        marginRight: wp(3),
        marginVertical: 4,
    },
    itmsData: {
        color: 'gray',
        textTransform: "capitalize"
    }
})