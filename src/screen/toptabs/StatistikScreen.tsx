import {Text, Center, Box, ScrollView, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import LineChartComponent from '../../components/LineChartComponent';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import XLSX from 'xlsx';
import AndroidToast from '../../utils/AndroidToast';
import {PermissionsAndroid} from 'react-native';
var RNFS = require('react-native-fs');

type dataProps = {
  hum: number;
  soil: number;
  temp: number;
  ph: number;
  time: string;
};

const StatistikScreen = ({route}) => {
  const [humi, setHumi] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [temp, setTemp] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [ph, setPh] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [soil, setSoil] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [time, timeSet] = useState<Array<string>>([
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
  ]);
  const [datalog, datalogSet] = useState<any>();
  const [granted, grantedSet] = useState<string>('');

  const requestPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    ).then(res => {
      console.log(res);

      // if (res == 'granted') {
      //   runningSet(true);
      // }
    });
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    database()
      .ref(`${route?.params?.id}/Sensor`)
      .limitToLast(8)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        if (snapshot.val() != null) {
          const data = snapshot.val();
          var dataArray: Array<dataProps> = [];
          for (let id in data) {
            dataArray.push(data[id]);
          }

          var humiArray: Array<number> = [];
          var tempArray: Array<number> = [];
          var soilArray: Array<number> = [];
          var phArray: Array<number> = [];
          var timeArray: Array<string> = [];
          var datalogging: Array<any> = [];

          for (let id in dataArray) {
            humiArray.push(dataArray[id]?.hum);
            tempArray.push(dataArray[id].temp);
            soilArray.push(dataArray[id].soil);
            phArray.push(dataArray[id].ph);
            timeArray.push(dataArray[id].time);
            datalogging.push(dataArray[id]);
          }

          datalogSet(datalogging);
          setHumi(humiArray);
          setTemp(tempArray);
          setSoil(soilArray);
          setPh(phArray);
          timeSet(timeArray);
        }
      });
  }, []);

  const exportDataToExcel = async () => {
    var ws = XLSX.utils.json_to_sheet(datalog);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: 'xlsx',
    });

    RNFS.writeFile(
      RNFS.DownloadDirectoryPath + '/mikiko_file.xlsx',
      wbout,
      'ascii',
    )
      .then(r => {
        console.log('Success', RNFS.DownloadDirectoryPath);
        AndroidToast.toast('Done Downloading');
      })
      .catch(e => {
        console.log('Error', e);
      });
  };

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box
        width={'100%'}
        px={5}
        py={2}
        flexWrap="wrap"
        flexDirection={'row'}
        justifyContent="center"
        alignItems={'center'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LineChartComponent
            data={temp}
            labelSurfix="°C"
            key={1}
            name="Temperature"
            color="#ED1000"
            RGBAColor="237, 16, 0"
            labels={time}
          />
          <LineChartComponent
            data={humi}
            labels={time}
            labelSurfix="%"
            key={2}
            name="Humidity"
            color="#006FF4"
            RGBAColor="0, 111, 244"
          />
          <LineChartComponent
            data={ph}
            labels={time}
            labelSurfix=" "
            key={3}
            name="PH"
            color="#2CCF16"
            RGBAColor="44, 207, 22"
          />
          <LineChartComponent
            data={soil}
            labels={time}
            labelSurfix="%"
            key={4}
            name="Soil Moisture"
            color="#F8B01E"
            RGBAColor="248, 176, 30"
          />
          <Button
            variant={'unstyled'}
            width={'100%'}
            bg={PRIMARY_COLOR}
            mt={3}
            height={10}
            rounded="none"
            justifyContent={'center'}
            alignItems="center"
            onPress={exportDataToExcel}
            _text={{
              color: FONT_INACTIVE_LIGHT,
              fontWeight: 'medium',
            }}>
            Download Data
          </Button>
        </ScrollView>
      </Box>
    </Center>
  );
};

export default StatistikScreen;
