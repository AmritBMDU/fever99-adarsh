import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, Share, TextInput } from 'react-native';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AuthContext } from '../../App';

import Headerr from '../ReuseableComp/Headerr';
import { generateFilePath } from '../Services/url.service';
import { deleteJwt, getUser, setUser, updateUserStatus } from '../Services/user.service';
import { Roles } from '../utils/constant';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { ScrollView } from 'react-native';
// all  icons import form ---> Edit_Phone_icons meen that there is two type  of  icons is there one is Edit and other is Phone icons
import Setting_Sharealt from "react-native-vector-icons/AntDesign";
import Edit_Phone_icons from "react-native-vector-icons/Feather";
import Phone_icons from "react-native-vector-icons/FontAwesome5"
import CashRefund_History_LogOut from "react-native-vector-icons/MaterialCommunityIcons";
import Right_Icons from "react-native-vector-icons/AntDesign";
import Contacts from "react-native-vector-icons/AntDesign";
import Mail_icons from "react-native-vector-icons/Entypo";
import Polocy_Icons from "react-native-vector-icons/MaterialIcons";
import Tandcondition_icons from "react-native-vector-icons/Ionicons";
import Money_Icons from "react-native-vector-icons/FontAwesome"


const { height, width } = Dimensions.get('window')

