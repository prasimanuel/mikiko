import {Box, Button, Text, FlatList, VStack} from 'native-base';
import React, {useContext, useEffect} from 'react';
import AuthContex, {AuthContexDeviceArray} from '../../route/AuthContext';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  ITEM_HEIGHT_H1,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import DeviceList from '../../components/DeviceList';
import SplashScreen from 'react-native-splash-screen';
import {StackScreenProps} from '@react-navigation/stack';

type Nav = StackScreenProps<any>;
const SharedScreen = ({navigation}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      px={3}>
      {state?.device[0] != undefined ? (
        <FlatList
          data={state?.device}
          renderItem={item => {
            const {gardenName, id, location}: AuthContexDeviceArray = item.item;
            return (
              <DeviceList
                gardenName={gardenName}
                id={id}
                location={location}
                shared={true}
              />
            );
          }}
        />
      ) : (
        <VStack
          justifyContent={'center'}
          mt={ITEM_HEIGHT_H1 / 2}
          alignItems="center"
          space={3}>
          <Text
            _light={{color: FONT_ACTIVE_LIGHT}}
            _dark={{color: FONT_INACTIVE_DARK}}
            fontSize={FONT_TITLE}>
            No Device Yet
          </Text>
          <Button
            variant={'unstyled'}
            width={ITEM_WIDTH_H4 * 1.3}
            height={TAB_BAR_HEIGHT}
            onPress={() => {
              navigation.navigate('Pairingbase', {
                screen: 'Barcode',
              });
            }}
            rounded="none"
            bg={PRIMARY_COLOR}
            _text={{color: FONT_INACTIVE_LIGHT, mt: -0.5}}>
            ADD
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default SharedScreen;
