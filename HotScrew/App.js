import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';

import HomeScreen from './src/screens/Home_Screen';
import MatchesScreen from './src/screens/Matches_Screen';

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <MatchesScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#373737',
  },
});

export default App;
