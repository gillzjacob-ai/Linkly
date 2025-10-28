import React from 'react';
import clsx from 'clsx';
import type { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isMine = message.author === 'me';
  const isSystem = message.author === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center py-3 text-xs font-medium uppercase tracking-widest text-brand">
        {message.text}
      </div>
    );
  }

  return (
    <div className={clsx('flex w-full', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-sm transition',
          isMine
            ? 'rounded-br-md bg-brand text-white'
            : 'rounded-bl-md bg-white text-slate-900 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700',
        )}
      >
        <p>{message.text}</p>
        <span className="mt-1 block text-[10px] uppercase tracking-wider text-white/70">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
