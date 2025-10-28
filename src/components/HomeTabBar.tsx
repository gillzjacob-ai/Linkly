import React from 'react';
import { ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Button } from './Button';
import { useAppContext } from '../context/AppContext';
import type { HomeTab } from '../types';

interface HomeTabBarProps {
  value: HomeTab;
  onChange: (tab: HomeTab) => void;
}

export const HomeTabBar: React.FC<HomeTabBarProps> = ({ value, onChange }) => {
  const { startMatchmaking } = useAppContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 py-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-md items-center justify-around px-6">
        <button
          type="button"
          onClick={() => onChange('friends')}
          className={clsx(
            'flex flex-col items-center text-xs font-medium uppercase tracking-wide transition',
            value === 'friends'
              ? 'text-brand'
              : 'text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300',
          )}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          Friends
        </button>
        <Button
          type="button"
          onClick={startMatchmaking}
          className="-mt-10 h-16 w-16 rounded-full px-0"
          aria-label="Find a match"
        >
          <BoltIcon className="h-7 w-7" />
        </Button>
        <button
          type="button"
          onClick={() => onChange('profile')}
          className={clsx(
            'flex flex-col items-center text-xs font-medium uppercase tracking-wide transition',
            value === 'profile'
              ? 'text-brand'
              : 'text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300',
          )}
        >
          <UserCircleIcon className="h-6 w-6" />
          Profile
        </button>
      </div>
    </nav>
  );
};
