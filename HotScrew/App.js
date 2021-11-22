import React from 'react';
import {View,StyleSheet} from 'react-native';
import Card from './src/components/Profile_Card';
import users from './assets/data/users';

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <Card user={users[0]}></Card>
    </View>
  );
};
const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }});

export default App;
