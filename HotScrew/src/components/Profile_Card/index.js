import React from "react";
import { Text, View, StyleSheet, ImageBackground } from "react-native";

const Card = (props) =>{
  const{name, image, bio}=props.user;
    return (<View style={styles.card}>
        <ImageBackground
          source={{
            uri: image,
          }}
          style={styles.image}>
          <View style={styles.cardInner}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.bio}>{bio}</Text>
          </View>
        </ImageBackground>
      </View>);
};

const styles = StyleSheet.create({
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

export default Card;