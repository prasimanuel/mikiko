import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Pressable,
  Radio,
  Select,
  Switch,
  Text,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../utils/constanta';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import AuthContex, {SchedulParams} from '../../route/AuthContext';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<HomeStackParams>;

var splitTime: string = new Date().toLocaleTimeString();
splitTime: [] = splitTime.split(':');

var MQTTClient: IMqttClient;

var channel1: Array<any> = [];
var channel2: Array<any> = [];
var channel3: Array<any> = [];
var channel4: Array<any> = [];
var channel5: Array<any> = [];

const ScheduleDetail = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const {Schedule} = useContext(AuthContex);
  const [show, showSet] = useState<boolean>(false);
  const [time, timeSet] = useState<string>(
    `${splitTime[0]}${splitTime[1]}:${splitTime[3]}${splitTime[4]}`,
  );
  const [btn, btnSet] = useState<string>('btnone');
  const [duration, durationSet] = useState<string>('1');
  const [day, daySet] = useState<string>('mon');
  const [status, statusSet] = useState<boolean>(true);

  const id: string = route?.params?.id;
  const mode: string = route?.params?.mode;
  const _id: string = route?.params?._id;
  const _time: string = route?.params?._time;
  const _btn: string = route?.params?._btn;
  const _duration: string = route?.params?._duration;
  const _day: string = route?.params?._day;
  const _status: boolean = route?.params?._status;

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}schedule`,
      })
      .then(function (client) {
        client.on('message', function (msg) {
          if (msg.topic == `/${id}/time/btnone`) {
            channel1 = JSON.parse(msg.data);
          } else if (msg.topic == `/${id}/time/btntwo`) {
            channel2 = JSON.parse(msg.data);
          } else if (msg.topic == `/${id}/time/btnthree`) {
            channel3 = JSON.parse(msg.data);
          } else if (msg.topic == `/${id}/time/btnfour`) {
            channel4 = JSON.parse(msg.data);
          } else if (msg.topic == `/${id}/time/btnfive`) {
            channel5 = JSON.parse(msg.data);
          }
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(`/${id}/time/btnone`, 0);
          client.subscribe(`/${id}/time/btntwo`, 0);
          client.subscribe(`/${id}/time/btnthree`, 0);
          client.subscribe(`/${id}/time/btnfour`, 0);
          client.subscribe(`/${id}/time/btnfive`, 0);
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (mode == 'edit') {
      timeSet(_time);
      durationSet(_duration);
      daySet(_day);
      statusSet(_status);
      btnSet(_btn);
    }
  }, []);

  const handleConfirm = time => {
    showSet(false);
    var timesplit = time.toLocaleTimeString();
    timesplit = timesplit.split('.');
    // timesplit = timesplit[4].split(':');

    timeSet(`${timesplit[0]}:${timesplit[1]}`);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      <Pressable
        onPress={() => {
          showSet(true);
        }}>
        <HStack
          py={3}
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          borderBottomColor="gray.300">
          <Text
            _light={{color: FONT_INACTIVE_LIGHT}}
            _dark={{color: FONT_INACTIVE_DARK}}>
            Time
          </Text>
          <Text
            _light={{color: FONT_INACTIVE_LIGHT}}
            _dark={{color: FONT_INACTIVE_DARK}}>
            {time}
          </Text>
        </HStack>
      </Pressable>

      {/* select button */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Button
        </Text>
        <Select
          isDisabled={mode == 'edit' ? true : false}
          selectedValue={btn}
          minWidth="200"
          accessibilityLabel="Choose Button"
          placeholder="Choose Button"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={val => btnSet(val)}>
          <Select.Item label="Switch 1" value="btnone" />
          <Select.Item label="Switch 2" value="btntwo" />
          <Select.Item label="Switch 3" value="btnthree" />
          <Select.Item label="Switch 4" value="btnfour" />
          <Select.Item label="Switch 5" value="btnfive" />
        </Select>
      </HStack>

      {/* radio btn duration */}

      <HStack
        py={3}
        alignItems={'center'}
        justifyContent="space-between"
        borderBottomWidth={0.8}
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Duration
        </Text>
        <Radio.Group
          defaultValue="1"
          name="myRadioGroup"
          onChange={val => durationSet(val)}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio
                value="1"
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                1 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="2"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                2 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="3"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                3 minutes
              </Radio>
            </VStack>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="5"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                5 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="7"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                7 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="10"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                10 minutes
              </Radio>
            </VStack>
          </HStack>
        </Radio.Group>
      </HStack>

      {/* select day */}

      <HStack
        py={3}
        alignItems={'center'}
        justifyContent="space-between"
        borderBottomWidth={0.8}
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Every
        </Text>
        <Radio.Group
          defaultValue="mon"
          name="myRadioGroup"
          onChange={val => {
            daySet(val);
          }}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="mon"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Monday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="sun"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Sunday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="tue"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Tuesday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="wed"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Wednesday
              </Radio>
            </VStack>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="thu"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Thursday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="fri"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Friday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="sat"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Saturday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="day"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Everyday
              </Radio>
            </VStack>
          </HStack>
        </Radio.Group>
      </HStack>

      {/* status */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Enable
        </Text>
        <Switch
          isChecked={status}
          onChange={() => statusSet(!status)}
          onThumbColor={PRIMARY_COLOR}
          onTrackColor={SECONDARY_COLOR}
        />
      </HStack>

      {/* button save */}

      <Button
        mt={ITEM_HEIGHT_H3}
        bg={PRIMARY_COLOR}
        onPress={() => {
          if (mode == 'edit') {
            const newDevice = state.schedule.filter(res => {
              return res.id == _id;
            });
          } else {
            var newSchedule: SchedulParams = {
              btn: btn,
              duration: duration,
              every: day,
              status: status,
              id: Math.random().toString(),
              time,
            };

            Schedule(newSchedule);

            if (btn == 'btnone') {
              try {
                channel1 = [...channel1, newSchedule];
              } catch (e) {
                console.log(e);
              }
              MQTTClient.publish(
                `/${id}/schedule/btnone`,
                JSON.stringify(channel1),
                0,
                true,
              );
            } else if (btn == 'btntwo') {
              try {
                channel2 = [...channel2, newSchedule];
              } catch (e) {
                console.log(e);
              }
              MQTTClient.publish(
                `/${id}/schedule/btntwo`,
                JSON.stringify(channel2),
                0,
                true,
              );
            } else if (btn == 'btnthree') {
              try {
                channel3 = [...channel3, newSchedule];
              } catch (e) {
                console.log(e);
              }
              MQTTClient.publish(
                `/${id}/schedule/btnthree`,
                JSON.stringify(channel3),
                0,
                true,
              );
            } else if (btn == 'btnfour') {
              try {
                channel4 = [...channel4, newSchedule];
              } catch (e) {
                console.log(e);
              }
              MQTTClient.publish(
                `/${id}/schedule/btnfour`,
                JSON.stringify(channel4),
                0,
                true,
              );
            } else if (btn == 'btnfive') {
              try {
                channel5 = [...channel5, newSchedule];
              } catch (e) {
                console.log(e);
              }
              MQTTClient.publish(
                `/${id}/schedule/btnfive`,
                JSON.stringify(channel5),
                0,
                true,
              );
            }
          }

          navigation.goBack();
        }}
        _text={{
          color: 'black',
          letterSpacing: 3,
          fontWeight: 'medium',
          //   fontSize: FONT_SUB,
        }}>
        save
      </Button>

      {/* schedule picker */}
      <DateTimePickerModal
        isVisible={show}
        date={new Date()}
        // timeZoneOffsetInMinutes={0}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => {
          showSet(false);
        }}
      />
    </Box>
  );
};

export default ScheduleDetail;
