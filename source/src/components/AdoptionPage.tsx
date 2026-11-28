import { useState } from 'react';
import AdoptionListings from './AdoptionListings';

const groups = [
  { title: '가족과 생활 계획', items: [
    [0, '가족 모두와 입양에 합의하고 돌봄 역할을 정했어요.'],
    [1, '주거지의 반려동물 규정을 확인하고 혼자 있는 시간을 고려했어요.'],
    [3, '산책·훈련 시간을 확보하고 여행이나 외출 때 돌봄 계획을 정했어요.'],
    [4, '알레르기와 기존 반려동물의 생활 공간을 가족과 상의했어요.'],
  ] },
  { title: '예산과 집 준비', items: [
    [2, '사료·용품·예방 관리·진료에 들어갈 비용을 점검했어요.'],
    [5, '매달 쓸 예산과 갑작스러운 진료에 대비한 예산을 따로 적었어요.'],
    [6, '물그릇, 잠자리, 이동장이나 안전벨트, 목줄과 배변용품을 준비했어요.'],
    [7, '전선, 약품, 먹으면 위험한 물건을 치우고 현관과 창문을 점검했어요.'],
  ] },
  { title: '보호견 만나기', items: [
    [8, '관심 있는 공고의 번호와 보호센터 연락처를 기록했어요.'],
    [9, '센터에 현재 상태와 입양 가능 여부, 방문 일정을 확인했어요.'],
    [10, '성격, 산책 습관, 혼자 있는 시간, 다른 동물과 지낸 경험을 물었어요.'],
    [11, '건강 기록, 준비 서류, 인계 절차를 센터와 확인했어요.'],
  ] },
  { title: '데려오는 날과 첫 주', items: [
    [12, '안전한 이동 수단과 집에서 조용히 쉴 공간을 마련했어요.'],
    [13, '기존에 먹던 사료와 배변 습관 등 인계받을 내용을 적었어요.'],
    [14, '이용할 동물병원을 정하고 건강 기록을 가져갈 계획을 세웠어요.'],
    [15, '동물등록 또는 보호자 정보 변경이 필요한지 확인했어요.'],
  ] },
] as const;

const storageKey = 'dog-adoption-checklist';
const itemCount = groups.reduce((count, group) => count + group.items.length, 0);

export default function AdoptionPage() {
  const [checked, setChecked] = useState<number[]>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      return Array.isArray(value) ? [...new Set(value.filter((id): id is number => Number.isInteger(id) && id >= 0 && id < itemCount))] : [];
    } catch { return []; }
  });

  function toggle(id: number) {
    const next = checked.includes(id) ? checked.filter((item) => item !== id) : [...checked, id];
    setChecked(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Works for the current visit. */ }
  }

  return (
    <main className="home-extras adoption-page">
      <header className="adoption-intro">
        <h1>입양하개</h1>
        <p>가족을 기다리는 보호견을 만나고, 함께 살 준비부터 첫 주 계획까지 차근차근 확인해 보세요.</p>
        <nav aria-label="입양하개 바로가기">
          <a className="project-action" href="#adoption-listings">보호견 공고</a>
          <a className="project-action" href="#adoption">준비 체크리스트</a>
          <a className="project-action" href="#shelter-contact">보호센터 문의</a>
        </nav>
      </header>
      <AdoptionListings guide={
        <article id="adoption" className="project-card" aria-labelledby="adoption-title">
          <h2 id="adoption-title">입양 준비 가이드</h2>
          <p id="adoption-progress" aria-live="polite">{checked.length} / {itemCount} 완료</p>
          <progress aria-label="입양 준비 진행률" className="adoption-progress" value={checked.length} max={itemCount} />
          <p className="text-sm">체크한 내용은 이 브라우저에 저장돼요.</p>
          {groups.map((group) => (
            <fieldset key={group.title} className="adoption-check-group">
              <legend>{group.title}</legend>
              <div className="adoption-checks">
                {group.items.map(([id, label]) => (
                  <label key={id}><input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} />{label}</label>
                ))}
              </div>
            </fieldset>
          ))}
        </article>
      } />
    </main>
  );
}
