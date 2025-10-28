import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaceSmileIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/Button';
import { ChatBubble } from '../components/ChatBubble';
import { ProfileCard } from '../components/ProfileCard';
import { Timer } from '../components/Timer';
import { useAppContext } from '../context/AppContext';

export const ChatView: React.FC = () => {
  const {
    activeMatch,
    messages,
    sendMessage,
    leaveChat,
    extendChat,
    getAvatarUrl,
  } = useAppContext();
  const [input, setInput] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.author !== 'me') {
      return;
    }
    setIsPartnerTyping(true);
    const responses = [
      'Love that. What pulled you into Linkly tonight?',
      'Totally. Have you tried any speed-dating events IRL?',
      'I dig it. What should we do with our remaining minutes?',
      'Respect. Any fun weekend plans?',
    ];
    const timeout = window.setTimeout(() => {
      setIsPartnerTyping(false);
      sendMessage(responses[Math.floor(Math.random() * responses.length)], 'partner');
    }, 1600 + Math.random() * 1800);
    return () => window.clearTimeout(timeout);
  }, [messages, sendMessage]);

  if (!activeMatch) {
    return null;
  }

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }
    sendMessage(input.trim(), 'me');
    setInput('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const conversationNotice = useMemo(
    () =>
      activeMatch.extended
        ? 'Extended by 2 minutes. Make them count!'
        : 'Leaving ends the chat early. Stay present for the full vibe check.',
    [activeMatch.extended],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand/10 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <img
              src={getAvatarUrl(activeMatch.partner.avatarSeed)}
              alt={activeMatch.partner.name}
              className="h-12 w-12 rounded-full border-2 border-brand object-cover"
            />
            {activeMatch.partner.verified && (
              <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                ✓
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeMatch.partner.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tap to view profile</p>
          </div>
        </button>
        <Timer expiresAt={activeMatch.expiresAt} onExpire={leaveChat} />
      </header>
      <div className="flex flex-1 flex-col gap-6 px-4 py-6">
        <div className="rounded-3xl bg-white/80 p-4 text-xs font-semibold uppercase tracking-wide text-brand dark:bg-slate-900/80">
          {conversationNotice}
        </div>
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isPartnerTyping && (
            <div className="ml-2 inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand" />
              Partner is typing…
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-brand dark:bg-brand/20 dark:text-brand-light">
              <FaceSmileIcon className="h-4 w-4" />
              Try this icebreaker: {activeMatch.icebreaker}
            </span>
            {!activeMatch.extended && (
              <button
                type="button"
                onClick={extendChat}
                className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-brand/10 hover:text-brand dark:bg-slate-800 dark:text-slate-200"
              >
                Extend chat by 2 minutes
              </button>
            )}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="Say hi, share a hot take, or play two truths and a lie…"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={leaveChat}
                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400"
              >
                <XMarkIcon className="h-5 w-5" />
                End chat
              </button>
              <Button onClick={handleSend} disabled={!input.trim()}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isProfileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setIsProfileOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform rounded-3xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900">
                  <Dialog.Title className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                    <UserCircleIcon className="h-6 w-6" /> Profile peek
                  </Dialog.Title>
                  <ProfileCard profile={activeMatch.partner} />
                  <div className="mt-6 text-right">
                    <Button variant="secondary" onClick={() => setIsProfileOpen(false)}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
