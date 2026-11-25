import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const source = 'https://rescueanimal.kr';
const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

interface DogNotice {
  id: number;
  species: string;
  breed: string;
  sex: string;
  age: string;
  image_url: string | null;
  shelter_name: string;
  process_state: string;
  notice_end: string | null;
}

function NoticeCard({ dog }: { dog: DogNotice }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [tilted, setTilted] = useState(false);
  const photo = dog.image_url?.replace(/^http:\/\//i, 'https://');
  return <li className={`notice-card${tilted ? " is-tilted" : ""}`} onAnimationEnd={() => setTilted(false)}>
    <a onClick={() => setTilted(true)} href={source + '/animals/' + dog.id} target="_blank" rel="noreferrer" aria-label={dog.breed + ' 상세 공고 ' + dog.id}>
      <div className="notice-photo">
        {photo?.startsWith('https://') && !imageFailed
          ? <img src={photo} alt={dog.breed + ' 보호견 공고 사진'} loading="lazy" onError={() => setImageFailed(true)} />
          : <span><ImageOff size={22} aria-hidden="true" />사진은 상세 공고에서 확인</span>}
      </div>
      <div className="notice-copy">
        <span className="project-tag">{dog.process_state}</span>
        <h3>{dog.breed || '보호견'}</h3>
        <p>{[dog.sex === 'M' ? '수컷' : dog.sex === 'F' ? '암컷' : '', dog.age].filter(Boolean).join(' · ')}</p>
        <p>{dog.shelter_name}</p>
        {dog.notice_end && <p className="text-sm">공고 종료 예정 {dog.notice_end}</p>}
      </div>
    </a>
  </li>;
}

export default function AdoptionListings({ guide }: { guide: ReactNode }) {
  const [selection, setSelection] = useState('');
  const [query, setQuery] = useState({ region: '', request: 0 });
  const [dogs, setDogs] = useState<DogNotice[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [snapshotAt, setSnapshotAt] = useState<number>();
  const saved = useRef(new Map<string, { at: number; dogs: DogNotice[] }>());
  const rail = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 26000);
    let mounted = true;
    const params = new URLSearchParams({ kind: 'DOG', limit: '18' });
    if (query.region) params.set('region', query.region);
    fetch(source + '/api/public/v1/animals?' + params, {
      signal: controller.signal, headers: { Accept: 'application/json' },
    }).then(async (response) => {
      if (!response.ok) throw new Error('Service unavailable');
      const result = await response.json();
      if (!result.ok || !Array.isArray(result.data)) throw new Error('Unexpected data');
      if (!mounted) return;
      const notices = result.data.filter((dog: DogNotice) => dog.species === 'DOG' && dog.process_state === '보호중' && Number.isInteger(dog.id));
      saved.current.set(query.region, { at: Date.now(), dogs: notices });
      setDogs(notices);
      setSnapshotAt(undefined);
    }).catch(() => {
      if (mounted) setFailed(true);
    }).finally(() => window.clearTimeout(timeout));

    const recent = saved.current.get(query.region);
    if (recent?.dogs.length) {
      setDogs(recent.dogs);
      setSnapshotAt(recent.at);
    } else {
      void fetch(import.meta.env.BASE_URL + 'adoption-snapshot.json')
        .then((response) => response.ok ? response.json() : null)
        .then((snapshots: Record<string, { at: number; dogs: DogNotice[] }> | null) => {
          const snapshot = snapshots?.[query.region];
          if (!mounted || !snapshot?.dogs.length || saved.current.has(query.region)) return;
          setDogs(snapshot.dogs);
          setSnapshotAt(snapshot.at);
        }).catch(() => {});
    }
    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function lookup(region: string) {
    setDogs(null);
    setSnapshotAt(undefined);
    setFailed(false);
    setQuery((previous) => ({ region, request: previous.request + 1 }));
  }

  function move(direction: number) {
    const list = rail.current;
    if (!list) return;
    list.scrollBy({ left: direction * list.clientWidth * 0.82, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <>
    <section id="adoption-listings" className="adoption-section" aria-labelledby="notices-title">
      <div className="notice-header">
        <div>
          <h2 id="notices-title">{query.region ? query.region + '에서 보호 중인 강아지' : '오늘 만나는 입양 공고'}</h2>
          <p>가족을 기다리는 보호견의 공고를 살펴보세요. 입양 가능 여부는 보호센터에 확인해 주세요.</p>
        </div>
        <form className="notice-region" onSubmit={(event) => {
          event.preventDefault();
          lookup(selection);
        }}>
          <label htmlFor="adoption-region">지역별 찾기</label>
          <div className="region-field">
            <select className="project-control" id="adoption-region" value={selection} onChange={(event) => setSelection(event.target.value)}>
              <option value="">전국</option>
              {regions.map((region) => <option key={region}>{region}</option>)}
            </select>
            <button className="project-action">조회</button>
          </div>
        </form>
      </div>
      {!!dogs?.length && <div className="notice-controls">
          <button type="button" aria-label="이전 보호견 보기" onClick={() => move(-1)}><ChevronLeft size={22} /></button>
          <button type="button" aria-label="다음 보호견 보기" onClick={() => move(1)}><ChevronRight size={22} /></button>
        </div>}
      {snapshotAt && <p className="notice-status text-sm" role="status">
        {new Date(snapshotAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'medium', timeStyle: 'short' })} 확인한 공고
        {failed ? ' · 최신 조회에 실패했어요. ' : ' · 최신 공고를 확인 중이에요.'}
        {failed && <>
          <button type="button" className="underline" onClick={() => lookup(query.region)}>다시 조회</button>
          <span> · </span>
          <a className="underline" href={source + '/animals'} target="_blank" rel="noreferrer">원본 공고 보기</a>
        </>}
      </p>}
      {failed && !snapshotAt ? <div className="project-card notice-status" role="status">
        <p>공고를 불러오지 못했어요. 다시 조회하거나 원본 사이트에서 확인해 주세요.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <button className="project-action" onClick={() => lookup(query.region)}>다시 조회</button>
          <a className="project-action" href={source + '/animals'} target="_blank" rel="noreferrer">원본 공고 보기</a>
        </div>
      </div> : dogs === null ? <p className="project-card notice-status" role="status">보호견 공고를 불러오는 중이에요.</p> :
        dogs.length ? <ul key={query.request} className="notice-rail" aria-label="보호견 공고" tabIndex={0} ref={rail}>
          {dogs.map((dog) => <NoticeCard dog={dog} key={dog.id} />)}
        </ul> : <p className="project-card notice-status" role="status">이 지역에서 조회된 보호견 공고가 없어요. 다른 지역을 선택해 보세요.</p>}
      <p className="text-sm"><a className="underline" href={source + '/animals'} target="_blank" rel="noreferrer">공고 출처 RescueAnimal</a></p>
    </section>
    <p className="home-disclaimer">건강 정보는 참고용이며, 정확한 진단은 수의사에게 문의하세요.</p>
    <section className="adoption-links" aria-label="입양 준비 가이드 및 보호센터 문의">
      {guide}
      <article className="project-card">
        <h3>보호센터에 문의하기</h3>
        <p>공고 상세의 연락처나 보호센터 목록에서 입양 가능 여부, 방문 일정, 필요한 서류를 확인하세요.</p>
        <a className="project-action" href={source + '/shelters'} target="_blank" rel="noreferrer">동물보호센터 찾기</a>
      </article>
    </section>
  </>;
}
