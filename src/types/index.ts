export type Gender = 'man' | 'woman' | 'non-binary' | 'everyone';

export interface MatchPreferences {
  genders: Exclude<Gender, 'everyone'>[] | ['everyone'];
  ageRange: [number, number];
  maxDistance: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  genderIdentity: Exclude<Gender, 'everyone'>;
  bio: string;
  avatarSeed: string;
  verified: boolean;
  preferences: MatchPreferences;
}

export interface MatchPartner extends Omit<UserProfile, 'preferences'> {
  distance: number;
  interests: string[];
}

export interface Message {
  id: string;
  author: 'me' | 'partner' | 'system';
  text: string;
  timestamp: number;
}

export interface ActiveMatch {
  partner: MatchPartner;
  startedAt: number;
  expiresAt: number;
  initialDurationSeconds: number;
  extended: boolean;
  icebreaker: string | null;
}

export interface FriendMatch {
  id: string;
  partner: MatchPartner;
  matchedAt: number;
  lastMessage: string;
}

export type AppView =
  | 'setup'
  | 'home'
  | 'matchmaking'
  | 'chat'
  | 'post-chat';

export type HomeTab = 'friends' | 'profile';
