import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';

import {Auth, DataStore} from 'aws-amplify';
import {User} from '../models/';

const ProfileOptionScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await Auth.currentAuthenticatedUser();

      const dbUsers = await DataStore.query(
        User,
        u => u.sub === user.attributes.sub,
      );
      if (dbUsers.length < 0) {
        return;
      }
      const dbUser = dbUsers[0];
      setUser(dbUser);

      setName(dbUser.name);
      setBio(dbUser.bio);
    };
    getCurrentUser();
  }, []);

  const isValid = () => {
    return name && bio;
  };

  const save = async () => {
    if (!isValid()) {
      console.warn('Not valid');
      return;
    }

    if (user) {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
      });

      await DataStore.save(updatedUser);
    } else {
      const authUser = await Auth.currentAuthenticatedUser();

      const newUser = new User({
        sub: authUser.attributes.sub,
        name,
        bio,
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
      });
      await DataStore.save(newUser);
    }

    Alert.alert('Zapisano pomyślnie!');
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name..."
          value={name}
          onChangeText={setName}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Bio..."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
          placeholderTextColor="#ffffff"
        />
        <Pressable onPress={save} style={styles.button}>
          <Text>Zapisz</Text>
        </Pressable>
        <Pressable onPress={() => Auth.signOut()} style={styles.button}>
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

  input: {
    margin: 10,
    borderBottomColor: '#5dbcd2',
    borderBottomWidth: 1,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#F18C15',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
});

export default ProfileOptionScreen;
