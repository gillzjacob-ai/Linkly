import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  type ActiveMatch,
  type AppView,
  type FriendMatch,
  type HomeTab,
  type Message,
  type UserProfile,
} from '../types';
import { ICEBREAKERS, MOCK_PARTNERS } from '../utils/mockData';

interface AppContextValue {
  view: AppView;
  setView: (view: AppView) => void;
  homeTab: HomeTab;
  setHomeTab: (tab: HomeTab) => void;
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  friends: FriendMatch[];
  activeMatch: ActiveMatch | null;
  messages: Message[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  getAvatarUrl: (seed: string) => string;
  startMatchmaking: () => void;
  cancelMatchmaking: () => void;
  completeMatchmaking: () => void;
  leaveChat: () => void;
  extendChat: () => void;
  sendMessage: (text: string, author?: Message['author']) => void;
  concludePostChat: (choice: 'match' | 'next') => void;
}

const LOCAL_STORAGE_KEY = 'linkly-profile';
const FRIENDS_STORAGE_KEY = 'linkly-friends';
const THEME_STORAGE_KEY = 'linkly-theme';

const AppContext = createContext<AppContextValue | undefined>(undefined);

function loadProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  } catch (error) {
    console.warn('Failed to read profile from storage', error);
    return null;
  }
}

function loadFriends(): FriendMatch[] {
  try {
    const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as FriendMatch[]) : [];
  } catch (error) {
    console.warn('Failed to read friends from storage', error);
    return [];
  }
}

function loadTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
  if (stored) {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('setup');
  const [homeTab, setHomeTab] = useState<HomeTab>('friends');
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    typeof window !== 'undefined' ? loadProfile() : null,
  );
  const [friends, setFriends] = useState<FriendMatch[]>(() =>
    typeof window !== 'undefined' ? loadFriends() : [],
  );
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' ? loadTheme() : 'light',
  );
  const [matchmakingTimeout, setMatchmakingTimeout] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setView('home');
    }
  }, [profile]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    return () => {
      if (matchmakingTimeout) {
        window.clearTimeout(matchmakingTimeout);
      }
    };
  }, [matchmakingTimeout]);

  const getAvatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

  const startMatchmaking = () => {
    if (!profile) {
      return;
    }
    setView('matchmaking');
    setMessages([]);
    const timeout = window.setTimeout(() => {
      completeMatchmaking();
    }, 2400);
    setMatchmakingTimeout(timeout);
  };

  const cancelMatchmaking = () => {
    if (matchmakingTimeout) {
      window.clearTimeout(matchmakingTimeout);
      setMatchmakingTimeout(null);
    }
    setView('home');
  };

  const pickIcebreaker = () => ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];

  const filterPartnerPool = () => {
    if (!profile) {
      return [] as typeof MOCK_PARTNERS;
    }
    return MOCK_PARTNERS.filter((partner) => {
      const genderMatches =
        profile.preferences.genders.includes('everyone') ||
        profile.preferences.genders.includes(partner.genderIdentity);
      const ageMatches =
        partner.age >= profile.preferences.ageRange[0] &&
        partner.age <= profile.preferences.ageRange[1];
      const distanceMatches = partner.distance <= profile.preferences.maxDistance;
      const notSelf = partner.id !== profile.id;
      return genderMatches && ageMatches && distanceMatches && notSelf;
    });
  };

  const buildPartnerProfile = () => {
    const pool = filterPartnerPool();
    const partner = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (partner) {
      return partner;
    }
    return {
      id: nanoid(),
      name: 'Linkly Explorer',
      age: 28,
      genderIdentity: 'non-binary',
      bio: 'New to the city and curious to meet someone delightful.',
      avatarSeed: 'linkly-explorer',
      verified: false,
      distance: 5,
      interests: ['Coffee Walks', 'Podcasts', 'Art Museums'],
    };
  };

  const completeMatchmaking = () => {
    setMatchmakingTimeout(null);
    const partner = buildPartnerProfile();
    const icebreaker = pickIcebreaker();
    const durationSeconds = 5 * 60;
    const startTime = Date.now();
    const match: ActiveMatch = {
      partner,
      startedAt: startTime,
      expiresAt: startTime + durationSeconds * 1000,
      initialDurationSeconds: durationSeconds,
      extended: false,
      icebreaker,
    };
    setActiveMatch(match);
    setMessages([
      {
        id: nanoid(),
        author: 'system',
        text: `Icebreaker: ${icebreaker}`,
        timestamp: Date.now(),
      },
    ]);
    setView('chat');
  };

  const leaveChat = () => {
    setView('post-chat');
  };

  const extendChat = () => {
    setActiveMatch((prev) =>
      prev
        ? {
            ...prev,
            expiresAt: prev.expiresAt + 120 * 1000,
            extended: true,
          }
        : prev,
    );
  };

  const sendMessage: AppContextValue['sendMessage'] = (text, author = 'me') => {
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        author,
        text,
        timestamp: Date.now(),
      },
    ]);
  };

  const concludePostChat: AppContextValue['concludePostChat'] = (choice) => {
    if (!activeMatch) {
      setView('home');
      return;
    }

    let closingMessage = '';

    if (choice === 'match') {
      const partnerReciprocates = Math.random() > 0.35;
      if (partnerReciprocates) {
        const lastMessage = messages[messages.length - 1]?.text ?? 'Let\'s catch up soon!';
        setFriends((prev) => [
          ...prev,
          {
            id: nanoid(),
            partner: activeMatch.partner,
            matchedAt: Date.now(),
            lastMessage,
          },
        ]);
        closingMessage = 'It\'s a match! You can find them in your friends list.';
      } else {
        closingMessage = 'They decided to keep exploring. On to the next great chat!';
      }
    } else {
      closingMessage = 'No worries! There are plenty more people waiting to meet you.';
    }

    if (closingMessage) {
      window.setTimeout(() => {
        window.alert(closingMessage);
      }, 300);
    }

    setActiveMatch(null);
    setMessages([]);
    setView('home');
  };

  const value = useMemo<AppContextValue>(
    () => ({
      view,
      setView,
      homeTab,
      setHomeTab,
      profile,
      saveProfile: setProfile,
      friends,
      activeMatch,
      messages,
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
      getAvatarUrl,
      startMatchmaking,
      cancelMatchmaking,
      completeMatchmaking,
      leaveChat,
      extendChat,
      sendMessage,
      concludePostChat,
    }),
    [
      view,
      homeTab,
      profile,
      friends,
      activeMatch,
      messages,
      theme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
};
