import { useNavigation } from "@react-navigation/native"
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Whatapps_Twiter_icon from 'react-native-vector-icons/Feather'
import Phone_Mail_icons from 'react-native-vector-icons/FontAwesome5';
import Youtube_Mail_icons from "react-native-vector-icons/Zocial";
import Location_icon from 'react-native-vector-icons/Entypo'
import Headerr from '../ReuseableComp/Headerr'

export default function Contactus() {
    const navigate = useNavigation()

    const handleRedirectToWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${6262808062}&text=''`);
    }

    const handleRedirectToPhone = () => {
        Linking.openURL(`tel:${6262808062}`)
    }

    const handleRedirectToEmail = () => {
        Linking.openURL(`mailto:support@fever99.com`)
    }

    // youtube link
    const handleRedirectToYoutube = () => {
        Linking.openURL("https://www.youtube.com/embed/_xjIgqE05ik?si=6dhJb2F7y_beEa84");
    }

    const handleRedirectToTwitter = () => {
        // Linking.canOpenURL("twitter://timeline").then(supported => {
        //     if (!supported) {
        //         Alert.alert("You do not have twitter on your phone",
        //             "",
        //             [
        //                 { text: "go to store", onPress: () => Linking.openURL("market://details?id=com.twitter.com") },
        //                 { text: "cancel", onPress: () => { }, style: 'cancel' },
        //             ],
        //             { cancelable: false }
        //         );
        //     } else {
        //         return Linking.openURL("twitter://timeline");
        //     }
        // }).catch(err => {
        //     console.error(err);
        // });
        return Linking.openURL("https://twitter.com/");
    }


    return (
        <>
            <Headerr secndheader label={'Contact Us'} />
            <ScrollView style={[{ backgroundColor: "white" }]}>
                <Pressable>
                    <Image source={require('../../assets/images/contact_us.png')} style={internalcss.imgfluid} resizeMode='contain' />
                </Pressable>
                <Text style={internalcss.gettext}>Get in Touch with us</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Pressable style={internalcss.icons_and_iconName} onPress={() => handleRedirectToPhone()} >
                        <Whatapps_Twiter_icon name='phone-call' size={20} color='#050845' />
                        <Text style={internalcss.textStyle}>Phone</Text>
                    </Pressable>
                    <Pressable style={internalcss.icons_and_iconName} onPress={() => handleRedirectToWhatsapp()} >
                        <Phone_Mail_icons name='whatsapp' size={20} color='#128c7e' />
                        <Text style={[internalcss.textStyle, { color: "#128c7e" }]}>Whatsapp</Text>
                    </Pressable>
                    <Pressable style={internalcss.icons_and_iconName} onPress={() => handleRedirectToEmail()} >
                        <Youtube_Mail_icons name='email' style={{ height: wp(5.5), width: wp(5.5), fontSize: hp(2.80), color: "#00596B" }} />
                        <Text style={[internalcss.textStyle, { color: "#00596B" }]}>Email</Text>
                    </Pressable>
                    {/* youtube */}
                    <Pressable style={internalcss.icons_and_iconName} onPress={() => handleRedirectToYoutube()} >
                        <Youtube_Mail_icons name='youtube' size={20} color='#FF0000' />
                        <Text style={[internalcss.textStyle, { color: "#FF0000" }]}>Youtube</Text>
                    </Pressable>
                    <Pressable style={internalcss.icons_and_iconName} onPress={() => handleRedirectToTwitter()} >
                        <Whatapps_Twiter_icon name='twitter' size={20} color='#1DA1F2' />
                        <Text style={[internalcss.textStyle, { color: "#1DA1F2" }]}>Twitter</Text>
                    </Pressable>
                </View>
                <Pressable onPress={() => handleRedirectToWhatsapp()} style={internalcss.boxinfo}>
                    <Location_icon name='location' size={25} color='red' />
                    <Text style={internalcss.numver}>Fever99 E-clinic, Shriram Complex, Near SPR Society, Sector 82, Faridabad, Haryana</Text>
                </Pressable>

            </ScrollView>
        </>
    )
}
const internalcss = StyleSheet.create({
    numver: {
        color: '#050845',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        width: wp(80)
    },
    textStyle: {
        color: '#050845',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        marginTop: 10
    },
    boxinfo: {
        backgroundColor: '#fff',
        padding: wp(7),
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    gettext: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        textAlign: 'center',
        color: '#050845',
        paddingVertical: 15,
    },
    imgfluid: {
        width: '100%',
        height: 220,
        marginTop: 40
    },
    icons_and_iconName: {
        marginTop: 10,
        minHeight: hp(7),
        maxWidth: wp(32),
        minWidth: wp(30),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }
})