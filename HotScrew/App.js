import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Amplify, {Hub} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import config from './src/aws-exports';

import HomeScreen from './src/screens/Home_Screen';
import MatchesScreen from './src/screens/Matches_Screen';
import ProfileOptionScreen from './src/screens/ProfileOption_Screen';
import LikingMeScreen from './src/screens/Liking_Me_Screen';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [isUserLoading, setIsUserLoading] = useState(true);

  const activeColor = '#f18c15';
  const color = '#5dbcd2';

  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        setIsUserLoading(false);
      }
    });

    return () => listener();
  }, []);

  const renderPage = () => {
    if (activeScreen === 'HOME') {
      return <HomeScreen isUserLoading={isUserLoading} />;
    }

    if (isUserLoading) {
      return <ActivityIndicator style={{flex: 1}} />;
    }
    if (activeScreen === 'LIKING_ME') {
      return <LikingMeScreen />;
    }
    if (activeScreen === 'CHAT') {
      return <MatchesScreen />;
    }
    if (activeScreen === 'OPTIONS') {
      return <ProfileOptionScreen />;
    }
  };

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
          <Pressable onPress={() => setActiveScreen('LIKING_ME')}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={40}
              color={activeScreen === 'LIKING_ME' ? activeColor : color}
            />
          </Pressable>
          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons
              name="ios-chatbubbles"
              size={40}
              color={activeScreen === 'CHAT' ? activeColor : color}
            />
          </Pressable>
          <Pressable onPress={() => setActiveScreen('OPTIONS')}>
            <FontAwesome5
              name="robot"
              size={40}
              color={activeScreen === 'OPTIONS' ? activeColor : color}
            />
          </Pressable>
        </View>
        {renderPage()}
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

export default withAuthenticator(App);
