/*
# 닉네임 프로필 테이블 생성

1. 새 테이블
- `profiles` - 로그인한 사용자의 닉네임 저장 (중복 불가)
  - id (uuid, PK)
  - user_id (uuid, FK -> auth.users, UNIQUE, ON DELETE CASCADE)
  - nickname (text, UNIQUE - 같은 닉네임 중복 불가)
  - created_at (timestamptz)

2. 보안
- RLS 활성화
- 모든 authenticated 사용자가 SELECT 가능 (닉네임 중복 확인용)
- INSERT/UPDATE/DELETE는 본인 프로필만 가능
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
