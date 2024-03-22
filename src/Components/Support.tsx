import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, TextInput, Animated, StyleSheet } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { LoginContext } from '../../App';
import { toastError } from '../utils/toast.utils';
import { getsupport } from '../Services/support.service';
import debounce from 'lodash.debounce';
const { height, width } = Dimensions.get('window')

const Support = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontmedium = 'Montserrat-Medium'
    const maincolor = '#1263AC'
    const navigation = useNavigation()
    const [mainSupportArr, setMainSupportArr] = useState([]);
    const [user, setUser] = useContext(LoginContext)
    const [supportArr, setSupportArr] = useState([]);
    const focused = useIsFocused();


    const handleGetSupport = async () => {
        try {
            let { data: res } = await getsupport()
            if (res.data) {
                setSupportArr(res.data);
                setMainSupportArr(res.data);
            }
        } catch (err) {
            toastError(err);
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetSupport()
        }
    }, [focused])



    const [query, setQuery] = useState("");



    const handleSearch = (value:string)=> {
        if(value != ""){

            setSupportArr(mainSupportArr.filter((el:any) => `${el.title}`.toLowerCase().trim().includes(`${value}`.toLowerCase().trim())))
        }
        else{
            setSupportArr([...mainSupportArr])

        }
    }

    const debouncedSave = useCallback(

        debounce((nextValue:string) => handleSearch(nextValue), 400),
    
        [] // will be created only once initially
    
      )
    
      // highlight-ends
    
    
    
      const handleChange = (event:string) => {
    
        const nextValue = event
    
        setQuery(nextValue)
    
        // Even though handleChange is created on each render and executed
    
        // it references the same debouncedSave that was created initially
    
        debouncedSave(nextValue)
    
      }
    return (
        <View style={{ width: width, height: height, backgroundColor: '#F1F8FF' }}>
            <Headerr secndheader={true} label='Support' />
            <View style={{ width: wp(95), alignSelf: 'center' }}>
                <View style={{ width: wp(95), alignSelf: 'center', flexDirection: 'row', marginTop: hp(1.5), justifyContent: 'space-between' }}>
                    <View style={{ width: wp(95), height: hp(5.5), borderColor: '#E8E6E6', borderWidth: 0.8, borderRadius: 5, flexDirection: 'row', backgroundColor: 'white' }}>
                        <Image source={require('../../assets/images/srch.png')}
                            style={{ height: wp(10), width: wp(10), tintColor: '#8E8E8E' }} />
                        <TextInput onChangeText={(e)=> handleChange(e)} placeholder='Search Here.' placeholderTextColor="#8E8E8E" />
                    </View>
                </View>
                <View style={{ width: wp(95), marginTop: hp(2) }}>
                    {user == 'PATIENT' ? <FlatList
                        data={supportArr}
                        renderItem={({ item, index }:any) => {
                            return (
                                <View style={{ width: wp(95), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', marginBottom: hp(2), elevation: 2, borderRadius: 5, paddingLeft: wp(2.5), paddingRight: wp(2.5) }}>
                                    <View style={{ width: wp(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6) }}>Title    :  <Text style={{ color: '#8E8E8E' }}>{item?.title}</Text></Text>
                                        <View style={{ width: wp(18), height: hp(3), backgroundColor: '#E9AC111F', borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                                            <Text style={{ color: '#DB9E00', fontSize: hp(1.5), fontFamily: mainFont }}>{item?.status}</Text>
                                        </View>
                                    </View>

                                    <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>Resolution    :  <Text style={{ color: '#8E8E8E' }}>{item?.resolution}</Text></Text>
                                    <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>Description    :  <Text style={{ color: '#8E8E8E' }}>{item?.details}</Text></Text>
                                </View>
                            )
                        }}
                    /> :
                        <FlatList
                            data={supportArr}
                            renderItem={({ item, index }:any) => {
                                return (
                                    <View style={{ width: wp(95), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', marginBottom: hp(2), elevation: 2, borderRadius: 5, paddingLeft: wp(2.5), paddingRight: wp(2.5) }}>
                                    <View style={{ width: wp(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6) }}>Title    :  <Text style={{ color: '#8E8E8E' }}>{item?.title}</Text></Text>
                                        <View style={{ width: wp(18), height: hp(3), backgroundColor: '#E9AC111F', borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                                            <Text style={{ color: '#DB9E00', fontSize: hp(1.5), fontFamily: mainFont }}>{item?.status}</Text>
                                        </View>
                                    </View>

                                    <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>Resolution    :  <Text style={{ color: '#8E8E8E' }}>{item?.resolution}</Text></Text>
                                    <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.6), marginTop: hp(1) }}>Description    :  <Text style={{ color: '#8E8E8E' }}>{item?.details}</Text></Text>
                                </View>
                                )
                            }}
                        />}
                </View>
            </View>
        </View>
    )
}

export default Support