import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../screen/authscreens/SignInScreen';
import SignUpScreen from '../screen/authscreens/SignUpScreen';
import PhoneScreen from '../screen/authscreens/PhoneScreen';
import PhoneScreenOtp from '../screen/authscreens/PhoneScreeOtp';

export type AuthStackParams = {
  Signin;
  Signup;
  Phone;
  Phoneotp;
};

const Stack = createStackNavigator<AuthStackParams>();

const AuthStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Signin" component={SignInScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="Phoneotp" component={PhoneScreenOtp} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;
