// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//     PermissionsAndroid,
//     Platform,
//     Pressable,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View
// } from 'react-native';
// import {
//     ChannelProfileType,
//     IRtcEngine,
//     RtcSurfaceView,
//     createAgoraRtcEngine
// } from 'react-native-agora';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Octicons from "react-native-vector-icons/Octicons";
// import { getAppointmentById } from '../Services/appointments.service';
// import { getMeetingToken } from '../Services/meeting.service';
// import { getUser } from '../Services/user.service';
// import { toastError } from '../utils/toast.utils';
// export default function Meeting(props: any) {
//     const [isJoined, setIsJoined] = useState(false);
//     const [remoteUid, setRemoteUid] = useState(0);
//     const [message, setMessage] = useState('');
//     const [idArr, setIdArr] = useState<number[]>([])


//     const navigation: any = useNavigation()

//     const [isCameraDisabled, setIsCameraDisabled] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const agoraEngineRef = useRef<IRtcEngine>();
//     let temp = 0;

//     const [appointmentObj, setAppointmentObj] = useState({});
//     const [role, setRole] = useState("");

//     const [uid, setuid] = useState(Math.floor(Math.random() * 1000));
//     const channelName = props.route.params.data;
//     const focused = useIsFocused();

//     const [token, setToken] = useState("");
//     const HandleGetMeetingToken = async () => {
//         try {
//             let obj = {
//                 channelName: channelName,
//                 role: role,
//                 uid: uid,
//             }
//             let { data: res } = await getMeetingToken(obj)
//             if (res.tokenA) {
//                 console.log(res.tokenA, "res.tokenA")
//                 setToken(res.tokenA);
//             }
//         } catch (error) {
//             toastError(error)
//         }

//     }



//     const HandleGetAppointment = async () => {
//         try {


//             let userObj = await getUser();
//             let { data: res } = await getAppointmentById(props?.route?.params?.data);
//             if (res.data) {
//                 setAppointmentObj(res.data);
//                 if (res.data.expert == userObj?._id) {
//                     setRole("User")
//                 }
//                 else {
//                     setRole("Doctor")
//                 }
//                 HandleGetMeetingToken();
//             }
//         } catch (error) {
//             toastError(error)
//         }
//     }

//     useEffect(() => {
//         if (focused) {
//             if (props.route.params.data && props.route.params.data != "") {
//                 HandleGetAppointment();

//             }
//         }
//         return () => leave()
//     }, [focused]);


//     useEffect(() => {
//         if (focused && token != "") {
//             setupVideoSDKEngine();
//         }
//         // return () => leave()
//     }, [focused, token]);

//     const getPermission = async () => {
//         if (Platform.OS === 'android') {
//             await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//                 PermissionsAndroid.PERMISSIONS.CAMERA,
//             ]);
//         }
//     };


//     const setupVideoSDKEngine = async () => {
//         try {
//             // use the helper function to get permissions
//             if (Platform.OS === 'android') { await getPermission() };
//             agoraEngineRef.current = createAgoraRtcEngine();
//             const agoraEngine = agoraEngineRef.current;
//             agoraEngine.initialize({
//                 appId: "b671aeda83ee48d582e9cc33f83b30cb",
//                 channelProfile: ChannelProfileType.ChannelProfileCommunication,
//             });
//             agoraEngine.enableVideo();
//             join()
//             agoraEngine.addListener("onUserJoined", (asdf, remoteId) => {
//                 setIdArr(prev => [...prev, remoteId])
//             })
//             agoraEngine.addListener("onJoinChannelSuccess", (asdf, ...rest) => {
//                 console.log("Remote user joined with uid ' + suc", asdf, rest)
//             })
//             agoraEngine.addListener("onConnectionStateChanged", (...rest) => {
//                 console.log("Remote user connection with uid '", rest)
//             })
//             agoraEngine.addListener("onVideoDeviceStateChanged", (...rest) => {
//                 console.log("video changed", rest)
//             })
//             agoraEngine.addListener("onLeaveChannel", (...rest) => {
//                 console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLRemote user left with uid ' + Uid left")
//                 leave()
//             })

//         } catch (e) {
//             console.log(e, "agora error");
//         }
//     };

//     const join = async () => {
//         if (isJoined) {
//             return;
//         }
//         try {
//             temp = new Date().getTime()
//             let temp2 = await agoraEngineRef.current?.startPreview();
//             console.log(temp2, "temp2")

//             console.log(uid, "uid")

//             let temp3 = await agoraEngineRef.current?.joinChannel(token, channelName, uid,
//                 {
//                     publishCameraTrack: true,
//                     publishSecondaryCameraTrack: false,
//                     isInteractiveAudience: false,
//                     isAudioFilterable: false
//                 }
//             );
//             setTimeout(() => {
//                 setIsJoined(true)
//             }, 300);
//             console.log(temp3, "temp3")
//         } catch (error) {
//             console.error('Error joining channel:', error);
//         }
//     };



