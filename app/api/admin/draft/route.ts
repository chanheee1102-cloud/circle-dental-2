import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { CLINIC } from '@/lib/clinic';
import { TREATMENTS } from '@/lib/treatments';
import { SYMPTOM_GROUPS, symptomsOfGroup } from '@/lib/symptoms';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * POST { topic, existingTitles? } → Gemini 가 블로그 글 **초안**을 만든다.
 *
 * ★★ 초안이다. 발행하지 않는다 (2026-09-08 오너: "글은 제미나이로 쓸거니깐"). ★★
 *   만들어진 것은 편집칸에 채워질 뿐이고, 사람이 읽고 '발행하기' 를 눌러야 저장소에 간다.
 *   블로그 글도 의료광고라 사람이 한 번은 봐야 한다 — 이 순서를 '자동 발행' 으로 바꾸지 말 것.
 *
 * ★ 사이트가 이미 다루는 주제(진료 10 · 증상 26)를 통째로 프롬프트에 넣는다. 두 가지 이유 —
 *   1) 같은 주제를 다시 쓰면 기존 페이지와 검색에서 서로 다툰다(자기 잠식). 그래서 '다른 각도' 를 잡게 한다.
 *   2) 본문 안 링크는 **여기 적힌 주소만** 쓰게 한다. 모델이 지어낸 주소는 404 가 되고, 아래에서 걷어 낸다.
 * ★ 글의 결은 실제 글 한 편(EXEMPLAR)으로 보여 준다. 규칙 열 줄보다 예문 한 편이 더 정확히 옮겨진다.
 * ⚠️ 결과는 결정론 검사 두 겹을 지난다 — 형식(목록·마크다운·허용 밖 태그)과 의료법 낱말(최상급·보장·경험담).
 *    형식은 고쳐서 내보내고, 낱말은 **경고로 돌려준다**(자동 치환하지 않는다 — 문맥을 모른 채 바꾸면 비문이 된다).
 * ⚠️ 키는 서버 환경변수(GEMINI_API_KEY)가 우선, 없으면 헤더(x-gemini-key). 모델은 GEMINI_MODEL 로 바꿀 수 있다.
 */
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview';

const CATEGORIES = ['임플란트', '잇몸치료', '충치치료', '신경치료', '보철', '심미치료', '사랑니', '예방', '응급', '치과 선택'];

const EXEMPLAR = {
  title: '스케일링을 하면 이가 벌어진다는 말은 사실인가요?',
  summary:
    '스케일링 뒤에 치아 사이가 벌어져 보이고 시린 것은 사실입니다. 다만 스케일링이 치아를 깎거나 벌린 것이 아니라, 그 자리를 메우고 있던 치석이 빠지면서 원래 있던 공간이 드러난 것입니다.',
  html:
    "<p>스케일링을 받고 나서 거울을 보면 치아 사이에 전에 없던 틈이 보이고, 찬물이 닿으면 시립니다. 그래서 \"스케일링이 이를 깎아서 벌어졌다\" 는 말이 오래전부터 돌았고, 그 말 때문에 스케일링을 미루는 분이 지금도 계십니다. 결론부터 말씀드리면 느끼신 변화는 실제이고, 다만 원인이 다릅니다.</p><h2>틈은 새로 생긴 것이 아니라 드러난 것입니다</h2><p>치석은 치아와 잇몸 사이, 그리고 치아와 치아 사이에 단단하게 붙어 자랍니다. 오래된 치석은 그 자리를 꽉 채우고 있어서, 그동안 잇몸이 내려앉아 생긴 공간을 치석이 대신 메우고 있던 셈입니다. 스케일링은 그 치석을 떼어 내는 시술이라 치석이 빠진 자리가 그대로 빈 공간으로 보입니다.</p><h2>얼마나 자주 받는 것이 좋을까요</h2><p>만 19세 이상은 1년에 한 번 건강보험이 적용되고, 그 기준은 매년 1월 1일에 새로 시작됩니다. 스케일링과 잇몸치료가 어떻게 다른지는 <a href='/treatment/periodontal'>잇몸치료 안내</a>에 정리해 두었습니다.</p><p>스케일링 뒤의 틈과 시림은 치료가 잘못됐다는 신호가 아니라 그동안 가려져 있던 상태가 보이기 시작했다는 신호입니다.</p>",
};

/* 의료법 제56조에서 자주 걸리는 낱말. 경고용이다 — 치환하지 않는다. */
const MEDLAW_FLAGS = [
  '최고', '최상', '최고급', '최첨단', '유일', '완벽', '100%', '1위', '최초', '국내 최대', '보장', '확실히 낫', '반드시 낫',
  '부작용이 없', '부작용 없', '통증이 없', '무통', '후기', '경험담', '치료 전후', '비포', '애프터', '만족도', '평생',
  '영구적', '영구 ', '가장 좋은', '가장 안전', '가장 효과',
];

