import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {DataStore} from '@aws-amplify/datastore';
import {ChatRoom, Message as MessageModel} from '../models';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import {selectInput, SortDirection} from 'aws-amplify';

const ChatRoomScreen = props => {
  const data = props.chatRoom;
  const me = props.me;
  const [messages, setMessages] = useState();
  const [messageReplyTo, setMessageReplyTo] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!data) {
        console.warn('No chatroom id provided');
        return;
      }
      let isMounted = true;
      const room = await DataStore.query(ChatRoom, data);
      if (!room) {
        console.error("Couldn't find a chat room with this id");
      } else {
        if (isMounted) {
          setChatRoom(room);
        }
      }
      return () => {
        isMounted = false;
      };
    };
    fetchChatRoom();
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatRoom) {
        return;
      }
      let isMounted = true;
      const fetchedMessages = await DataStore.query(
        MessageModel,
        m => m.chatroomID('eq', chatRoom?.id),
        {
          sort: m => m.createdAt(SortDirection.DESCENDING),
        },
      );
      if (isMounted) {
        console.log('start timeout');
        setTimeout(function () {
          console.log('start fetchedMessages updating');
          setMessages(fetchedMessages);
          console.log('stop fetchedMessages updating');
        }, 1000);
        console.log('stop timeout');
      }
      return () => {
        isMounted = false;
      };
    };
    fetchMessages();
  }, [chatRoom]);

  useEffect(() => {
    let isMounted = true;
    console.log('sub started');
    const subscription = DataStore.observe(MessageModel).subscribe(msg => {
      if (msg.model === MessageModel && msg.opType === 'INSERT') {
        if (isMounted) {
          console.log('start updating');
          setMessages(existingMessage => [msg.element, ...existingMessage]);
          console.log('stop updating');
        }
      }
    });
    return () => {
      console.log('sub returned');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  const renderItem = ({item}) => (
    <Message
      me={me}
      message={item}
      setAsMessageReply={() => setMessageReplyTo(item)}
    />
  );

  return (
    <SafeAreaView style={styles.page}>
      <FlatList data={messages} renderItem={renderItem} inverted />
      <MessageInput
        me={me}
        chatRoom={chatRoom}
        messageReplyTo={messageReplyTo}
        removeMessageReplyTo={() => setMessageReplyTo(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#373737',
    flex: 1,
  },
});

export default ChatRoomScreen;
