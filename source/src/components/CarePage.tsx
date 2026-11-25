import { useEffect, useRef, useState } from 'react';
import { PawPrint, Stethoscope } from 'lucide-react';
import DogIllustration from '@/components/DogIllustration';
import InfoPanel from '@/components/InfoPanel';
import { loadBoard, postKey, type BoardPost } from '@/lib/community';
import VetHospitalPanel from '@/components/VetHospitalPanel';
import { dogParts } from '@/data/dogParts';

export default function CarePage({ onOpenBoard }: { onOpenBoard: (part: string, post?: string, write?: boolean) => void }) {
  const [selection, setSelection] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const showVet = selection === 'vet';
  const partInfo = selection && !showVet ? dogParts[selection] : null;

  function select(id: string) {
    setSelection(id);
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }

  return (
    <main className="care-layout">
      <header className="care-heading">
        <h1>우리 강아지, <span>건강하게</span> 돌봐요</h1>
        <p>강아지 그림이나 버튼에서 부위를 선택하세요. 목줄을 누르면 동물병원을 찾을 수 있어요.</p>
      </header>
      <div className="care-grid">
        <div className="care-picker">
          <DogIllustration
            selectedPart={partInfo ? partInfo.id : null}
            onSelectPart={select}
            collarActive={showVet}
            onCollarClick={() => select('vet')}
          />
          <div className="care-choices" role="group" aria-label="부위와 동물병원 선택">
            {Object.values(dogParts).map((part) => (
              <button type="button" key={part.id} onClick={() => select(part.id)}
                aria-pressed={selection === part.id} aria-controls="care-results">
                <span aria-hidden="true">{part.emoji}</span> {part.label}
              </button>
            ))}
            <button type="button" className="care-vet-choice" onClick={() => select('vet')}
              aria-pressed={showVet} aria-controls="care-results">
              <Stethoscope size={16} aria-hidden="true" /> 동물병원 찾기
            </button>
          </div>
        </div>
        <div id="care-results" ref={panelRef} className="care-results" role="region"
          aria-label={showVet ? '동물병원 안내' : partInfo ? partInfo.label + ' 돌봄 정보' : '돌봄 안내'} tabIndex={0}>
          {partInfo ? (
            <div key={partInfo.id} className="space-y-3">
              <InfoPanel partInfo={partInfo} onWritePost={() => onOpenBoard(partInfo.id, '', true)} />
              <RelatedPosts part={partInfo.id} label={partInfo.label} onOpenBoard={onOpenBoard} />
            </div>
          ) : showVet ? <VetHospitalPanel /> : (
            <div className="care-empty">
              <PawPrint size={38} aria-hidden="true" />
              <h2>어디가 궁금한가요?</h2>
              <p>부위를 선택하면 질병, 세척법, 행동 반응과 관련 경험담을 볼 수 있어요.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function RelatedPosts({ part, label, onOpenBoard }: { part: string; label: string; onOpenBoard: (part: string, post?: string) => void }) {
  const [result, setResult] = useState<{ posts: BoardPost[]; error: boolean } | null>(null);
  useEffect(() => {
    let active = true;
    void loadBoard().then(({ posts, error }) => {
      if (active) setResult({ posts: posts.filter((post) => post.body_part === part).slice(0, 3), error });
    });
    return () => { active = false; };
  }, [part]);

  return <section className="project-card space-y-3" aria-label={label + ' 관련 경험담'}>
    <h3>{label} 관련 경험담</h3>
    {!result ? <p role="status">경험담을 불러오는 중이에요.</p> :
      result.posts.length === 0 ? <p>{result.error ? '경험담을 불러오지 못했어요.' : '이 부위에 등록된 경험담이 없어요.'}</p> :
      <ul className="space-y-2">{result.posts.map((post) => <li key={postKey(post)}><button className="text-left underline line-clamp-2 break-all" onClick={() => onOpenBoard(part, postKey(post))}>{post.title || post.content}</button></li>)}</ul>}
    <button className="project-action" onClick={() => onOpenBoard(part)}>소통하개에서 관련 글 보기</button>
  </section>;
}
