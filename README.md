# 함께하개 · Together with Dog

제공된 Bolt 프로젝트의 색상과 기능을 유지하면서 스케치를 참고해 디자인을 수정한 사이트입니다.

## 현재 반영한 디자인

- 로고를 유지하고, 책갈피 메뉴에는 돌봐주개 제목과 같은 Noto Sans KR 굵은 글꼴을 사용합니다.
- TOGETHER와 WITH는 기존 손그림 윤곽선을 유지하고, DOG만 오렌지색으로 채웠습니다. 글자 안의 장식 빗금은 제거했습니다.
- 원래 네 마리의 일러스트를 유지하고 닥스훈트·푸들·퍼그·달마시안을 추가해 여덟 종류가 끊김 없이 행진합니다.
- 사이트 안내부터 배경이 흰색으로 전환되며, 설명 영역은 스크롤로 화면에 들어오면 아래에서 올라옵니다.
- 돌봐주개 강아지를 같은 계열의 선과 색으로 다시 그렸습니다. 작은 흰자와 검은 눈동자가 선택한 부위를 바라봅니다.
- 귀·눈·코·입·피부·발·꼬리·등에는 각각 부드러운 선택 애니메이션을 적용했습니다. 실제 그림 클릭, 키보드 선택, 부위 선택 버튼 모두 연결됩니다.
- 동작 줄이기 설정에서는 스크롤 등장과 반복 움직임을 줄입니다.

기존의 부위별 건강 정보, 동물병원 안내, 게시판, 로그인·회원가입 기능은 유지했습니다.

## 실행

```sh
npm ci
npm run dev
```

원본의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 `.env`에 설정하세요. `.env`는 Git에서 제외됩니다. 배포 빌드에는 원본 프로젝트의 공개 클라이언트 설정이 반영되어 있습니다.

```sh
npm run typecheck
npm run build
```

## 주요 파일

- `src/components/HandwrittenTitle.tsx`: 손글씨 제목
- `src/components/ParadeDog.tsx`, `src/data/paradeDogs.ts`: 강아지 일러스트와 종류
- `src/components/DogIllustration.tsx`, `src/lib/dogMotion.ts`: 부위별 그림, 시선과 선택 반응
- `src/hooks/useScrollReveal.ts`: 설명 영역 등장 애니메이션
- `src/components/AboutPage.tsx`, `src/index.css`: 메인 화면과 배치

`.openai/hosting.json`은 현재 비공개 미리보기 사이트의 배포 설정입니다. 기존 Bolt 사이트와는 별도로 구동됩니다.

## 검증

타입 검사·프로덕션 빌드, 모든 부위에 대한 시선 방향과 눈동자 범위, 선택별 움직임 연결, 여덟 종류의 SVG 렌더링을 확인했습니다. 기존 네 마리 일러스트와 로고가 유지되었는지도 확인했습니다.
Sites 브라우저 제어 도구가 제공되지 않아 스크롤·클릭의 브라우저 최종 QA는 진행하지 못했습니다. 실제 계정 생성이나 게시글 작성 등 데이터 변경은 하지 않았습니다.
