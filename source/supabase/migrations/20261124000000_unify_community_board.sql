BEGIN;

ALTER TABLE public.feed_posts
  ADD COLUMN title text,
  ADD COLUMN category text CHECK (category IN ('일상·사진', '건강·돌봄', '훈련·행동', '입양·준비', '자유 이야기')),
  ADD COLUMN body_part text,
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.feed_comments ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.community_post_comments ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS anon_insert_feed_posts ON public.feed_posts;
DROP POLICY IF EXISTS anon_delete_feed_posts ON public.feed_posts;
DROP POLICY IF EXISTS anon_insert_feed_comments ON public.feed_comments;
DROP POLICY IF EXISTS anon_delete_feed_comments ON public.feed_comments;
DROP POLICY IF EXISTS anon_insert_posts ON public.community_posts;
DROP POLICY IF EXISTS anon_delete_posts ON public.community_posts;
DROP POLICY IF EXISTS anon_insert_post_comments ON public.community_post_comments;
DROP POLICY IF EXISTS anon_delete_post_comments ON public.community_post_comments;

CREATE POLICY feed_post_insert_owned ON public.feed_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY feed_post_update_owned ON public.feed_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY feed_post_delete_owned ON public.feed_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY feed_comment_insert_owned ON public.feed_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY part_comment_insert_owned ON public.community_post_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-images', 'community-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']);

CREATE POLICY community_image_upload_owned ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'community-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY community_image_select_owned ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'community-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY community_image_delete_owned ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'community-images' AND (storage.foldername(name))[1] = auth.uid()::text);

COMMIT;
