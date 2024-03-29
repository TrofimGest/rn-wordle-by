import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import Game from './src/components/Game';
import {colors} from './src/constants';

function App(): JSX.Element {
  useEffect(() => {
    Orientation.lockToPortrait();
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>ЎОРДЛІ</Text>
      <Game />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
});

export default App;
