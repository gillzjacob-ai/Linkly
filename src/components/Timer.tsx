import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  expiresAt: number;
  onExpire: () => void;
  isActive?: boolean;
}

const computeRemaining = (expiresAt: number) => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

export const Timer: React.FC<TimerProps> = ({ expiresAt, onExpire, isActive = true }) => {
  const [remaining, setRemaining] = useState(() => computeRemaining(expiresAt));
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    setRemaining(computeRemaining(expiresAt));
    hasExpiredRef.current = false;
  }, [expiresAt]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (remaining <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire();
      }
      return;
    }
    const interval = window.setInterval(() => {
      setRemaining(computeRemaining(expiresAt));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [remaining, expiresAt, isActive, onExpire]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand bg-white text-2xl font-bold text-brand shadow-lg dark:bg-slate-900">
      {minutes}:{secs}
    </div>
  );
};
