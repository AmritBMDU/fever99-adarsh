import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Category from '../Components/Category';
import CategoryDetail from '../Components/CategoryDetail';
const Stack = createNativeStackNavigator();

const CategoryStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }}
                name="Category" component={Category} />
            <Stack.Screen options={{ headerShown: false }}
                name="CategoryDetail" component={CategoryDetail} />
        </Stack.Navigator>
    )
}

export default CategoryStack