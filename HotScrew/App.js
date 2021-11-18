import React from 'react';
import {Text, Image, View, StyleSheet, ImageBackground} from 'react-native';

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.card}>
        <ImageBackground
          source={{
            uri: 'https://i.pinimg.com/736x/80/7a/6f/807a6fa07befdce098b0e90c18701c64.jpg',
          }}
          style={styles.image}>
          <View style={styles.cardInner}>
            <Text style={styles.name}>EDI</Text>
            <Text style={styles.bio}>Pozwiedzasz ze mną galaktykę?</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  card: {
    width: '95%',
    height: '70%',
    backgroundColor: 'red',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
    flex: 1,
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
});

export default App;
