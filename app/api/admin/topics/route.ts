import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { CATEGORIES, siteContext, clinicLine, callGeminiJson } from '@/lib/adminGemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST { count, existing: [{title, summary}] } → 아직 안 쓴 블로그 주제 N개.
 * '자동으로 쓰고 예약' 의 첫 단계다 (2026-09-08 오너: "자동 10건 쓰기 하면 … 이전 블로그랑 다른 내용이어야 해").
 *
 * ★ 기존 글의 제목과 요약, 그리고 사이트 페이지 목록을 통째로 준다 — 겹치는 주제를 고르지 않게.
 * ★ 분류를 골고루 섞게 한다. 한 달 10편이 전부 임플란트면 검색에서도 독자에게도 손해다.
 * ⚠️ 여기서 고른 주제는 이어서 /api/admin/draft 로 한 편씩 간다. 주제 문장은 환자가 묻는 말이어야 한다 — 그 문장이 곧 제목의 뼈대다.
 */
type Topic = { topic: string; category: string };

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const key = process.env.GEMINI_API_KEY || req.headers.get('x-gemini-key');
  if (!key) return NextResponse.json({ error: 'Gemini 키가 없습니다.' }, { status: 428 });

  const body = (await req.json().catch(() => ({}))) as { count?: number; existing?: Array<{ title: string; summary?: string }> };
  const count = Math.min(30, Math.max(1, Math.round(Number(body.count) || 10)));
  const existing = Array.isArray(body.existing) ? body.existing.slice(0, 300) : [];

  const text = [
    `${clinicLine()} 블로그의 다음 글 주제를 ${count}개 고릅니다.`,
    '',
    '## 조건',
    '- 각 주제는 환자가 검색창이나 AI 에 실제로 묻는 **질문 문장** 그대로 (예: "임플란트 심고 며칠 뒤부터 씹어도 되나요"). 15~40자.',
    '- 아래 "이미 있는 글" 과 같은 질문, 같은 답이 나오는 질문은 고르지 않습니다. 비슷한 주제라면 다른 각도(시기·비용·통증·관리·아이·어르신)로.',
    '- 아래 "사이트 페이지" 가 이미 답하는 질문(시술 소개·증상 설명)도 고르지 않습니다. 블로그는 그 페이지들이 못 담는 구체적인 상황을 다룹니다.',
    `- 분류(${CATEGORIES.join(' / ')})를 골고루 섞습니다. 한 분류가 ${Math.max(2, Math.ceil(count / 4))}개를 넘지 않게.`,
    '- 계절·명절·연말정산·방학처럼 시기와 맞는 질문을 한둘 섞어도 좋습니다. 지금은 9~10월입니다.',
    '- 최상급·후기·이벤트 냄새가 나는 주제는 뺍니다(의료광고).',
    '',
    '## 이미 있는 글',
    existing.length ? existing.map((e) => `- ${e.title}${e.summary ? ` — ${e.summary.slice(0, 80)}` : ''}`).join('\n') : '- (없음)',
    '',
    siteContext(),
    '',
    `## 출력\nJSON 배열 ${count}개. 각 원소: { topic, category }.`,
  ].join('\n');

  const schema = {
    type: 'ARRAY',
    items: { type: 'OBJECT', properties: { topic: { type: 'STRING' }, category: { type: 'STRING' } }, required: ['topic', 'category'] },
  };

  try {
    const raw = await callGeminiJson<Topic[]>(key, text, schema, 0.9);
    const seen = new Set<string>();
    const topics = (Array.isArray(raw) ? raw : [])
      .map((t) => ({ topic: String(t.topic || '').trim().replace(/[?？]$/, ''), category: CATEGORIES.includes(t.category) ? t.category : '' }))
      .filter((t) => t.topic.length >= 6 && !seen.has(t.topic) && seen.add(t.topic))
      .slice(0, count);
    if (!topics.length) return NextResponse.json({ error: '주제를 못 골랐습니다. 다시 눌러 보세요.' }, { status: 502 });
    return NextResponse.json({ ok: true, topics });
  } catch (e) {
    return NextResponse.json({ error: String(e).slice(0, 300) }, { status: 502 });
  }
}
