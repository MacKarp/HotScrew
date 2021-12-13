import React, {useEffect, useState} from 'react';
import {Text, ImageBackground, View, StyleSheet, Image} from 'react-native';
import Screw from '../../../assets/images/screw.png';
import {Storage} from 'aws-amplify';

const Card = props => {
  const {name, image, bio} = props.user;
  const [imageUrl, setImageUrl] = useState(image);

  useEffect(() => {
    if (!image?.startsWith('http')) {
      Storage.get(image).then(setImageUrl);
    }
  }, [image]);

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: imageUrl,
        }}
        style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
          <Image source={Screw} style={styles.like} resizeMode="contain" />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#fefefe',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 11,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  cardInner: {
    padding: 10,
    backgroundColor: 'rgba(241, 140, 21, 0.75)',
  },
  name: {
    fontWeight: 'normal',
    fontSize: 30,
    color: 'white',
  },
  bio: {
    fontSize: 20,
    color: 'white',
    lineHeight: 25,
  },

  like: {
    width: 600,
    height: 100,
    position: 'absolute',
    top: -25,
    zIndex: 1,
  },
});

export default Card;
