import { supabase } from './supabase';

export const categories = ['일상·사진', '건강·돌봄', '훈련·행동', '입양·준비', '자유 이야기'] as const;

type PostSource = 'feed_posts' | 'community_posts';
export interface BoardPost {
  id: string;
  source: PostSource;
  nickname: string;
  title?: string;
  content: string;
  image_url?: string | null;
  body_part?: string | null;
  category?: string | null;
  user_id?: string | null;
  created_at: string;
}

const feedFields = 'id, nickname, content, image_url, created_at';
const partFields = 'id, nickname, title, content, body_part, created_at';

export async function loadBoard() {
  const [current, legacy] = await Promise.all([
    supabase.from('feed_posts').select('id, nickname, content, image_url, created_at, title, body_part, category, user_id').order('created_at', { ascending: false }),
    supabase.from('community_posts').select(partFields).order('created_at', { ascending: false }),
  ]);
  const feed = current.error?.code === '42703'
    ? await supabase.from('feed_posts').select(feedFields).order('created_at', { ascending: false })
    : current;
  const posts: BoardPost[] = [
    ...(feed.data ?? []).map((item) => ({ ...item, source: 'feed_posts' as const })),
    ...(legacy.data ?? []).map((item) => ({ ...item, source: 'community_posts' as const })),
  ];
  posts.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  return { posts, error: !!(feed.error || legacy.error), writable: !current.error };
}

export const postKey = (post: BoardPost) => post.source + ':' + post.id;
export const postCategory = (post: BoardPost) => post.category || (post.body_part ? '건강·돌봄' : '일상·사진');
export const commentTable = (post: BoardPost) => post.source === 'feed_posts' ? 'feed_comments' : 'community_post_comments';
