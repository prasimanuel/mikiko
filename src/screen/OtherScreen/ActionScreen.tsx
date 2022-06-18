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
import React, {useState} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<HomeStackParams>;

const ActionScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  const id: string = route?.params?.id;

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      {/* <FlatList
        data={state.schedule}
        renderItem={({item}) => {
          return (
            <Pressable onPress={() => {}}>
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
            </Pressable>
          );
        }}
      /> */}
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
