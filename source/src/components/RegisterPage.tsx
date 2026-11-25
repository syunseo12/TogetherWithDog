import { useState } from 'react';
import { PawPrint, LogOut, Mail, Check, Loader2, UserCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

const referralOptions = [
  ['friend', '지인 추천'], ['direct', '직접 방문'], ['search', '검색'], ['social', 'SNS'], ['other', '기타'],
];

export default function RegisterPage() {
  const { user, loading, signIn, signUp, signOut, nickname, setNickname } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [signupNick, setSignupNick] = useState('');
  const [referral, setReferral] = useState('');
  const [nickCheck, setNickCheck] = useState<{ candidate: string; available: boolean; message: string }>();
  const [checkingSignupNick, setCheckingSignupNick] = useState(false);
  const [signupNotice, setSignupNotice] = useState('');
  const [profileNick, setProfileNick] = useState<string>();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(error);
    } else {
      setEmail('');
      setPassword('');
    }
    setSubmitting(false);
  }

  async function checkSignupNickname() {
    const candidate = signupNick.trim();
    setCheckingSignupNick(true);
    const { data, error } = await supabase.rpc('signup_nickname_available', { candidate });
    setNickCheck({
      candidate, available: !error && data === true,
      message: error?.code === 'PGRST202' ? '로그인 후 닉네임 중복을 확인하고 저장할 수 있어요.'
        : error ? '닉네임 확인 서비스에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.'
        : data === true ? '사용할 수 있는 닉네임이에요.' : '이미 사용 중인 닉네임이에요.',
    });
    setCheckingSignupNick(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !email.trim() || !password.trim()) return;
    setSubmitting(true);
    setError(null);
    setSignupNotice('');
    try {
      const result = await signUp(email.trim(), password, isOwner, signupNick, referral);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMode('login');
      setPassword('');
      setIsOwner(null);
      setSignupNick('');
      setReferral('');
      setNickCheck(undefined);
      setSignupNotice('이메일 인증이 필요하면 가입에 사용한 주소로 온 확인 메일을 열어 주세요. 이미 인증했다면 그 이메일로 로그인하세요.');
    } catch {
      setError('가입 서비스에 연결할 수 없어요. 연결을 확인하고 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  async function saveProfileNickname(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSavingProfile(true);
    try {
      const result = await setNickname(String(form.get('nickname') ?? ''));
      setProfileError(result.error);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
      </div>
    );
  }

  // Logged in
  if (user) {
    const ownerMeta = user.user_metadata?.is_owner;
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <PawPrint className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-1">환영해요!</h2>
            <p className="text-white/80 text-sm">함께하개에 로그인되어 있어요</p>
          </div>

          <div className="p-6 space-y-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">이메일</span>
              </div>
              <p className="text-sm text-gray-800 font-medium">{user.email}</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <UserCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">닉네임</span>
              </div>
              {nickname ? <p className="text-sm text-gray-800 font-bold">{nickname}</p> : (
                <form onSubmit={saveProfileNickname}>
                  <label htmlFor="profile-nickname" className="text-sm">닉네임을 저장하면 게시판에서 사용할 수 있어요.</label>
                  <div className="mt-2 flex gap-2">
                    <input id="profile-nickname" name="nickname" className="project-control" autoComplete="nickname"
                      required minLength={2} maxLength={20}
                      value={profileNick ?? user.user_metadata?.signup_nickname ?? ''}
                      onChange={(event) => setProfileNick(event.target.value)} />
                    <button type="submit" className="project-action shrink-0" disabled={savingProfile}>저장</button>
                  </div>
                  {profileError && <p role="alert" className="mt-1 text-sm text-rose-700">{profileError}</p>}
                </form>
              )}
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-700">견주 여부</span>
              <p className="text-sm text-gray-800 font-medium mt-1">
                {ownerMeta === true && '견주 🐕'}
                {ownerMeta === false && '비견주 (예비 견주) 🐾'}
                {ownerMeta == null && '선택 안 함'}
              </p>
            </div>

            <button
              onClick={signOut}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged out — login or signup
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {mode === 'login' ? '함께하개에 로그인하세요' : '간단한 정보로 가입할 수 있어요'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {signupNotice && <p role="status" className="text-sm text-emerald-800">{signupNotice}</p>}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="bg-rose-50 text-rose-600 text-sm rounded-xl p-3 border border-rose-100">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '로그인'}
              </button>

              {/* Signup prompt */}
              <div className="text-center pt-2 border-t border-gray-100 mt-2">
                <p className="text-xs text-gray-400 mb-2">아직 계정이 없으신가요?</p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  회원가입을 하시겠습니까?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 (6자 이상)"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-nickname" className="block text-sm font-semibold mb-1">닉네임 (선택)</label>
                <div className="flex gap-2">
                  <input id="signup-nickname" className="project-control" autoComplete="nickname" minLength={2} maxLength={20}
                    value={signupNick} onChange={(event) => { setSignupNick(event.target.value); setNickCheck(undefined); }} />
                  <button type="button" className="project-action shrink-0" disabled={checkingSignupNick || signupNick.trim().length < 2}
                    onClick={() => void checkSignupNickname()}>중복 확인</button>
                </div>
                {nickCheck?.candidate === signupNick.trim() && <p role="status" className="mt-1 text-sm">{nickCheck.message}</p>}
              </div>

              {/* 견주 / 비견주 선택 (선택) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  견주 여부 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOwner(isOwner === true ? null : true)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isOwner === true
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {isOwner === true && <Check className="w-4 h-4" />}
                    견주 🐕
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOwner(isOwner === false ? null : false)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isOwner === false
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {isOwner === false && <Check className="w-4 h-4" />}
                    비견주 🐾
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">선택하지 않아도 가입할 수 있어요.</p>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold mb-2">사이트 유입 경로 (선택)</legend>
                <div className="signup-sources">
                  {referralOptions.map(([value, label]) => (
                    <label key={value}><input type="radio" name="referral" value={value} checked={referral === value}
                      onChange={() => setReferral(value)} />{label}</label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div role="alert" className="bg-rose-50 text-rose-600 text-sm rounded-xl p-3 border border-rose-100">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '가입하기'}
              </button>

              <div className="text-center pt-2 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
