import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../../ReuseableComp/Headerr'

const { height, width } = Dimensions.get('window')
const mainFont = 'Montserrat-Regular';

export default function ReturnandRefundPolicy() {
    const mainFontBold = 'Montserrat-Bold'
    return (
        <View style={{ width: width, height: height, }}>
            <Headerr secndheader={true} label='Cancellation & Refund Policy' />
            <ScrollView style={{ width: wp(95), alignSelf: 'center', marginBottom: hp(3) }}>
                <Text style={styles.common_Text_styl}>Fever99.com will refund full amount for cancellation of an appointment if cancellation is done 6 hours before the scheduled time. If the appointment is cancelled within 6 hours of the scheduled time then no refund would be provided.</Text>
                <Text style={styles.common_Text_styl}>The appointment can be rescheduled till 1 hour before the appointment time at no extra cost by calling the customer care. If the appointment is rescheduled then it can not be cancelled anytime. However, the appointment can be rescheduled maximum 2 times.</Text>
                <Text style={styles.common_Text_styl}>In case of refund, Your money would be refunded to your account by reversal of transaction as per the payment mode within 15 working days of the cancellation of an appointment</Text>
                <Text style={styles.common_Text_styl}>For any delay in refunding the money due to unforeseen conditions beyond the control of Fever99 E-clinic. Fever99 Eclinic would not be liable to pay any extra amount as compensation for delay</Text>
                <Text style={[styles.common_Text_styl, { fontFamily: mainFontBold }]}>Contact Details:</Text>
                <Text style={styles.common_Text_styl}>Visit us at: Fever99 E-clinic, Shriram Complex,Near SPR Society ,Sector 82 Faridabad,Haryana Website: https://www.fever99.com</Text>
                <Text style={styles.common_Text_styl}>Email: info@fever99.com</Text>
                <Text style={styles.common_Text_styl}>M:+91 6262808062</Text>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    common_Text_styl: {
        marginTop: hp(1.5),
        fontFamily: mainFont,
        fontSize: hp(1.8),
        color: 'black',
        textAlign:"justify"
    }
})