/* 자주 나오는 비문 — 문맥과 무관하게 안전한 것만 (CLAUDE.md 룰과 같은 목록). */
const GRAMMAR_FIX: Array<[RegExp, string]> = [
  [/(필요|중요|안전|건강|가능|충분|정확|확실|깨끗|복잡|단순|편안|신선|소중|특별)하는/g, '$1한'],
  [/되어진다/g, '된다'], [/되어지는/g, '되는'], [/되어진/g, '된'], [/되어질/g, '될'], [/되어졌/g, '됐'],
  [/어떻해/g, '어떡해'],
];

type Draft = { title: string; slug: string; summary: string; category: string; imageAlt: string; imagePrompt: string; html: string };

function siteContext() {
  const lines: string[] = [];
  lines.push('## 이미 사이트에 있는 페이지 (이 주제를 통째로 다시 쓰지 말 것. 링크는 아래 주소만 쓸 것)');
  for (const t of TREATMENTS) lines.push(`- /treatment/${t.slug} — ${t.name}: ${t.qa.map((q) => q.q).join(' / ')}`);
  for (const g of SYMPTOM_GROUPS) {
    lines.push(`- /insight/symptom/${g.slug} — ${g.title}: ${symptomsOfGroup(g).map((s) => s.title).join(' / ')}`);
  }
  lines.push('- /insight/blog — 블로그 목록');
  lines.push('- /about/doctors — 의료진');
  return lines.join('\n');
}

function allowedPaths(): Set<string> {
  const s = new Set<string>(['/insight/blog', '/about/doctors', '/contact', '/insight']);
  for (const t of TREATMENTS) s.add(`/treatment/${t.slug}`);
  for (const g of SYMPTOM_GROUPS) s.add(`/insight/symptom/${g.slug}`);
  return s;
}

function prompt(topic: string, existingTitles: string[]) {
  return [
    `당신은 ${CLINIC.name}(${CLINIC.address.region} ${CLINIC.address.locality} ${CLINIC.address.dong})의 대표원장이 환자에게 설명하듯 쓰는 치과 블로그 글을 씁니다.`,
    '',
    `주제: ${topic}`,
    '',
    '## 글의 목적',
    '사람이 검색창이나 AI 에 실제로 묻는 문장에 정확히 답하는 글입니다. 검색과 답변 엔진이 첫 문단만 떼어 인용해도 답이 되게 씁니다.',
    '',
    '## 반드시 지킬 형식',
    '- 제목은 환자가 실제로 묻는 **질문 문장** 하나 (예: "임플란트를 심고 며칠 뒤부터 씹어도 되나요?"). 낚시·과장 없이.',
    '- 첫 문단에서 결론을 먼저 말합니다. 그다음 h2 셋에서 다섯으로 이유·상황·주의를 풀고, 마지막 문단은 짧게 정리합니다.',
    '- 본문은 HTML 이고 <p> <h2> <h3> <strong> <a> 만 씁니다. <ul> <ol> <li> <table> <img> <h1> 과 마크다운(**, ##, -) 은 절대 쓰지 않습니다.',
    '- 항목을 나열하고 싶으면 문장으로 잇습니다 ("또한 / 한편 / 특히 / 다만").',
    '- 본문 길이는 공백 포함 1,400~2,200자. 한 문단은 서너 문장.',
    '- 본문 안에 위 목록의 주소로 가는 <a href=\'/...\'> 링크를 하나에서 둘 넣습니다. 목록에 없는 주소는 만들지 않습니다. 외부 링크 없음.',
    '- 말투: "~합니다 / ~입니다". 환자를 "분" 으로 부릅니다. 첫 문단에 "결론부터 말씀드리면" 같은 직답 신호를 둡니다.',
    '- 숫자·기간은 "대개 / 보통 / 경우가 많습니다" 로 폭을 두고, 개인차가 있음을 자연스럽게 담습니다.',
    '',
    '## 의료법 제56조 — 절대 금지',
    '최고·최상·유일·완벽·1위·최초 같은 최상급, 효과·결과 보장, "부작용이 없다", "통증이 없다", 치료 후기·경험담·만족도, 치료 전후 비교, 다른 병원 비교·비방, 가격 할인·이벤트. 위반 낱말이 하나라도 있으면 글 전체가 광고 심의에 걸립니다.',
    '',
    '## 이미 있는 블로그 글 제목 (같은 질문을 다시 쓰지 말 것. 겹치면 다른 각도로)',
    existingTitles.length ? existingTitles.map((t) => `- ${t}`).join('\n') : '- (없음)',
    '',
    siteContext(),
    '',
    '## 결의 예시 (이 글과 같은 호흡·어조로. 내용은 베끼지 말 것)',
    `제목: ${EXEMPLAR.title}`,
    `요약: ${EXEMPLAR.summary}`,
    `본문: ${EXEMPLAR.html}`,
    '',
    '## 출력',
    'JSON 하나만. 키: title, slug(영문 소문자·숫자·하이픈 3~5단어), summary(검색 결과용 70~160자, 결론이 담긴 한두 문장), ' +
      `category(${CATEGORIES.join(' / ')} 중 하나), imageAlt(대표 사진에 무엇이 찍혔는지 한 문장, 한국어), ` +
      'imagePrompt(대표 사진 장면 한 문장, 영어, 사람·손·얼굴·글자 없이 치과 기구·모형·재료만), html(본문).',
  ].join('\n');
}

