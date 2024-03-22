import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';

const { height, width } = Dimensions.get('window')

const TermAndC = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const mainFontmedium = 'Montserrat-Medium'
  const maincolor = '#1263AC'
  const navigation = useNavigation()
  return (
    <View style={{ width: width, height: height, }} >
      <Headerr secndheader={true} label='Terms & conditions' />
      <ScrollView style={{ width: wp(95), alignSelf: 'center', marginBottom: hp(3) }} showsVerticalScrollIndicator={false}>
        <Text style={{ marginTop: hp(1), fontFamily: mainFont, fontSize: hp(1.8), color: 'black' }}>Welcome to Fever99.com. By continuing to browse and use this website, you agree to adhere to and be bound by the following terms and conditions of use. These terms, along with our privacy policy, govern the relationship between you and Fever99.com in connection with this website. If you do not agree with any part of these terms and conditions, we kindly request that you refrain from using our website.</Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>The term 'Fever99.com' or 'we' or 'us' refers to the owner of the website. Your use of this website is subject to the following terms:</Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          The content on the pages of this website is for your general information and use only. It is subject to change without prior notice.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          This website is designed to securely store your medical and demographic data.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          Neither we nor any third parties provide any warranty or guarantee regarding the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          Your use of any information or materials on this website is entirely at your own risk, and we shall not be liable. It is your responsibility to ensure that any products, services, or information available through this website meet your specific requirements.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          This website contains material that is owned by or licensed to us. Reproduction is prohibited, except in accordance with the copyright notice, which forms part of these terms and conditions.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          All trademarks reproduced on this website, which are not the property of, or licensed to, the operator, are acknowledged on the website.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          From time to time, this website may include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s), and we have no responsibility for the content of the linked website(s).
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          Your use of this website and any dispute arising out of such use is subject to the laws of the Republic of India
        </Text>
        <Text style={{ marginTop: hp(2), fontFamily: mainFontmedium, fontSize: hp(1.9), color: 'black' }}>
          Thank you for choosing Fever99.com for your healthcare needs
        </Text>
      </ScrollView>
    </View>
  )
}

export default TermAndC;
