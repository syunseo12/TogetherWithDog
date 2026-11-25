import { useState } from 'react';
import AdoptionListings from './AdoptionListings';
import { paradeDogs } from '@/data/paradeDogs';

const breedNotes = [
  '카디건 웰시 코기는 목양견 출신입니다. 짧은 다리와 긴 몸을 가졌고, 산책과 놀이를 즐기는 친구가 많아요.',
  '비글은 후각을 쓰는 활동을 즐기는 하운드입니다. 산책 중 냄새를 탐색할 시간을 충분히 주세요.',
  '테리어는 여러 견종을 아우르는 그룹입니다. 생김새도 다양하고, 탐색 놀이를 즐기는 친구가 많아요.',
  '포메라니안은 풍성한 이중모가 특징입니다. 엉키기 쉬운 부분을 살피며 빗질해 주세요.',
  '닥스훈트의 이름은 독일어로 오소리 사냥개를 뜻해요. 기다란 몸과 짧은 다리가 특징이에요.',
  '푸들은 크기에 따라 여러 종류가 있어요. 곱슬털은 엉키기 쉬워 꾸준히 빗질하고 미용 일정을 챙겨 주세요.',
  '퍼그는 둥근 머리와 짧은 주둥이가 특징입니다. 더운 날에는 시원한 곳에서 쉬도록 해 주세요.',
  '달마시안은 흰 바탕에 점박이 무늬를 가진 견종이에요. 산책과 놀이 시간을 충분히 마련해 주세요.',
];

const checklist = [
  '가족 모두와 입양에 합의하고 돌봄 역할을 정했어요.',
  '주거지에서 반려견을 키울 수 있고 혼자 있는 시간을 고려했어요.',
  '사료·용품·예방 관리·진료에 들어갈 비용을 점검했어요.',
  '산책·훈련 시간을 확보하고 외출이나 여행 때 돌봄 계획을 세웠어요.',
];
export default function AdoptionGuide() {
  const seoulDay = Math.floor((Date.now() + 9 * 3600000) / 86400000);
  const breed = seoulDay % breedNotes.length;
  const [checked, setChecked] = useState<number[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('dog-adoption-checklist') ?? '[]');
      return Array.isArray(saved) ? saved.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < checklist.length) : [];
    } catch { return []; }
  });

  function toggle(index: number) {
    const next = checked.includes(index) ? checked.filter((entry) => entry !== index) : [...checked, index];
    setChecked(next);
    try { localStorage.setItem('dog-adoption-checklist', JSON.stringify(next)); } catch { /* Checklist still works for this visit. */ }
  }

  return (
    <div className="home-extras">
      <section className="daily-breed" aria-labelledby="daily-breed">
        <div>
          <h2 id="daily-breed">오늘의 강아지</h2>
          <p className="breed-name">{paradeDogs[breed].label}</p>
          <p className="breed-description">{breedNotes[breed]}</p>
        </div>
        <figure className="breed-picture">
          <img src={import.meta.env.BASE_URL + 'breeds/' + paradeDogs[breed].id + '.jpg'} alt={paradeDogs[breed].label + ' 사진'} loading="lazy" />
          <figcaption>{paradeDogs[breed].id === 'poodle'
            ? <a href="https://pixabay.com/photos/toy-poodle-dog-puppy-pet-animal-6478265/" target="_blank" rel="noreferrer">사진 Javaistan · Pixabay</a>
            : <a href="https://dog.ceo/dog-api/" target="_blank" rel="noreferrer">사진 Dog CEO</a>}</figcaption>
        </figure>
      </section>
      <AdoptionListings guide={
        <article id="adoption" className="project-card" aria-labelledby="adoption-title">
          <h2 id="adoption-title">입양 준비 가이드</h2>
          <p>평생 함께할 준비를 점검해 보세요.</p>
          <div className="adoption-checks">
            {checklist.map((label, index) => (
              <label key={label}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} />{label}</label>
            ))}
          </div>
          <p className="text-sm" aria-live="polite">{checked.length} / {checklist.length} 완료</p>
        </article>
      } />
    </div>
  );
}
