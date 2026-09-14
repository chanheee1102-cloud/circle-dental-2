'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BodyEditor } from '@/components/admin/BodyEditor';

/**
 * 블로그 관리 — 마케터가 쓰는 화면 (2026-09-08 오너: "사용하기 편하고 직관적이면서 최대한 자동화").
 *
 * ★★ 흐름은 두 단계다 ★★
 *   1) '어떤 글을 쓸까요' 한 줄 → [초안 만들기] → Gemini 가 제목·요약·본문·사진 장면을 쓰고,
 *      이어서 gpt-image-2 가 그 장면으로 대표 사진까지 만든다. 사람은 기다리기만 한다.
 *   2) 검토 화면 — 사진(다시 만들기 / 내 사진 올리기)과 글(문서처럼 고치는 편집기)을 보고,
 *      [지금 바로 올리기] 또는 날짜·시각을 골라 [예약 발행].
 *
 * ★ '발행' 은 저장소에 커밋하는 것이다. content/blog/{날짜}-{주소}.json 이 GitHub 에 올라가고
 *   Vercel 이 2~3분 안에 다시 빌드한다. 날짜·시각이 미래면 그때까지 숨어 있다가 저절로 실린다(lib/blog.ts publishKey).
 * ★ 초안이 자동으로 발행되는 일은 없다 — 의료광고라 사람이 한 번은 읽어야 한다. 이 순서를 바꾸지 말 것.
 * ★ 권한은 두 겹. 비밀번호는 이 화면을 여는 문, GitHub 토큰은 저장소에 쓰는 힘. 키 셋은 Vercel 환경변수가
 *   정석이고(목록 머리에 ✓/✗ 로 보인다), 없으면 이 브라우저에만 붙여 넣어 쓸 수 있다.
 * ⚠️ 이 화면은 noindex + robots disallow 다(layout.tsx · app/robots.ts).
 * ⚠️ 사진은 만들거나 올릴 때 **커밋하지 않는다** — 미리보기(data URL)만 들고 있다가 발행할 때 글과 함께 보낸다(imageData).
 *    그래서 '다시 만들기' 를 열 번 눌러도 저장소와 Vercel 은 조용하다.
 */
type Post = {
  file?: string;
  sha?: string;
  slug: string;
  title: string;
  date: string;
  time?: string;
  updated?: string;
  summary: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  html: string;
};
type View = 'list' | 'edit';

const CATEGORIES = ['임플란트', '잇몸치료', '충치치료', '신경치료', '보철', '심미치료', '사랑니', '예방', '응급', '치과 선택'];

const nowKST = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 16);
const todayKST = () => nowKST().slice(0, 10);
const keyOf = (p: { date: string; time?: string }) => `${p.date}T${p.time || '00:00'}`;
const koDate = (iso: string, time?: string) => {
  const [y, m, d] = iso.split('-');
  return `${y}. ${Number(m)}. ${Number(d)}.${time && time !== '00:00' ? ` ${time}` : ''}`;
};

const inputCls = 'w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-[15.5px] text-ink outline-none focus:border-clay-600';
const labelCls = 'text-[13px] font-black text-clay-700';
const btn = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold transition-opacity disabled:opacity-40';
const btnDark = `${btn} bg-ink text-wine-bg hover:opacity-90`;
const btnLine = `${btn} border-[1.5px] border-ink/40 text-ink hover:bg-ink hover:text-wine-bg`;

/** 휴대폰 사진(3~8MB)을 브라우저에서 먼저 줄인다 — 서버 한도(4.5MB) 때문. 긴 변 1600px, JPEG 0.86 → 보통 300~600KB. */
async function shrink(file: File): Promise<string> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error('이 형식은 브라우저가 읽지 못합니다. 아이폰 HEIC 는 사진 앱에서 JPG 로 내보내거나, 설정 > 카메라 > 포맷을 "높은 호환성" 으로 바꿔 주세요.');
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.86);
}

/**
 * 규칙 한 줄.
 * ★ 칸은 내용에 맞춰 세로로 늘어난다 — 좁은 왼쪽 기둥에서 한 줄짜리 input 을 쓰면 긴 규칙이 옆으로 잘려
 *   무엇을 적어 뒀는지 눈으로 확인할 수 없다. 줄바꿈은 칸 구분이라 Enter 로는 못 넣는다(+ 로 칸을 늘린다).
 */
function RuleRow({
  index,
  value,
  onChange,
  onRemove,
  placeholder,
  max,
  disabled,
}: {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  placeholder: string;
  max: number;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <div className="flex items-start gap-1">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        onKeyDown={(ev) => { if (ev.key === 'Enter') ev.preventDefault(); }}
        disabled={disabled}
        maxLength={max}
        placeholder={placeholder}
        className={`${inputCls} min-w-0 resize-none overflow-hidden px-3 py-2 text-[13.5px] leading-[1.6]`}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`${index + 1}번째 규칙 지우기`}
        title="이 줄 지우기"
        className="mt-1.5 shrink-0 rounded-full px-1.5 py-1 text-[17px] leading-none text-ink-muted hover:bg-ink/5 hover:text-red-700 disabled:opacity-40"
      >
        ×
      </button>
    </div>
  );
}

/**
 * 규칙 한 줄 = 칸 하나 (2026-09-14 오너: "한 줄씩 칸 생기게 해 줘. + 버튼 넣어서 규칙 추가하고 싶을 때마다
 * 한 줄씩 추가하도록. 지금 저렇게 한 번에 좁은 곳에 다 쓰니까 너무 어지럽다").
 *
 * ★ 저장 형식은 그대로 **줄바꿈으로 이은 한 덩이**다. 서버도 프롬프트도 이 화면이 칸을 어떻게 쪼개는지 모른다.
 *   나중에 칸 모양을 또 바꿔도 저장된 규칙은 그대로 읽힌다.
 * ⚠️ 이 컴포넌트를 AdminPage 안에 두지 말 것 — 렌더마다 새 함수가 되어 글자 하나 칠 때마다 칸에서 커서가 빠진다.
 */
