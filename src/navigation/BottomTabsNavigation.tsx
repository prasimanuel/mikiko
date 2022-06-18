import React, {useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import {Box, Icon, Image, Text, VStack} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from './HomeStackNavigation';
import {
  BG_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import PairingNavigation from './PairingNavigation';
import Carousel from 'react-native-snap-carousel';
import {dummyData} from '../assets/Dataimage/Data';
import {Dimensions, LogBox} from 'react-native';
import SceneTopTabNavigator from './SceneTopTabNavigator';

export type BottomTabsParams = {
  Home;
  Pairing;
  Profile;
};

const Tab = createBottomTabNavigator<BottomTabsParams>();

type navBar = StackScreenProps<HomeStackParams>;

function MyTabBar({state, descriptors, navigation}) {
  return (
    <Box
      flexDir={'row'}
      width="100%"
      justifyContent={'space-around'}
      alignItems="center"
      height={TAB_BAR_HEIGHT}
      bg={PRIMARY_COLOR}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        var label: string;
        var destination: string;

        // console.log(route.name);

        if (route.name == 'Home') {
          label = 'home-edit-outline';
          destination = 'Home';
        } else if (route.name == 'Pairing') {
          label = 'plus-box';
          destination = 'Pairingbase';
        } else {
          label = 'account-circle-outline';
          destination = 'Profilebase';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(destination);
        };

        return (
          <Box key={index}>
            <Icon
              onPress={onPress}
              as={MaterialCommunityIcons}
              name={label}
              size={options.title == 'Pairing' ? 'lg' : 6}
              color={'gray.200'}
            />
          </Box>
        );
      })}
    </Box>
  );
}

const BottomTabsNavigator = ({navigation}: navBar) => {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={SceneTopTabNavigator}
        options={{
          header: () => (
            <Carousel
              data={dummyData}
              autoplay
              loop
              autoplayDelay={5000}
              renderItem={({item, index}) => {
                return (
                  // <Box
                  //   width={Dimensions.get('screen').width}
                  //   height={ITEM_HEIGHT_H3 * 0.9}
                  //   maxHeight={ITEM_HEIGHT_H3 * 0.9}>
                  <Image
                    source={item.url}
                    alt="kampret"
                    width={Dimensions.get('screen').width}
                    height={ITEM_HEIGHT_H3 * 0.9}
                    maxHeight={ITEM_HEIGHT_H3 * 0.9}
                  />
                  //   <VStack
                  //     position={'absolute'}
                  //     left={5}
                  //     bottom={5}
                  //     // zIndex={10}
                  //   >
                  //     <Text fontSize={FONT_TITLE} mb={3} color={BG_LIGHT}>
                  //       {item.title}
                  //     </Text>
                  //     <Text
                  //       fontSize={FONT_SUB}
                  //       maxWidth={Dimensions.get('screen').width - 40}
                  //       color={BG_LIGHT}>
                  //       {item.description}
                  //     </Text>
                  //   </VStack>
                  //   <Box
                  //     width={Dimensions.get('screen').width}
                  //     height={ITEM_HEIGHT_H3}
                  //     bg={'#0808084D'}
                  //     position="absolute"
                  //     top={0}
                  //     zIndex={1}
                  //   />
                  // </Box>
                );
              }}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={Dimensions.get('screen').width}
            />
          ),
          headerStyle: {
            height: ITEM_HEIGHT_H3 * 0.85,
          },
        }}
      />
      <Tab.Screen
        name="Pairing"
        component={PairingNavigation}
        options={
          {
            // tabBarIcon: ({color, focused}) => (
            //   <Icon
            //     as={MaterialCommunityIcons}
            //     name="plus-box"
            //     color={'gray.200'}
            //     size={'lg'}
            //     onPress={() => {
            //       navigation.navigate('Pairingbase');
            //     }}
            //   />
            // ),
          }
        }
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={
          {
            // tabBarIcon: ({color, focused}) => (
            //   <Icon
            //     as={MaterialCommunityIcons}
            //     name="account-circle-outline"
            //     size={6}
            //     color={'gray.200'}
            //     onPress={() => {
            //       navigation.navigate('Profilebase');
            //     }}
            //   />
            // ),
          }
        }
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
