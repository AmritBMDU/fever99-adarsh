import { View, Text, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { toastError } from '../utils/toast.utils';
import { getReferalUsed } from '../Services/userReferal.service';
import { getUser } from '../Services/user.service';
import Headerr from '../ReuseableComp/Headerr';

import Profiles_setting_icons from "react-native-vector-icons/AntDesign"
import Male_Felale_icons from "react-native-vector-icons/FontAwesome"
import Emails_icosn from "react-native-vector-icons/Fontisto";
import Docto_icosn from "react-native-vector-icons/FontAwesome6";
import Loding_service from '../All_Loding_page/Loding_service';


const { height, width } = Dimensions.get('window')
export default function Referal() {
    const navigation: any = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const [userObj, setUserObj] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [referalArr, setReferalArr] = useState<any[]>([
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        },
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        },
        {
            name: "asd",
            email: "a@a.com",
            gender: "Female",
            service: "physiotherapy"
        }
    ]);
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }

    const focused = useIsFocused();
    const handleGetReferal = async () => {
        try {
            let { data: res } = await getReferalUsed()
            if (res.data) {
                // setReferalArr(res.data)
            }
        } catch (err) {
            toastError(err)
        }
    }



    useEffect(() => {
        if (focused) {
            handleGetReferal();
            handleGetAndSetUser();
        }
    }, [focused])

    return (
        <View>
            <Headerr secndheader={true} referalCode={userObj?.refrelCode} label='Referal' btn={false} />

            <FlatList
                data={referalArr}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: hp(10) }}
                ListEmptyComponent={
                    <>
                        {
                            loading ?
                                <View>
                                    <Loding_service />
                                </View>
                                : <View style={{ display: "flex", height: height, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>No appointments found </Text>
                                    <Text style={{ color: "#fff", fontSize: wp(3.5), marginTop: hp(2), backgroundColor: '#1263AC', borderRadius: 5, padding: wp(1.5) }} onPress={() => navigation.navigate("BookAppt")}>Book Appointments</Text>
                                </View>
                        }
                    </>
                }
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: width, paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 3, marginBottom: hp(2), }}>
                            <View style={{ width: width, flexDirection: 'row' }}>
                                <View style={{ width: wp(40), paddingLeft: wp(3), paddingTop: hp(2) }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.flexSTYLES}>
                                            <Profiles_setting_icons name='bars' style={styles.iconsStyls} />
                                            <Text style={{ marginLeft: wp(2), color: 'black', fontFamily: mainFontBold }}>S.no:</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'gray' }}>{index + 1}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.flexSTYLES}>
                                            <Profiles_setting_icons name='user' style={styles.iconsStyls} />
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFontBold }}>Name:</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'gray' }}>{item.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.flexSTYLES}>
                                            <Emails_icosn name='email' style={styles.iconsStyls} />
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFontBold }}>Email:</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'gray' }}>{item?.email}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.flexSTYLES}>
                                            <Male_Felale_icons name={item?.gender === 'female' ? 'female' : 'male'} style={[styles.iconsStyls, { fontSize: hp(2.4), }]} />
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFontBold }}> Gender:</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'gray' }}>{item?.gender}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.flexSTYLES}>
                                            <Docto_icosn name='user-doctor' style={styles.iconsStyls} />
                                            <Text style={{ marginLeft: wp(2), fontSize: hp(1.8), color: 'black', fontFamily: mainFontBold }}>Speciality:</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'gray', textTransform: "capitalize" }}>{item.service}</Text>
                                        </View>
                                    </View>

                                </View>

                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    flexSTYLES: {
        flexDirection: "row",
        width: wp(45)
    },
    iconsStyls: {
        color: "#1263AC",
        fontSize: hp(2.2),
        marginRight: wp(3),
        marginVertical: 4,
    }
})