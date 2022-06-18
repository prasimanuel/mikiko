import React from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {HStack, Icon, Pressable, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {ITEM_WIDTH_H4} from '../utils/constanta';
const GoogleLogin = () => {
  GoogleSignin.configure({
    webClientId:
      '239894239921-t9oikekptv4vodlk3ecvln6lqe2h6g62.apps.googleusercontent.com',
  });

  const signIn = async () => {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  return (
    <Pressable
      // w={'100%'}
      // bg="red.100"
      // h={42}
      // justifyContent={'center'}
      // rounded="sm"
      onPress={signIn}>
      {/* <HStack justifyContent={'flex-start'}>
        <Icon
          ml={3}
          as={MaterialCommunityIcons}
          name="google"
          size={5}
          color={'red.600'}
        />
        <Text ml={3}>Sign in with Google</Text>
      </HStack> */}
      <NoFlickerImage
        source={require('./../assets/logo/google.png')}
        style={{
          width: ITEM_WIDTH_H4 * 0.5,
          height: ITEM_WIDTH_H4 * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Pressable>
  );
};

export default GoogleLogin;
