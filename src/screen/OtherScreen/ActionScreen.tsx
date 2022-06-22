import {
  Box,
  Fab,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {BG_DARK, BG_LIGHT, PRIMARY_COLOR} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {ActionsParams} from '../../route/AuthContext';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';

type Nav = StackScreenProps<HomeStackParams>;
var MQTTClient: IMqttClient;

const ActionScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  const id: string = route?.params?.id;

  const [actionList, actionListSet] = useState<Array<ActionsParams>>();

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}actions`,
      })
      .then(function (client) {
        client.on('message', function (msg) {});

        client.on('connect', function () {
          console.log('connected');
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .doc(id)
      .get()
      .then(res => {
        if (res.exists) {
          actionListSet(res?.data()?.actions);
        }
      });
  }, [navigation, route]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newActions = actionList?.filter(res => {
      return res.id != rowKey;
    });

    actionListSet(newActions);

    firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .doc(id)
      .update({
        actions: newActions,
      })
      .then(() => {
        MQTTClient.publish(`/${id}/data/actions`, 'true', 0, false);
      });
  };

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      {/* <FlatList
        data={actionList}
        renderItem={({item}) => {
          return (
            <HStack
              justifyContent={'space-between'}
              borderBottomWidth={0.8}
              alignItems="center"
              pb={2}
              borderBottomColor="gray.300">
              <VStack space={2}>
                <HStack space={2}>
                  <Text>
                    {item.if == 'temp'
                      ? 'Temperature'
                      : item.if == 'humi'
                      ? 'Humidity'
                      : item.if == 'soil'
                      ? 'Soil Moisture'
                      : 'PH'}
                  </Text>
                  <Text>
                    {item.con == '>=' ? 'greater than' : 'lower than'}
                  </Text>
                  <Text>{item.value}</Text>
                </HStack>
                <HStack space={1}>
                  <Text>
                    {item.output == 'out1'
                      ? 'Switch 1'
                      : item.output == 'out2'
                      ? 'Switch 2'
                      : item.output == 'out3'
                      ? 'Switch3'
                      : item.output == 'out4'
                      ? 'Switch 4'
                      : 'Switch 5'}
                  </Text>
                  <Text>{item.state == true ? 'ON' : 'OFF'}</Text>
                </HStack>
              </VStack>
              <Switch
                onChange={() => {
                  const newStatus = actionList?.map(res => {
                    if (res.id == item.id) {
                      return {...res, status: !res.status};
                    }

                    return res;
                  });

                  actionListSet(newStatus);

                  firestore()
                    .collection(
                      state.auth.email !== null
                        ? state.auth.email
                        : state.auth.uid,
                    )
                    .doc(id)
                    .update({
                      actions: newStatus,
                    })
                    .then(() => {
                      const myTimeOut = setTimeout(() => {
                        MQTTClient.publish(
                          `/${id}/data/actions`,
                          'true',
                          0,
                          false,
                        );
                      }, 2000);

                      clearTimeout(myTimeOut);
                    });
                }}
                value={item.status == true ? true : false}
              />
            </HStack>
          );
        }}
      /> */}
      <SwipeListView
        data={actionList}
        renderItem={(data, rowMap) => {
          return (
            <HStack
              justifyContent={'space-between'}
              borderBottomWidth={0.8}
              _dark={{bg: BG_DARK}}
              alignItems="center"
              pb={2}
              borderBottomColor="gray.300">
              <VStack space={2}>
                <HStack space={2}>
                  <Text>
                    {data.item.if == 'temp'
                      ? 'Temperature'
                      : data.item.if == 'humi'
                      ? 'Humidity'
                      : data.item.if == 'soil'
                      ? 'Soil Moisture'
                      : 'PH'}
                  </Text>
                  <Text>
                    {data.item.con == '>=' ? 'greater than' : 'lower than'}
                  </Text>
                  <Text>{data.item.value}</Text>
                </HStack>
                <HStack space={1}>
                  <Text>
                    {data.item.output == 'out1'
                      ? 'Switch 1'
                      : data.item.output == 'out2'
                      ? 'Switch 2'
                      : data.item.output == 'out3'
                      ? 'Switch3'
                      : data.item.output == 'out4'
                      ? 'Switch 4'
                      : 'Switch 5'}
                  </Text>
                  <Text>{data.item.state == true ? 'ON' : 'OFF'}</Text>
                </HStack>
              </VStack>
              <Switch
                onChange={() => {
                  const newActions = actionList?.map(res => {
                    if (res.id == data.item.id) {
                      return {...res, status: !res.status};
                    }
                    return res;
                  });

                  actionListSet(newActions);

                  firestore()
                    .collection(
                      state.auth.email !== null
                        ? state.auth.email
                        : state.auth.uid,
                    )
                    .doc(id)
                    .update({
                      actions: newActions,
                    })
                    .then(() => {
                      MQTTClient.publish(
                        `/${id}/data/actions`,
                        'true',
                        0,
                        true,
                      );
                    });
                }}
                value={data.item.status == true ? true : false}
              />
            </HStack>
          );
        }}
        renderHiddenItem={(data, rowMap) => (
          <Box
            alignItems={'center'}
            flex={1}
            flexDirection={'row'}
            pl={15}
            justifyContent="flex-end">
            <Box
              w={12}
              h="100%"
              alignItems={'center'}
              justifyContent="center"
              bg={'gray.600'}>
              <Icon
                as={MaterialCommunityIcons}
                name="cog"
                size={7}
                color="gray.200"
              />
            </Box>
            <Box
              w={12}
              h="100%"
              alignItems={'center'}
              justifyContent="center"
              bg={'red.500'}>
              <Icon
                size={7}
                color="gray.200"
                as={MaterialCommunityIcons}
                name="delete"
                onPress={() => {
                  deleteRow(rowMap, data.item.id);
                }}
              />
            </Box>
          </Box>
        )}
        disableRightSwipe={true}
        leftOpenValue={75}
        rightOpenValue={-100}
      />
      <Fab
        renderInPortal={false}
        shadow={2}
        bg={PRIMARY_COLOR}
        onPress={() => {
          navigation.navigate('Actiondetail', {
            id: id,
            mode: 'add',
            model: 'MTH5CH',
          });
        }}
        size="sm"
        icon={
          <Icon
            color="white"
            as={MaterialCommunityIcons}
            name="plus"
            size="sm"
          />
        }
      />
    </Box>
  );
};

export default ActionScreen;
