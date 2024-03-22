import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';

// mani font family
const mainFont = 'Montserrat-Regular';
const mainFontBold = 'Montserrat-Bold';
const mainFontmedium = 'Montserrat-Medium';
const maincolor = '#1263AC';

const PrivacyPolicy = () => {
  return (
    <View style={{ flex: 1 }}>
      <Headerr secndheader={true} label='Privacy & Policy' />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: wp(95), alignSelf: 'center', marginBottom: hp(4) }} >
        <Text style={styles.common_TextStyl}>At Fever99.com, we understand the significance of the trust you place in our services, and we are dedicated to upholding the highest standards for customer information privacy and transactions.</Text>
        <Text style={styles.common_TextStyl}>Fever99.com is deeply committed to safeguarding the personal information and sensitive personal data of our customers, striving to ensure the utmost privacy.</Text>
        <Text style={styles.common_TextStyl}>"Personal information," as referred to in this policy, encompasses any data that can independently identify, contact, or locate an individual. This includes sensitive personal data or information such as medical history, treated as part of personal information for the purposes of this policy.</Text>
        <Text style={styles.common_TextStyl}>Fever99 collects personal information for various regulatory and business reasons, including but not limited to identity verification, effective completion of transactions, billing for availed products and services, responding to service requests, market analysis, business and operational improvement, and promotion and marketing of products and services that we believe may be of interest and benefit to you. We also ensure adherence to legal and regulatory requirements for the prevention and detection of frauds and crimes.</Text>
        <Text style={styles.common_TextStyl}>Our Privacy Policy is meticulously designed to address the privacy and security of the personal information entrusted to us. This policy delineates the types of personal information we may collect and outlines our approach to handling and dealing with this information.</Text>
        <Text style={styles.common_TextStyl}>Note: Our privacy policy is subject to change at any time without notice.</Text>
        <Text style={styles.common_TextStyl}>By utilizing our services and portal, you signify your agreement to all the terms and conditions outlined in the document below.</Text>
        <Text style={[styles.common_TextStyl, { fontFamily: mainFontBold, }]}>Feedback and Concerns:</Text>
        <Text style={styles.common_TextStyl}>At Fever99.com, your trust and satisfaction are paramount, and we are unwaveringly committed to safeguarding the personal information entrusted to us. We appreciate and anticipate your ongoing support in this endeavor. Should you have any feedback or concerns regarding the protection of your personal information, the delivery of our products/services, or any payment-related issues, we encourage you to reach out to our dedicated customer support team.</Text>
        <Text style={styles.common_TextStyl}>For assistance, please contact us at 6262-8080-62 or via email at info@fever99.com. Your inquiries are important to us, and we are here to address them promptly and effectively.</Text>
        <Text style={styles.common_TextStyl}>Fever99.com reserves the right to amend or modify this Privacy Policy at any time to adapt to evolving needs and ensure the highest standards of privacy protection. We recommend that you visit our website www.fever99.com periodically for the latest information and updates. Your continued trust and support are invaluable to us, and we are committed to keeping you informed about any changes in our privacy practices.</Text>
        <Text style={styles.common_TextStyl}>Thank you for choosing Fever99.com for your healthcare needs</Text>
      </ScrollView>
    </View>
  )
}

export default PrivacyPolicy;
const styles = StyleSheet.create({
  common_TextStyl: {
    marginTop: hp(2),
    fontFamily: mainFont,
    fontSize: hp(1.8),
    color: 'black',
    textAlign: "justify"
  },
})