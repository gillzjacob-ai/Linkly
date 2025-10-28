import React from 'react';
import { CalendarDaysIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/Button';
import { ProfileCard } from '../components/ProfileCard';
import { useAppContext } from '../context/AppContext';

export const FriendsView: React.FC = () => {
  const { friends, startMatchmaking } = useAppContext();

  if (friends.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center text-slate-500 dark:text-slate-400">
        <ChatBubbleOvalLeftEllipsisIcon className="h-16 w-16 text-brand" />
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No matches yet…</h3>
          <p className="mt-2 text-sm">
            Fire up a 5-minute chat, trust your gut, and tap match when the vibe is right.
          </p>
        </div>
        <Button onClick={startMatchmaking}>Find someone now</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your saved sparks</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Every successful match lands here. Jump back in by saying hi on socials or inviting them to a new Linkly chat.
        </p>
      </div>
      <div className="space-y-4">
        {friends.map((friend) => (
          <ProfileCard
            key={friend.id}
            profile={friend.partner}
            footer={
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="inline-flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  Matched {new Date(friend.matchedAt).toLocaleDateString()}
                </div>
                <span className="italic text-slate-400">“{friend.lastMessage}”</span>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
