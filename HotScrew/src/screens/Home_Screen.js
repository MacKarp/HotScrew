import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {DataStore, Auth} from 'aws-amplify';
import {User, Match, ChatRoom} from '../models';

import Card from '../components/Profile_Card';
import AnimatedStack from '../components/Animated_Stack';

const HomeScreen = ({isUserLoading}) => {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [matchesIds, setMatchesIds] = useState(null);

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
  }, [isUserLoading]);

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
        setMatchesIds(
          result.map(match =>
            match.User1ID === me.id ? match.User2ID : match.User1ID,
          ),
        );
      }
      return () => {
        isMounted = false;
      };
    };
    fetchMatches();
  }, [me]);

  useEffect(() => {
    if (isUserLoading || !me || matchesIds === null) {
      return;
    }
    const fetchUsers = async () => {
      let isMounted = true;
      let fetchedUsers = await DataStore.query(User, user =>
        user.type('eq', me.lookingFor),
      );

      fetchedUsers = fetchedUsers.filter(u => !matchesIds.includes(u.id));
      if (isMounted) {
        setUsers(fetchedUsers);
      }
      return () => {
        isMounted = false;
      };
    };
    fetchUsers();
  }, [isUserLoading, me, matchesIds]);

  const onSwipeLeft = () => {
    if (!currentUser || !me) {
      return;
    }

    console.warn('swipe left', currentUser.name);
  };

  const onSwipeRight = async () => {
    if (!currentUser || !me) {
      return;
    }

    const myMatches = await DataStore.query(Match, match =>
      match.User1ID('eq', me.id).User2ID('eq', currentUser.id),
    );
    if (myMatches.length > 0) {
      console.warn('You already swiped right to this user');
      return;
    }

    const hisMatches = await DataStore.query(Match, match =>
      match.User1ID('eq', currentUser.id).User2ID('eq', me.id),
    );

    if (hisMatches.length > 0) {
      const hisMatch = hisMatches[0];
      const newChatRoomData = {
        newMessages: 0,
        Admin: me,
        ChatRoomUser1: me.id,
        ChatRoomUser2: currentUser.id,
      };
      const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

      DataStore.save(
        Match.copyOf(hisMatch, updated => {
          updated.isMatch = true;
          updated.ChatRoom = newChatRoom;
        }),
      );
      return;
    }

    console.warn('Sending him a match request!');
    const newMatch = new Match({
      User1ID: me.id,
      User2ID: currentUser.id,
      isMatch: false,
    });
    DataStore.save(newMatch);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        setCurrentUser={setCurrentUser}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.bottomNavigationBar}>
        <FontAwesome name="undo" size={40} color="#eecf00" />
        <Entypo name="cross" size={50} color="#c30000" />
        <Entypo name="heart" size={40} color="#6dc900" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  bottomNavigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#202020',
    alignItems: 'center',
  },
});

export default HomeScreen;