//     const leave = () => {
//         try {
//             agoraEngineRef.current?.leaveChannel({
//                 stopAudioMixing: true,
//                 stopAllEffect: true,
//                 stopMicrophoneRecording: true
//             });
//             console.log("called")
//             if (navigation.canGoBack()) {
//             }
//             navigation.goBack()
//         } catch (e) {
//             console.log(e, "agora error");
//         }
//     };


//     const mute = (value: boolean) => {
//         try {
//             agoraEngineRef.current?.muteLocalAudioStream(value);
//         } catch (e) {
//             console.log(e, "agora error");
//         }
//     };



//     const swithCamera = () => {
//         try {
//             agoraEngineRef.current?.switchCamera();
//         } catch (e) {
//             console.log(e, "agora error");
//         }
//     };


//     const disableCamera = (value: boolean) => {
//         setIsCameraDisabled(prev => !prev)
//         agoraEngineRef.current?.muteLocalVideoStream(value)
//         // try {
//         //     if (value) {
//         //         agoraEngineRef.current?.stopPreview()
//         //     }
//         //     else {
//         //         agoraEngineRef.current?.enableVideo()
//         //         agoraEngineRef.current?.startPreview()
//         //     }
//         // } catch (e) {
//         //     console.log(e, "agora error");
//         // }
//     };
//     return (
//         <SafeAreaView style={styles.main}>
//             <View style={styles.btnContainer}>
//                 <Text>{idArr && idArr.length && idArr[0]}</Text>
//                 <Text>{idArr.length}</Text>
//                 <Pressable onPress={() => { mute(!isMuted); setIsMuted(prev => !prev) }} style={[styles.button, { backgroundColor: "grey" }]}>
//                     {
//                         isMuted ?
//                             <Octicons size={25} color={"white"} name="mute" />
//                             :
//                             <Octicons size={25} color={"white"} name="unmute" />
//                     }

//                 </Pressable>
//                 <Pressable onPress={() => { swithCamera() }} style={[styles.button, { backgroundColor: "grey" }]}>
//                     <MaterialCommunityIcons size={25} color={"white"} name="camera-flip-outline" />
//                 </Pressable>
//                 <Pressable onPress={() => { disableCamera(!isCameraDisabled); }} style={[styles.button, { backgroundColor: "grey" }]}>
//                     {
//                         isCameraDisabled ?
//                             <MaterialCommunityIcons size={25} color={"white"} name="camera-outline" />
//                             :
//                             <MaterialCommunityIcons size={25} color={"white"} name="camera-off-outline" />
//                     }
//                 </Pressable>
//                 <Pressable onPress={() => { leave() }} style={[styles.button, { backgroundColor: "red" }]}>
//                     <MaterialIcons size={25} color={"white"} name="call-end" />
//                 </Pressable>
//             </View>


//             {
//                 isJoined &&
//                 <>
//                     {
//                         isCameraDisabled ?
//                             <View style={[styles.videoView1, { backgroundColor: "black", zIndex: 15 }]}>
//                                 <Text style={{ color: "white" }}>Camera disabled</Text>
//                             </View>
//                             :
//                             <RtcSurfaceView zOrderOnTop zOrderMediaOverlay canvas={{ uid: 0 }} style={styles.videoView1} />
//                     }
//                 </>
//             }

//             {/*  */}
//             {
//                 idArr.filter(((el, index) => index == (idArr.length - 1))).length > 0 ?
//                     idArr.filter(((el, index) => index == (idArr.length - 1))).map((el, indexX) =>
//                         <>

//                             <RtcSurfaceView key={indexX} canvas={{ uid: el }} style={styles.videoView} />

//                         </>
//                     )
//                     :
//                     <Text style={{ position: "absolute", color: "white", top: hp(50), left: 10, zIndex: 100 }}>Waiting for others to join</Text>
//             }


//         </SafeAreaView>
//     );

// }


// const styles = StyleSheet.create({
//     button: {
//         borderRadius: 205,
//         width: 60,
//         height: 60,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontWeight: 'bold',
//         color: '#ffffff',
//         backgroundColor: '#0055cc',
//         margin: 5,
//     },
//     main: {
//         height: hp(100),
//         width: wp(100),
//         alignItems: 'center',
//         position: "relative",
//         zIndex: -15
//     },
//     videoView: {
//         width: wp(100),
//         zIndex: -1,
//         height: hp(100),
//         position: "absolute",
//         top: 0,
//         left: 0
//     },
//     videoView1: {
//         width: wp(50),
//         position: "absolute",
//         top: hp(5),
//         borderRadius: 10,
//         right: wp(7),
//         zIndex: 1,
//         height: hp(28),
//         borderColor: "white",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         borderWidth: 1
//     },
//     btnContainer: {
//         zIndex: 150,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         padding: 10,
//         backgroundColor: "white",
//         width: wp(100),
//     },
//     head: {
//         fontSize: 20
//     },
//     info: {
//         backgroundColor: '#ffffe0',
//         color: '#0000ff'
//     }
// });










