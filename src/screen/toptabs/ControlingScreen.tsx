import {StackScreenProps} from '@react-navigation/stack';
import {Center, Box, Button, VStack, Text, Icon, Pressable} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import ControlButton from '../../components/ControlButton';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {BG_DARK, BG_LIGHT, PRIMARY_COLOR} from '../../utils/constanta';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const ControlingScreen = ({navigation, route}: Nav) => {
  const [btnone, btnoneSet] = useState(false);
  const [btntwo, btntwoSet] = useState(false);
  const [btnthree, btnthreeSet] = useState(false);
  const [btnfour, btnfourSet] = useState(false);
  const [btnfive, btnfiveSet] = useState(false);
  const [isLoading, isLoadingSet] = useState(true);

  let state: Array<{path: string; status: boolean}> = [];

  for (let i = 0; i < 5; i++) {
    state = [
      ...state,
      {
        path: `btn${i + 1}`,
        status: false,
      },
    ];
  }

  const id: string = route?.params?.id;

  useEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}12345`,
      })
      .then(function (client) {
        client.on('message', function (msg) {
          // console.log('mqtt.event.message', msg);

          if (isLoading) {
            if (msg.topic == `/${id}/data/btnone`) {
              if (msg.data == 'true') {
                btnoneSet(true);
              } else {
                btnoneSet(false);
              }
            } else if (msg.topic == `/${id}/data/btntwo`) {
              if (msg.data == 'true') {
                btntwoSet(true);
              } else {
                btntwoSet(false);
              }
            } else if (msg.topic == `/${id}/data/btnthree`) {
              if (msg.data == 'true') {
                btnthreeSet(true);
              } else {
                btnthreeSet(false);
              }
            } else if (msg.topic == `/${id}/data/btnfour`) {
              if (msg.data == 'true') {
                btnfourSet(true);
              } else {
                btnfourSet(false);
              }
            } else if (msg.topic == `/${id}/data/btnfive`) {
              if (msg.data == 'true') {
                btnfiveSet(true);
              } else {
                btnfiveSet(false);
              }
            }
          }
        });

        client.on('connect', function () {
          client.subscribe(`/${id}/data/btnone`, 0);
          client.subscribe(`/${id}/data/btntwo`, 0);
          client.subscribe(`/${id}/data/btnthree`, 0);
          client.subscribe(`/${id}/data/btnfour`, 0);
          client.subscribe(`/${id}/data/btnfive`, 0);
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });

    return () => isLoadingSet(true);
  }, [navigation]);

  useEffect(() => {
    isLoadingSet(false);

    return () => isLoadingSet(true);
  }, []);

  if (MQTTClient == undefined)
    return (
      <Box
        flex={1}
        width="100%"
        _light={{bg: BG_LIGHT}}
        _dark={{bg: BG_DARK}}
      />
    );

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box
        width={'100%'}
        height="95%"
        px={5}
        mt={12}
        flexDirection="row"
        justifyContent={'space-around'}
        flexWrap="wrap">
        <ControlButton
          key={1}
          onPress={() => {
            // btnoneSet(!btnone);
            btnone == true
              ? MQTTClient.publish(`/${id}/data/btnone`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnone`, 'true', 0, true);
          }}
          name={`Switch 1`}
          condition={btnone}
        />
        <ControlButton
          key={2}
          onPress={() => {
            // btntwoSet(!btntwo);
            btntwo == true
              ? MQTTClient.publish(`/${id}/data/btntwo`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btntwo`, 'true', 0, true);
          }}
          name={`Switch 2`}
          condition={btntwo}
        />
        <ControlButton
          key={3}
          onPress={() => {
            // btnthreeSet(!btnthree);
            btnthree == true
              ? MQTTClient.publish(`/${id}/data/btnthree`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnthree`, 'true', 0, true);
          }}
          name={`Switch 3`}
          condition={btnthree}
        />
        <ControlButton
          key={4}
          onPress={() => {
            // btnfourSet(!btnfour);
            btnfour == true
              ? MQTTClient.publish(`/${id}/data/btnfour`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnfour`, 'true', 0, true);
          }}
          name={`Switch 4`}
          condition={btnfour}
        />
        <ControlButton
          key={5}
          onPress={() => {
            // btnfiveSet(!btnfive);
            btnfive == true
              ? MQTTClient.publish(`/${id}/data/btnfive`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnfive`, 'true', 0, true);
          }}
          name={`Switch 5`}
          condition={btnfive}
        />
      </Box>
      <Box
        flexDir={'row'}
        justifyContent="space-around"
        width={'100%'}
        position="absolute"
        bottom={5}>
        <Pressable
          onPress={() => {
            navigation.navigate('Action', {
              id: id,
            });
          }}
          justifyContent={'center'}
          alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="clock-edit-outline"
            size={10}
            color={PRIMARY_COLOR}
          />
          <Text mt={1}>Action</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('Schedule', {
              id: id,
            });
          }}
          justifyContent={'center'}
          alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="alarm"
            size={10}
            color={PRIMARY_COLOR}
          />
          <Text mt={1}>Schedule</Text>
        </Pressable>
      </Box>
    </Center>
  );
};

export default ControlingScreen;
