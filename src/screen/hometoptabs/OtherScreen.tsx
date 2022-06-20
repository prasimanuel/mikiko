import {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, FlatList, Text, VStack} from 'native-base';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import DeviceList from '../../components/DeviceList';
import firestore from '@react-native-firebase/firestore';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
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
import {deviceList} from './GreenHouseScreen';
import {LogBox} from 'react-native';

type Nav = StackScreenProps<HomeStackParams>;

const OtherScreen = ({navigation}: Nav) => {
  // const {Publish, Subscribe} = useContext(AuthContex);
  const state = useSelector((state: ReducerRootState) => state);

  const [deviceList, deviceListSet] = useState<Array<deviceList>>([]);
  const [status, statusSet] = useState<boolean>(true);

  LogBox.ignoreAllLogs();

  useLayoutEffect(() => {
    firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .onSnapshot(res => {
        if (res.size == 0) {
          deviceListSet([]);
        } else {
          var devices: any = [];
          res.forEach((device: any) => {
            devices.push(device._data);
          });
          deviceListSet(devices);
        }
      });
  }, []);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      px={3}>
      {deviceList[0] != undefined ? (
        <FlatList
          data={deviceList}
          renderItem={({item}) => {
            if (item.scene == 'other') statusSet(false);
            return (
              <Box>
                {item.scene == 'other' ? (
                  <DeviceList
                    gardenName={item.gardenName}
                    id={item.id}
                    location={item.location}
                    shared={false}
                    model={item.model}
                  />
                ) : null}
              </Box>
            );
          }}
          keyExtractor={item => item.id}
        />
      ) : null}
      {status ? (
        <VStack
          justifyContent={'center'}
          position="absolute"
          top={ITEM_HEIGHT_H1 / 2}
          left="37%"
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
              navigation.navigate('Pairingbase');
            }}
            rounded="none"
            bg={PRIMARY_COLOR}
            _text={{color: FONT_INACTIVE_LIGHT, mt: -0.5}}>
            ADD
          </Button>
        </VStack>
      ) : null}
    </Box>
  );
};

export default OtherScreen;
