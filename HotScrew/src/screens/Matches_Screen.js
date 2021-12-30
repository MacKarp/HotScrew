import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';

import {Match, User} from '../models';
import ChatRoomScreen from './ChatRoomScreen';

const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [activeScreen, setActiveScreen] = useState('MATCHED');
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      let isMounted = true;
      const user = await Auth.currentAuthenticatedUser();

      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', user.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      if (isMounted) {
        setMe(dbUsers[0]);
      }
      return () => {
        isMounted = false;
      };
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      let isMounted = true;
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(m1 => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      if (isMounted) {
        setMatches(result);
      }
      return () => {
        isMounted = false;
      };
    };
    fetchMatches();
  }, [me]);

  useEffect(() => {
    const subscription = DataStore.observe(Match).subscribe(msg => {
      if (msg.opType === 'UPDATE') {
        const newMatch = msg.element;
        if (
          newMatch.isMatch &&
          (newMatch.User1ID === me.id || newMatch.User2ID === me.id)
        ) {
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [me]);

  const openChat = match => {
    setActiveScreen('CHAT');
    setChatRoom(match.ChatRoom.id);
  };

  const renderPage = () => {
    if (activeScreen === 'MATCHED') {
      return (
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
                  </View>
                );
              }
              return (
                <Pressable onPress={() => openChat(match)} key={match.id}>
                  <View style={styles.user}>
                    <Image
                      source={{
                        uri:
                          'https://hotscrew-storage-d3m4jte6nvg2hq120711-staging.s3.eu-central-1.amazonaws.com/public/' +
                          matchUser.image,
                      }}
                      style={styles.image}
                    />
                    <Text style={styles.name}>{matchUser.name}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      );
    }
    if (activeScreen === 'CHAT') {
      return <ChatRoomScreen chatRoom={chatRoom} me={me} />;
    }
  };

  return <SafeAreaView style={styles.root}>{renderPage()}</SafeAreaView>;
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
    color: '#ffffff',
  },
});

export default MatchesScreen;
