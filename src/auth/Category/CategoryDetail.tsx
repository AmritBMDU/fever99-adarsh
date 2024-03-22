import { View, Text, Dimensions, Image, ScrollView, FlatList, Platform, Linking, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Headerr from '../ReuseableComp/Headerr';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toastError } from '../utils/toast.utils';
import { getServiceByid } from '../Services/services.service';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { generateFilePath } from '../Services/url.service';
import FastImage from 'react-native-fast-image';

const { height, width } = Dimensions.get('window')

const CategoryDetail = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const navigation = useNavigation();
    const focused = useIsFocused();
    const [serviceObj, setServiceObj] = useState<any>({});
    const handleGetServiceById = async () => {
        try {
            let { data: res } = await getServiceByid(props.route.params.data);
            if (res) {
                setServiceObj(res.data)
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetServiceById()
        }
    }, [focused])


    const callNumber = (phone: any) => {
        return Linking.openURL(`tel:${phone}`);
    };
    return (
        <View style={{ width: width, height: height, backgroundColor: '#F1F8FF', }}>
            <Headerr secndheader={true} label='Category' btn={true} serviceId={props.route.params.data} btnlbl='Book Service' />
            <ScrollView contentContainerStyle={{ width: wp(95), alignSelf: 'center', marginTop: hp(2), paddingBottom: hp(20), marginBottom: 50 }}>
                <FastImage source={{ uri: generateFilePath(serviceObj.image), priority: FastImage.priority.normal }}
                    resizeMode='contain' style={{ height: hp(30), width: wp(95), borderColor: 'gray', borderWidth: 0.6 }} />
                <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: 'black', fontSize: hp(2.1), fontFamily: mainFont }}>{serviceObj?.name}</Text>
                        <Text style={{ color: 'gray', fontSize: hp(1.8), fontFamily: mainFont, marginTop: hp(1) }}>{serviceObj?.description}</Text>
                    </View>
                    <Text style={{ color: 'black', fontSize: hp(1.95), fontFamily: mainFont }}>Charge: Rs. {serviceObj?.price}/-</Text>
                </View>

                <View style={{ width: wp(95), marginTop: hp(2), justifyContent: 'space-between' }}>
                    <Pressable onPress={() => callNumber("6262808062")}><Text style={{ color: 'black', fontSize: hp(1.95), fontFamily: mainFont }}>Call for booking:   <Text style={{ color: maincolor }}>6262 8080 62</Text></Text></Pressable>
                    <Text style={{ color: 'black', fontSize: hp(1.95), fontFamily: mainFont, marginTop: hp(1) }}>Email:   <Text style={{ color: maincolor }}>Support@ fever99.com</Text></Text>
                    {/* <Text style={{ color: 'black', fontSize: hp(1.95), fontFamily: mainFont, marginTop: hp(1) }}>Address:   <Text style={{ color: maincolor }}>New Delhi</Text></Text> */}
                </View>

                <View style={{ width: wp(95), marginTop: hp(2), justifyContent: 'space-between' }}>
                    <Text style={{ color: 'black', fontSize: hp(2.1), fontFamily: 'Montserrat-Medium' }}>About Us</Text>
                    <View>

                        <AutoHeightWebView
                            style={{ width: wp(90), marginTop: 35 }}
                            source={{
                                html: serviceObj?.about
                            }}
                            viewportContent={'width=device-width, user-scalable=no'}
                            onSizeUpdated={size => console.log(size.height)}
                            scalesPageToFit={false}
                        />
                    </View>
                    {/*                     
                    <Text style={{ color: 'gray', fontSize: hp(1.8), fontFamily: mainFont, marginTop: hp(1) }}>Physiotherapy, also known as physical therapy,is a
                        healthcare profession that focuses on helping
                        individuals regain and maintain physical
                        functionmobility, focuses on helping
                        individuals regain and maintain physical
                        functionmobility Read More...</Text> */}
                </View>
                {/* {
                    serviceObj?.keyFeture && serviceObj?.keyFeture.length > 0 &&
                    <View style={{ width: wp(92), marginTop: hp(2), minHeight: hp(13), elevation: 2, backgroundColor: 'white', paddingLeft: wp(5), paddingBottom: 10, marginBottom: hp(8), alignSelf: 'center', paddingTop: hp(1) }}>
                        <Text style={{ color: 'black', fontSize: hp(2.1), fontFamily: 'Montserrat-Medium', }}>Key Feature</Text>

                        <FlatList
                            data={serviceObj?.keyFeture}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        <Text style={{ color: 'black', fontSize: hp(1.9), fontFamily: 'Montserrat-Medium', marginTop: hp(1) }}>{item.key}</Text>
                                        <Text style={{ color: 'gray', fontSize: hp(1.7), fontFamily: 'Montserrat-Medium', marginTop: hp(1) }}>{item.featers}</Text>
                                    </>
                                )
                            }}
                        />
                    </View>
                } */}

            </ScrollView>
        </View>
    )
}

export default CategoryDetail