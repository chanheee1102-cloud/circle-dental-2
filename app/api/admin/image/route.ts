import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { writeFile, fileSha, tokenFrom } from '@/lib/github';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * POST { prompt, name } → gpt-image-2 로 그림을 만들어 public/img/blog/{name}.webp 로 커밋한다.
 *
 * ★ 결은 사이트의 다른 AI 사진과 같아야 한다 — 아래 LOOK 을 프롬프트 뒤에 항상 붙인다.
 *   (scripts 의 _gen*.cjs 와 같은 문장. 결이 갈리면 한 사이트로 안 보인다.)
 * ⚠️ 사람·손·얼굴·글자·로고 금지도 LOOK 이 강제한다. 관리자가 프롬프트에 사람을 적어도 뒤 문장이 막는다.
 * ⚠️ OpenAI 키는 서버 환경변수(OPENAI_API_KEY)가 우선, 없으면 헤더(x-openai-key).
 * ⚠️ webp 변환은 sharp 가 한다 — 원본 PNG(1536×1024, 2~3MB)를 그대로 올리면 목록이 무거워진다.
 */
const LOOK =
  'Bright, tidy dental clinic. Clean white counter surface, clinical daylight, soft shadows. ' +
  'White and pale grey palette with one quiet warm beige accent in the background. ' +
  'Macro photographic, shallow depth of field, calm and professional. ' +
  'No linen cloth, no dried flowers, no rustic pottery. ' +
  'Absolutely no people, no hands, no faces, no body parts. No logos, no brand marks, no readable lettering or numbers anywhere.';

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const token = tokenFrom(req);
  if (!token) return NextResponse.json({ error: 'GitHub 토큰이 없습니다.' }, { status: 428 });
  const key = process.env.OPENAI_API_KEY || req.headers.get('x-openai-key');
  if (!key) return NextResponse.json({ error: 'OpenAI 키가 없습니다. Vercel 환경변수 OPENAI_API_KEY 를 설정하거나 화면에서 붙여 넣으세요.' }, { status: 428 });

  const { prompt, name } = (await req.json().catch(() => ({}))) as { prompt?: string; name?: string };
  const safe = (name || '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!prompt || !safe) return NextResponse.json({ error: '설명과 파일 이름이 필요합니다.' }, { status: 400 });

  try {
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-image-2', prompt: `${prompt} ${LOOK}`, size: '1536x1024', quality: 'medium', n: 1 }),
    });
    if (!r.ok) return NextResponse.json({ error: `OpenAI ${r.status}: ${(await r.text()).slice(0, 200)}` }, { status: 502 });
    const j = (await r.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = j.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: 'OpenAI 가 빈 응답을 보냈습니다.' }, { status: 502 });

    const sharp = (await import('sharp')).default;
    const webp = await sharp(Buffer.from(b64, 'base64')).webp({ quality: 82 }).toBuffer();
    const path = `public/img/blog/${safe}.webp`;
    const sha = await fileSha(token, path);
    await writeFile(token, path, webp, `사진(블로그): ${safe}`, sha);
    return NextResponse.json({ ok: true, image: `/img/blog/${safe}.webp`, bytes: webp.length });
  } catch (e) {
    return NextResponse.json({ error: String(e).slice(0, 300) }, { status: 502 });
  }
}
