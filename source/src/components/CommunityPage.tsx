import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import { GripVertical, MessageCircle, PencilLine, X } from 'lucide-react';
import { dogParts } from '@/data/dogParts';
import { categories, commentTable, loadBoard, postCategory, postKey, type BoardPost } from '@/lib/community';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface Props {
  initialPart: string;
  initialPost: string;
  startWriting: boolean;
  onRegister: () => void;
}

interface BoardComment {
  id: string;
  nickname: string;
  content: string;
}

const dateLabel = (date: string) => date ? new Date(date).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }) : '';
const emptyDraft = { title: '', content: '', category: '일상·사진', body_part: '', image_url: '', anonymous: false };
const partOptions = Object.values(dogParts).map((part) => <option key={part.id} value={part.id}>{part.label}</option>);

export default function CommunityPage({ initialPart, initialPost, startWriting, onRegister }: Props) {
  const { user, nickname, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [writable, setWritable] = useState(false);
  const [category, setCategory] = useState('');
  const [part, setPart] = useState(initialPart);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(initialPost);
  const [editing, setEditing] = useState<BoardPost | null>(null);
  const [composing, setComposing] = useState(startWriting);
  const [draft, setDraft] = useState({ ...emptyDraft, ...initialPart && { body_part: initialPart, category: '건강·돌봄' } });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [panelWidth, setPanelWidth] = useState<number>();
  const [isResizing, setIsResizing] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; width: number } | null>(null);

  function stopResize() {
    drag.current = null;
    setIsResizing(false);
  }

  function closeComments() {
    stopResize();
    setSelected('');
    setPanelWidth(undefined);
  }

  function startResize(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    const panel = document.getElementById('community-comments');
    if (!panel) return;
    drag.current = { x: event.clientX, width: panel.getBoundingClientRect().width };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsResizing(true);
  }

  function resizePanel(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current || !boardRef.current || window.matchMedia('(max-width: 760px)').matches) return;
    const width = drag.current.width - (event.clientX - drag.current.x);
    setPanelWidth(Math.max(235, Math.min(width, boardRef.current.clientWidth - 320)));
  }

  function endResize(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    stopResize();
    if (!start) return;
    const delta = event.clientX - start.x;
    if (delta >= 70 && (window.matchMedia('(max-width: 760px)').matches || start.width - delta < 235)) {
      closeComments();
    }
  }

  async function refresh() {
    setLoading(true);
    const result = await loadBoard();
    setPosts(result.posts);
    setLoadError(result.error);
    setWritable(result.writable);
    setLoading(false);
  }

  useEffect(() => { void refresh(); }, []);

  const searchText = search.trim().toLowerCase();
  const visible = posts.filter((post) =>
    (!category || postCategory(post) === category) && (!part || post.body_part === part) &&
    (!searchText || [post.title, post.content, post.nickname].some((value) => value?.toLowerCase().includes(searchText))));
  const selectedPost = visible.find((post) => postKey(post) === selected);

  function openEditor(post?: BoardPost) {
    setMessage('');
    setFile(null);
    setEditing(post ?? null);
    setDraft(post ? {
      title: post.title ?? '', content: post.content, category: postCategory(post), body_part: post.body_part ?? '',
      image_url: post.image_url ?? '', anonymous: post.nickname === '익명 견주',
    } : { ...emptyDraft, category: category || (part ? '건강·돌봄' : '일상·사진'), body_part: part });
    setComposing(true);
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || saving || !draft.title.trim() || !draft.content.trim()) return;
    setSaving(true);
    setMessage('');
    let uploadedPath: string | null = null;
    try {
      if (!writable) {
        const common = { nickname: draft.anonymous ? '익명 견주' : nickname || '함께하개 회원', content: draft.content.trim() };
        const source = draft.body_part ? 'community_posts' : 'feed_posts';
        const result = await supabase.from(source).insert(draft.body_part
          ? { ...common, title: draft.title.trim(), body_part: draft.body_part }
          : { ...common, content: draft.title.trim() + '\n\n' + common.content, image_url: draft.image_url.trim() || null })
          .select('id').single();
        if (result.error || !result.data) throw new Error('게시글을 저장하지 못했어요. 다시 시도해 주세요.');
        setSelected(source + ':' + result.data.id);
        setCategory('');
        setPart('');
        setSearch('');
        setComposing(false);
        await refresh();
        return;
      }
      let imageUrl = draft.image_url.trim() || null;
      if (file) {
        const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[file.type];
        if (!extension || file.size > 5 * 1024 * 1024) throw new Error('5MB 이하의 JPG, PNG, WebP, GIF 사진을 선택해 주세요.');
        const path = user.id + '/' + crypto.randomUUID() + '.' + extension;
        const upload = await supabase.storage.from('community-images').upload(path, file);
        if (upload.error) throw new Error('사진을 올리지 못했어요. 잠시 후 다시 시도해 주세요.');
        uploadedPath = path;
        imageUrl = supabase.storage.from('community-images').getPublicUrl(path).data.publicUrl;
      }
      const values = {
        title: draft.title.trim(), content: draft.content.trim(), category: draft.category, body_part: draft.body_part || null,
        image_url: imageUrl, nickname: draft.anonymous ? '익명 견주' : nickname || '함께하개 회원',
      };
      const query = editing
        ? supabase.from('feed_posts').update(values).eq('id', editing.id).eq('user_id', user.id)
        : supabase.from('feed_posts').insert({ ...values, user_id: user.id });
      const { data, error } = await query.select('id').single();
      if (error || !data) throw new Error('게시글을 저장하지 못했어요. 다시 시도해 주세요.');
      uploadedPath = null;
      setSelected('feed_posts:' + data.id);
      setCategory('');
      setPart('');
      setSearch('');
      setComposing(false);
      await refresh();
    } catch (error) {
      if (uploadedPath) await supabase.storage.from('community-images').remove([uploadedPath]);
      setMessage(error instanceof Error ? error.message : '저장 중 오류가 발생했어요.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BoardPost) {
    if (!user || post.user_id !== user.id || !window.confirm('이 게시글을 삭제할까요?')) return;
    const result = await supabase.from('feed_posts').delete().eq('id', post.id).eq('user_id', user.id).select('id').single();
    if (result.error) { setMessage('게시글을 삭제하지 못했어요.'); return; }
    setSelected('');
    await refresh();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-[var(--ink)]">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold">소통하개</h1>
          <p className="mt-2">사진과 반려생활 이야기를 나누고, 돌봄과 입양에 대해 궁금한 점을 물어보세요.</p>
        </div>
        <button type="button" className="project-action gap-2" onClick={() => openEditor()}><PencilLine size={17} /> 글쓰기</button>
      </header>
      {composing && <section className="project-card mb-6" aria-label="게시글 작성">
        <div className="flex justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">{editing ? '게시글 수정' : '새 게시글'}</h2>
          <button type="button" className="underline" disabled={saving} onClick={() => { setComposing(false); setMessage(''); }}>닫기</button>
        </div>
        {authLoading ? <p>로그인 상태를 확인 중이에요.</p> : !user ? <div className="space-y-3">
          <p>로그인하면 글과 사진을 올릴 수 있어요.</p><button type="button" className="project-action" onClick={onRegister}>등록하개</button>
        </div> : loading ? <p>게시판을 불러오는 중이에요.</p> :
          <form onSubmit={savePost} className="space-y-3">
            <label className="block">제목<input className="project-control" value={draft.title} maxLength={100} required onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
            {!writable && <p className="text-sm">현재 부위가 지정된 글은 건강·돌봄에, 나머지 글은 일상·사진에 저장돼요.</p>}
            <div className="grid sm:grid-cols-2 gap-3">
              {writable && <label>카테고리<select className="project-control" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>}
              <label>부위 태그<select className="project-control" value={draft.body_part} onChange={(event) => setDraft({ ...draft, body_part: event.target.value })}><option value="">선택 안 함</option>{partOptions}</select></label>
            </div>
            <label className="block">내용<textarea className="project-control" rows={5} maxLength={2000} required value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} /></label>
            {writable && <label className="block">사진 첨부 <span className="text-sm">(선택, 최대 5MB)</span><input className="project-control" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>}
            {(writable || !draft.body_part) && <label className="block">이미지 URL <span className="text-sm">(선택)</span><input className="project-control" type="url" pattern="https?://.+" value={draft.image_url} onChange={(event) => setDraft({ ...draft, image_url: event.target.value })} /></label>}
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.anonymous} onChange={(event) => setDraft({ ...draft, anonymous: event.target.checked })} />익명으로 표시</label>
            <button className="project-action" disabled={saving}>{saving ? '저장 중…' : '저장하기'}</button>
          </form>}
      </section>}
      {message && <p role="alert" className="mb-4 text-red-800">{message}</p>}
      <section className="project-card mb-5 grid gap-3 sm:grid-cols-3" aria-label="게시글 필터">
        <label>카테고리<select className="project-control" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">전체 카테고리</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>부위<select className="project-control" value={part} onChange={(event) => setPart(event.target.value)}><option value="">전체 부위</option>{partOptions}</select></label>
        <label>게시글 검색<input type="search" className="project-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="제목, 내용, 작성자" /></label>
      </section>
      {loadError && <p role="alert" className="mb-4">일부 게시글을 불러오지 못했어요. <button type="button" className="underline" onClick={refresh}>다시 불러오기</button></p>}
      {loading ? <p role="status">게시글을 불러오는 중이에요.</p> : visible.length === 0 ? <p className="project-card">{loadError ? '현재 표시할 수 있는 글이 없어요.' : '조건에 맞는 게시글이 없어요.'}</p> :
        <div ref={boardRef} className={`community-board${selectedPost ? ' has-comments' : ''}${isResizing ? ' is-resizing' : ''}`}
          style={selectedPost && panelWidth ? { gridTemplateColumns: `minmax(0, 1fr) minmax(0, min(${panelWidth}px, 65%))` } : undefined}>
          <section className="community-feed" aria-label="게시글 피드">
            {visible.map((post) => {
              const key = postKey(post);
              const expanded = selectedPost === post;
              return <article className={`community-post${expanded ? ' is-selected' : ''}`} key={key}>
                <button type="button" className="community-post-body" aria-expanded={expanded}
                  aria-controls={expanded ? 'community-comments' : undefined}
                  onClick={() => expanded ? closeComments() : setSelected(key)}>
                  <span className="community-post-author">
                    <span className="community-avatar" aria-hidden="true">{post.nickname.slice(0, 1)}</span>
                    <span><strong>{post.nickname}</strong><small>{dateLabel(post.created_at)}</small></span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="project-tag">{postCategory(post)}</span>
                    {post.body_part && dogParts[post.body_part] && <span className="project-tag">#{dogParts[post.body_part].label}</span>}
                  </span>
                  {post.title && <strong className="text-lg break-words">{post.title}</strong>}
                  <span className="whitespace-pre-wrap break-words">{post.content}</span>
                  {post.image_url && /^https?:\/\//i.test(post.image_url) && <img src={post.image_url} alt="게시글 첨부 사진" loading="lazy" />}
                  <span className="community-reply-label"><MessageCircle size={19} aria-hidden="true" />{expanded ? '댓글 닫기' : '댓글 보기'}</span>
                </button>
                {user && post.user_id === user.id && <div className="community-post-actions">
                  <button type="button" onClick={() => openEditor(post)}>수정</button>
                  <button type="button" onClick={() => void deletePost(post)}>삭제</button>
                </div>}
              </article>;
            })}
          </section>
          {selectedPost && <aside id="community-comments" className="community-comments" aria-labelledby="community-comments-title">
            <button type="button" className={`community-panel-handle${isResizing ? ' is-resizing' : ''}`} title="오른쪽으로 밀어 댓글 닫기" aria-label="댓글 패널 밀기 또는 닫기"
              onPointerDown={startResize} onPointerMove={resizePanel} onPointerUp={endResize}
              onPointerCancel={stopResize} onLostPointerCapture={stopResize} onClick={(event) => { if (event.detail === 0) closeComments(); }}>
              <GripVertical size={18} aria-hidden="true" />
            </button>
            <div className="community-comments-inner">
              <div className="community-comments-heading">
                <h2 id="community-comments-title"><MessageCircle size={20} aria-hidden="true" /> 댓글</h2>
                <button type="button" onClick={closeComments} aria-label="댓글 패널 닫기"><X size={20} aria-hidden="true" /></button>
              </div>
              <p className="community-comment-context">{selectedPost.title || selectedPost.content}</p>
              <Comments key={postKey(selectedPost)} post={selectedPost} writable={writable} onRegister={onRegister} />
            </div>
          </aside>}
        </div>}
    </main>
  );
}