import React, { useEffect, useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { getMeetingToken } from '../Services/meeting.service';
import { toastError } from '../utils/toast.utils';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Meeting = (props: any) => {
    const navigation: any = useNavigation()
    const [videoCall, setVideoCall] = useState(true);
    const [uid, setuid] = useState(Math.floor(Math.random() * 1000));
    const [token, setToken] = useState("");

    const connectionData = {
        appId: "b671aeda83ee48d582e9cc33f83b30cb",
        channel: props.route.params.data,
        // token: token
    };
    const rtcCallbacks = {
        EndCall: () => { setVideoCall(false); navigation.goBack() },
    };
    const focused = useIsFocused();
    const [loading, setLoading] = useState(false);


    const btnStyle = {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#3832a8',
        borderWidth: 0,
    };



    const HandleGetMeetingToken = async () => {
        try {
            setLoading(true)
            let obj = {
                channelName: props.route.params.data,
                role: "",
                uid: uid,
            }
            let { data: res } = await getMeetingToken(obj)
            if (res.tokenA) {
                setLoading(false)
                console.log(res.tokenA, "res.tokenA")
                setToken(res.tokenA);
            }
        } catch (error) {
            setLoading(false)
            toastError(error)
        }

    }


    useEffect(() => {
        if (focused && props.route.params.data && props.route.params.data != "") {
            HandleGetMeetingToken()
            console.log(props.route.params.data, "props.route.params.data")
        }
    }, [focused, props.route.params.data])



    const remoteBtnStyle = { backgroundColor: '#2edb8555' };
    return (
        <>
            <AgoraUIKit
                connectionData={connectionData}
                settings={{
                    mode: 0
                }}
                styleProps={
                    {
                        iconSize: 25,
                        theme: '#ffffffee',

                        overlayContainer: {
                            opacity: 1,
                        },
                        localBtnStyles: {
                            muteLocalVideo: btnStyle,
                            muteLocalAudio: btnStyle,
                            switchCamera: btnStyle,
                            endCall: {
                                borderRadius: 50,
                                width: 50,
                                height: 50,
                                backgroundColor: '#f66',
                                borderWidth: 0,
                            },
                        },
                        localBtnContainer: {
                            backgroundColor: 'transparent',
                            bottom: 0,
                            paddingVertical: 10,
                            borderWidth: 0,
                            borderColor: 'transparent',
                            height: 90,
                        },
                        maxViewRemoteBtnContainer: {
                            top: 0,
                            alignSelf: 'flex-end',
                        },
                        remoteBtnStyles: {
                            muteRemoteAudio: remoteBtnStyle,
                            muteRemoteVideo: remoteBtnStyle,
                            remoteSwap: remoteBtnStyle,
                            minCloseBtnStyles: remoteBtnStyle,
                        },
                        minViewContainer: {
                            top: 50,
                            left: widthPercentageToDP(65),
                            marginRight: 10,
                            backgroundColor: 'transparent',
                            borderColor: '#2edb85',
                            borderWidth: 0,
                            borderRadius: 10,
                        },
                        minViewStyles: {
                            // width: "auto",
                            height: 215,
                            borderRadius: 10,
                            width: 120,
                            marginLeft: "auto"
                            // maxWidth: "100%",
                            // maxHeight: "150%",
                        },
                        maxViewStyles: {
                            height: '100%',
                        },
                        UIKitContainer: { height: '100%' },
                    }
                }
                rtcCallbacks={rtcCallbacks} />
            {/* {
                loading ?
                    <Text>Loading Please wait ....</Text>
                    :
                    <AgoraUIKit connectionData={connectionData} styleProps={
                        {
                            iconSize: 25,
                            theme: '#ffffffee',

                            overlayContainer: {
                                opacity: 1,
                            },
                            localBtnStyles: {
                                muteLocalVideo: btnStyle,
                                muteLocalAudio: btnStyle,
                                switchCamera: btnStyle,
                                endCall: {
                                    borderRadius: 50,
                                    width: 50,
                                    height: 50,
                                    backgroundColor: '#f66',
                                    borderWidth: 0,
                                },
                            },
                            localBtnContainer: {
                                backgroundColor: 'transparent',
                                bottom: 0,
                                paddingVertical: 10,
                                borderWidth: 0,
                                borderColor: 'transparent',
                                height: 90,
                            },
                            maxViewRemoteBtnContainer: {
                                top: 0,
                                alignSelf: 'flex-end',
                            },
                            remoteBtnStyles: {
                                muteRemoteAudio: remoteBtnStyle,
                                muteRemoteVideo: remoteBtnStyle,
                                remoteSwap: remoteBtnStyle,
                                minCloseBtnStyles: remoteBtnStyle,
                            },
                            minViewContainer: {
                                top: 50,
                                right: 10,
                                marginRight: 10,
                                backgroundColor: 'transparent',
                                borderColor: '#2edb85',
                                borderWidth: 0,
                                borderRadius: 10,
                            },
                            minViewStyles: {
                                // width: "auto",
                                height: 195,
                                borderRadius: 10,
                                width: 120,
                                // maxWidth: "100%",
                                // maxHeight: "150%",
                            },
                            maxViewStyles: {
                                height: '100%',
                            },
                            UIKitContainer: { height: '100%' },
                        }



                    } rtcCallbacks={rtcCallbacks} />

            } */}
        </>
    )
};
export default Meeting;