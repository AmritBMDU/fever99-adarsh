import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Category from '../Components/Category';
import CategoryDetail from '../Components/CategoryDetail';
import Appointment from '../Components/Appointment';
import Meeting from '../Components/Meeting';
const Stack = createNativeStackNavigator();

const AppointmentStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }}
                name="Appointment" component={Appointment} />
            <Stack.Screen options={{ headerShown: false }}
                name="Meeting" component={Meeting} />
        </Stack.Navigator>
    )
}

export default AppointmentStack