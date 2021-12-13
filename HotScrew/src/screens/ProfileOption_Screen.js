import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';

import {Auth, DataStore, Storage} from 'aws-amplify';

import {User} from '../models/';

import {Picker} from '@react-native-picker/picker';
import {S3Image} from 'aws-amplify-react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';

const ProfileOptionScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [newImageLocalUri, setNewImageLocalUri] = useState(null);
  const [type, setType] = useState('OTHER');
  const [lookingFor, setLookingFor] = useState('OTHER');

  useEffect(() => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.CAMERA;
    request(perm).then(status => {
      console.log(status);
    });
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        console.warn('This is a new user');
        return;
      }
      const dbUser = dbUsers[0];
      setUser(dbUser);

      setName(dbUser.name);
      setBio(dbUser.bio);
      setType(dbUser.type);
      setLookingFor(dbUser.lookingFor);
    };
    getCurrentUser();
  }, []);

  const isValid = () => {
    return name && bio && type && lookingFor;
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(newImageLocalUri);

      const blob = await response.blob();

      const urlParts = newImageLocalUri.split('.');
      const extension = urlParts[urlParts.length - 1];

      const key = `${user.id}.${extension}`;

      await Storage.put(key, blob);

      return key;
    } catch (e) {
      console.log(e);
    }
    return '';
  };

  const save = async () => {
    if (!isValid()) {
      console.warn('Coś jest nie tak');
      return;
    }
    let newImage;
    if (newImageLocalUri) {
      newImage = await uploadImage();
    }

    if (user) {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
        updated.type = type;
        updated.lookingFor = lookingFor;
        if (newImage) {
          updated.image = newImage;
        }
      });

      await DataStore.save(updatedUser);
      setNewImageLocalUri(null);
    } else {
      // create a new user
      const authUser = await Auth.currentAuthenticatedUser();

      const newUser = new User({
        sub: authUser.attributes.sub,
        name,
        bio,
        type,
        lookingFor,
        image: 'dummy.png',
      });
      await DataStore.save(newUser);
    }

    Alert.alert('Zapisano!');
  };

  const pickImage = () => {
    console.log('pickImage');
    launchImageLibrary(
      {mediaType: 'mixed'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || errorCode) {
          console.warn('canceled or error');
          console.log(errorMessage);
          return;
        }
        console.log('assets[0].uri');
        console.log(assets[0].uri);
        setNewImageLocalUri(assets[0].uri);
      },
    );
  };
  const signOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  const renderImage = () => {
    if (newImageLocalUri) {
      return <Image source={{uri: newImageLocalUri}} style={styles.image} />;
    }
    if (user?.image?.startsWith('http')) {
      return <Image source={{uri: user?.image}} style={styles.image} />;
    }
    return <S3Image imgKey={user?.image} style={styles.image} />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Pressable onPress={pickImage}>{renderImage()}</Pressable>
        <TextInput
          style={styles.input}
          placeholder="Imię..."
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
        <Text style={styles.text}>Jestem:</Text>
        <Picker
          label="Jestem"
          selectedValue={type}
          onValueChange={itemValue => setType(itemValue)}>
          <Picker.Item label="Android" value="ANDROID" />
          <Picker.Item label="Cyborg" value="CYBORG" />
          <Picker.Item label="Droid" value="DROID" />
          <Picker.Item label="Umysł zbiorowy" value="HIVEMIND" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
        <Text style={styles.text}>Szukam:</Text>
        <Picker
          label="Szukam"
          selectedValue={lookingFor}
          onValueChange={itemValue => setLookingFor(itemValue)}>
          <Picker.Item label="Android" value="ANDROID" />
          <Picker.Item label="Cyborg" value="CYBORG" />
          <Picker.Item label="Droid" value="DROID" />
          <Picker.Item label="Umysł zbiorowy" value="HIVEMIND" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
        <Pressable onPress={save} style={styles.button}>
          <Text>Zapisz</Text>
        </Pressable>
        <Pressable onPress={signOut} style={styles.button}>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#F18C15',
    borderWidth: 5,
  },
  text: {
    color: '#fff',
  },
});

export default ProfileOptionScreen;
