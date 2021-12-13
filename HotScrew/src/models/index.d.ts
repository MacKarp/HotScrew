import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Type {
  ANDROID = "ANDROID",
  CYBORG = "CYBORG",
  DROID = "DROID",
  HIVEMIND = "HIVEMIND",
  OTHER = "OTHER"
}



type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Match {
  readonly id: string;
  readonly User1ID: string;
  readonly User2ID?: string;
  readonly isMatch: boolean;
  readonly Users1?: (User | null)[];
  readonly Users2?: (User | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Match, MatchMetaData>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

export declare class User {
  readonly id: string;
  readonly name?: string;
  readonly bio: string;
  readonly image?: string;
  readonly sub: string;
  readonly matchID?: string;
  readonly type?: Type | keyof typeof Type;
  readonly lookingFor?: Type | keyof typeof Type;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}