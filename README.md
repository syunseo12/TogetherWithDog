# 함께하개 · Together with Dog

[GitHub Pages에서 열기](https://syunseo12.github.io/TogetherWithDog/)

Pages의 게시 원본은 `main` 브랜치의 `/(root)`입니다. React 소스와 Supabase 마이그레이션은 `source/`에 있습니다.

## 수정 및 배포

```sh
cd source
npm ci
npm run typecheck
npm run build -- --base=/TogetherWithDog/
```

`source/dist/`의 내용을 저장소 루트에 반영한 뒤 이전 빌드의 해시 파일을 정리합니다. Supabase 연결 기본값은 `source/src/lib/supabase.ts`에 있습니다. 가입 인증 메일의 이동 주소는 Supabase Auth 설정에서 관리합니다.
