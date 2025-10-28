import React, { useEffect, useState } from 'react';
import { BoltIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

export const MatchmakingView: React.FC = () => {
  const { cancelMatchmaking } = useAppContext();
  const [tipsIndex, setTipsIndex] = useState(0);
  const tips = [
    'Finding people who are live and ready to talk…',
    'Respectful chats only. Linkly keeps you safe.',
    'Speed dating energy, friend-making ease.',
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTipsIndex((prev) => (prev + 1) % tips.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-br from-brand via-brand/80 to-brand-dark text-white">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 shadow-2xl ring-4 ring-white/20">
        <BoltIcon className="h-14 w-14 animate-pulse" />
      </div>
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-semibold">Matching you with someone awesome…</h2>
        <p className="mt-4 text-base text-white/80">{tips[tipsIndex]}</p>
      </div>
      <Button variant="ghost" onClick={cancelMatchmaking} className="bg-white/10 px-6 text-white">
        Cancel search
      </Button>
    </div>
  );
};
