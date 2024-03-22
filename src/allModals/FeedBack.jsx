import React, { useState } from 'react';
import { Keyboard, Alert, Pressable } from 'react-native';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { toastError,toastSuccess } from '../utils/toast.utils';
import url from '../Services/url.service';
const mainFont = 'Montserrat-Regular';
import axios from '../Services/axios.service';
const FeedBack = ({ cartId, onCloseModal }) => {

    console.log(cartId);
    const [name, setName] = useState('Sarita ji');
    const [email, setEmail] = useState('rajeshpushpakar01@gmail.com');
    const [subject, setSubject] = useState('Testing By adarsh Mishra');
    const [hasError, setHasError] = useState(false);
    const [description, setDescription] = useState('testing on going');

    const handleSubmit = async () => {
        console.log(`${url}/feedback`);
        if (!name || !email || !subject || !description) {
            setHasError(true);
            return;
        }

        try {
            const feedbackData = { name, email, subject, description };
            console.log(feedbackData, `${url}/feedback`);
            const response = await axios.post(`${url}/feedback`, feedbackData);

            if (response.status === 201) {
                onCloseModal();
                toastSuccess(response.message)
                console.log(response)
            } else {
                console.error("Error:", response.data);
                onCloseModal();
                toastError(response.data);
            }
        } catch (error) {
            console.error("Error sending feedback:", error);
            onCloseModal();
            toastError("An error occurred while sending feedback. Please try again later.");
        }
    };

    const offModal = () => {
        onCloseModal();
    }

    return (
        <View style={styles.mainView}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalContent}>
                    <View style={{
                        backgroundColor: "#fff", padding: hp(1.5), borderRadius: 5,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "baseline",
                    }}>
                        <View style={styles.d_Flex}>
                            <Text style={styles.modalTitle}>Feedback</Text>
                            <Pressable onPress={() => offModal()}>
                                <Text style={styles.closeBtn}>Close</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            placeholder='Name'
                            style={[styles.input, hasError && !name && styles.invalidInput]}
                            placeholderTextColor="gray"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder='Email'
                            style={[styles.input, hasError && !email && styles.invalidInput]}
                            placeholderTextColor="gray"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder='Subject'
                            style={[styles.input, hasError && !subject && styles.invalidInput]}
                            placeholderTextColor="gray"
                            value={subject}
                            maxLength={80}
                            onChangeText={setSubject}
                        />
                        <View style={[styles.multilineTextBorder, hasError && !description && styles.invalidInput]}>
                            <TextInput
                                placeholder='Description'
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={540}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    d_Flex: {
        width: wp(95),
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    },
    closeBtn: {
        backgroundColor: "light-green",
        color: "red",
        padding: wp(3),
    },
    mainView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: "center",
        alignContent: "center"

    },
    modalContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeIcon: {
        tintColor: 'black',
        height: wp(5),
        width: wp(5)
    },
    modalTitle: {
        fontSize: 20,
        color: 'black',
        fontWeight: "bold",
        marginTop: hp(2.5),
        justifyContent: "center",
        alignItems: "center",
        fontFamily: mainFont

    },
    input: {
        marginTop: hp(2),
        color: 'gray',
        backgroundColor: "#e6edf7",
        borderRadius: 3,
        borderWidth: .25,
        borderColor: "gray",
        width: wp(95),
    },
    submitButton: {
        width: wp(95),
        height: hp(7),
        alignSelf: "center",
        backgroundColor: '#1263AC',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        marginTop: hp(2)
    },
    submitButtonText: {
        color: 'white',
        fontSize: hp(2)
    },
    multilineTextBorder: {
        backgroundColor: '#e6edf7',
        height: hp(20),
        marginTop: hp(3),
        borderRadius: hp(.51),
        borderColor: "gray",
        borderWidth: .25,
        width: wp(95)
    },
    invalidInput: {
        borderColor: "red",
        borderWidth: .5
    },
});

export default FeedBack;
