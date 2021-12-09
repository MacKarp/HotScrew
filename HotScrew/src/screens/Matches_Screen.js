import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {Match, User} from '../models';

const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);

  const getCurrentUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    console.log('user ', user);

    const dbUsers = await DataStore.query(
      User,
      u => u.sub === user.attributes.sub,
    );
    if (dbUsers.length < 0) {
      return;
    }
    setMe(dbUsers[0]);
  };

  useEffect(() => getCurrentUser(), []);

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      console.log('me: ', me.id);
      const result = await DataStore.query(Match, m =>
        m.or(m1 => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      console.log('hole');
      console.log(result);
      setMatches(result);
    };
    fetchMatches();
  }, [me]);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.matchText}>Pasujące profile</Text>
        <View style={styles.users}>
          {matches.map(match => (
            <View style={styles.user} key={match.User1.id}>
              <Image source={{uri: match.User1.image}} style={styles.image} />
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
  matchText: {
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: 'Roboto',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default MatchesScreen;
