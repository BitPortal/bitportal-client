import { AsyncStorage } from 'react-native';
import { registerScreens } from 'screens';
import { startSingleApp, startTabBasedApp } from 'navigators';
registerScreens(); // this is where you register all of your app's screens

AsyncStorage.getItem('Welcome', (err, result) => {
  let data = JSON.parse(result);
  if (data && data.isFirst) startSingleApp();
  else startTabBasedApp();
})

