import React from 'react';
import {Text, ImageBackground, View, StyleSheet, Image} from 'react-native';
import Like from '../../../assets/images/screw.png';

const Card = props => {
  const {name, image, bio} = props.user;
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: image,
        }}
        style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
          <Image
              source={Like}
              style={[styles.like, {left: 10}]}
              resizeMode="contain"
            />
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

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
    fontSize: 14,
    color: 'white',
  },
  bio: {
    fontSize: 12,
    color: 'white',
    lineHeight: 14,
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
