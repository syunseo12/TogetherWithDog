/*
# 부위별 커뮤니티 게시글 댓글 테이블 생성

1. 새 테이블
- `community_post_comments` - 돌봐주개(부위별 커뮤니티) 게시글의 댓글
  - id (uuid, PK)
  - post_id (uuid, FK -> community_posts.id, ON DELETE CASCADE)
  - nickname (text, 작성자 닉네임)
  - content (text, 내용)
  - created_at (timestamptz)

2. 보안
- RLS 활성화
- 로그인 없이도 사용 가능하므로 anon, authenticated 모두 CRUD 허용
- post_id는 CASCADE로 community_posts 삭제 시 댓글도 자동 삭제
*/

CREATE TABLE IF NOT EXISTS community_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  nickname text NOT NULL DEFAULT '익명 견주',
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_post_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON community_post_comments TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_post_comments" ON community_post_comments;
CREATE POLICY "anon_select_post_comments" ON community_post_comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_post_comments" ON community_post_comments;
CREATE POLICY "anon_insert_post_comments" ON community_post_comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_post_comments" ON community_post_comments;
CREATE POLICY "anon_delete_post_comments" ON community_post_comments FOR DELETE
  TO anon, authenticated USING (true);
