import React from 'react';
import {View, StyleSheet, SafeAreaView, Text, Pressable} from 'react-native';

import {Auth} from 'aws-amplify';

const ProfileOptionScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Pressable onPress={() => Auth.signOut()}>
          <Text>Wyloguj</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 10,
    flex: 1,
  },
  container: {
    padding: 10,
  },
});

export default ProfileOptionScreen;
