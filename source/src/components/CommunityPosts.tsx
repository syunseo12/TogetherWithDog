import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { MessageCircle, Trash2, Send, X, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';

interface CommunityPost {
  id: string;
  nickname: string;
  body_part: string;
  title: string;
  content: string;
  created_at: string;
}

interface CommunityPostComment {
  id: string;
  post_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

interface CommunityPostsProps {
  bodyPart: string;
  partLabel: string;
  isWriteOpen: boolean;
  onCloseWrite: () => void;
}

export default function CommunityPosts({ bodyPart, partLabel, isWriteOpen, onCloseWrite }: CommunityPostsProps) {
  const { nickname: userNickname } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeNickname = isAnonymous ? '익명 견주' : (userNickname || '익명 견주');

  // Expanded post id (for showing comments)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Comments state keyed by post id
  const [commentsByPost, setCommentsByPost] = useState<Record<string, CommunityPostComment[]>>({});
  const [commentInputByPost, setCommentInputByPost] = useState<Record<string, { nickname: string; content: string; anonymous: boolean }>>({});
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    loadPosts();
    setExpandedPostId(null);
  }, [bodyPart]);

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, nickname, body_part, title, content, created_at')
      .eq('body_part', bodyPart)
      .order('created_at', { ascending: false });

    if (error) {
      setError('게시글을 불러오지 못했습니다.');
    } else {
      setPosts(data || []);
      setError(null);
    }
    setLoading(false);
  }

  async function loadComments(postId: string) {
    setCommentsLoading(true);
    const { data, error } = await supabase
      .from('community_post_comments')
      .select('id, post_id, nickname, content, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error) {
      setCommentsByPost((prev) => ({ ...prev, [postId]: data || [] }));
    }
    setCommentsLoading(false);
  }

  function toggleComments(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      if (!commentsByPost[postId]) {
        loadComments(postId);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        nickname: activeNickname,
        body_part: bodyPart,
        title: title.trim(),
        content: content.trim(),
      })
      .select('id, nickname, body_part, title, content, created_at')
      .single();

    if (error) {
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } else if (data) {
      setPosts([data, ...posts]);
      setTitle('');
      setContent('');
      onCloseWrite();
    }
    setSubmitting(false);
  }

  async function handleDeletePost(id: string) {
    const { error } = await supabase.from('community_posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
      setCommentsByPost((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (expandedPostId === id) setExpandedPostId(null);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent, postId: string) {
    e.preventDefault();
    const input = commentInputByPost[postId];
    if (!input?.content?.trim()) return;

    const commentNick = input.anonymous ? '익명 견주' : (userNickname || '익명 견주');
    const { data, error } = await supabase
      .from('community_post_comments')
      .insert({
        post_id: postId,
        nickname: commentNick,
        content: input.content.trim(),
      })
      .select('id, post_id, nickname, content, created_at')
      .single();

    if (!error && data) {
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
      setCommentInputByPost((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], content: '' },
      }));
    }
  }

  async function handleDeleteComment(postId: string, commentId: string) {
    const { error } = await supabase.from('community_post_comments').delete().eq('id', commentId);
    if (!error) {
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString('ko-KR');
  }

  function updateCommentInput(postId: string, field: 'nickname' | 'content' | 'anonymous', value: string | boolean) {
    setCommentInputByPost((prev) => ({
      ...prev,
      [postId]: {
        nickname: prev[postId]?.nickname ?? '',
        content: prev[postId]?.content ?? '',
        anonymous: prev[postId]?.anonymous ?? false,
        [field]: value,
      },
    }));
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">{partLabel} 커뮤니티</h2>
            <p className="text-white/80 text-sm mt-0.5">견주들끼리 정보와 경험을 나눠요</p>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div className="p-5 max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-gray-400">
            <p>{error}</p>
            <button onClick={loadPosts} className="mt-3 text-amber-600 text-sm font-semibold hover:underline">
              다시 시도
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3 opacity-50">🐾</div>
            <p className="text-gray-400 font-medium">아직 게시글이 없어요</p>
            <p className="text-gray-300 text-sm mt-1">첫 번째로 경험을 나눠주세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const comments = commentsByPost[post.id] || [];
              return (
                <div key={post.id} className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {post.nickname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{post.nickname}</p>
                        <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-rose-500 transition-all p-1"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* Comments toggle */}
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {isExpanded ? '댓글 숨기기' : `댓글 ${comments.length > 0 ? comments.length : '보기'}`}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Comments section */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-amber-100 space-y-2">
                      {commentsLoading ? (
                        <div className="flex items-center justify-center py-3">
                          <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                      ) : comments.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-2">아직 댓글이 없어요. 첫 번째 댓글을 남겨주세요!</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="group/comment bg-white rounded-xl p-3 border border-amber-50 flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                              {comment.nickname.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-xs font-semibold text-gray-700">{comment.nickname}</p>
                                <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              className="opacity-0 group-hover/comment:opacity-100 text-gray-300 hover:text-rose-500 transition-all p-0.5 flex-shrink-0"
                              aria-label="댓글 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}

                      {/* Comment input */}
                      <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="pt-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xs text-gray-500 font-medium">
                            {(commentInputByPost[post.id]?.anonymous ?? false) ? '익명 견주' : (userNickname || '익명 견주')}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCommentInput(post.id, 'anonymous', !(commentInputByPost[post.id]?.anonymous ?? false))}
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                              (commentInputByPost[post.id]?.anonymous ?? false)
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            <EyeOff className="w-3 h-3" />
                            {(commentInputByPost[post.id]?.anonymous ?? false) ? '익명 중' : '익명'}
                          </button>
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={commentInputByPost[post.id]?.content || ''}
                            onChange={(e) => updateCommentInput(post.id, 'content', e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            maxLength={300}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                          />
                          <button
                            type="submit"
                            disabled={!commentInputByPost[post.id]?.content?.trim()}
                            className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 flex-shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write form modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCloseWrite}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-4">
              <h3 className="text-lg font-bold text-white">{partLabel} 경험 나누기</h3>
              <button onClick={onCloseWrite} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">닉네임</label>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${
                    isAnonymous
                      ? 'border-gray-200 bg-gray-50 text-gray-400 italic'
                      : 'border-emerald-200 bg-emerald-50/50 text-gray-800 font-semibold'
                  }`}>
                    {isAnonymous ? '익명 견주' : (userNickname || '닉네임 미설정')}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      isAnonymous
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    <EyeOff className="w-4 h-4" />
                    {isAnonymous ? '익명 중' : '익명'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {userNickname
                    ? '로그인한 닉네임으로 자동 등록돼요. 익명을 누르면 익명으로 올라가요.'
                    : '닉네임은 등록하개에서 설정할 수 있어요. 지금은 익명으로 올라가요.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요"
                  required
                  maxLength={50}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`${partLabel}에 대한 경험이나 꿀팁을 나눠주세요!`}
                  required
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/500</p>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 text-sm rounded-xl p-3 border border-rose-100">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold hover:from-amber-500 hover:to-orange-500 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? '작성 중...' : '게시하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
