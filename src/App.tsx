import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ChatView } from './views/ChatView';
import { FriendsView } from './views/FriendsView';
import { MatchmakingView } from './views/MatchmakingView';
import { PostChatView } from './views/PostChatView';
import { SetupView } from './views/SetupView';
import { HomeTabBar } from './components/HomeTabBar';
import { HomeHeader } from './components/HomeHeader';
import { ThemeToggle } from './components/ThemeToggle';

const AppShell: React.FC = () => {
  const { view, homeTab, setHomeTab, profile } = useAppContext();

  if (view === 'setup' || !profile) {
    return <SetupView />;
  }

  if (view === 'matchmaking') {
    return <MatchmakingView />;
  }

  if (view === 'chat') {
    return <ChatView />;
  }

  if (view === 'post-chat') {
    return <PostChatView />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <HomeHeader />
      <main className="flex-1 px-4 pb-24 pt-4">
        {homeTab === 'friends' ? <FriendsView /> : <SetupView showHeader={false} />}
      </main>
      <ThemeToggle className="fixed bottom-24 right-4" />
      <HomeTabBar value={homeTab} onChange={setHomeTab} />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
