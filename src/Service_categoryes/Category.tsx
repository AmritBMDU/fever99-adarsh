import { View, Text, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getServicesPaginated } from '../Services/services.service';
import { toastError } from '../utils/toast.utils';
import { generateFilePath } from '../Services/url.service';

const { height, width } = Dimensions.get('window')

const Category = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const maincolor = '#1263AC'
    const navigation: any = useNavigation()
    const [servicesArr, setServicesArr] = useState([]);

    const CatData = [
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
        {
            title: 'Physiotherapy',
            desc: 'Physiotherapy'
        },
    ]

    const focused = useIsFocused();



    const handleGetServices = async () => {
        try {
            let { data: res }: any = await getServicesPaginated("page=1&size=1200")
            if (res) {
                setServicesArr(res.data);
            }

        }
        catch (err) {
            toastError(err)
        }

    }

    useEffect(() => {
        if (focused) {
            handleGetServices()
        }
    }, [focused])


    return (
        <View style={{ width: width, height: height, backgroundColor: '#F1F8FF' }}>
            <Headerr secndheader={true} label='Category' btnlbl='Book Service' />
            <View style={{ width: width }}>
                <FlatList
                    data={servicesArr}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp(15) }}
                    renderItem={({ item, index }: any) => {
                        return (
                            <View style={{ width: wp(93), minHeight: hp(25), backgroundColor: 'white', marginBottom: hp(2), padding: wp(1), paddingBottom: 20,  elevation: 2, alignSelf: 'center', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: wp(18), width: wp(18), backgroundColor: 'white', elevation: 2, borderRadius: wp(10) }}>
                                    <Image source={{ uri: generateFilePath(item?.image) }}
                                        style={{ height: wp(17), width: wp(18), borderRadius: wp(10), resizeMode: 'contain' }} />
                                </View>
                                <Text style={{ color: 'black', fontSize: hp(1.9), fontFamily: mainFont, marginTop: hp(1) }}>{item?.name}</Text>
                                <Text style={{ color: 'gray', fontSize: hp(1.7), fontFamily: mainFont, marginTop: hp(1) }}>{item?.description}</Text>
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
        </View>
    )
}

export default Category