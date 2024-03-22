import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { AuthContext, LoginContext, UserDataContext } from '../../App';
import Appointment_History from '../Components/Appointment_History';
import BookClient from '../Components/BookClient';
import BookService from '../Components/BookService';
import BookVideo from '../Components/BookVideo';
import Book_Appointment from '../Components/Book_Appointment';
import Chat from '../Components/Chat';
import Contactus from '../Components/Contact';
import EditProfile from '../profile/EditProfile';
import GetOTP from '../Components/GetOTP';
import Settings from '../setting/Settings';
import Login from '../auth/login/Login';
import Meeting from '../Components/Meeting';
import OTP from '../Components/OTP';
import Password from '../auth/login/Password';
import Paymentsuccess from '../Components/Paymentsuccess';
import PrivacyPolicy from '../privacypolicy/PrivacyPolicy';
import Referal_User from '../Components/Referal_User';
import Register from '../auth/registration/Register';
import ReturnandRefundPolicy from '../profile/refund_t&c/ReturnandRefundPolicy';

import Support from '../Components/Support'
import TermAndC from '../t&c/TermAndC';
import Write_Prescription from '../Components/Write_Prescription';
import PayementScreen from '../ReuseableComp/PayementScreen';
import ClintPayment from '../ReuseableComp/ClintPayment';
import { getJwt, getUser } from '../Services/user.service';
import BottamTab from '../TabNavigators/BottamTab';
import { useLinkTo } from '@react-navigation/native';
import ForgotPassword from '../Components/ForgotPassword';


const Stack = createNativeStackNavigator();



export default function Root() {



  const linkTo = useLinkTo()
  const [user, setUser] = useContext(LoginContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [isAuthorized, setIsAuthorized] = useContext(AuthContext)


  const checkAuthorized = async () => {
    let token = await getJwt();
    if (token) {
      setIsAuthorized(true)
      let userDataLocal: any = await getUser();
      if (userDataLocal) {
        setUser(userDataLocal?.role);
        setUserData(userDataLocal)
      }
    }
    else {
      setIsAuthorized(false)
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      checkAuthorized()
    }, 10000)
    checkAuthorized()
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }
    }>
      {
        isAuthorized ?
          <>
            <Stack.Screen name='BottamTab' component={BottamTab} />
            <Stack.Screen name='BookService' component={BookService} />
            <Stack.Screen name='AppointHistory' component={Appointment_History} />
            <Stack.Screen name='Chat' component={Chat} />
            <Stack.Screen name='BookAppt' component={Book_Appointment} />
            <Stack.Screen name='BookVdo' component={BookVideo} />
            <Stack.Screen name='BookClient' component={BookClient} />
            <Stack.Screen name='EditiProfile' component={EditProfile} />
            <Stack.Screen name='Write_P' component={Write_Prescription} />
            <Stack.Screen name='Ref' component={Referal_User} />
            <Stack.Screen name='Support' component={Support} />
            <Stack.Screen name='PayementScreen' component={PayementScreen} />
            <Stack.Screen name='PayementSuccess' component={Paymentsuccess} />
            <Stack.Screen name='ClintPayment' component={ClintPayment} />
            <Stack.Screen name='PayementScreen3' component={PayementScreen} />
            <Stack.Screen name='Meeting' component={Meeting} />
            <Stack.Screen name='Settings' component={Settings} />
          </>
          :
          <>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Password' component={Password} />
            <Stack.Screen name='OTP' component={OTP} />
            <Stack.Screen name='GetOTP' component={GetOTP} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          </>
      }
      <Stack.Screen name='ContactUs' component={Contactus} />
      <Stack.Screen name='ReturnandRefundPolicy' component={ReturnandRefundPolicy} />
      <Stack.Screen name='PAC' component={PrivacyPolicy} />
      <Stack.Screen name='TAC' component={TermAndC} />
    </Stack.Navigator>
  );
}