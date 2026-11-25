# 함께하개 · Together with Dog

공개 사이트는 [GitHub Pages](https://syunseo12.github.io/TogetherWithDog/)에서 열 수 있습니다.

Pages의 게시 원본은 `main` 브랜치의 `/(root)`입니다. 루트의 `index.html`, `config.js`, `assets/`, `breeds/`, `adoption-snapshot.json`이 배포 파일입니다. React 소스와 Supabase 마이그레이션은 `source/`에 있습니다.

## 수정 및 배포

```sh
cd source
npm ci
npm run typecheck
npm run build
```

`source/dist/`의 내용을 저장소 루트에 반영한 뒤, 이전 빌드에서 생성된 해시 파일을 정리하고 커밋합니다. `source/public/config.js`는 Supabase URL과 브라우저용 공개 키를 설정합니다.

회원가입 인증 메일이 공개 사이트로 돌아오려면 Supabase Auth의 Redirect URLs에 `https://syunseo12.github.io/TogetherWithDog/`가 허용되어 있어야 합니다. 가입 화면에서 닉네임 중복 확인과 자동 저장을 활성화하는 SQL은 [가입 닉네임 마이그레이션](source/supabase/migrations/20261124013000_signup_nickname.sql)에 있습니다. 이 마이그레이션이 없는 환경에서는 로그인 뒤 계정 화면에서 닉네임을 확인하고 저장할 수 있습니다.
