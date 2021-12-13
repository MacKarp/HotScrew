// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Type = {
  "ANDROID": "ANDROID",
  "CYBORG": "CYBORG",
  "DROID": "DROID",
  "HIVEMIND": "HIVEMIND",
  "OTHER": "OTHER"
};

const { Match, User } = initSchema(schema);

export {
  Match,
  User,
  Type
};