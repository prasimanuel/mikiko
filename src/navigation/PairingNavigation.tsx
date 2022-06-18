import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import PairingScreen from '../screen/pairingscreens/PairingScreen';
import BarcodeScreen from '../screen/pairingscreens/BarcodeScreen';
import WifiScreen from '../screen/pairingscreens/WifiScreen';
import SettingsUpScreen from '../screen/pairingscreens/SettingsUpScreen';
import DeviceInfoScreen from '../screen/pairingscreens/DeviceInfoScreen';
import {
  BG_ERROR,
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import MapScreen from '../screen/pairingscreens/MapScreen';
import FailedScreen from '../screen/pairingscreens/FailedScreen';
import {Icon} from 'native-base';

export type PairingParams = {
  Barcode;
  Wifi;
  Settingup;
  Map;
  Deviceinfo;
  pairing;
  Failed;
};

const Stack = createStackNavigator<PairingParams>();
type Nav = StackScreenProps<PairingParams>;

const PairingNavigation = ({navigation}: Nav) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: PRIMARY_COLOR, height: TAB_BAR_HEIGHT},
        headerTitleAlign: 'center',
        headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
        headerTintColor: FONT_INACTIVE_LIGHT,
      }}>
      <Stack.Screen
        name="pairing"
        component={PairingScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Barcode"
        component={BarcodeScreen}
        options={{title: 'Add Device', headerShown: false}}
      />
      <Stack.Screen
        name="Wifi"
        component={WifiScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Settingup"
        component={SettingsUpScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Failed"
        component={FailedScreen}
        options={{
          title: 'Error',
          headerStyle: {backgroundColor: BG_ERROR, height: TAB_BAR_HEIGHT},
          headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
          headerLeft: () => (
            <Icon
              as={MaterialCommunityIcons}
              name="close"
              size={5}
              ml={2}
              color={FONT_INACTIVE_LIGHT}
              onPress={() => {
                navigation.navigate('Wifi');
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Deviceinfo"
        component={DeviceInfoScreen}
        options={{title: 'Add Device', headerLeft: () => <></>}}
      />
    </Stack.Navigator>
  );
};

export default PairingNavigation;
