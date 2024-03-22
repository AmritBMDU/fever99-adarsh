import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SendNotificationForMeetingCreation } from '../Services/notificationSevice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import url from '../Services/url.service';
import { getUser } from '../Services/user.service';

export default function PayementScreen(props: any) {
    const focused = useIsFocused()
    const navigation: any = useNavigation();
    const [userObj, setUserObj] = useState<any>({});
    const [loading, setLoading] = useState(true); // Added state for loading

    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        setLoading(true);
        if (userData) {
            setUserObj(userData);
            setLoading(false);
        }
    }

    const handleWebViewState = (e: any) => {
        if (`${e?.url}`.includes("https://www.fever99.com/")) {
            console.log("thi is my e value\n", e);
            console.log("this is all value getting \n\n\t", `${e?.url}`.includes("https://www.fever99.com/"));
            navigation.navigate("PayementSuccess")
            SendNotificationForMeetingCreation({ appointment: props?.route?.params?.appointmentId })
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
        }
    }, [focused]);

    console.log("this wala", userObj?._id)
    console.log("this wala", props?.route?.params?.amount);


    return (
        <View>
            <View style={{ height: hp(100), width: wp(100), backgroundColor: "red" }}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    userObj?._id &&
                    <WebView
                        source={{
                            uri: `${url}/initiateWalletRecharge/?amount=${props?.route?.params?.amount}&appointmentId=${props?.route?.params?.appointmentId}&userId=${userObj?._id}`,
                        }}
                        onMessage={(event) => {
                            // Handle messages from the WebView, if needed
                            console.log('wEBview response')
                            console.log(event.nativeEvent.data);
                        }}
                        onNavigationStateChange={(e) => handleWebViewState(e)}
                        onLoadEnd={() => {
                            // WebView has loaded
                        }}
                    />
                )}
            </View>
        </View>
    )
}
