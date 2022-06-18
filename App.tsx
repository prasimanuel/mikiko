import React, {useEffect} from 'react';
import RouteNavigation from './src/route/RouteNavigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {NativeBaseProvider} from 'native-base';
import PhoneScreenOtp from './src/screen/authscreens/PhoneScreeOtp';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);
  return (
    <Provider store={store}>
      <RouteNavigation />
      {/* <NativeBaseProvider>
        <PhoneScreenOtp />
      </NativeBaseProvider> */}
    </Provider>
  );
};

export default App;
