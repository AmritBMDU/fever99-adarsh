import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Headerr from '../ReuseableComp/Headerr';
import {
  getUser,
  setUser,
  updateSlot,
} from '../Services/user.service';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Roles } from '../utils/constant';
import InterNetError from '../noInterNet/InterNetError';
import { useNetInfo } from '@react-native-community/netinfo';

export default function Settings() {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const navigation = useNavigation();
  const [isGenderFocused, setIsGenderFocused] = useState(false);
  const Dropdwndata = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];

  const [option, setOption] = useState<any[]>([]);

  const [timeSlot, setTimeSlot] = useState([]);
  const [timeSlotoffline, setTimeSlotoffline] = useState([]);

  const focused = useIsFocused();

  const [name, setName] = useState('');
  const [emailid, setEmailid] = useState('');
  const [gender, setGender] = useState('');

  const [profilePhoto, setProfilePhoto] = useState('');
  const [email, setemail] = useState();
  const [image, setImage] = useState<any>('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [mobile, setMobile] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [abhaid, setAbhaid] = useState('');
  const [userObj, setUserObj] = useState<any>('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const [refreshCount, setRefreshCount] = useState(0);
  const handleGetAndSetUser = async () => {
    let userData = await getUser();

    if (userData) {
      console.log(JSON.stringify(userData, null, 2), 'userData');
      setUserObj(userData);
      setGender(userData?.gender);
      setImage(userData?.image);
      setServiceCharge(userData?.serviceCharge);
      setAddress(userData?.address);
      setName(userData?.name);
      setPinCode(userData?.pinCode);
      setState(userData?.state);
      setMobile(userData?.mobile);
      setSpecialization(userData?.specialization);
      setAbhaid(userData?.abhaid);
      setemail(userData?.email);
      setProfilePhoto(userData?.image);
      setTimeSlot(userData?.timeSlot.map((el: any) => el.value));
      setTimeSlotoffline(userData?.timeSlotoffline.map((el: any) => el.value));
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetAndSetUser();
    }
  }, [focused]);

  const handleSubmit = async () => {
    try {
      let obj: any = {
        // name,
        // email,
        // gender,
      };
      if (userObj.role == Roles.DOCTOR) {
        obj.timeSlot = timeSlot.map(el => ({ label: el, value: el }));
        obj.timeSlotoffline = timeSlotoffline.map(el => ({
          label: el,
          value: el,
        }));
      }
      console.log(obj, "obj");

      let { data: res }: any = await updateSlot(obj);
      if (res) {
        await setUser(res.data);

        toastSuccess(res.message);

        setUserObj(res.data);
        setTimeSlot(res?.data?.timeSlot.map((el: any) => el.value));
        setTimeSlotoffline(
          res?.data?.timeSlotoffline.map((el: any) => el.value),
        );
        navigation.goBack();
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (focused) {
      function generateTimeArray() {
        const times = [];
        for (let hours = 0; hours < 24; hours++) {
          for (let minutes = 0; minutes < 59; minutes += 15) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const startTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

            // Calculate the next 15-minute interval
            const nextHours = (hours + Math.floor((minutes + 15) / 60)) % 24;
            const nextAmPm = nextHours >= 12 ? 'PM' : 'AM';
            const formattedNextHours = nextHours % 12 || 12;
            const nextMinutes = (minutes + 15) % 60;
            const formattedNextMinutes = nextMinutes < 10 ? `0${nextMinutes}` : nextMinutes;
            const endTime = `${formattedNextHours}:${formattedNextMinutes} ${nextAmPm}`;

            // Concatenate the start and end times with a space
            times.push({
              label: `${startTime} - ${endTime}`,
              value: `${startTime} - ${endTime}`,
            });
          }
        }
        return times;
      }

      const timeArray = generateTimeArray();
      setOption(timeArray);
    }
  }, [focused]);

  if (isConnected == false) {
    return (
      <InterNetError labels={"Setting"} />
    )
  } else {
    return (
      <>
        <Headerr secndheader={true} label="Setting" />
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 10, backgroundColor: '#fff' }}>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Image
              source={require('../../assets/images/imgchek.jpg')}
              style={{ width: wp(25), height: wp(25), borderRadius: 50, objectFit: 'contain', }}
            />
          </View>
          <Text style={{ fontFamily: mainFontmedium, fontSize: hp(2.6), color: '#1263AC', }}>
            Basic Informations
          </Text>

          <View
            style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
            <View style={{ width: wp(95) }}>
              <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Patient Name:</Text>
              <TextInput
                placeholderTextColor="#8E8E8E"
                placeholder="Patient Name"
                onChangeText={e => setName(e)}
                value={name}
                style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8 }}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between', }}>
            <View style={{ width: wp(95) }}>
              <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Email Id</Text>
              <TextInput
                placeholderTextColor="#8E8E8E"
                placeholder="Email Id"
                onChangeText={e => setEmailid(e)}
                value={emailid}
                style={{ height: hp(6), backgroundColor: '#F2F2F2E5', marginTop: hp(1), borderRadius: 8, }}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between', }}>
            <View style={{ width: wp(95) }}>
              <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}> Patient Gender:</Text>
              <Dropdown
                style={[styles.dropdown1, isGenderFocused && { borderColor: 'blue', borderWidth: 0.5 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={Dropdwndata}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={gender}
                onFocus={() => setIsGenderFocused(true)}
                onBlur={() => setIsGenderFocused(false)}
                onChange={item => {
                  setGender(item.value);
                  setIsGenderFocused(false);
                }}
              />
            </View>
          </View>
          {userObj?.role == Roles.DOCTOR && (
            <>
              <Text>Avaliable time slot For Appointment</Text>
              <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between', }}>
                <View style={{ width: wp(95) }}>
                  <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', }}>Select Time Slot (Online): </Text>
                  <MultiSelect
                    style={styles.dropdown1}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={option}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Time Slot (Online):"
                    searchPlaceholder="Search..."
                    value={timeSlot}
                    onChange={(item: any) => {
                      setTimeSlot(item);
                      console.log(item, 'item');
                    }}
                    renderLeftIcon={() => (<AntDesign style={styles.icon} color="black" name="Safety" size={20} />)}
                    selectedStyle={styles.selectedStyle}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <View style={{ width: wp(95) }}>
                  <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black', }}> Select Time Slot (Offline):</Text>
                  <MultiSelect
                    style={styles.dropdown1}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={option}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Time Slot (Offline)"
                    searchPlaceholder="Search..."
                    value={timeSlotoffline}
                    onChange={(item: any) => {
                      setTimeSlotoffline(item);
                      console.log(item, 'item');
                    }}
                    renderLeftIcon={() => (
                      <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                    )}
                    selectedStyle={styles.selectedStyle} />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={{ width: wp(94), marginTop: hp(5), height: hp(5), backgroundColor: '#50B148', borderRadius: 5, alignItems: 'center', justifyContent: 'center', }}>
                <Text style={{ color: 'white', fontFamily: mainFontmedium, }}> Proceed</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  dropdown1: {
    height: hp(6.7),
    borderColor: 'gray',
    borderWidth: 0.5,
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
    color: '#8E8E8E',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#8E8E8E',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },

  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
