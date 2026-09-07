'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * 블로그 관리 — 로그인 · 목록 · 쓰기/고치기 · 발행 · 삭제 · 사진 만들기.
 *
 * ★★ '발행하기' 는 저장소에 커밋하는 것이다 (2026-09-07 오너: "발행하기 버튼 만들어서 누르기만 하면") ★★
 *   누르면 content/blog/{날짜}-{주소}.json 이 GitHub 에 올라가고, Vercel 이 2~3분 안에 다시 빌드한다.
 *   글의 날짜가 오늘 이후면 **예약** 상태다 — 그 날짜가 되면 저절로 실린다(lib/blog.ts todayKST).
 *   그래서 '매달 자동 발행' 은 별도 장치 없이, 날짜를 미리 적어 두는 것으로 끝난다.
 *
 * ★ 권한은 두 겹이다. 비밀번호는 이 화면을 여는 문, GitHub 토큰은 저장소에 쓰는 힘.
 *   토큰은 Vercel 환경변수(GITHUB_TOKEN)에 두는 것이 정석이고, 없으면 여기서 한 번 붙여 넣는다
 *   (브라우저 localStorage 에만 남는다. 서버에는 저장하지 않는다).
 * ⚠️ 이 화면은 noindex + robots disallow 다(layout.tsx · app/robots.ts).
 * ⚠️ 의료광고다. 글마다 의료법 제56조가 그대로 적용된다 — 아래 '올리기 전에' 안내를 지우지 말 것.
 */
type Post = {
  file?: string;
  sha?: string;
  slug: string;
  title: string;
  date: string;
  updated?: string;
  summary: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  html: string;
};

const EMPTY: Post = { slug: '', title: '', date: '', summary: '', category: '', image: '', imageAlt: '', html: '' };
const todayKST = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const inputCls =
  'w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-[15.5px] text-ink outline-none focus:border-clay-600';
