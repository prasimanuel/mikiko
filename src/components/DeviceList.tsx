import {
  Box,
  HStack,
  Icon as NativeIcon,
  Switch,
  Text,
  VStack,
  Pressable,
  Skeleton,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Vibration} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import StaggerView from './Stager';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import {useNavigation} from '@react-navigation/native';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  DISABLE_COLOR,
  FONT_HEADING,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../utils/constanta';
import SplashScreen from 'react-native-splash-screen';
import AndroidToast from '../utils/AndroidToast';
import PushNotification, {Importance} from 'react-native-push-notification';

interface Props {
  gardenName: string;
  location: string;
  id: string;
  shared?: boolean;
}

var MQTTClient : IMqttClient;

// type nav = StackScreenProps<HomeStackParams>;

const DeviceList = ({gardenName, location, id, shared}: Props) => {
  const navigation = useNavigation<any>();

  const [isLoading, isLoadingSet] = useState(true);
  const [isConnected, isConnectedSet] = useState('true');
  const [weather, weatherSet] = useState('false');
  const [channel1, channel1Set] = useState('false');
  const [channel2, channel2Set] = useState('false');
  const [channel3, channel3Set] = useState('false');
  const [channel4, channel4Set] = useState('false');
  const [channel5, channel5Set] = useState('false');
  const [firmwareVersion, firmwareVersionSet] = useState('');

  const sendNotification = (channel, title, body) => {
    PushNotification.localNotification({
      channelId: channel,
      title: title,
      message: body,
      soundName: 'my_sound.mp3',
    });
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      isLoadingSet(true);
    });

    MQTT.createClient({
      uri: 'mqtt://broker.hivemq.com:1883',
      clientId: `${id}qwert`,
    })
      .then(function (client) {
        client.on('message', function (msg) {
          // console.log('mqtt.event.message', msg);
          if (msg.topic == `/${id}/data/weather`) {
            if (msg.data == 'true') {
              sendNotification(
                '1',
                `${gardenName} Turun hujan`,
                'Amati kebun anda',
              );
            }
            weatherSet(msg.data);
          } else if (msg.topic == `${id}`) {
            isConnectedSet(msg.data);
          }

          if (isLoading) {
            if (msg.topic == `/${id}/data/btnone`) {
              channel1Set(msg.data);
            } else if (msg.topic == `/${id}/data/btntwo`) {
              channel2Set(msg.data);
            } else if (msg.topic == `/${id}/data/btnthree`) {
              channel3Set(msg.data);
            } else if (msg.topic == `/${id}/data/btnfour`) {
              channel4Set(msg.data);
            } else if (msg.topic == `/${id}/data/btnfive`) {
              channel5Set(msg.data);
            } else if (msg.topic == `/${id}/data/firmwareversion`) {
              firmwareVersionSet(msg.data);
            }
          }
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(`/${id}/data/btnone`, 0);
          client.subscribe(`/${id}/data/btntwo`, 0);
          client.subscribe(`/${id}/data/btnthree`, 0);
          client.subscribe(`/${id}/data/btnfour`, 0);
          client.subscribe(`/${id}/data/btnfive`, 0);
          client.subscribe(`/${id}/data/weather`, 0);
          client.subscribe(`${id}`, 0);
          client.subscribe(`/${id}/data/firmwareversion`, 0);
          MQTTClient = client;
          SplashScreen.hide();
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [navigation]);

  useEffect(() => {
    isLoadingSet(false);

    return () => isLoadingSet(false);
  }, []);

  if (!MQTTClient) {
    return (
      <Box
        width="full"
        _light={{bg: BG_LIGHT}}
        _dark={{bg: BG_DARK}}
        h={ITEM_HEIGHT_H3 * 0.95}
        p={3}
        mt={3}
        borderWidth={1}
        borderColor={DISABLE_COLOR}
        rounded="xl">
        <HStack mt={3}>
          <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
          <Skeleton
            ml={3}
            h="5"
            w={'5'}
            rounded="full"
            startColor="coolGray.300"
          />
        </HStack>
        <Skeleton mt={3} h="3" w={'78%'} rounded="full" startColor="red.300" />
        <HStack mt={3} justifyContent="space-between">
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      width="full"
      mt={3}
      _light={{bg: BG_LIGHT, borderColor: DISABLE_COLOR}}
      _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
      h={ITEM_HEIGHT_H3 * 0.95}
      p={3}
      borderWidth={1}
      borderColor={DISABLE_COLOR}
      rounded="xl">
      <VStack>
        <Pressable
          onPress={() => {
            navigation.navigate('Toptabsbase', {id: id, weather: weather});
          }}>
          {/* garden name */}

          <HStack alignItems={'center'} justifyContent="space-between">
            <Text
              fontSize={FONT_HEADING}
              bold
              color={isConnected == 'true' ? PRIMARY_COLOR : DISABLE_COLOR}
              style={{textTransform: 'capitalize'}}>
              {gardenName}{' '}
              <Icon name={weather == 'true' ? 'cloud-rain' : 'sun'} size={18} />
            </Text>
            {!shared ? (
              <StaggerView
                id={id}
                gardenName={gardenName}
                location={location}
                shared={shared}
                version={firmwareVersion}
              />
            ) : null}
          </HStack>

          {/* connection */}

          <Text
            italic
            fontSize={FONT_SUB}
            _dark={{
              color:
                isConnected == 'false' ? FONT_INACTIVE_DARK : PRIMARY_COLOR,
            }}
            _light={{color: isConnected == 'false' ? DISABLE_COLOR : 'black'}}>
            {isConnected == 'true' ? 'online' : 'offline'}
          </Text>

          {/* location */}

          <HStack mt={2}>
            <NativeIcon
              as={MaterialCommunityIcons}
              name="map-marker"
              size={5}
              color={isConnected == 'true' ? 'red.400' : DISABLE_COLOR}
            />
            <Text
              noOfLines={1}
              fontSize={FONT_SUB}
              _dark={{
                color:
                  isConnected == 'false' ? FONT_INACTIVE_DARK : PRIMARY_COLOR,
              }}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              style={{textTransform: 'capitalize'}}>
              {location}
            </Text>
          </HStack>
        </Pressable>

        {/* switch */}

        <HStack mt={1} justifyContent="space-between">
          <VStack>
            <Switch
              isDisabled={isConnected == 'true' ? false : true}
              isChecked={channel1 == 'true' ? true : false}
              onThumbColor={PRIMARY_COLOR}
              onTrackColor={SECONDARY_COLOR}
              _dark={{offThumbColor: FONT_INACTIVE_DARK}}
              onChange={() => {
                if (isConnected == 'true') {
                  Vibration.vibrate(500);
                  channel1 == 'true'
                    ? channel1Set('false')
                    : channel1Set('true');
                  channel1 == 'true'
                    ? MQTTClient.publish(`/${id}/data/btnone`, 'false', 0, true)
                    : MQTTClient.publish(`/${id}/data/btnone`, 'true', 0, true);
                } else {
                  AndroidToast.toast('device disconnected');
                }
              }}
            />
            <Text
              fontSize={FONT_SUB}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              _dark={{
                color:
                  isConnected == 'true' ? FONT_INACTIVE_DARK : DISABLE_COLOR,
              }}>
              switch1
            </Text>
          </VStack>
          <VStack>
            <Switch
              isDisabled={isConnected == 'true' ? false : true}
              isChecked={channel2 == 'true' ? true : false}
              onThumbColor={PRIMARY_COLOR}
              onTrackColor={SECONDARY_COLOR}
              _dark={{offThumbColor: FONT_INACTIVE_DARK}}
              onChange={() => {
                Vibration.vibrate(500);
                channel2 == 'true' ? channel2Set('false') : channel2Set('true');
                channel2 == 'true'
                  ? MQTTClient.publish(`/${id}/data/btntwo`, 'false', 0, true)
                  : MQTTClient.publish(`/${id}/data/btntwo`, 'true', 0, true);
              }}
            />
            <Text
              fontSize={FONT_SUB}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              _dark={{
                color:
                  isConnected == 'true' ? FONT_INACTIVE_DARK : DISABLE_COLOR,
              }}>
              switch2
            </Text>
          </VStack>
          <VStack>
            <Switch
              isDisabled={isConnected == 'true' ? false : true}
              isChecked={channel3 == 'true' ? true : false}
              onThumbColor={PRIMARY_COLOR}
              onTrackColor={SECONDARY_COLOR}
              _dark={{offThumbColor: FONT_INACTIVE_DARK}}
              onChange={() => {
                Vibration.vibrate(500);
                channel3 == 'true' ? channel3Set('false') : channel3Set('true');
                channel3 == 'true'
                  ? MQTTClient.publish(`/${id}/data/btnthree`, 'false', 0, true)
                  : MQTTClient.publish(`/${id}/data/btnthree`, 'true', 0, true);
              }}
            />
            <Text
              fontSize={FONT_SUB}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              _dark={{
                color:
                  isConnected == 'true' ? FONT_INACTIVE_DARK : DISABLE_COLOR,
              }}>
              switch3
            </Text>
          </VStack>
          <VStack>
            <Switch
              isDisabled={isConnected == 'true' ? false : true}
              isChecked={channel4 == 'true' ? true : false}
              onThumbColor={PRIMARY_COLOR}
              onTrackColor={SECONDARY_COLOR}
              _dark={{offThumbColor: FONT_INACTIVE_DARK}}
              onChange={() => {
                Vibration.vibrate(500);
                channel4 == 'true' ? channel4Set('false') : channel4Set('true');
                channel4 == 'true'
                  ? MQTTClient.publish(`/${id}/data/btnfour`, 'false', 0, true)
                  : MQTTClient.publish(`/${id}/data/btnfour`, 'true', 0, true);
              }}
            />
            <Text
              fontSize={FONT_SUB}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              _dark={{
                color:
                  isConnected == 'true' ? FONT_INACTIVE_DARK : DISABLE_COLOR,
              }}>
              switch4
            </Text>
          </VStack>
          <VStack>
            <Switch
              isDisabled={isConnected == 'true' ? false : true}
              isChecked={channel5 == 'true' ? true : false}
              onThumbColor={PRIMARY_COLOR}
              onTrackColor={SECONDARY_COLOR}
              _dark={{offThumbColor: FONT_INACTIVE_DARK}}
              onChange={() => {
                Vibration.vibrate(500);
                channel5 == 'true' ? channel5Set('false') : channel5Set('true');
                channel5 == 'true'
                  ? MQTTClient.publish(`/${id}/data/btnfive`, 'false', 0, true)
                  : MQTTClient.publish(`/${id}/data/btnfive`, 'true', 0, true);
              }}
            />
            <Text
              fontSize={FONT_SUB}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              _dark={{
                color:
                  isConnected == 'true' ? FONT_INACTIVE_DARK : DISABLE_COLOR,
              }}>
              switch5
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DeviceList;
