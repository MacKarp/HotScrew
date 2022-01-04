import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';

import {Storage, DataStore} from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {Message as MessageModel} from '../../models';

import MessageReply from '../MessageReply';
import AudioPlayer from '../AudioPlayer';

const Message = props => {
  const propMessage = props.message;
  const setAsMessageReply = props.setAsMessageReply;
  const propMe = props.me;
  const userID = props.message.userID;

  const [message, setMessage] = useState(propMessage);
  const [repliedTo, setRepliedTo] = useState(undefined);
  const [isMe, setIsMe] = useState(null);
  const [soundURI, setSoundURI] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const {width} = useWindowDimensions();
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    const checkIfMe = () => {
      if (!userID) {
        return;
      }
      setIsMe(userID === propMe.sub);
    };
    checkIfMe();
  }, [userID, propMe]);

  useEffect(() => {
    let isMounted = true;
    if (message) {
      const subscription = DataStore.observe(
        MessageModel,
        message.id,
      ).subscribe(msg => {
        if (msg.model === MessageModel) {
          if (msg.opType === 'UPDATE') {
            if (isMounted) {
              setMessage(m => ({...m, ...msg.element}));
            }
          } else if (msg.opType === 'DELETE') {
            if (isMounted) {
              setIsDeleted(true);
            }
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    return () => (isMounted = false);
  }, [message]);

  useEffect(() => {
    let isMounted = true;
    if (message?.replyToMessageID) {
      DataStore.query(MessageModel, message.replyToMessageID).then(data => {
        if (isMounted) {
          setRepliedTo(data);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [message]);

  useEffect(() => {
    const setAsRead = async () => {
      if (message?.status) {
        if (isMe === false && message.status !== 'READ') {
          await DataStore.save(
            MessageModel.copyOf(message, updated => {
              updated.status = 'READ';
            }),
          );
        }
      }
    };
    setAsRead();
  }, [isMe, message]);

  useEffect(() => {
    const getAudio = async () => {
      let isMounted = true;
      if (message?.audio) {
        Storage.get(message.audio).then(data => {
          if (isMounted) {
            setSoundURI(data);
          }
        });
      }
      return () => {
        isMounted = false;
      };
    };
    getAudio();
  }, [message]);

  const deleteMessage = async () => {
    await DataStore.delete(message);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm delete',
      'Are you sure you want to delete the message?',
      [
        {
          text: 'Delete',
          onPress: deleteMessage,
          style: 'destructive',
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const onActionPress = index => {
    if (index === 0) {
      setAsMessageReply();
    } else if (index === 1) {
      if (isMe) {
        confirmDelete();
      } else {
        Alert.alert("Can't perform action", 'This is not your message');
      }
    }
  };

  const openActionMenu = () => {
    const options = ['Reply', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      onActionPress,
    );
  };

  if (!propMe) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable
      onLongPress={setAsMessageReply}
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        {width: soundURI ? '75%' : 'auto'},
      ]}>
      {repliedTo && <MessageReply message={repliedTo} />}
      <View style={styles.row}>
        {message.image && (
          <View style={{marginBottom: message.content ? 10 : 0}}>
            <S3Image
              imgKey={message.image}
              style={{width: width * 0.65, aspectRatio: 4 / 3}}
              resizeMode="contain"
            />
          </View>
        )}
        {soundURI && <AudioPlayer soundURI={soundURI} />}
        {!!message.content && (
          <Text style={{color: isMe ? 'black' : 'white'}}>
            {message.content}
          </Text>
        )}
        {isMe && !!message.status && message.status !== 'SENT' && (
          <Ionicons
            name={
              message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'
            }
            size={16}
            color="gray"
            style={{marginHorizontal: 5}}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageReply: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: '#F18C15',
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: 'blue',
    marginLeft: 'auto',
    marginRight: 10,
    alignItems: 'flex-end',
  },
});

export default Message;
