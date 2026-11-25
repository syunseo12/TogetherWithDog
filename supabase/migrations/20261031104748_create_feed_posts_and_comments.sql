/*
# 소통하개 커뮤니티 피드 테이블 생성

1. 새 테이블
- `feed_posts` - 자유게시판 게시글 (강아지 사진 자랑, 고민 등)
  - id (uuid, PK)
  - nickname (text, 작성자 닉네임)
  - content (text, 내용)
  - image_url (text, 이미지 URL - 선택사항)
  - created_at (timestamptz)
- `feed_comments` - 게시글 댓글
  - id (uuid, PK)
  - post_id (uuid, FK -> feed_posts.id, ON DELETE CASCADE)
  - nickname (text, 작성자 닉네임)
  - content (text, 내용)
  - created_at (timestamptz)

2. 보안
- RLS 활성화 (두 테이블 모두)
- 로그인 없이 사용 가능하므로 anon, authenticated 모두 CRUD 허용
- feed_comments의 post_id는 CASCADE로 feed_posts 삭제 시 자동 삭제
*/

CREATE TABLE IF NOT EXISTS feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '익명 견주',
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feed_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  nickname text NOT NULL DEFAULT '익명 견주',
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON feed_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON feed_comments TO anon, authenticated;

-- feed_posts policies
DROP POLICY IF EXISTS "anon_select_feed_posts" ON feed_posts;
CREATE POLICY "anon_select_feed_posts" ON feed_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feed_posts" ON feed_posts;
CREATE POLICY "anon_insert_feed_posts" ON feed_posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feed_posts" ON feed_posts;
CREATE POLICY "anon_delete_feed_posts" ON feed_posts FOR DELETE
  TO anon, authenticated USING (true);

-- feed_comments policies
DROP POLICY IF EXISTS "anon_select_feed_comments" ON feed_comments;
CREATE POLICY "anon_select_feed_comments" ON feed_comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feed_comments" ON feed_comments;
CREATE POLICY "anon_insert_feed_comments" ON feed_comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feed_comments" ON feed_comments;
CREATE POLICY "anon_delete_feed_comments" ON feed_comments FOR DELETE
  TO anon, authenticated USING (true);
