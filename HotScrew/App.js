import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './src/screens/Home_Screen';
import MatchesScreen from './src/screens/Matches_Screen';

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');

  const activeColor = '#f18c15';
  const color = '#5dbcd2';
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigationBar}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            <Octicons
              name="flame"
              size={40}
              color={activeScreen === 'HOME' ? activeColor : color}
            />
          </Pressable>
          <MaterialCommunityIcons
            name="star-four-points"
            size={40}
            color={color}
          />
          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons
              name="ios-chatbubbles"
              size={40}
              color={activeScreen === 'CHAT' ? activeColor : color}
            />
          </Pressable>
          <FontAwesome5 name="robot" size={40} color={color} />
        </View>
        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'CHAT' && <MatchesScreen />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#373737',
  },
  root: {
    flex: 1,
  },
  topNavigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#202020',
    alignItems: 'center',
  },
});

export default App;
