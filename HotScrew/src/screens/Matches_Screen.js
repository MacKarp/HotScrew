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

    const dbUsers = await DataStore.query(User, u =>
      u.sub('eq', user.attributes.sub),
    );
    if (!dbUsers || dbUsers.length === 0) {
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
        m
          .isMatch('eq', true)
          .or(m1 => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      console.log('hole');
      console.log(result);
      setMatches(result);
    };
    fetchMatches();
  }, [me]);

  useEffect(() => {
    const subscription = DataStore.observe(Match).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);

      if (msg.opType === 'UPDATE') {
        const newMatch = msg.element;
        if (
          newMatch.isMatch &&
          (newMatch.User1ID === me.id || newMatch.User2ID === me.id)
        ) {
          console.log(
            '+++++++++++++++++++ There is a new match waiting for you!',
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [me]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.matchText}>Pasujące profile</Text>
        <View style={styles.users}>
          {matches.map(match => {
            const matchUser =
              match.User1ID === me.id ? match.User2 : match.User1;
            if (!match.User1 || !match.User2) {
              return (
                <View style={styles.user} key={match.id}>
                  <Image source={{}} style={styles.image} />
                  <Text style={styles.name}>New match</Text>
                </View>
              );
            }
            return (
              <View style={styles.user} key={match.id}>
                <Image source={{uri: matchUser.image}} style={styles.image} />
                <Text style={styles.name}>{matchUser.name}</Text>
              </View>
            );
          })}
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
  name: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default MatchesScreen;
