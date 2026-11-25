import { useState } from 'react';
import { LogOut, PawPrint, UserCircle } from 'lucide-react';
import AboutPage from '@/components/AboutPage';
import CarePage from '@/components/CarePage';
import CommunityPage from '@/components/CommunityPage';
import RegisterPage from '@/components/RegisterPage';
import { useAuth } from '@/lib/auth';

type Tab = 'about' | 'care' | 'community' | 'register';
const tabs: { id: Tab; label: string }[] = [
  { id: 'about', label: '함께하개' },
  { id: 'care', label: '돌봐주개' },
  { id: 'community', label: '소통하개' },
  { id: 'register', label: '등록하개' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [boardTarget, setBoardTarget] = useState({ part: '', post: '', write: false });
  const { user, nickname, signOut } = useAuth();
  const navigate = (tab: Tab, part = '', post = '', write = false) => {
    if (tab === 'community') setBoardTarget({ part, post, write });
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <button onClick={() => navigate('about')} className="brand" aria-label="함께하개 홈">
            <PawPrint strokeWidth={1.6} aria-hidden="true" />
            <span>함께하개</span>
          </button>
          <nav className="bookmark-nav" aria-label="주 메뉴">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => navigate(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`bookmark ${activeTab === tab.id ? 'is-active' : ''} ${tab.id === 'register' ? 'bookmark-join' : ''}`}>
                <span className="bookmark-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {user && (
          <div className="user-bar">
            <UserCircle size={15} /><span>{nickname ?? '함께하개 회원'}</span>
            <button onClick={signOut}><LogOut size={13} /> 로그아웃</button>
          </div>
        )}
      </header>
      <div id="page-content" className={`page-content page-${activeTab}`}>
        {activeTab === 'about' && <AboutPage onNavigate={navigate} />}
        {activeTab === 'care' && <CarePage onOpenBoard={(part, post, write) => navigate('community', part, post, write)} />}
        {activeTab === 'community' && <CommunityPage key={JSON.stringify(boardTarget)} initialPart={boardTarget.part} initialPost={boardTarget.post} startWriting={boardTarget.write} onRegister={() => navigate('register')} />}
        {activeTab === 'register' && <RegisterPage />}
      </div>
      <footer className="site-footer">
        <div><span>함께하개</span></div>
        <p>견주와 예비 견주를 위한 정보 교환 공간</p>
      </footer>
    </div>
  );
}
