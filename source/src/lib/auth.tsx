import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  nickname: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, isOwner?: boolean | null, nickname?: string, referralSource?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  checkNickname: (nickname: string) => Promise<{ available: boolean; error: string | null }>;
  setNickname: (nickname: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNicknameState] = useState<string | null>(null);

  async function loadNickname(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', userId)
      .maybeSingle();
    setNicknameState(data?.nickname ?? null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadNickname(data.session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (sess?.user) {
        loadNickname(sess.user.id);
      } else {
        setNicknameState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, isOwner?: boolean | null, nickname?: string, referralSource?: string) {
    const candidate = nickname?.trim();
    if (candidate) {
      const { data, error } = await supabase.rpc('signup_nickname_available', { candidate });
      if (error && error.code !== 'PGRST202') return { error: '닉네임 확인 서비스에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.' };
      if (!error && !data) return { error: '이 닉네임은 사용할 수 없어요. 다른 닉네임을 입력해 주세요.' };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: new URL(import.meta.env.BASE_URL, window.location.href).href,
        data: { is_owner: isOwner ?? null, signup_nickname: candidate || null, referral_source: referralSource || null },
      },
    });
    switch (error?.code) {
      case 'email_address_invalid':
        return { error: '이메일 주소를 다시 확인해 주세요.' };
      case 'email_address_not_authorized':
        return { error: '현재 메일 설정에서 이 주소로 인증 메일을 보낼 수 없어요. 가입이 완료되지 않았어요.' };
      case 'over_email_send_rate_limit':
      case 'over_request_rate_limit':
        return { error: '인증 메일 발송 한도에 도달했어요. 잠시 후 다시 시도해 주세요.' };
      case 'weak_password':
        return { error: '더 긴 비밀번호를 입력해 주세요.' };
    }
    if (error) return { error: '가입을 완료하지 못했어요. ' + error.message };
    return { error: data.user || data.session ? null : '가입 응답을 확인하지 못했어요. 다시 시도해 주세요.' };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setNicknameState(null);
  }

  async function checkNickname(nick: string): Promise<{ available: boolean; error: string | null }> {
    if (!nick.trim()) return { available: false, error: '닉네임을 입력해주세요.' };
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nick.trim())
      .maybeSingle();
    if (error) return { available: false, error: '닉네임 확인 중 오류가 발생했어요.' };
    if (data) return { available: false, error: '이미 사용 중인 닉네임이에요.' };
    return { available: true, error: null };
  }

  async function setNickname(nick: string): Promise<{ error: string | null }> {
    if (!user) return { error: '로그인이 필요해요.' };
    const trimmed = nick.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return { error: '닉네임은 2~20자로 입력해주세요.' };

    // Check uniqueness again (race-safe)
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', trimmed)
      .neq('user_id', user.id)
      .maybeSingle();
    if (existing) return { error: '이미 사용 중인 닉네임이에요.' };

    // Upsert: insert if new, update if exists
    const { data: current } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (current) {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname: trimmed })
        .eq('user_id', user.id);
      if (error) return { error: error.code === '23505' ? '이미 사용 중인 닉네임이에요.' : '닉네임 저장에 실패했어요.' };
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, nickname: trimmed });
      if (error) return { error: error.code === '23505' ? '이미 사용 중인 닉네임이에요.' : '닉네임 저장에 실패했어요.' };
    }

    setNicknameState(trimmed);
    return { error: null };
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, nickname, signIn, signUp, signOut, checkNickname, setNickname }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
