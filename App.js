/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
//import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { useEffect } from 'react/cjs/react.production.min';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  

const NotificationListner = () => {

  messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      )
    });

    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

    messaging().onMessage(async remoteMessage => {

      console.log('notif on foreground',remoteMessage)
     })

}

React.useEffect(() => { 

  NotificationListner() ;

}, []);

  async function GetFCMToken() {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
    console.log(fcmtoken,'old token')
    if(!fcmtoken){
        try {
            const fcmtoken = await messaging().getToken();
            if(fcmtoken){
                console.log(fcmtoken,'new token') 
                await AsyncStorage.setItem('fcmtoken', fcmtoken);
            }

        } catch (error) {
            console.log('error',error)
            
        }
     }
}

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      GetFCMToken();
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
     
     <View>
       <TouchableOpacity onPress={requestUserPermission}>
       <Text  >Hello Chabrik</Text>
       </TouchableOpacity>
      
     </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
