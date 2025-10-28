import React from 'react';
import { Button } from '../components/Button';
import { ProfileCard } from '../components/ProfileCard';
import { useAppContext } from '../context/AppContext';

export const PostChatView: React.FC = () => {
  const { activeMatch, concludePostChat } = useAppContext();

  if (!activeMatch) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand/10 via-white to-white px-4 py-10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Time\'s up!</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Did the sparks fly? Lock it in to keep the conversation rolling, or head back to find someone new.
          </p>
        </div>
        <ProfileCard profile={activeMatch.partner} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={() => concludePostChat('match')}>Match & add to friends</Button>
          <Button variant="secondary" onClick={() => concludePostChat('next')}>
            Next chat
          </Button>
        </div>
      </div>
    </div>
  );
};
