import React from 'react';
import {HStack, Icon, Pressable, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {ITEM_WIDTH_H4} from '../utils/constanta';

const FacebookLogin = props => {
  //   Settings.setAppID('434933588007672');
  //   Settings.initializeSDK();

  async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    auth()
      .signInWithCredential(facebookCredential)
      .then(res => {
        console.log('facebook login = ', res);
        // SignIn(res.user);
      });
  }

  return (
    <Pressable
      // w={'100%'}
      // bg="blue.100"
      // h={42}
      // justifyContent={'center'}
      // rounded="sm"
      onPress={onFacebookButtonPress}>
      {/* <HStack justifyContent={'flex-start'}>
        <Icon
          ml={3}
          as={MaterialCommunityIcons}
          name="facebook"
          size={5}
          color={'blue.600'}
        />
        <Text ml={3}>Sign in with Facebook</Text>
      </HStack> */}
      <NoFlickerImage
        source={require('./../assets/logo/fb.png')}
        style={{
          width: ITEM_WIDTH_H4 * 0.5,
          height: ITEM_WIDTH_H4 * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Pressable>
  );
};

export default FacebookLogin;
