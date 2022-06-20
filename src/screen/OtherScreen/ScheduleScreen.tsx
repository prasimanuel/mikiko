import {
  Box,
  Button,
  Fab,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<HomeStackParams>;

type scheduleListDetail = {
  btn: string;
  duration: number;
  every: number;
  id: string;
  status: boolean;
  time: string;
};

const ScheduleScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  const id: string = route?.params?.id;

  const [scheduleList, scheduleListSet] = useState<Array<scheduleListDetail>>();

  useEffect(() => {
    firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .doc(id)
      .get()
      .then(res => {
        // console.log('res data ===== ', res?.data()?.schedule);
        if (res.exists) {
          scheduleListSet(res?.data()?.schedule);
        }
      });
  }, [navigation]);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      <FlatList
        data={scheduleList}
        renderItem={({item, index}) => {
          return (
            // <Pressable
            //   onPress={() => {
            //     navigation.navigate('Scheduledetail', {
            //       id: id,
            //       mode: 'edit',
            //       btn: item.btn,
            //       duration: item.duration,
            //       time: item.time,
            //       day: item.every,
            //       status: item.status,
            //     });
            //   }}>
            <HStack
              justifyContent={'space-between'}
              borderBottomWidth={0.8}
              alignItems="center"
              //   height={TAB_BAR_HEIGHT}
              borderBottomColor="gray.300">
              <VStack>
                <Text>{item.time}</Text>
                <Text>
                  {item.duration}
                  {' Minutes'}
                </Text>
              </VStack>
              <Switch value={item.status} />
            </HStack>
            // </Pressable>
          );
        }}
      />

      {/* <Button
        onPress={() => {
          const neww = scheduleList?.filter(res => {
            return res.id != '0.9346302520850872';
          });
          console.log('new = ', neww);
        }}>
        delete
      </Button> */}

      <Button
        onPress={() => {
          scheduleList?.filter(res => {
            console.log('print new list = ', res);
          });
        }}>
        delete
      </Button>
      <Button
        onPress={() => {
          const neww = scheduleList?.map(res => {
            if (res.id != '0.9346302520850872') {
              return {...res, duration: 5};
            }
            return res;
          });
          console.log('new = ', neww);
        }}>
        edit
      </Button>
      <Fab
        renderInPortal={false}
        shadow={2}
        bg={PRIMARY_COLOR}
        onPress={() => {
          navigation.navigate('Scheduledetail', {
            id: id,
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

export default ScheduleScreen;
