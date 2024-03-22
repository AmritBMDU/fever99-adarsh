import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LoginContext, UserDataContext } from '../../../App';
import { AuthContext } from '../../../App';
import { loginUser, setJwt } from '../../Services/user.service';
import { toastError } from '../../utils/toast.utils';
const { height, width } = Dimensions.get('window');
import Openeye_closeEye from "react-native-vector-icons/Ionicons"
import Lock from "react-native-vector-icons/FontAwesome6"

const Password = (props: any) => {
    const mainFont = 'Montserrat-Regular';
    const mainFontBold = 'Montserrat-Bold';
    const navigation: any = useNavigation();
    const [hide, setHide] = useState(true);
    const [password, setPassword] = useState("");
    const [isAuthorized, setIsAuthorized] = useContext<any>(AuthContext)
    const [user, setUser] = useContext(LoginContext)
    const [userData, setUserData] = useContext(UserDataContext)

    const handleLogin = async () => {
        try {
            if (password == "") {
                toastError("Password is mandatory !!!")
                return
            }
            let obj = {
                email: props.route.params.data,
                password,
            }

            const { data: res }: any = await loginUser(obj);
            if (res.status == false) {
                throw new Error(res.error)
            }
            if (res.token) {
                await setJwt(res?.token, res?.user);
                setUser(res?.user?.role);
                setUserData(JSON.stringify(res?.user))
                setIsAuthorized(true);
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    return (
        <View style={{ flex: 1, width: width }}>
            <ImageBackground source={require('../../../assets/images/background_img.png')} resizeMode='contain' style={{ flex: 1, width: width, backgroundColor: "#1263AC" }} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,.75)', flex: 1, width: width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: hp(3), color: 'white', alignSelf: 'center', marginTop: hp(7), fontFamily: mainFont }}>Login</Text>
                        <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>

                            {/* Password section >>>>>>>>>>>>>>>>>>>>>*/}
                            <Text style={{ color: '#fff' }}>Password</Text>
                            <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(3), flexDirection: 'row' }}>

                                <Lock name='lock' style={{ height: wp(5.5), width: wp(5.5), color: 'grey', fontSize: hp(2.80) }} />
                                <TextInput
                                    placeholder='Enter password'
                                    placeholderTextColor="gray"
                                    secureTextEntry={hide}
                                    onChangeText={(e) => setPassword(e)}
                                    value={password}
                                    style={{ marginLeft: 5, width: wp(70) }}
                                />
                                <Pressable onPress={() => setHide(!hide)}>
                                    {hide ? (
                                        <Openeye_closeEye name='eye-off' style={{ height: wp(5.5), width: wp(5.5), color: 'grey', fontSize: hp(3) }} />
                                    ) : (
                                        <Openeye_closeEye name='eye' style={{ height: wp(5.5), width: wp(5.5), color: 'grey', fontSize: hp(3) }} />
                                    )}
                                </Pressable>
                            </View>
                            <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginTop: 8 }}><Text style={{ color: '#fff' }}>Forgot Password</Text></Pressable>
                            {/* Button section >>>>>>>>>>>>>>>>>> */}
                            <TouchableOpacity
                                onPress={() => handleLogin()}
                                style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: 'AvenirNextLTPro-Regular' }}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                        <View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </ImageBackground>
        </View>
    )
}

export default Password