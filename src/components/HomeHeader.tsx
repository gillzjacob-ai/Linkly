import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../context/AppContext';

export const HomeHeader: React.FC = () => {
  const { profile, getAvatarUrl } = useAppContext();

  if (!profile) {
    return null;
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Linkly</p>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
          The 5-Minute Match
          <SparklesIcon className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick chemistry checks, authentic conversations.
        </p>
      </div>
      <img
        src={getAvatarUrl(profile.avatarSeed)}
        alt={profile.name}
        className="h-14 w-14 rounded-full border-2 border-brand object-cover shadow"
      />
    </header>
  );
};
