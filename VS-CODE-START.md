# 함께하개 · VS Code에서 실행하기

1. ZIP을 압축 해제해 주세요.
2. VS Code에서 **파일 → 폴더 열기**로 `together-with-dog` 폴더를 여세요.
3. Node.js와 npm이 설치된 상태에서 VS Code 터미널에 아래 명령을 차례로 입력하세요.

   ```sh
   npm ci
   npm run dev
   ```

4. 터미널에 표시되는 주소를 브라우저에서 여세요. 기본 주소는 http://localhost:5173 입니다.

## 수정할 파일

| 변경하려는 곳 | 파일 |
|---|---|
| 메인 화면과 강아지 행렬 | `src/components/AboutPage.tsx`, `src/components/ParadeDog.tsx` |
| 입양 공고와 오늘의 강아지 | `src/components/AdoptionListings.tsx`, `src/components/AdoptionGuide.tsx` |
| 돌봐주개 | `src/components/CarePage.tsx` |
| 소통하개 | `src/components/CommunityPage.tsx` |
| 회원가입 | `src/components/RegisterPage.tsx` |
| 색상과 화면 배치 | `src/index.css` |
| 사진 | `public/breeds/` |

`npm run typecheck`로 코드 오류를 확인할 수 있어요. `npm run build`를 실행하면 배포용 파일이 `dist`에 생성돼요.

로컬에서 파일을 저장하면 미리보기 화면에 반영돼요. 기존 함께하개 사이트에는 별도 배포가 필요해요.

포함된 `.env.local`은 기존 사이트의 공개 클라이언트 설정입니다. 소스 수정은 로컬에만 저장되지만, 실행 중 로그인해서 글이나 댓글을 등록하면 기존 데이터베이스에 저장될 수 있어요. 가입 전 닉네임 중복 확인은 해당 Supabase 데이터베이스에 관련 마이그레이션을 적용해야 작동합니다.
