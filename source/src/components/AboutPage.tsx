import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import DailyBreed from './DailyBreed';
import ParadeDog from './ParadeDog';
import HandwrittenTitle from './HandwrittenTitle';
import { paradeDogs } from '@/data/paradeDogs';
import useScrollReveal from '@/hooks/useScrollReveal';

interface AboutPageProps {
  onNavigate: (tab: 'care' | 'community' | 'adoption' | 'register') => void;
}
const chapters = [
  { label: '함께하개', desc: '반려견의 건강 정보를 알아보고, 견주들과 경험을 나누는 공간입니다.\n입양 준비부터 보호견 찾기까지 한곳에서 살펴보세요.', action: '입양 준비 시작하기', target: 'adoption', variant: 1 },
  { label: '돌봐주개', desc: '강아지 그림의 부위를 누르면 질병과 증상, 세척법, 행동 정보를 볼 수 있어요.\n목줄의 뼈다귀를 누르면 지역별 동물병원도 찾을 수 있습니다.', action: '건강 정보 살펴보기', target: 'care', variant: 0 },
  { label: '소통하개', desc: '강아지 사진과 반려생활 이야기를 올리고, 궁금한 점을 물어보세요.\n게시글과 댓글로 견주들의 경험을 나눌 수 있어요.', action: '커뮤니티 보기', target: 'community', variant: 3 },
  { label: '입양하개', desc: '지역별 보호견 공고를 살펴보고, 가족과의 합의부터 데려온 첫 주까지 체크리스트로 준비해 보세요.\n보호센터에 연락하기 전에 물어볼 질문도 모아두었어요.', action: '입양하개 둘러보기', target: 'adoption', variant: 5 },
  { label: '등록하개', desc: '로그인하거나 새 계정을 만들 수 있어요.\n회원가입 후 닉네임을 설정해 커뮤니티에 참여하세요.', action: '로그인 · 회원가입', target: 'register', variant: 2 },
] as const;

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [chapter, setChapter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoppingDogs] = useState(() => {
    const first = Math.floor(Math.random() * paradeDogs.length);
    const second = (first + 1 + Math.floor(Math.random() * (paradeDogs.length - 1))) % paradeDogs.length;
    return [first, second];
  });
  const [shakingDogs] = useState(() =>
    paradeDogs.map((_, index) => index).filter((index) => !hoppingDogs.includes(index))
      .map((index) => ({ index, draw: Math.random() })).sort((a, b) => a.draw - b.draw)
      .slice(0, 2).map(({ index }) => index)
  );
  const current = chapters[chapter];
  const storyReveal = useScrollReveal();

  return (
    <main>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-lockup">
          <h1 id="hero-title" className="hero-type"><span className="sr-only">Together with Dog</span><HandwrittenTitle /></h1>
        </div>
        <div aria-label={paradeDogs.length + "종의 강아지 행렬"} role="img" className={`dog-parade ${paused ? 'is-paused' : ''}`}>
          <div className="parade-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className="parade-group" key={copy}>
                {paradeDogs.map((dog, variant) => (
                  <div className={`parade-friend friend-${variant}${variant === hoppingDogs[0] ? ' is-hopping hop-front' : variant === hoppingDogs[1] ? ' is-hopping hop-zigzag' : shakingDogs.includes(variant) ? ' is-shaking' : ''}`} key={dog.id}>
                    <div className="parade-hop"><ParadeDog variant={variant} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="story-area">
        <div className="hero-bottom"><a href="#our-story">사이트 안내 </a><button className="parade-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? '강아지 행진 재생' : '강아지 행진 일시정지'} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}<span>{paused ? '재생' : '일시정지'}</span></button></div>
        <div className="bone-divider" aria-hidden="true"><svg viewBox="0 0 1200 98" preserveAspectRatio="none">
          <path d="M0 72C0 44 20 12 63 12c45 0 63 68 116 68h842c53 0 71-68 116-68 43 0 63 32 63 60" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg></div>
        <section ref={storyReveal.ref} className={`story-section reveal-${storyReveal.state}`} id="our-story" aria-label="사이트 안내">
          <div className="story-layout">
            <div className="chapter-list" role="tablist" aria-label="함께하개 소개">
              {chapters.map((item, index) => <button key={item.label} id={`chapter-${index}`} role="tab" aria-selected={chapter === index} aria-controls="chapter-panel" tabIndex={chapter === index ? 0 : -1} onClick={() => setChapter(index)} onKeyDown={(event) => {
                let next = index;
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % chapters.length;
                else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + chapters.length - 1) % chapters.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = chapters.length - 1;
                else return;
                event.preventDefault(); setChapter(next); document.getElementById(`chapter-${next}`)?.focus();
              }} className={chapter === index ? 'selected' : ''}><span>{item.label}</span></button>)}
            </div>
            <div className="story-panel" id="chapter-panel" role="tabpanel" aria-labelledby={`chapter-${chapter}`} tabIndex={0}>
              <div className="story-copy" key={chapter}><h2>{current.label}</h2><p>{current.desc}</p><button className="story-cta" onClick={() => onNavigate(current.target)}>{current.action}</button></div>
              <div className="story-illustration"><ParadeDog variant={current.variant} /><div className="illustration-ground" /></div>
            </div>
          </div>
        </section>
        <DailyBreed />
      </div>
    </main>
  );
}