const btn = 'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold transition-opacity disabled:opacity-40';
const btnDark = `${btn} bg-ink text-wine-bg hover:opacity-90`;
const btnLine = `${btn} border-[1.5px] border-ink/40 text-ink hover:bg-ink hover:text-wine-bg`;

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [server, setServer] = useState({ hasServerToken: true, hasOpenAI: true });
  const [ghToken, setGhToken] = useState('');
  const [oaKey, setOaKey] = useState('');
  const [imgPrompt, setImgPrompt] = useState('');

  useEffect(() => {
    setGhToken(localStorage.getItem('cd_gh_token') || '');
    setOaKey(localStorage.getItem('cd_oa_key') || '');
  }, []);

  const headers = useCallback(() => {
    const h: Record<string, string> = { 'content-type': 'application/json' };
    if (ghToken) h['x-github-token'] = ghToken;
    if (oaKey) h['x-openai-key'] = oaKey;
    return h;
  }, [ghToken, oaKey]);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await fetch('/api/admin/posts', { headers: headers(), cache: 'no-store' });
    setBusy(false);
    if (r.status === 401) {
      setAuthed(false);
      return;
    }
    const j = await r.json();
    if (!r.ok) {
      setAuthed(true);
      setMsg({ kind: 'err', text: j.error || '목록을 못 읽었습니다.' });
      if (r.status === 428) setServer((s) => ({ ...s, hasServerToken: false }));
      return;
    }
    setAuthed(true);
    setPosts(j.posts);
    setServer({ hasServerToken: j.hasServerToken, hasOpenAI: j.hasOpenAI });
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (!r.ok) {
      setMsg({ kind: 'err', text: '비밀번호가 맞지 않습니다.' });
      return;
    }
    setPw('');
    setMsg(null);
    load();
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthed(false);
    setPosts([]);
    setEditing(null);
  };

  const saveKeys = () => {
    localStorage.setItem('cd_gh_token', ghToken.trim());
    localStorage.setItem('cd_oa_key', oaKey.trim());
    setMsg({ kind: 'ok', text: '이 브라우저에 저장했습니다. 다시 불러옵니다.' });
    load();
  };

  const publish = async () => {
    if (!editing) return;
    setBusy(true);
    setMsg(null);
    const r = await fetch('/api/admin/posts', { method: 'PUT', headers: headers(), body: JSON.stringify({ post: editing }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) {
      setMsg({ kind: 'err', text: j.error || '발행에 실패했습니다.' });
      return;
    }
    const future = editing.date > todayKST();
    setMsg({
      kind: 'ok',
      text: `${j.updated ? '고쳐서' : '새로'} 올렸습니다 (${j.file}). ${
        future ? `${editing.date} 에 자동으로 실립니다.` : '2~3분 뒤 사이트에 보입니다.'
      }`,
    });
    setEditing(null);
    load();
  };

  const remove = async (p: Post) => {
    if (!p.file) return;
    if (!confirm(`"${p.title}" 을(를) 삭제할까요? 주소가 사라지고, 색인된 글이면 검색에서도 빠집니다.`)) return;
    setBusy(true);
    const r = await fetch('/api/admin/posts', { method: 'DELETE', headers: headers(), body: JSON.stringify({ file: p.file }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) {
      setMsg({ kind: 'err', text: j.error || '삭제에 실패했습니다.' });
      return;
    }
    setMsg({ kind: 'ok', text: '삭제했습니다. 2~3분 뒤 사이트에서 사라집니다.' });
    load();
  };

  const makeImage = async () => {
    if (!editing) return;
    const name = editing.slug || 'post';
    if (!imgPrompt.trim()) {
      setMsg({ kind: 'err', text: '어떤 장면인지 한 줄 적어 주세요. 예: 흰 상판 위에 놓인 임플란트 하나와 크라운' });
      return;
    }
    setBusy(true);
    setMsg({ kind: 'info', text: '그림을 만드는 중입니다 (30~40초)…' });
    const r = await fetch('/api/admin/image', { method: 'POST', headers: headers(), body: JSON.stringify({ prompt: imgPrompt, name }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) {
      setMsg({ kind: 'err', text: j.error || '그림을 못 만들었습니다.' });
      return;
    }
    setEditing({ ...editing, image: j.image });
    setMsg({ kind: 'ok', text: `사진을 올렸습니다 (${Math.round(j.bytes / 1024)}KB). 아래 '사진 설명' 을 채워 주세요.` });
  };

  const today = todayKST();
  const stats = useMemo(() => {
    const live = posts.filter((p) => p.date <= today).length;
    return { live, queued: posts.length - live };
  }, [posts, today]);

  /* ── 로그인 ───────────────────────────────────────────────── */
  if (authed === false) {
    return (
      <main className="mx-auto max-w-[420px] px-6 py-24">
        <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">동그라미치과 · 블로그 관리</p>
        <h1 className="display-sm mt-3 text-[28px] text-ink">로그인</h1>
        <form onSubmit={login} className="mt-8 space-y-4">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" autoFocus className={inputCls} />
          <button type="submit" disabled={busy || !pw} className={`${btnDark} w-full justify-center`}>
            들어가기
          </button>
        </form>
        {msg && <p className="mt-4 text-[14.5px] text-red-700">{msg.text}</p>}
      </main>
    );
  }
  if (authed === null) return <main className="px-6 py-24 text-center text-ink-soft">불러오는 중…</main>;

  /* ── 편집 ─────────────────────────────────────────────────── */
  if (editing) {
    const e = editing;
    const set = (k: keyof Post, v: string) => setEditing({ ...e, [k]: v });
    return (
      <main className="mx-auto max-w-[880px] px-6 py-14">
        <button onClick={() => setEditing(null)} className="text-[14.5px] font-bold text-clay-700">
          ← 목록으로
        </button>
        <h1 className="display-sm mt-4 text-[26px] text-ink">{e.file ? '글 고치기' : '새 글'}</h1>
        {e.file && <p className="mt-1 text-[13.5px] text-ink-muted">파일 {e.file} · 주소 /insight/blog/{e.slug}</p>}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-[13px] font-black text-clay-700">제목 · 사람이 실제로 검색하거나 AI 에 묻는 문장 그대로</span>
            <input value={e.title} onChange={(ev) => set('title', ev.target.value)} className={`${inputCls} mt-1.5`} placeholder="예: 임플란트·브리지·틀니, 무엇을 기준으로 고르나요?" />
          </label>
          <label className="block">
            <span className="text-[13px] font-black text-clay-700">주소(영문) {e.file && '· 바꾸지 마세요'}</span>
            <input value={e.slug} disabled={!!e.file} onChange={(ev) => set('slug', ev.target.value)} className={`${inputCls} mt-1.5 disabled:opacity-60`} placeholder="implant-bridge-denture" />
          </label>
          <label className="block">
            <span className="text-[13px] font-black text-clay-700">발행일 · 오늘 이후면 그날 자동으로 실립니다</span>
            <input type="date" value={e.date} onChange={(ev) => set('date', ev.target.value)} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className="text-[13px] font-black text-clay-700">분류</span>
            <input value={e.category || ''} onChange={(ev) => set('category', ev.target.value)} className={`${inputCls} mt-1.5`} placeholder="임플란트 · 잇몸치료 · 응급 …" />
          </label>
          <label className="block">
            <span className="text-[13px] font-black text-clay-700">고친 날 (선택)</span>
            <input type="date" value={e.updated || ''} onChange={(ev) => set('updated', ev.target.value)} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[13px] font-black text-clay-700">요약 · 검색 결과와 카드에 나가는 한두 문장 (70~160자)</span>
            <textarea value={e.summary} onChange={(ev) => set('summary', ev.target.value)} rows={2} className={`${inputCls} mt-1.5`} />
          </label>

          <div className="sm:col-span-2 rounded-2xl border border-brand-200/70 bg-parchment p-5">
            <p className="text-[13px] font-black text-clay-700">대표 사진</p>
            {e.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.image} alt="" className="mt-3 aspect-[3/2] w-full max-w-[420px] rounded-xl object-cover" />
            ) : (
              <p className="mt-2 text-[14px] text-ink-soft">아직 없습니다. 아래에 장면을 적고 만들거나, 경로를 직접 적으세요.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <input value={imgPrompt} onChange={(ev) => setImgPrompt(ev.target.value)} className={`${inputCls} min-w-[260px] flex-1`} placeholder="장면 한 줄 (사람·손·글자는 자동으로 뺍니다)" />
              <button onClick={makeImage} disabled={busy || !e.slug} className={btnLine}>
                사진 만들기
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input value={e.image || ''} onChange={(ev) => set('image', ev.target.value)} className={inputCls} placeholder="/img/blog/파일이름.webp" />
              <input value={e.imageAlt || ''} onChange={(ev) => set('imageAlt', ev.target.value)} className={inputCls} placeholder="사진 설명 (무엇이 찍혔는지)" />
            </div>
          </div>

          <label className="block sm:col-span-2">
            <span className="text-[13px] font-black text-clay-700">본문 HTML · p / h2 / h3 / strong / a 만. 목록·마크다운·최상급 표현 금지</span>
            <textarea value={e.html} onChange={(ev) => set('html', ev.target.value)} rows={18} className={`${inputCls} mt-1.5 font-mono text-[13.5px]`} />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-5 text-[14.5px] leading-[1.8] text-ink">
          <p className="font-black">올리기 전에</p>
          <p className="mt-1">
            블로그 글도 의료광고입니다. 치료경험담·후기·별점, 치료 전후 사진, &lsquo;최고·유일·완벽&rsquo; 같은 최상급, 근거 없는 효과 단정은 의료법 제56조에 걸립니다.
            이미 사이트에 있는 주제(증상·질환·시술·비용)를 다시 쓰면 기존 페이지와 검색에서 서로 다툽니다.
          </p>
        </div>

        {msg && (
          <p className={`mt-5 text-[15px] ${msg.kind === 'err' ? 'text-red-700' : msg.kind === 'ok' ? 'text-green-800' : 'text-ink-soft'}`}>{msg.text}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={publish} disabled={busy} className={btnDark}>
            {e.file ? '고쳐서 발행하기' : '발행하기'}
          </button>
          <button onClick={() => setEditing(null)} disabled={busy} className={btnLine}>
            취소
          </button>
        </div>
      </main>
    );
  }

  /* ── 목록 ─────────────────────────────────────────────────── */
  return (
    <main className="mx-auto max-w-[1000px] px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">동그라미치과 · 블로그 관리</p>
          <h1 className="display-sm mt-3 text-[28px] text-ink">글 {posts.length}편</h1>
          <p className="mt-1 text-[14.5px] text-ink-soft">
            실린 글 {stats.live} · 예약 {stats.queued} · 오늘 {today}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setEditing({ ...EMPTY, date: today })} className={btnDark}>
            새 글
          </button>
          <button onClick={logout} className={btnLine}>
            나가기
          </button>
        </div>
      </div>

      {(!server.hasServerToken || !server.hasOpenAI) && (
        <div className="mt-8 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-5">
          <p className="text-[14.5px] font-black text-ink">서버에 키가 없습니다 — 이 브라우저에만 저장해 두고 쓸 수 있습니다</p>
          <p className="mt-1 text-[14px] leading-[1.7] text-ink-soft">
            정석은 Vercel 프로젝트의 Environment Variables 에 <code>GITHUB_TOKEN</code> (repo 권한의 fine-grained 토큰)
            {!server.hasOpenAI && (
              <>
                {' '}
                과 <code>OPENAI_API_KEY</code>
              </>
            )}{' '}
            를 넣는 것입니다. 그러면 아래 칸은 필요 없습니다.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {!server.hasServerToken && <input type="password" value={ghToken} onChange={(e) => setGhToken(e.target.value)} className={inputCls} placeholder="GitHub 토큰 (github_pat_…)" />}
            {!server.hasOpenAI && <input type="password" value={oaKey} onChange={(e) => setOaKey(e.target.value)} className={inputCls} placeholder="OpenAI 키 (sk-…) — 사진 만들기용" />}
          </div>
          <button onClick={saveKeys} className={`${btnLine} mt-4`}>
            저장하고 다시 불러오기
          </button>
        </div>
      )}

      {msg && (
        <p className={`mt-6 text-[15px] ${msg.kind === 'err' ? 'text-red-700' : msg.kind === 'ok' ? 'text-green-800' : 'text-ink-soft'}`}>{msg.text}</p>
      )}

      <ul className="mt-8 divide-y divide-wine-line border-t border-wine-line">
        {posts.map((p) => {
          const live = p.date <= today;
          return (
            <li key={p.file} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
              <span className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] font-black ${live ? 'bg-green-100 text-green-900' : 'bg-clay-tint text-clay-700'}`}>
                {live ? '실림' : '예약'}
              </span>
              <span className="w-[96px] shrink-0 text-[14px] tabular-nums text-ink-muted">{p.date}</span>
              <span className="min-w-0 flex-1 text-[16px] font-bold text-ink">{p.title}</span>
              {p.category && <span className="text-[13px] text-ink-muted">{p.category}</span>}
              <span className="flex gap-2">
                {live && (
                  <a href={`/insight/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-clay-700 hover:underline">
                    보기
                  </a>
                )}
                <button onClick={() => setEditing(p)} className="text-[14px] font-bold text-ink hover:underline">
                  고치기
                </button>
                <button onClick={() => remove(p)} className="text-[14px] font-bold text-red-700 hover:underline">
                  삭제
                </button>
              </span>
            </li>
          );
        })}
        {!posts.length && !busy && <li className="py-8 text-[15px] text-ink-soft">아직 글이 없습니다. &lsquo;새 글&rsquo; 을 눌러 시작하세요.</li>}
      </ul>
      <p className="mt-8 text-[13.5px] leading-[1.7] text-ink-muted">
        발행·수정·삭제는 저장소에 바로 커밋되고, 사이트에는 2~3분 뒤 반영됩니다. 발행일이 오늘 이후인 글은 그날 0시(한국 시간)부터 저절로 실립니다.
      </p>
    </main>
  );
}