function RuleList({
  label,
  value,
  onChange,
  placeholder,
  max,
  disabled,
  onReset,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
  disabled?: boolean;
  onReset: () => void;
  hint?: React.ReactNode;
}) {
  const rules = value.split('\n');
  /* 줄바꿈이 칸 구분이라 한 칸 안에 줄바꿈이 들어오면(붙여넣기) 공백으로 눕힌다. */
  const set = (i: number, v: string) => onChange(rules.map((r, k) => (k === i ? v.replace(/[\r\n]+/g, ' ') : r)).join('\n'));
  const remove = (i: number) => {
    const next = rules.filter((_, k) => k !== i);
    onChange((next.length ? next : ['']).join('\n'));
  };
  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between gap-2">
        <span className={labelCls}>{label}</span>
        <button type="button" onClick={onReset} disabled={disabled} className="text-[12px] font-bold text-ink-muted underline underline-offset-2 disabled:opacity-40">
          기본값
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {rules.map((r, i) => (
          <RuleRow
            key={i}
            index={i}
            value={r}
            onChange={(v) => set(i, v)}
            onRemove={() => remove(i)}
            placeholder={i === 0 ? placeholder : '규칙 한 줄'}
            max={max}
            disabled={disabled}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rules, ''].join('\n'))}
        disabled={disabled}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink/25 px-3.5 py-1.5 text-[13px] font-bold text-ink hover:bg-ink hover:text-wine-bg disabled:opacity-40"
      >
        <span className="text-[15px] leading-none">+</span> 규칙 추가
      </button>
      {hint && <p className="mt-2 text-[12px] leading-[1.7] text-ink-muted">{hint}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<Post | null>(null);
  /* 새로 만들거나 올린 사진의 data URL. 발행 때 imageData 로 함께 간다. 저장소에 이미 있는 사진이면 null. */
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [server, setServer] = useState({ hasServerToken: true, hasOpenAI: true, hasGemini: true, repo: '' });
  const [ghToken, setGhToken] = useState('');
  const [oaKey, setOaKey] = useState('');
  const [gmKey, setGmKey] = useState('');
  const [scene, setScene] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [cautions, setCautions] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  /* 자동 예약 발행(크론) 설정 — /api/admin/auto. null 이면 아직 못 읽음. */
  const [autoCfg, setAutoCfg] = useState<{ enabled: boolean; everyDays: number; time: string; last?: { at: string; result: string } } | null>(null);
  const [autoNext, setAutoNext] = useState<{ due: boolean; date: string } | null>(null);
  /* 중앙(winaid)에서 오는 글 — 여기서는 숨기기만 된다(lib/centralHidden.ts). */
  const [central, setCentral] = useState<{ items: Array<{ slug: string; title: string; post_type: string; published_at: string; hasCover: boolean; hidden: boolean }> } | null>(null);
  const [cronReady, setCronReady] = useState(true);
  /*
   * 담당자 프롬프트 — 이 병원의 글·사진 규칙 (저장소 content/clinic-prompt.json · lib/clinicPrompt.ts).
   * ★ 기본값도 서버에서 받는다. 같은 규칙 원문을 화면과 서버 두 곳에 두면 반드시 어긋난다.
   * ⚠️ clinicDirtyRef — 목록을 다시 불러올 때(발행 뒤 load()) 마케터가 고치던 칸을 덮어쓰지 않기 위한 자물쇠.
   */
  type Clinic = { writing: string; image: string; updatedAt?: string; saved?: boolean };
  const [clinicSaved, setClinicSaved] = useState<Clinic | null>(null);
  const [clinicDefaults, setClinicDefaults] = useState<{ writing: string; image: string } | null>(null);
  const [clinicForm, setClinicForm] = useState({ writing: '', image: '' });
  const [clinicMax, setClinicMax] = useState(2000);
  const [clinicSaving, setClinicSaving] = useState(false);
  const clinicDirtyRef = useRef(false);

  useEffect(() => {
    setGhToken(localStorage.getItem('cd_gh_token') || '');
    setOaKey(localStorage.getItem('cd_oa_key') || '');
    setGmKey(localStorage.getItem('cd_gm_key') || '');
  }, []);

  const headers = useCallback(() => {
    const h: Record<string, string> = { 'content-type': 'application/json' };
    if (ghToken) h['x-github-token'] = ghToken;
    if (oaKey) h['x-openai-key'] = oaKey;
    if (gmKey) h['x-gemini-key'] = gmKey;
    return h;
  }, [ghToken, oaKey, gmKey]);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await fetch('/api/admin/posts', { headers: headers(), cache: 'no-store' });
    setBusy(false);
    if (r.status === 401) { setAuthed(false); return; }
    /* ★ 글 목록보다 먼저 — GitHub 토큰이 없어 목록이 실패해도 규칙 칸은 기본값으로 보여야 한다(아래 return 위). */
    fetch('/api/admin/prompt', { headers: headers(), cache: 'no-store' })
      .then((rp) => rp.json())
      .then((p) => {
        if (!p.ok) return;
        setClinicSaved(p.prompt);
        setClinicDefaults(p.defaults);
        setClinicMax(p.max || 2000);
        /* 고치던 중이면 건드리지 않는다 — 발행 한 번에 쓰던 규칙이 날아가면 다시는 안 쓴다. */
        if (!clinicDirtyRef.current) setClinicForm({ writing: p.prompt.writing, image: p.prompt.image });
      })
      .catch(() => {});
    const j = await r.json();
    if (!r.ok) {
      setAuthed(true);
      setMsg({ kind: 'err', text: j.error || '목록을 못 읽었습니다.' });
      if (r.status === 428) setServer((s) => ({ ...s, hasServerToken: false }));
      return;
    }
    setAuthed(true);
    setPosts(j.posts);
    setServer({ hasServerToken: j.hasServerToken, hasOpenAI: j.hasOpenAI, hasGemini: j.hasGemini, repo: `${j.repo}@${j.branch}` });
    fetch('/api/admin/auto', { headers: headers(), cache: 'no-store' })
      .then((r) => r.json())
      .then((a) => { if (a.ok) { setAutoCfg(a.config); setAutoNext(a.next); setCronReady(a.cronReady); } })
      .catch(() => {});
    fetch('/api/admin/central', { headers: headers(), cache: 'no-store' })
      .then((r) => r.json())
      .then((c) => { if (c.ok) setCentral({ items: c.items }); })
      .catch(() => {});
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  /* 중앙 글 숨기기/다시 보이기 — 저장소에 한 줄 커밋. 반영은 재빌드 뒤(1~2분). */
  const toggleCentral = async (slug: string, hidden: boolean) => {
    setBusy(true);
    const r = await fetch('/api/admin/central', { method: 'POST', headers: headers(), body: JSON.stringify({ slug, hidden }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '못 바꿨습니다.' }); return; }
    setCentral((c) => (c ? { items: c.items.map((it) => (it.slug === slug ? { ...it, hidden } : it)) } : c));
    setMsg({ kind: 'ok', text: hidden ? '숨겼습니다. 1~2분 뒤 사이트에서 빠집니다(중앙 데이터는 그대로).' : '다시 보이게 했습니다. 1~2분 뒤 사이트에 실립니다.' });
  };

  /*
   * ★★ 담당자 프롬프트 저장 (2026-09-14 오너: "마케터가 칸에서 프롬프트 바꾸고 저장하면 그대로 반영해서 매번 나와야 해") ★★
   *   저장 = 저장소에 커밋 하나. 글쓰기·사진 라우트가 요청마다 이 파일을 읽으므로 **다음 글부터 바로** 먹는다.
   *   이미 올라간 글은 바뀌지 않는다 — 그 글들은 이미 만들어진 결과물이다.
   */
  const saveClinic = async () => {
    setClinicSaving(true);
    const r = await fetch('/api/admin/prompt', { method: 'POST', headers: headers(), body: JSON.stringify(clinicForm) });
    const j = await r.json().catch(() => ({}));
    setClinicSaving(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '프롬프트를 저장하지 못했습니다.' }); return; }
    clinicDirtyRef.current = false;
    setClinicSaved(j.prompt);
    setClinicForm({ writing: j.prompt.writing, image: j.prompt.image });
    setMsg({ kind: 'ok', text: '프롬프트를 저장했습니다. 지금부터 새로 쓰는 글과 사진에 매번 반영됩니다 (이미 올라간 글은 그대로).' });
  };

  const setClinicField = (k: 'writing' | 'image', v: string) => {
    clinicDirtyRef.current = true;
    setClinicForm((f) => ({ ...f, [k]: v }));
  };

  /* 기본값 불러오기 — 칸만 채운다. 저장은 사람이 읽어 보고 누른다. */
  const fillDefault = (k: 'writing' | 'image') => {
    if (!clinicDefaults) return;
    setClinicField(k, clinicDefaults[k]);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: '비밀번호가 맞지 않습니다.' }); return; }
    setPw(''); setMsg(null); load();
  };

  const saveKeys = () => {
    localStorage.setItem('cd_gh_token', ghToken.trim());
    localStorage.setItem('cd_oa_key', oaKey.trim());
    localStorage.setItem('cd_gm_key', gmKey.trim());
    setMsg({ kind: 'ok', text: '이 브라우저에 저장했습니다. 다시 불러옵니다.' });
    load();
  };

  const openEdit = (p: Post) => { setEditing({ ...p, time: p.time || '00:00' }); setPreview(null); setWarnings([]); setCautions([]); setScene(''); setMsg(null); setView('edit'); };
  const backToList = () => { setEditing(null); setView('list'); setMsg(null); };

  /* ── 사진: 만들기 / 올리기 ─────────────────────────────────── */
  const imageName = (p: Post) => (p.image ? `${p.slug || 'post'}-${Date.now().toString(36).slice(-4)}` : p.slug || 'post');

  /* ruleMiss — 사진 규칙 칸에 글이 있는데 그것을 못 반영한 경우. 조용히 넘어가면 칸이 안 먹는 것처럼 보인다. */
  const RULE_MISS = ' 다만 사진 규칙은 이번에 반영하지 못했습니다 (글쓰기 키 확인). 다시 만들기를 한 번 더 눌러 보세요.';
  const makeImage = async (p: Post, sceneText: string): Promise<{ post: Post; ruleMiss: boolean }> => {
    const r = await fetch('/api/admin/image', { method: 'POST', headers: headers(), body: JSON.stringify({ prompt: sceneText, name: imageName(p) }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || '사진을 못 만들었습니다.');
    setPreview(j.preview || null);
    return { post: { ...p, image: j.image }, ruleMiss: !!j.hasRule && j.ruleApplied === false };
  };

  const regenImage = async () => {
    if (!editing) return;
    if (!scene.trim()) { setMsg({ kind: 'err', text: '어떤 장면인지 한 줄 적어 주세요. 예: 흰 상판 위의 임플란트 하나와 크라운' }); return; }
    setBusy(true); setMsg({ kind: 'info', text: '사진을 만드는 중입니다 (30~50초)…' });
    try {
      const { post, ruleMiss } = await makeImage(editing, scene);
      setEditing(post);
      setMsg({ kind: ruleMiss ? 'err' : 'ok', text: `사진을 바꿨습니다. 올릴 때 함께 저장됩니다. 마음에 안 들면 장면을 고쳐 다시 만들거나, 내 사진을 올리세요.${ruleMiss ? RULE_MISS : ''}` });
    } catch (e) { setMsg({ kind: 'err', text: String((e as Error).message) }); }
    setBusy(false);
  };

  const upload = async (file: File | undefined) => {
    if (!editing || !file) return;
    setBusy(true); setMsg({ kind: 'info', text: '사진을 올리는 중입니다…' });
    try {
      const data = await shrink(file);
      const r = await fetch('/api/admin/upload', { method: 'POST', headers: headers(), body: JSON.stringify({ name: imageName(editing), data }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || '사진을 못 올렸습니다.');
      setPreview(j.preview || null);
      setEditing({ ...editing, image: j.image });
      setMsg({ kind: 'ok', text: `사진을 받았습니다 (${Math.round(j.bytes / 1024)}KB). 올릴 때 함께 저장됩니다. '사진 설명' 이 사진과 맞는지 봐 주세요.` });
    } catch (e) { setMsg({ kind: 'err', text: String((e as Error).message) }); }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── 발행 ─────────────────────────────────────────────────── */
  const publish = async (mode: 'now' | 'schedule') => {
    if (!editing) return;
    let p = editing;
    if (mode === 'now') {
      const n = nowKST();
      p = { ...p, date: n.slice(0, 10), time: n.slice(11, 16) };
    }
    if (!p.title.trim() || !p.summary.trim() || !p.html.trim()) { setMsg({ kind: 'err', text: '제목·요약·본문은 비울 수 없습니다.' }); return; }
    if (p.image && !p.imageAlt?.trim()) { setMsg({ kind: 'err', text: '사진 설명(무엇이 찍혔는지)을 채워 주세요. 검색과 화면 낭독기가 읽는 글입니다.' }); return; }
    if (p.file && preview) p = { ...p, updated: todayKST() };
    setBusy(true); setMsg(null);
    const r = await fetch('/api/admin/publish', { method: 'POST', headers: headers(), body: JSON.stringify({ posts: [{ ...p, ...(preview ? { imageData: preview } : {}) }] }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '올리지 못했습니다.' }); return; }
    const future = keyOf(p) > nowKST();
    setEditing(null); setView('list');
    setMsg({
      kind: 'ok',
      text: future
        ? `예약했습니다. ${koDate(p.date, p.time)} 에 저절로 실립니다 (그 시각 뒤 최대 한 시간 안).`
        : `올렸습니다. 2~3분 뒤 사이트에 보입니다: /insight/blog/${p.slug}`,
    });
    load();
  };

  /*
   * ★ 자동 예약 발행 토글 (2026-09-08 오너: "마케터 손에 안 가게 3일마다 자동으로") — 켜 두면 Vercel 크론이 매일 0시(한국)에
   *   /api/cron/blog 를 부르고, 미래 글이 없으면 한 편을 만들어 everyDays 뒤로 예약한다. 사람은 아무것도 안 해도 된다.
   * ⚠️ 설정은 저장소 파일(content/auto-blog.json)이라 토글 = 커밋 = 빌드 한 번. 자주 누를 것이 아니다.
   */
  const toggleAuto = async (enabled: boolean, everyDays?: number) => {
    if (!autoCfg) return;
    const days = everyDays ?? autoCfg.everyDays;
    if (enabled && !confirm(`자동 예약 발행을 켤까요? 사람이 읽지 않은 글이 ${days}일에 한 편씩 올라갑니다. 의료법 낱말 검사와 감수를 거치지만 완벽하지는 않습니다 — 목록을 가끔 훑어봐 주세요.`)) return;
    setBusy(true);
    const r = await fetch('/api/admin/auto', { method: 'POST', headers: headers(), body: JSON.stringify({ enabled, everyDays: days }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '설정을 저장하지 못했습니다.' }); return; }
    setAutoCfg(j.config);
    setMsg({ kind: 'ok', text: enabled ? `자동 예약 발행을 켰습니다 — ${days}일에 한 편, ${j.config.time}. 다음 글은 예약된 마지막 글 ${days}일 뒤에 저절로 만들어집니다.` : '자동 예약 발행을 껐습니다. 예약된 글은 그대로 실립니다.' });
  };

  /* 시험 — 크론이 하는 일을 지금 한 번 (미래 글이 있어도 그 뒤에 잇는다). 2~3분. */
  const runCronNow = async () => {
    if (!confirm('지금 한 편을 자동으로 만들어 예약할까요? 2~3분 걸립니다.')) return;
    setBusy(true); setMsg({ kind: 'info', text: '한 편을 쓰는 중입니다 (주제 → 글 → 감수 → 사진, 2~3분)…' });
    const r = await fetch('/api/cron/blog?force=1', { cache: 'no-store' });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '실패했습니다.' }); return; }
    if (j.skipped) { setMsg({ kind: 'err', text: `이번엔 올리지 않았습니다 — ${j.skipped}${j.topic ? ` (${j.topic})` : ''}. 내일 다시 시도합니다.` }); load(); return; }
    setMsg({ kind: 'ok', text: `${koDate(j.date)} 에 예약했습니다 — ${j.title}${j.cautions?.length ? ` · 확인 권장: ${j.cautions.join(', ')}` : ''}${j.fixes?.length ? ` · 감수: ${j.fixes.join(' / ')}` : ''}` });
    load();
  };

  const remove = async (p: Post) => {
    if (!p.file || !confirm(`"${p.title}" 을 지울까요? 사이트에서도 사라집니다.`)) return;
    setBusy(true);
    const r = await fetch('/api/admin/posts', { method: 'DELETE', headers: headers(), body: JSON.stringify({ file: p.file }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: j.error || '삭제에 실패했습니다.' }); return; }
    setMsg({ kind: 'ok', text: '지웠습니다. 2~3분 뒤 사이트에서 사라집니다.' });
    setEditing(null); setView('list');
    load();
  };

  const now = nowKST();
  /* 저장 단추를 켜는 조건. 훅이 아니라 파생값이므로 이른 return 위에 둘 필요는 없지만, 읽기 좋게 여기 모아 둔다. */
  const clinicDirty = !!clinicSaved && (clinicForm.writing !== clinicSaved.writing || clinicForm.image !== clinicSaved.image);
  const stats = useMemo(() => {
    const live = posts.filter((p) => keyOf(p) <= now).length;
    return { live, queued: posts.length - live };
  }, [posts, now]);

  const Msg = () =>
    msg ? (
      <p className={`mt-6 rounded-xl px-4 py-3 text-[14.5px] leading-[1.7] ${msg.kind === 'ok' ? 'bg-green-50 text-green-900' : msg.kind === 'err' ? 'bg-red-50 text-red-800' : 'bg-brand-100 text-ink'}`}>
        {msg.text}
      </p>
    ) : null;

  /* ── 로그인 ───────────────────────────────────────────────── */
  if (authed === false) {
    return (
      <main className="mx-auto max-w-[420px] px-6 py-24">
        <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">동그라미치과 · 블로그 관리</p>
        <h1 className="display-sm mt-3 text-[28px] text-ink">로그인</h1>
        <form onSubmit={login} className="mt-8 space-y-4">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" autoFocus className={inputCls} />
          <button type="submit" disabled={busy || !pw} className={`${btnDark} w-full`}>들어가기</button>
        </form>
        {msg && <p className="mt-4 text-[14.5px] text-red-700">{msg.text}</p>}
      </main>
    );
  }
  if (authed === null) return <main className="px-6 py-24 text-center text-ink-soft">불러오는 중…</main>;

  /* ── 글 고치기 (목록의 '수정') ─────────────────────────────── */
  if (view === 'edit' && editing) {
    const e = editing;
    const set = (k: keyof Post, v: string) => setEditing({ ...e, [k]: v });
    const img = preview || e.image || '';
    const scheduledFuture = keyOf(e) > now;
    return (
      <main className="mx-auto max-w-[1180px] px-6 py-12">
        <button onClick={backToList} className="text-[14.5px] font-bold text-clay-700">← 목록으로</button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="display-sm text-[26px] text-ink">{e.file ? '글 고치기' : '읽어 보고 올리기'}</h1>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              {e.file ? `주소 /insight/blog/${e.slug} (바꿀 수 없습니다)` : e.slug ? `주소 /insight/blog/${e.slug}` : '주소는 올릴 때 자동으로 정해집니다'}
            </p>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 text-[14.5px] leading-[1.7] text-red-900">
            <p className="font-black">이 낱말은 의료광고 심의에 걸릴 수 있습니다: {warnings.join(', ')}</p>
            <p className="mt-1">본문에서 찾아서 다른 말로 바꿔 주세요. 그대로 올리면 병원이 책임을 집니다.</p>
          </div>
        )}
        {cautions.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-[14.5px] leading-[1.7] text-amber-900">
            <p className="font-black">확인해 보세요: {cautions.join(', ')}</p>
            <p className="mt-1">문맥에 따라 괜찮을 수도 있는 말입니다. &lsquo;통증이 없어도 오세요&rsquo; 는 되고 &lsquo;통증이 없는 시술&rsquo; 은 안 됩니다. 효과를 단정하는 문장이면 고쳐 주세요.</p>
          </div>
        )}
        <Msg />

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* 왼쪽: 사진 */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-brand-200/70 bg-brand-100">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="aspect-[3/2] w-full object-cover" />
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center text-[14.5px] text-ink-muted">아직 사진이 없습니다</div>
              )}
            </div>
            <div className="rounded-2xl border border-brand-200/70 bg-parchment p-4">
              <p className={labelCls}>사진 바꾸기</p>
              <input value={scene} onChange={(ev) => setScene(ev.target.value)} className={`${inputCls} mt-2`} placeholder="장면 한 줄 (영어·한국어 모두 됩니다)" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={regenImage} disabled={busy || (!server.hasOpenAI && !oaKey)} className={btnLine}>AI 로 다시 만들기</button>
                <button onClick={() => fileRef.current?.click()} disabled={busy} className={btnLine}>내 사진 올리기</button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(ev) => upload(ev.target.files?.[0])} />
              </div>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-ink-muted">
                {clinicSaved?.image.trim()
                  ? '여기 적은 장면에 목록 화면의 ‘사진 규칙’ 이 항상 함께 적용됩니다 (사람이 나오는지, 어떤 결인지).'
                  : '목록 화면에서 ‘사진 규칙’ 을 적어 두면 만들 때마다 그 결로 나옵니다.'}
                {' '}JPG·PNG 아무 크기나 됩니다. 사람 얼굴·치료 전후 사진은 올리지 마세요(의료법).
              </p>
            </div>
            <label className="block">
              <span className={labelCls}>사진 설명 · 무엇이 찍혔는지</span>
              <input value={e.imageAlt || ''} onChange={(ev) => set('imageAlt', ev.target.value)} className={`${inputCls} mt-2`} placeholder="예: 흰 상판 위의 임플란트 모형과 크라운" />
            </label>
          </aside>

          {/* 오른쪽: 글 */}
          <section className="space-y-5">
            <label className="block">
              <span className={labelCls}>제목</span>
              <input value={e.title} onChange={(ev) => set('title', ev.target.value)} className={`${inputCls} mt-2 text-[18px] font-bold`} placeholder="환자가 묻는 문장 그대로" />
            </label>
            <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
              <label className="block">
                <span className={labelCls}>요약 · 검색 결과와 목록 카드에 나가는 한두 문장</span>
                <textarea value={e.summary} onChange={(ev) => set('summary', ev.target.value)} rows={3} className={`${inputCls} mt-2`} />
                <span className="mt-1 block text-[12.5px] text-ink-muted">{e.summary.length}자 · 70~160자가 좋습니다</span>
              </label>
              <label className="block">
                <span className={labelCls}>분류</span>
                <select value={e.category || ''} onChange={(ev) => set('category', ev.target.value)} className={`${inputCls} mt-2`}>
                  <option value="">고르기</option>
                  {[...new Set([...CATEGORIES, ...posts.map((p) => p.category).filter(Boolean)])].map((c) => (
                    <option key={c} value={c as string}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <span className={labelCls}>본문 · 보이는 그대로 사이트에 실립니다</span>
              <div className="mt-2">
                <BodyEditor value={e.html} onChange={(html) => set('html', html)} />
              </div>
            </div>
            {!e.file && (
              <details className="text-[13.5px] text-ink-muted">
                <summary className="cursor-pointer font-bold">고급 · 주소(영문) 바꾸기</summary>
                <input value={e.slug} onChange={(ev) => set('slug', ev.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className={`${inputCls} mt-2`} placeholder="when-to-chew-after-implant" />
                <p className="mt-1">올린 뒤에는 바꿀 수 없습니다. 영문 소문자·숫자·하이픈만.</p>
              </details>
            )}
          </section>
        </div>

        {/* 아래 고정 띠: 언제 올릴까 */}
        {/* ★ 띠 배경은 본문과 다른 베이지(brand-100) — 흰 바탕에 흰 띠라 어디서 끊기는지 안 보였다(2026-09-08 오너). */}
        <div className="sticky bottom-0 mt-10 -mx-6 border-t-2 border-clay-600/40 bg-brand-100 px-6 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-end gap-4">
            <label className="block">
              <span className={labelCls}>올릴 날짜</span>
              <input type="date" value={e.date} min={e.file ? undefined : todayKST()} onChange={(ev) => set('date', ev.target.value)} className={`${inputCls} mt-1.5 w-[170px]`} />
            </label>
            <label className="block">
              <span className={labelCls}>시각</span>
              <select value={e.time || '00:00'} onChange={(ev) => set('time', ev.target.value)} className={`${inputCls} mt-1.5 w-[110px]`}>
                {Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              {e.file && <button onClick={() => remove(e)} disabled={busy} className="text-[14px] font-bold text-red-700">이 글 삭제</button>}
              {e.file ? (
                <button onClick={() => publish('schedule')} disabled={busy} className={btnDark}>고친 내용 저장</button>
              ) : (
                <>
                  <button onClick={() => publish('schedule')} disabled={busy || !scheduledFuture} className={btnLine} title={scheduledFuture ? '' : '날짜·시각을 지금 이후로 고르면 예약할 수 있습니다'}>
                    {scheduledFuture ? `${koDate(e.date, e.time)} 예약 발행` : '예약 발행 (미래 시각을 고르세요)'}
                  </button>
                  <button onClick={() => publish('now')} disabled={busy} className={btnDark}>지금 바로 올리기</button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── 목록 ─────────────────────────────────────────────────── */
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">동그라미치과 · 블로그 관리</p>
          <h1 className="display-sm mt-3 text-[28px] text-ink">글 {posts.length}편</h1>
          <p className="mt-1 text-[14.5px] text-ink-soft">실린 글 {stats.live} · 예약 {stats.queued} · 지금 {now.replace('T', ' ')}</p>
          {/* ★ 어느 저장소에 쓰는지 보인다 — GITHUB_REPO 를 안 넣으면 옛 저장소로 가는 사고를 눈으로 잡는다. */}
          <p className="mt-1 text-[13px] text-ink-muted">
            저장소 {server.repo || '…'} · 연결: 저장소 {server.hasServerToken ? '✓' : '✗'} · 사진 {server.hasOpenAI ? '✓' : '✗'} · 글쓰기 {server.hasGemini ? '✓' : '✗'}
          </p>
        </div>
        {/*
          ★ 자동 예약 발행 토글 — 이 화면의 유일한 단추다 (2026-09-14 오너: "자동 예약 발행 저 토글만,
            문구도 쉽게, 날짜 드롭다운 더 티나게"). 켜 두면 사람이 아무것도 안 해도 며칠에 한 편씩 올라간다.
            같은 날 '자동으로 쓰고 예약'·'새 글 쓰기'·'나가기' 를 뺐다 — 글은 전부 자동으로 쓰고,
            사람이 하는 일은 왼쪽 규칙을 손보고 목록을 훑는 것뿐이다.
        */}
        {autoCfg && (
          <div className={`flex items-center gap-4 rounded-2xl border-[1.5px] px-5 py-3.5 ${autoCfg.enabled ? 'border-green-700/50 bg-green-50' : 'border-ink/25 bg-white'}`}>
            <button
              type="button"
              role="switch"
              aria-checked={autoCfg.enabled}
              disabled={busy}
              onClick={() => toggleAuto(!autoCfg.enabled)}
              className={`relative h-[30px] w-[54px] shrink-0 rounded-full transition-colors ${autoCfg.enabled ? 'bg-green-700' : 'bg-ink/25'} disabled:opacity-40`}
              title={autoCfg.enabled ? '자동 예약 발행 끄기' : '자동 예약 발행 켜기'}
            >
              <span className={`absolute top-[3px] size-[24px] rounded-full bg-white shadow transition-[left] ${autoCfg.enabled ? 'left-[27px]' : 'left-[3px]'}`} />
            </button>
            <div className="leading-tight">
              <p className="text-[16px] font-black text-ink">자동 예약 발행 {autoCfg.enabled ? '켜짐' : '꺼짐'}</p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-[14.5px] text-ink">
                <select
                  value={autoCfg.everyDays}
                  disabled={busy}
                  onChange={(ev) => toggleAuto(autoCfg.enabled, Number(ev.target.value))}
                  className="rounded-full border-[1.5px] border-ink/35 bg-white px-3 py-1.5 text-[15px] font-black text-ink outline-none focus:border-clay-600 disabled:opacity-40"
                  aria-label="며칠에 한 편"
                >
                  {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => <option key={d} value={d}>{d}일</option>)}
                </select>
                <span>에 한 편씩 저절로 올라갑니다</span>
              </p>
              <p className="mt-1.5 text-[12.5px] text-ink-muted">
                {!cronReady ? '⚠️ 서버에 CRON_SECRET 이 없어 자동 발행이 못 돕니다' : autoCfg.enabled && autoNext ? (autoNext.due ? '오늘 밤 0시에 다음 글을 만듭니다' : `${koDate(autoNext.date)} 글이 실린 날 밤에 다음 글을 만듭니다`) : '켜면 사람이 안 건드려도 이어집니다'}
                {' · '}
                <button type="button" onClick={runCronNow} disabled={busy} className="font-bold underline underline-offset-2 disabled:opacity-40">지금 한 편 쓰기</button>
              </p>
            </div>
          </div>
        )}
      </div>

      {(!server.hasServerToken || !server.hasOpenAI || !server.hasGemini) && (
        <div className="mt-8 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-5">
          <p className="text-[14.5px] font-black text-ink">서버에 키가 없습니다 — 이 브라우저에만 저장해 두고 쓸 수 있습니다</p>
          <p className="mt-1 text-[14px] leading-[1.7] text-ink-soft">
            정석은 Vercel 프로젝트의 Environment Variables 에 <code>GITHUB_TOKEN</code>
            {!server.hasOpenAI && <> · <code>OPENAI_API_KEY</code></>}
            {!server.hasGemini && <> · <code>GEMINI_API_KEY</code></>} 를 넣고 Redeploy 하는 것입니다. 그러면 아래 칸은 필요 없습니다.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {!server.hasServerToken && <input type="password" value={ghToken} onChange={(ev) => setGhToken(ev.target.value)} className={inputCls} placeholder="GitHub 토큰 (github_pat_…)" />}
            {!server.hasOpenAI && <input type="password" value={oaKey} onChange={(ev) => setOaKey(ev.target.value)} className={inputCls} placeholder="OpenAI 키 (sk-…) — 사진용" />}
            {!server.hasGemini && <input type="password" value={gmKey} onChange={(ev) => setGmKey(ev.target.value)} className={inputCls} placeholder="Gemini 키 (AIza…) — 글쓰기용" />}
          </div>
          <button onClick={saveKeys} className={`${btnLine} mt-4`}>저장하고 다시 불러오기</button>
        </div>
      )}

      <Msg />

      {/* ⚠️ '무인 발행 마지막 기록' 띠는 뺐다 (2026-09-14 오너: "저건 그냥 없애"). 기록 자체는
          content/auto-blog.json 의 last 에 그대로 남으므로, 무엇이 왜 건너뛰어졌는지는 그 파일로 확인한다. */}

      <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr]">
        {/*
          ★★ 담당자 프롬프트 (2026-09-14 오너: "담당자 프롬프트 넣는 거 만들어줘 … 저장해 두면 이미지 만들 때 반영해서 나오도록") ★★
            칸은 둘 — 글·제목 하나, 사진 하나. 제목을 따로 떼지 않은 이유는 lib/clinicPrompt.ts 머리말 참고.
            기본값은 전에 코드에 박혀 있던 프롬프트 그대로다. 고칠 수 있게 꺼내 놓은 것이 이 기능의 요지다
            ("지금 사람 안 나오게 되어 있는데 나오게 하고 싶을 수도 있으니까" — 그 줄이 이제 사진 칸 안에 있다).
        */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-brand-200/70 bg-parchment p-5">
            <p className="text-[16px] font-black text-ink">담당자 프롬프트</p>
            <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-soft">
              말하듯이 적으면 됩니다. 저장하면 <strong>새로 쓰는 글과 사진마다</strong> 그대로 반영됩니다.
            </p>

            {clinicSaved === null ? (
              <p className="mt-5 text-[14px] text-ink-muted">불러오는 중…</p>
            ) : (
              <>
                <RuleList
                  label="글 · 제목 규칙"
                  value={clinicForm.writing}
                  onChange={(v) => setClinicField('writing', v)}
                  onReset={() => fillDefault('writing')}
                  max={clinicMax}
                  disabled={clinicSaving}
                  placeholder="예: 원장님이 말하듯 친절하게 써 주세요"
                  hint="제목 규칙도 여기에 함께 적으시면 됩니다."
                />

                <RuleList
                  label="사진 규칙"
                  value={clinicForm.image}
                  onChange={(v) => setClinicField('image', v)}
                  onReset={() => fillDefault('image')}
                  max={clinicMax}
                  disabled={clinicSaving}
                  placeholder="예: 치과 의사는 안 나오게 해 주세요"
                  hint={<>&ldquo;환자 뒷모습이 보이게&rdquo; 처럼 적으시면 됩니다. 사람이 나오게 하려면 <strong>&lsquo;사람은 나오지 않게&rsquo; 줄을 × 로 지우세요.</strong></>}
                />

                <button onClick={saveClinic} disabled={!clinicDirty || clinicSaving || busy} className={`${btnDark} mt-4 w-full`}>
                  {clinicSaving ? '저장하는 중…' : clinicDirty ? '저장' : '저장됨'}
                </button>
                {clinicDirty && (
                  <button
                    type="button"
                    onClick={() => { clinicDirtyRef.current = false; setClinicForm({ writing: clinicSaved.writing, image: clinicSaved.image }); }}
                    className="mt-2 w-full text-[13px] font-bold text-ink-muted underline underline-offset-2"
                  >
                    고친 것 취소
                  </button>
                )}
                <p className="mt-3 text-[12px] leading-[1.7] text-ink-muted">
                  {clinicSaved.saved ? `마지막 저장 ${clinicSaved.updatedAt || '기록 없음'}.` : '아직 저장한 적 없음 (기본값).'} 다음 글부터 바로 적용되고, 이미 올라간 글은 그대로입니다. 의료법에 걸리는 표현과 얼굴·치료 전후 사진은 여기서 뭘 적으셔도 늘 막힙니다.
                </p>
              </>
            )}
          </div>
        </aside>

        <div className="min-w-0">
      <ul className="divide-y divide-brand-200/70 border-t border-brand-200/70">
        {posts.map((p) => {
          const live = keyOf(p) <= now;
          return (
            <li key={p.file || p.slug} className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4">
              <span className={`w-[52px] rounded-full px-2 py-0.5 text-center text-[12.5px] font-black ${live ? 'bg-green-100 text-green-800' : 'bg-brand-100 text-clay-700'}`}>
                {live ? '실림' : '예약'}
              </span>
              <span className="w-[150px] text-[14.5px] tabular-nums text-ink-soft">{koDate(p.date, p.time)}</span>
              <button onClick={() => openEdit(p)} className="min-w-0 flex-1 truncate text-left text-[16px] font-bold text-ink hover:text-clay-700">{p.title}</button>
              <span className="text-[13.5px] text-ink-muted">{p.category}</span>
              {/* 2026-09-14 오너: "보기 고치기 말고, 수정 삭제 두 개만". 글을 읽어 보려면 제목을 누르면 된다. */}
              <button onClick={() => openEdit(p)} className="text-[14px] font-bold text-ink">수정</button>
              <button onClick={() => remove(p)} disabled={busy} className="text-[14px] font-bold text-red-700 disabled:opacity-40">삭제</button>
            </li>
          );
        })}
        {posts.length === 0 && !busy && <li className="py-10 text-center text-[15px] text-ink-soft">아직 글이 없습니다. 위 '자동 예약 발행' 을 켜면 저절로 쌓입니다.</li>}
      </ul>

      {/*
        ★ 중앙(winaid)에서 오는 글 (2026-09-08 오너: "중앙에서 올린 거 admin 에서 삭제 못 해?")
          이 글들은 우리 저장소에 없다 — 사이트가 그릴 때 API 로 받는다(lib/insightFeed.ts). 그래서 '지우기' 는
          없고 '숨기기' 만 있다. 고치기·사진·발행 취소는 중앙 관리자에서. 숨김은 목록·상세·사이트맵에 함께 적용된다.
      */}
      {central && central.items.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[18px] font-black text-ink">중앙(winaid)에서 오는 글 {central.items.length}편</h2>
            <p className="text-[13px] text-ink-muted">여기서는 숨기기만 됩니다. 글을 고치거나 지우는 건 중앙에서.</p>
          </div>
          <ul className="mt-4 divide-y divide-brand-200/70 border-t border-brand-200/70">
            {central.items.map((c) => {
              const k = new Date(new Date(c.published_at).getTime() + 9 * 3600 * 1000).toISOString();
              return (
                <li key={c.slug} className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4">
                  <span className={`w-[52px] rounded-full px-2 py-0.5 text-center text-[12.5px] font-black ${c.hidden ? 'bg-ink/10 text-ink-muted' : 'bg-green-100 text-green-800'}`}>
                    {c.hidden ? '숨김' : '실림'}
                  </span>
                  <span className="w-[150px] text-[14.5px] tabular-nums text-ink-soft">{koDate(k.slice(0, 10), k.slice(11, 16))}</span>
                  <span className={`min-w-0 flex-1 truncate text-[16px] font-bold ${c.hidden ? 'text-ink-muted line-through' : 'text-ink'}`}>{c.title}</span>
                  <span className="text-[13.5px] text-ink-muted">{c.post_type === 'column' ? '칼럼' : '블로그'}{c.hasCover ? '' : ' · 사진 없음'}</span>
                  {!c.hidden && <a href={`/insight/blog/${c.slug}`} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-clay-700">보기</a>}
                  <button onClick={() => toggleCentral(c.slug, !c.hidden)} disabled={busy} className={`text-[14px] font-bold ${c.hidden ? 'text-ink' : 'text-red-700'} disabled:opacity-40`}>
                    {c.hidden ? '다시 보이기' : '숨기기'}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[13px] leading-[1.7] text-ink-muted">숨기면 저장소에 기록되고 1~2분 뒤 사이트에서 빠집니다(목록·상세·사이트맵 모두). 중앙 쪽 데이터는 그대로라 다시 보이기도 됩니다. 사진이 없는 글은 중앙에서 사진을 붙이면 저절로 따라옵니다.</p>
        </section>
      )}

      <details className="mt-12 rounded-2xl border border-brand-200/70 bg-parchment p-5 text-[14.5px] leading-[1.85] text-ink">
        <summary className="cursor-pointer text-[15px] font-black">처음이라면 · 사용법</summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li><strong>자동 예약 발행</strong> 을 켜 두면 끝입니다. 며칠에 한 편씩 주제·글·사진까지 저절로 만들어져 예약됩니다(매일 밤 0시에 확인). 며칠에 한 편인지는 옆 드롭다운에서 고르세요.</li>
          <li>
            왼쪽 <strong>담당자 프롬프트</strong> 가 그 글과 사진의 결을 정합니다. 말하듯이 적으면 됩니다 —
            &ldquo;원장님이 말하듯 친절하게&rdquo;, &ldquo;치과 의사는 안 나오게 해 주세요&rdquo; 처럼. <strong>+ 규칙 추가</strong> 로 늘리고 <strong>×</strong> 로 지운 뒤 <strong>저장</strong> 을 누르면 다음 글부터 매번 반영됩니다.
            되돌리려면 <strong>기본값</strong> 을 누르고 저장하세요.
          </li>
          <li>예약된 글은 실리기 전에 목록에서 <strong>수정</strong> 으로 읽고 고칠 수 있습니다. 마음에 안 들면 <strong>삭제</strong>.</li>
          <li>사진이 별로면 수정 화면에서 장면을 고쳐 <strong>AI 로 다시 만들기</strong>, 또는 <strong>내 사진 올리기</strong>. 사진 설명 칸은 사진과 맞게.</li>
          <li>고친 글은 2~3분 뒤 사이트에 반영됩니다. 예약 글은 그 시각이 지나면 저절로 실립니다.</li>
        </ol>
        <p className="mt-3 font-black">알아 두실 것</p>
        <p>사람이 읽지 않은 글이 올라가는 구조라 목록을 가끔 훑어봐 주세요. 치료 후기·전후 사진·'최고/유일/완벽' 같은 표현은 의료법 위반이고, 프롬프트 칸에 무엇을 적으셔도 그런 표현과 얼굴 나오는 사진은 늘 막힙니다. 올린 글의 주소(영문)는 바꾸지 마세요.</p>
      </details>
        </div>
      </div>
    </main>
  );
}
