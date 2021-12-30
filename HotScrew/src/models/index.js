// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const Type = {
  "ANDROID": "ANDROID",
  "CYBORG": "CYBORG",
  "DROID": "DROID",
  "HIVEMIND": "HIVEMIND",
  "OTHER": "OTHER"
};

const { ChatRoom, Message, User, Match } = initSchema(schema);

export {
  ChatRoom,
  Message,
  User,
  Match,
  MessageStatus,
  Type
};