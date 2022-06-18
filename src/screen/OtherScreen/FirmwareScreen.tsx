import {Box, HStack, Icon, Pressable, Text} from 'native-base';
import React, {useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TAB_BAR_HEIGHT} from '../../utils/constanta';
import storage from '@react-native-firebase/storage';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import ModalAlert from '../../components/ModalAlert';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const FirmwareScreen = ({route, navigation}: Nav) => {
  const [versionUpdate, versionUpdateSet] = useState<boolean>(false);
  const [targetVersion, targetVersionSet] = useState<string>('');
  const [versionURL, versionURLSet] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  // const [firmwareVersion, firmwareVersionSet] = useState<string>('');

  const id = route?.params?.id;

  console.log(id);

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}update`,
      })
      .then(function (client) {
        client.on('closed', function () {
          // console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          // console.log('mqtt.event.error', msg);
        });

        client.on('message', function (msg) {
          // console.log('mqtt.event.message', msg);
          // if (msg.topic == `/${id}/data/firmwareversion`) {
          //   firmwareVersionSet(msg.data);
          // }
        });

        client.on('connect', function () {
          // client.subscribe(`/${id}/data/firmwareversion`, 0);
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  useLayoutEffect(() => {
    const reference = storage().ref('/esp8266/');
    reference.listAll().then(res => {
      if (res.items[0].name !== route.params?.version) {
        versionUpdateSet(true);
        targetVersionSet(res.items[0].name.toString());
        storage()
          .ref('/esp8266/esp8266.bin')
          .getDownloadURL()
          .then(res => {
            versionURLSet(res);
          });
      }
    });
  }, []);

  // if (MQTTClient == undefined) return <></>;

  return (
    <Box flex={1} width="100%" px={5}>
      <HStack
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        height={TAB_BAR_HEIGHT}
        borderBottomColor="gray.300">
        <Text>Version</Text>
        <Text>{route.params?.version}</Text>
      </HStack>
      {/* manual */}

      <Pressable
        onPress={() => {
          // navigation.navigate('Manual');
        }}>
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <Text>Manual Update</Text>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>
      </Pressable>

      {/* otomatis */}
      <Pressable
        onPress={() => {
          targetVersion
            ? setShow(true)
            : AndroidToast.toast('Already in lastest version');
        }}>
        <HStack
          justifyContent={'space-between'}
          alignItems="center"
          borderBottomWidth={0.8}
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <Text>Check Update</Text>
          <HStack>
            {targetVersion ? (
              <Box
                justifyContent={'center'}
                alignItems="center"
                bg={'red.600'}
                h={5}
                w={5}
                rounded="full">
                <Text>1</Text>
              </Box>
            ) : null}
            <Icon as={MaterialCommunityIcons} name="chevron-right" />
          </HStack>
        </HStack>
      </Pressable>

      <ModalAlert
        show={show}
        title="Update Firmware"
        message={`upgrade from version ${route.params?.version} to ${targetVersion}`}
        onPress={() => {
          MQTTClient.publish(`/${id}/data/update`, versionURL, 0, false);
          setShow(false);
          // navigation.navigate('Wifi');
        }}
        onCancel={() => {
          setShow(false);
        }}
        schema="check"
        variant="error"
      />
    </Box>
  );
};

export default FirmwareScreen;
