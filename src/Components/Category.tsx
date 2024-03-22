import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getServicesPaginated } from '../Services/services.service';
import { toastError } from '../utils/toast.utils';
import { generateFilePath } from '../Services/url.service';
import { useNetInfo } from '@react-native-community/netinfo';  // <--- internet connection
import InterNetError from '../noInterNet/InterNetError';
import Loding_service from '../All_Loding_page/Loding_service';
const { height, width } = Dimensions.get('window')

const Category = () => {
    // checking internet connection
    const netInfo = useNetInfo();
    const isConnected = netInfo.isConnected;

    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [servicesArr, setServicesArr] = useState([]);
    const [lodings, setLoding] = useState(true);

    const focused = useIsFocused();
    const handleGetServices = async () => {
        setLoding(true);
        try {
            let { data: res }: any = await getServicesPaginated("page=1&size=1200")
            if (res) {
                setServicesArr(res.data);
            }
        }
        catch (err) {
            toastError(err)
        }
        finally {
            setLoding(false)
        }
    }
    useEffect(() => {
        if (focused) {
            handleGetServices()
        }
    }, [focused])

    // handling internet connections
    if (isConnected == false) {
        return (
            <InterNetError labels={"Category"} />
        )
    } else {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <Headerr secndheader={true} label='Category' btnlbl='Book Service' />

                {lodings ?
                    <ScrollView>
                        <Loding_service />
                    </ScrollView>
                    :
                    <View style={{ width: width }}>
                        <FlatList
                            data={servicesArr}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: hp(17), marginTop: 7 }}
                            renderItem={({ item, index }: any) => {
                                return (
                                    <View style={{ width: wp(100), minHeight: hp(25), backgroundColor: 'white', marginBottom: hp(2), paddingHorizontal: 8, paddingVertical: 13, elevation: 2, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ height: wp(18), width: wp(18), backgroundColor: 'white', elevation: 2, borderRadius: wp(10) }}>
                                            <Image source={{ uri: generateFilePath(item?.image) }}
                                                style={{ height: wp(17), width: wp(18), borderRadius: wp(10), resizeMode: 'contain' }} />
                                        </View>
                                        <Text style={{ color: 'black', fontSize: hp(1.9), fontFamily: mainFont, marginTop: hp(1), textAlign: "justify", }}>{item?.name}</Text>
                                        <Text style={{ color: 'gray', fontSize: hp(1.7), fontFamily: mainFont, marginTop: hp(1), textAlign: "justify", }}>{item?.description}</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('CategoryDetail', { data: item._id })}
                                            style={{ width: wp(27), height: hp(4.5), backgroundColor: maincolor, marginTop: hp(1), borderRadius: 5, elevation: 2, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: hp(1.7), fontFamily: mainFont }}>View Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    </View>
                }

            </View>
        )
    }
}

export default Category;