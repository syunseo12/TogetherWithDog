/*
# 강아지 케어 커뮤니티 테이블 생성

1. 새 테이블
- `community_posts` - 강아지 정보 교환 커뮤니티 게시글
  - id (uuid, PK)
  - nickname (text, 작성자 닉네임)
  - body_part (text, 관련 부위: eyes, ears, nose, mouth, fur, paws, tail, back 등)
  - title (text, 제목)
  - content (text, 내용)
  - created_at (timestamptz)

2. 보안
- RLS 활성화
- 로그인 없이 사용 가능하므로 anon, authenticated 모두 CRUD 허용
*/

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '익명 견주',
  body_part text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_posts" ON community_posts;
CREATE POLICY "anon_select_posts" ON community_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON community_posts;
CREATE POLICY "anon_insert_posts" ON community_posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON community_posts;
CREATE POLICY "anon_delete_posts" ON community_posts FOR DELETE
  TO anon, authenticated USING (true);