const Profile = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const mainFontmedium = 'Montserrat-Medium'
  const maincolor = '#1263AC'
  const navigation: any = useNavigation()
  const [bookmodal, setBookmodal] = useState(false)
  const [isAuthorized, setIsAuthorized] = useContext<any>(AuthContext)
  const focused = useIsFocused()
  const [userObj, setUserObj] = useState<any>({});
  const [count, setCount] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");


  const handleLogout = async () => {
    try {
      await deleteJwt();
      setIsAuthorized(false);
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
    }
  }, [focused, count])

  useEffect(() => {

  }, [focused, userObj])

  const handleChangeStatus = async () => {
    try {

      let tempStatus = userObj?.userStatus

      if (tempStatus == "online") {
        tempStatus = "offline"
      }
      else {
        tempStatus = "online"
      }

      let { data: res } = await updateUserStatus(userObj?._id, { userStatus: tempStatus, })
      if (res) {
        await setUser(res.data);
        setUserObj({ ...res.data });
      }
    }
    catch (err) {
      toastError(err)
    }
  }

  // share this app clicking
  const shareContent = async () => {
    const result = await Share.share({
      message: 'Download fever99 app ',
      url: 'https://play.google.com/store/apps/details?id=com.fever99',
      title: 'fever99',
    });
  };

  const HandleAddAmountToWallet = async () => {
    try {

      let tempAmount = parseInt(`${amount}`) || 0
      if (tempAmount && tempAmount < 1) {
        toastError("Amount should be more than 10 rupees !!!")
        return
      }
      setPaymentModal(false);
      navigation.navigate("PayementScreen", { amount: tempAmount })
    }
    catch (error) {
      toastError(error)
    }
  }


  return (
    <View style={{ width: width, height: height, backgroundColor: 'white' }}>
      <Headerr secndheader={true} label='Profile' />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, width: wp(95), alignSelf: 'center' }}>
        <View style={{ width: wp(95), marginTop: hp(3), flexDirection: 'row' }}>
          <View style={{ position: "relative" }}>
            <Image source={(userObj?.image && userObj?.image != "" && userObj?.image.includes("file")) ? { uri: generateFilePath(userObj?.image) } : require('../../assets/images/user_frame.png')}
              style={{ height: wp(20), width: wp(20) }} />
            {
              userObj.role == Roles.DOCTOR &&
              <View style={{ position: "absolute", top: 5, right: 5, backgroundColor: userObj?.userStatus == "online" ? "green" : "red", height: 10, width: 10, borderRadius: 10 }}></View>
            }
          </View>
          <View style={{ height: wp(20), marginLeft: wp(3) }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: hp(1.9), fontFamily: mainFontBold }}>{userObj?.name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditiProfile')}
                style={{ marginLeft: wp(30) }}>
                <Edit_Phone_icons name='edit-3' style={[styles.allIconsStyle, { fontSize: hp(2.5) }]} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Mail_icons name='mail' style={styles.profuleIcons} />

              <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Phone_icons name='phone-alt' style={styles.profuleIcons} />
              <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.mobile}</Text>
            </View>
            {
              userObj.role == Roles.DOCTOR &&
              <Pressable style={{ borderWidth: 1, borderColor: userObj?.userStatus == "online" ? "green" : "red", borderRadius: 10, width: 100, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 }} onPress={() => handleChangeStatus()}>
                <Text>Set {userObj?.userStatus == "online" ? "Offline" : "Online"}</Text>
              </Pressable>
            }

            {
              userObj?.address && userObj?.address != "" && userObj?.city && userObj?.city != "" && userObj?.state && userObj?.state != "" && userObj?.pincode && userObj?.pincode != "" &&
              <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
                <Image source={require('../../assets/images/Location2.png')}
                  style={{ height: wp(4), width: wp(4) }} />
                <Text style={{ color: '#4A4D64', fontSize: hp(1.5), fontFamily: mainFontmedium, marginLeft: wp(2), }}>{userObj?.address} , {userObj?.city} , {userObj?.state} - {userObj?.pincode}</Text>
              </View>
            }

          </View>
        </View>

        <View style={{ width: wp(95), marginTop: hp(7) }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Setting_Sharealt name='setting' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Setting</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate('Appointment')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <CashRefund_History_LogOut name='history' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Appointment History</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />

          </TouchableOpacity>

          {
            userObj.role == Roles.FRANCHISE &&
            <>
              <TouchableOpacity
                onPress={() => setPaymentModal(true)}
                style={styles.clickbleLines}>
                <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
                  <Money_Icons name='money' style={styles.allIconsStyle} />
                  <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Recharge Wallet</Text>
                </View>
                <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
              </TouchableOpacity>

              <Modal
                isVisible={paymentModal}
                animationIn={'bounceIn'}
                animationOut={'slideOutDown'}
                onBackButtonPress={() => setPaymentModal(false)}
                style={{ marginLeft: 0, marginRight: 0 }}
              >
                <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
                  <TouchableOpacity
                    onPress={() => setPaymentModal(false)}
                    style={{ alignSelf: 'flex-end' }}>
                    <Image source={require('../../assets/images/close.png')}
                      style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, color: 'black', fontFamily: mainFont, fontWeight: "bold" }}>Add Wallet Amount</Text>

                  <TextInput placeholder='Amount' keyboardType='number-pad' style={{ marginTop: 15, color: 'gray', backgroundColor: "#e6edf7" }} onChangeText={(e: any) => setAmount(e)} value={`${amount}`} placeholderTextColor="gray" />
                  <TouchableOpacity onPress={() => HandleAddAmountToWallet()} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Add now</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>

          }

          <TouchableOpacity
            onPress={() => navigation.navigate('EditiProfile')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Edit_Phone_icons name='edit' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Edit Profile</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ContactUs')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Contacts name='contacts' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}>Contact Us</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TAC')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Tandcondition_icons name='receipt-outline' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Terms & Conditions</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReturnandRefundPolicy')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <CashRefund_History_LogOut name='cash-refund' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Cancellation & Refund Policy</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() => navigation.navigate('PAC')}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Polocy_Icons name='policy' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Privacy Policy</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clickbleLines}
            onPress={() => shareContent()}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <Setting_Sharealt name='sharealt' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}>Share App</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBookmodal(true)}
            style={styles.clickbleLines}>
            <View style={{ flexDirection: 'row', height: wp(8), alignItems: 'center' }}>
              <CashRefund_History_LogOut name='logout' style={styles.allIconsStyle} />
              <Text style={{ fontSize: hp(1.8), color: '#4A4D64', fontFamily: mainFont, marginLeft: wp(2) }}> Logout</Text>
            </View>
            <Right_Icons name='right' style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        isVisible={bookmodal}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackButtonPress={() => setBookmodal(false)}
        style={{ marginLeft: 0, marginRight: 0 }} >
        <View style={{ width: wp(85), paddingTop: hp(3), paddingBottom: hp(3), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingLeft: wp(4), paddingRight: wp(4) }}>
          <TouchableOpacity
            onPress={() => setBookmodal(false)}
            style={{ alignSelf: 'flex-end' }}>
            <Image source={require('../../assets/images/close.png')}
              style={{ tintColor: 'black', height: wp(5), width: wp(5) }} />
          </TouchableOpacity>
          <View style={{ height: wp(14), width: wp(14), backgroundColor: '#D8D8D8E5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: wp(8) }}>
            <Image source={require('../../assets/images/logouticn.png')}
              style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }} />
          </View>
          <Text style={{ color: 'black', fontFamily: mainFontmedium, fontSize: hp(2), marginTop: hp(3), textAlign: 'center' }}>Are you sure
            you want to logout ?</Text>
          <View style={{ width: wp(75), alignSelf: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => setBookmodal(false)}
              style={{ height: hp(5), marginTop: hp(2), width: wp(35), borderColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8 }}>
              <Text style={{ color: maincolor, fontFamily: mainFont, fontSize: hp(2) }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLogout()}
              style={{ height: hp(5), marginTop: hp(2), width: wp(35), backgroundColor: maincolor, alignSelf: 'center', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Profile;
const styles = StyleSheet.create({
  allIconsStyle: {
    color: "#1263AC",
    fontSize: hp(3.4),

  },
  clickbleLines: {
    width: wp(95),
    flexDirection: 'row',
    backgroundColor: '#E8E6E6',
    height: hp(5.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: wp(3),
    paddingLeft: wp(3),
    borderRadius: wp(1),
    marginTop: hp(2)
  },
  profuleIcons: {
    fontSize: hp(1.75)
  }
})