function Comments({ post, writable, onRegister }: { post: BoardPost; writable: boolean; onRegister: () => void }) {
  const { user, nickname } = useAuth();
  const [comments, setComments] = useState<BoardComment[] | null>(null);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<BoardComment | null>(null);
  const commentInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const table = commentTable(post);
  useEffect(() => {
    let active = true;
    async function fetchComments() {
      const result = await supabase.from(table).select('id,nickname,content').eq('post_id', post.id).order('created_at');
      if (active) {
        setComments(result.data ?? []);
        if (result.error) setError('댓글을 불러오지 못했어요.');
      }
    }
    void fetchComments();
    return () => { active = false; };
  }, [post.id, table]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !content.trim() || saving) return;
    setSaving(true);
    setError('');
    const { data, error } = await supabase.from(table)
      .insert({ post_id: post.id, nickname: nickname || '함께하개 회원', content: replyTo ? '[reply:' + replyTo.id + ']\n' + content.trim() : content.trim(), ...(writable ? { user_id: user.id } : {}) })
      .select('id,nickname,content').single();
    if (error) setError('댓글을 저장하지 못했어요.');
    else if (data) {
      setComments((previous) => [...(previous ?? []), data]);
      setContent('');
      setReplyTo(null);
    }
    setSaving(false);
  }

  // The existing comment tables share the same text schema. Encode only the
  // parent UUID in the stored text, and resolve it within this post's comments.
  const entries = (comments ?? []).map((comment) => {
    const link = /^\[reply:([a-f0-9-]{36})\]\n/i.exec(comment.content);
    return { ...comment, parent: link?.[1], text: link ? comment.content.slice(link[0].length) : comment.content };
  });
  const roots = entries.filter((comment) => !comment.parent || !entries.some((candidate) => candidate.id === comment.parent && !candidate.parent));
  const rootIds = new Set(roots.map((comment) => comment.id));

  return <div className="border-t pt-3 space-y-3">
    {comments === null ? <p>댓글을 불러오는 중이에요.</p> : comments.length === 0 && !error ? <p>아직 댓글이 없어요.</p> : roots.map((comment) =>
      <div key={comment.id} className="break-words">
        <p><strong className="mr-2">{comment.nickname}</strong>{comment.text}</p>
        <button type="button" className="text-sm underline" aria-label={comment.nickname + ' 댓글에 답글'} onClick={() => {
          if (!user) { onRegister(); return; }
          setReplyTo(comment);
          commentInput.current?.focus();
        }}>답글</button>
        {entries.filter((reply) => reply.parent === comment.id && !rootIds.has(reply.id)).map((reply) =>
          <p key={reply.id} className="comment-reply"><strong className="mr-2">{reply.nickname}</strong>{reply.text}</p>)}
      </div>)}
    {error && <p role="alert" className="text-red-800">{error}</p>}
    {!user ? <button onClick={onRegister} className="underline">로그인하고 댓글 달기</button> :
      <>
        {replyTo && <div className="flex items-center justify-between gap-2 text-sm" role="status">
          <span>{replyTo.nickname}님에게 답글 작성 중</span>
          <button type="button" className="underline shrink-0" onClick={() => setReplyTo(null)}>취소</button>
        </div>}
        <form onSubmit={submit} className="flex gap-2">
          <input ref={commentInput} className="project-control" aria-label={replyTo ? '답글 내용' : '댓글 내용'} value={content} maxLength={300} onChange={(event) => setContent(event.target.value)} />
          <button className="project-action shrink-0" disabled={!comments || saving || !content.trim()}>{replyTo ? '답글 등록' : '등록'}</button>
        </form>
      </>}
  </div>;
}
