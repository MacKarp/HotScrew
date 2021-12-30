import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ"
}

export enum Type {
  ANDROID = "ANDROID",
  CYBORG = "CYBORG",
  DROID = "DROID",
  HIVEMIND = "HIVEMIND",
  OTHER = "OTHER"
}



type ChatRoomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MessageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ChatRoom {
  readonly id: string;
  readonly LastMessage?: Message;
  readonly Messages?: (Message | null)[];
  readonly newMessages?: number;
  readonly Admin?: User;
  readonly name?: string;
  readonly imageUri?: string;
  readonly ChatRoomUser1: string;
  readonly ChatRoomUser2: string;
  readonly User1?: User;
  readonly User2?: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly chatRoomLastMessageId?: string;
  readonly chatRoomAdminId?: string;
  constructor(init: ModelInit<ChatRoom, ChatRoomMetaData>);
  static copyOf(source: ChatRoom, mutator: (draft: MutableModel<ChatRoom, ChatRoomMetaData>) => MutableModel<ChatRoom, ChatRoomMetaData> | void): ChatRoom;
}

export declare class Message {
  readonly id: string;
  readonly content?: string;
  readonly userID?: string;
  readonly chatroomID?: string;
  readonly image?: string;
  readonly audio?: string;
  readonly status?: MessageStatus | keyof typeof MessageStatus;
  readonly replayToMessageID?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Message, MessageMetaData>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message, MessageMetaData>) => MutableModel<Message, MessageMetaData> | void): Message;
}

export declare class User {
  readonly id: string;
  readonly name?: string;
  readonly bio: string;
  readonly image?: string;
  readonly sub: string;
  readonly type?: Type | keyof typeof Type;
  readonly lookingFor?: Type | keyof typeof Type;
  readonly Messages?: (Message | null)[];
  readonly lastOnlineAt?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class Match {
  readonly id: string;
  readonly User1ID: string;
  readonly User2ID?: string;
  readonly isMatch: boolean;
  readonly User1?: User;
  readonly User2?: User;
  readonly ChatRoom?: ChatRoom;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly matchChatRoomId?: string;
  constructor(init: ModelInit<Match, MatchMetaData>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}