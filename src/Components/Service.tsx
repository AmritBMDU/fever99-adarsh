import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import { getServiceBookings } from '../Services/serviceOrder.service';
import { generateFilePath } from '../Services/url.service';
import { toastError } from '../utils/toast.utils';

const { height, width } = Dimensions.get('window')

const Service = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'

    const [actvbtn, setActvbtn] = useState('used')

    const serviceData = [
        {
            name: 'Ritesh',
            email: 'ritesh@test.com',
            service: 'Xyz Service',
            Gender: 'Male',
            Pstatus: 'Pending'
        },
        {
            name: 'Mohit',
            email: 'mohit@test.com',
            service: 'Xyz Service',
            Gender: 'Male',
            Pstatus: 'complete'
        },
        {
            name: 'Ritesh',
            email: 'ritesh@test.com',
            service: 'Xyz Service',
            Gender: 'Male',
            Pstatus: 'Pending'
        },
        {
            name: 'Mohit',
            email: 'mohit@test.com',
            service: 'Xyz Service',
            Gender: 'Male',
            Pstatus: 'complete'
        },
        {
            name: 'Mohit',
            email: 'mohit@test.com',
            service: 'Xyz Service',
            Gender: 'Male',
            Pstatus: 'complete'
        },

    ]
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
            handleGetServiceBookings()
        }
    }, [focused])


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
            {actvbtn == 'used' &&
                <FlatList
                    data={serviceRequests.filter((el: any) => `${el.status}`.toLowerCase() === "completed")}
                    contentContainerStyle={{ paddingBottom: hp(10) }}
                    renderItem={({ item, index }: any) => {
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
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={require('../../assets/images/icn5.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Patient Name: </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                            <Image source={require('../../assets/images/icn3.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Service Booked: </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Image source={require('../../assets/images/icn6.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Age:</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Image source={require('../../assets/images/Date.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Payment Status: </Text>
                                        </View>


                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Image source={require('../../assets/images/Call.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Price: </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Image source={require('../../assets/images/Age.png')}
                                                style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Request Date: </Text>
                                        </View>
                                    </View>


                                    <View style={{ width: wp(50), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.customerName}</Text></Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.serviceName}</Text></Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}> {item?.age}</Text></Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: item.paymentStatus == 'Pending' ? '#DB9E00' : '#50B148' }}>{item?.paymentStatus}</Text></Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.amount}</Text></Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}> <Text style={{ color: 'gray' }}>{moment(item?.requestDate).format("YYYY-MM-DD")} | {item.requestTime}</Text></Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        )
                    }}
                    ListEmptyComponent={
                        <View style={{ height: "100%", }}>
                            <Text style={{ color: "black", justifyContent: "center", alignContent: "center", marginTop: hp(40), margin: 30, fontSize: 18, textAlign: "center" }}>No data found</Text>
                        </View>
                    }
                />
            }
            {actvbtn == 'request' && <FlatList
                data={serviceRequests.filter((el: any) => `${el.status}`.toLowerCase() !== "completed")}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                renderItem={({ item, index }: any) => {
                    return (
                        <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                            <View style={{ width: wp(95), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                </View>

                                <View style={{ paddingHorizontal: 10, backgroundColor: '#E9AC111F', height: hp(4), borderRadius: 5, marginTop: hp(3), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: hp(1.7), color: '#DB9E00', fontFamily: mainFont, textTransform: "uppercase" }}>{item?.status}</Text>
                                </View>
                            </View>
                            <View style={{ width: width, flexDirection: 'row' }}>
                                <View style={{ width: wp(43), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../../assets/images/icn5.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Patient Name: </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                        <Image source={require('../../assets/images/icn3.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Service Booked: </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/icn6.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Age:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/Date.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Payment Status: </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/Call.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Price: </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Image source={require('../../assets/images/Age.png')}
                                            style={{ height: wp(5), width: wp(5), resizeMode: 'contain' }} />
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>Request Date: </Text>
                                    </View>
                                </View>


                                <View style={{ width: wp(50), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.customerName}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), height: 40 }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.serviceName}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}> {item?.age}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: item.paymentStatus == 'Pending' ? '#DB9E00' : '#50B148' }}>{item?.paymentStatus}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}><Text style={{ color: 'gray' }}>{item?.amount}</Text></Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                        <Text style={{ marginLeft: wp(2), flex: 1, fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}> <Text style={{ color: 'gray' }}>{moment(item?.requestDate).format("YYYY-MM-DD")} | {item.requestTime}</Text></Text>
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
    )
}

export default Service