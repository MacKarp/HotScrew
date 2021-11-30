import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import users from '../../assets/data/users';

const MatchesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            fontFamily: 'Roboto',
            color: '#ffffff',  textAlign:'center' 
          }}>
          Pasujące profile
        </Text>
        <View style={styles.users}>
          {users.map(user => (
            <View style={styles.user} key={user.id}>
              <Image source={{uri: user.image}} style={styles.image} />
            </View>
          ))}
        </View>
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
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  user: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 5,
    borderColor: '#F18C15',
    borderRadius: 50,
    padding: 2,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default MatchesScreen;
