import {useNavigation} from '@react-navigation/native';
import {Box, Icon, Menu} from 'native-base';
import React, {useContext, useState} from 'react';
import {Pressable, NativeModules} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNQRGenerator from 'rn-qr-generator';
import {
  AES_IV,
  AES_KEY,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  ITEM_WIDTH_H2,
} from '../utils/constanta';
import AuthContex from '../route/AuthContext';
import ModalAlert from './ModalAlert';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../redux/Reducer';
var Aes = NativeModules.Aes;

interface Props {
  id: string;
  location: string;
  gardenName: string;
  shared?: boolean;
  version?: string;
  model: string;
}

const StaggerView = ({
  id,
  location,
  gardenName,
  shared,
  version,
  model,
}: Props) => {
  const Nav: any = useNavigation();

  const state = useSelector((state: ReducerRootState) => state);

  const {RemoveDevice} = useContext(AuthContex);
  const [show, setShow] = useState(false);

  const generateQRCode = () => {
    Aes.encrypt(
      `${id}&${gardenName}&${location}&${model}&PMK2022`,
      AES_KEY,
      AES_IV,
      'aes-256-cbc',
    ).then(res => {
      RNQRGenerator.generate({
        value: res,
        height: ITEM_WIDTH_H2 * 0.9,
        width: ITEM_WIDTH_H2 * 0.9,
        fileName: `${id}`,
        base64: true,
        padding: {top: 1, left: 1, bottom: 1, right: 1},
        correctionLevel: 'H',
      })
        .then(response => {
          const {uri, base64} = response;
          // console.log(response);
          Nav.navigate('Shareimage', {
            uri,
            base64,
          });
        })
        .catch(error => console.log('Cannot create QR code', error));
    });
  };

  return (
    <Box>
      <Menu
        right={7}
        trigger={triggerProps => {
          //   console.log(triggerProps);
          return (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Icon
                as={MaterialCommunityIcons}
                _light={{color: FONT_ACTIVE_LIGHT}}
                _dark={{color: FONT_INACTIVE_DARK}}
                name="dots-vertical"
                size={7}
              />
            </Pressable>
          );
        }}>
        <Menu.Item onPress={() => setShow(true)} _text={{fontSize: FONT_SUB}}>
          Delete
        </Menu.Item>
        <Menu.Item
          _text={{fontSize: FONT_SUB}}
          // isDisabled={shared ? false : true}

          onPress={() => {
            Nav.navigate('Firmware', {
              id,
              version,
            });
          }}>
          Update Firmware
        </Menu.Item>
        <Menu.Item
          // isDisabled={shared ? false : true}

          _text={{fontSize: FONT_SUB}}
          onPress={generateQRCode}>
          QR Code
        </Menu.Item>
        <Menu.Item
          _text={{fontSize: FONT_SUB}}
          // isDisabled={shared ? false : true}
        >
          Edit
        </Menu.Item>
      </Menu>
      {/* alert */}
      <ModalAlert
        show={show}
        schema="trash-can"
        title="Delete Device ?"
        message="Are you sure delete this device ?"
        onPress={() => {
          if (shared) {
            RemoveDevice(id);
          } else {
            firestore()
              .collection(
                state.auth.email !== null ? state.auth.email : state.auth.uid,
              )
              .doc(id)
              .delete()
              .then(() => {
                console.log('User deleted!');
              });
          }

          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}
      />
      {/* end alert */}
    </Box>
  );
};

export default StaggerView;