/** 형식 교정 — 마크다운 흔적·허용 밖 태그·지어낸 링크. 고친 것은 notes 로 알린다. */
function normalize(d: Draft, allowed: Set<string>): { draft: Draft; notes: string[]; hardFail?: string } {
  const notes: string[] = [];
  let html = (d.html || '').trim();
  if (/<(ul|ol|li|table|img|script|iframe|h1)\b/i.test(html)) return { draft: d, notes, hardFail: '목록·표·그림 태그가 들어왔습니다' };
  const before = html;
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#{1,3}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/<(\/?)(h4|h5|h6)\b/gi, '<$1h3')
    .replace(/<\/?(div|span|section|article|br)\b[^>]*>/gi, '')
    .replace(/\s(class|style|id|target|rel)="[^"]*"/gi, '');
  if (html !== before) notes.push('형식을 손봤습니다 (마크다운·허용 밖 태그)');
  html = html.replace(/<a\s+href=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, text: string) => {
    const path = href.split('#')[0];
    if (allowed.has(path)) return `<a href='${href}'>${text}</a>`;
    notes.push(`없는 주소 링크를 뺐습니다: ${href}`);
    return text;
  });
  for (const [re, to] of GRAMMAR_FIX) html = html.replace(re, to);
  const slug = (d.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const category = CATEGORIES.includes(d.category) ? d.category : '';
  return { draft: { ...d, html, slug, category }, notes };
}

function medlawWarnings(d: Draft): string[] {
  const text = `${d.title} ${d.summary} ${d.html.replace(/<[^>]+>/g, ' ')}`;
  return MEDLAW_FLAGS.filter((w) => text.includes(w));
}

async function callGemini(key: string, text: string): Promise<Draft> {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        temperature: 0.65,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' }, slug: { type: 'STRING' }, summary: { type: 'STRING' }, category: { type: 'STRING' },
            imageAlt: { type: 'STRING' }, imagePrompt: { type: 'STRING' }, html: { type: 'STRING' },
          },
          required: ['title', 'slug', 'summary', 'category', 'imageAlt', 'imagePrompt', 'html'],
        },
      },
    }),
  });
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = (await r.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const raw = j.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!raw) throw new Error('Gemini 가 빈 응답을 보냈습니다.');
  return JSON.parse(raw.replace(/^```json\s*|```\s*$/g, '')) as Draft;
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const key = process.env.GEMINI_API_KEY || req.headers.get('x-gemini-key');
  if (!key) return NextResponse.json({ error: 'Gemini 키가 없습니다. Vercel 환경변수 GEMINI_API_KEY 를 설정하거나 화면에서 붙여 넣으세요.' }, { status: 428 });

  const body = (await req.json().catch(() => ({}))) as { topic?: string; existingTitles?: string[] };
  const topic = (body.topic || '').trim().slice(0, 300);
  if (topic.length < 2) return NextResponse.json({ error: '주제를 한 줄 적어 주세요. 예: 임플란트 심고 며칠 뒤부터 씹어도 되나' }, { status: 400 });
  const existing = Array.isArray(body.existingTitles) ? body.existingTitles.slice(0, 200).map(String) : [];
  const allowed = allowedPaths();

  try {
    let d = await callGemini(key, prompt(topic, existing));
    let out = normalize(d, allowed);
    if (out.hardFail) {
      /* 한 번 더 — 목록을 만든 것은 형식 규칙을 놓친 것이라 다시 말하면 대개 고쳐 온다. */
      d = await callGemini(key, `${prompt(topic, existing)}\n\n⚠️ 방금 응답에 ${out.hardFail}. <ul> <ol> <li> 표 그림 없이, 문장으로만 다시 쓰세요.`);
      out = normalize(d, allowed);
      if (out.hardFail) return NextResponse.json({ error: `두 번 모두 ${out.hardFail}. 주제를 조금 바꿔 다시 시도해 주세요.` }, { status: 502 });
    }
    const plain = out.draft.html.replace(/<[^>]+>/g, '');
    return NextResponse.json({
      ok: true,
      draft: out.draft,
      notes: out.notes,
      warnings: medlawWarnings(out.draft),
      chars: plain.length,
      model: MODEL,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e).slice(0, 300) }, { status: 502 });
  }
}
