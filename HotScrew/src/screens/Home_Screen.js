import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Card from '../components/Profile_Card';
import users from '../../assets/data/users';

import AnimatedStack from '../components/Animated_Stack';

const HomeScreen = () => {
  const onSwipeLeft = user => {
    console.warn('swipe left: ', user.name);
  };

  const onSwipeRight = user => {
    console.warn('swipe right: ', user.name);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.bottomNavigationBar}>
        <FontAwesome name="undo" size={40} color="#eecf00" />
        <Entypo name="cross" size={50} color="#c30000" />
        <Entypo name="star" size={40} color="#3caecb" />
        <Entypo name="heart" size={40} color="#6dc900" />
        <Ionicons name="flash" size={40} color="#a200ff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  bottomNavigationBar: {
flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#202020',
    alignItems: 'center',
  },
});

export default HomeScreen;
