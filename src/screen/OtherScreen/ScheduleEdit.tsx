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
import React, {useState} from 'react';
import {
  BG_LIGHT,
  FONT_SUB,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';

type Nav = StackScreenProps<HomeStackParams>;

var splitTime: string = new Date().toLocaleTimeString();
splitTime: [] = splitTime.split(':');

const ScheduleEdit = ({navigation, route}: Nav) => {
  const [show, showSet] = useState<boolean>(false);
  const [time, timeSet] = useState<string>(
    `${splitTime[0]}${splitTime[1]}:${splitTime[3]}${splitTime[4]}`,
  );
  const [btn, btnSet] = useState<string>('btnone');
  const [duration, durationSet] = useState<string>('10');
  const [day, daySet] = useState<string>('mon');
  const [status, statusSet] = useState<boolean>(true);

  const handleConfirm = time => {
    var timesplit = time.toLocaleTimeString();
    timesplit = timesplit.split(':');
    // timesplit = timesplit[4].split(':');

    timeSet(`${timesplit[0]}:${timesplit[1]}`);

    showSet(false);
  };

  return (
    <Box flex={1} justifyContent="center" width="100%" bg={BG_LIGHT} p={5}>
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
          <Text>Time</Text>
          <Text>{time}</Text>
        </HStack>
      </Pressable>

      {/* select button */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text>Button</Text>
        <Select
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

      {/* select duration */}

      <HStack
        py={3}
        alignItems={'center'}
        justifyContent="space-between"
        borderBottomWidth={0.8}
        borderBottomColor="gray.300">
        <Text>Duration</Text>
        <Radio.Group
          defaultValue="10"
          name="myRadioGroup"
          onChange={val => durationSet(val)}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio value="10" colorScheme="green" size="sm" my={1}>
                10 second
              </Radio>
              <Radio value="30" colorScheme="green" size="sm" my={1}>
                30 second
              </Radio>
              <Radio value="60" colorScheme="green" size="sm" my={1}>
                60 second
              </Radio>
            </VStack>
            <VStack>
              <Radio value="2" colorScheme="green" size="sm" my={1}>
                2 minutes
              </Radio>
              <Radio value="5" colorScheme="green" size="sm" my={1}>
                5 minutes
              </Radio>
              <Radio value="600" colorScheme="green" size="sm" my={1}>
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
        <Text>Every</Text>
        <Radio.Group
          defaultValue="mon"
          name="myRadioGroup"
          onChange={val => {
            console.log(val);

            daySet(val);
          }}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio value="mon" colorScheme="green" size="sm" my={1}>
                Monday
              </Radio>
              <Radio value="sun" colorScheme="green" size="sm" my={1}>
                Sunday
              </Radio>
              <Radio value="tue" colorScheme="green" size="sm" my={1}>
                Tuesday
              </Radio>
              <Radio value="wed" colorScheme="green" size="sm" my={1}>
                Wednesday
              </Radio>
            </VStack>
            <VStack>
              <Radio value="thu" colorScheme="green" size="sm" my={1}>
                Thursday
              </Radio>
              <Radio value="fri" colorScheme="green" size="sm" my={1}>
                Friday
              </Radio>
              <Radio value="sat" colorScheme="green" size="sm" my={1}>
                Saturday
              </Radio>
              <Radio value="day" colorScheme="green" size="sm" my={1}>
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
        <Text>Enable</Text>
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
          firestore()
            .collection('Users')
            .add({
              name: 'Ada Lovelace',
              age: 30,
            })
            .then(() => {
              console.log('User added!');
            });
        }}
        _text={{
          color: 'black',
          letterSpacing: 3,
          fontWeight: 'medium',
          //   fontSize: FONT_SUB,
        }}>
        save
      </Button>

      {/* time picker */}
      <DateTimePickerModal
        isVisible={show}
        date={new Date()}
        // timeZoneOffsetInMinutes={0}
        mode="time"
        onConfirm={time => {
          handleConfirm(time);
        }}
        onCancel={() => {
          showSet(false);
        }}
      />
    </Box>
  );
};

export default ScheduleEdit;
