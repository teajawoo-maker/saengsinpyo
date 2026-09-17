/**
 * 쪽마다 카톡·SNS 공유 썸네일을 만든다.
 *
 *   npm run og-images
 *
 * 카톡은 링크 미리보기 이미지를 휴대폰에서 폭 250~300px 정도로 줄여 보여 준다.
 * 1200px 원본 기준 40px 글씨는 거기서 10px이 되어 읽히지 않는다.
 * 그래서 제목은 아주 크게, 나머지 정보는 짧은 칩 몇 개로만 담는다.
 * 문장으로 된 설명은 이미지가 아니라 og:description이 맡는다.
 *
 * 동적 이미지(opengraph-image.tsx)를 쓰지 않는 이유: 주소에 쿼리스트링이 붙고
 * must-revalidate 헤더가 걸리는데, 카카오 스크래퍼가 그런 이미지를 못 가져왔다.
 * 정적 PNG는 문제없이 가져간다.
 *
 * HTML로 그린 뒤 설치된 Chrome의 헤드리스 모드로 찍는다.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { GUIDES } = await import('../src/lib/guides.ts');

const OUT_DIR = resolve('public/og');
const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
];

/** 분위기별 색. 49재는 잔치 색을 쓰면 안 된다. */
const THEMES = {
  brand: { bg: '#fff4e6', bg2: '#ffe3c7', ink: '#2e2119', accent: '#c94a0d', chipBg: '#ffffff', chipInk: '#8a3a0a', muted: '#806a56' },
  baby: { bg: '#fff1f2', bg2: '#ffdfe5', ink: '#2e2119', accent: '#be3a63', chipBg: '#ffffff', chipInk: '#9c2c4f', muted: '#83606a' },
  calm: { bg: '#eef1f4', bg2: '#dde3ea', ink: '#1f2a36', accent: '#3f5468', chipBg: '#ffffff', chipInk: '#3f5468', muted: '#5f6f7e' },
  guide: { bg: '#fffaf3', bg2: '#fdebd3', ink: '#2e2119', accent: '#c94a0d', chipBg: '#ffffff', chipInk: '#8a3a0a', muted: '#806a56' },
};

/** 만들 카드 목록. file은 public/og/ 아래 파일명이다. */
const CARDS = [
  {
    file: 'home.png',
    theme: 'brand',
    emoji: '🎂',
    label: '우리집 생신표',
    headline: ['음력 생신,', '올해는 양력 며칠?'],
    chips: ['윤달·30일 처리', '띠·환갑', '가족 생신 저장'],
    url: 'saengsinpyo.com',
  },
  {
    file: 'baegil.png',
    theme: 'baby',
    emoji: '👶',
    label: '우리집 생신표',
    headline: ['백일·돌 계산기'],
    sub: '태어난 날만 넣으면 끝',
    chips: ['50일', '백일', '200일', '첫돌'],
    url: 'saengsinpyo.com/baegil',
  },
  {
    file: 'sasipgujae.png',
    theme: 'calm',
    emoji: '🕯️',
    label: '우리집 생신표',
    headline: ['49재·삼우제', '계산기'],
    chips: ['삼우제', '초재~육재', '49재'],
    url: 'saengsinpyo.com/sasipgujae',
  },
  {
    file: 'guide.png',
    theme: 'guide',
    emoji: '📖',
    label: '음력 생일 가이드',
    headline: ['음력 생일,', '헷갈릴 때 보는 글'],
    chips: ['윤달', '음력 30일', '환갑', '명절'],
    url: 'saengsinpyo.com/guide',
  },
  {
    file: 'about.png',
    theme: 'guide',
    emoji: '🔭',
    label: '우리집 생신표',
    headline: ['어떻게', '계산하나요?'],
    chips: ['한국천문연구원 데이터', '윤달·30일 원칙'],
    url: 'saengsinpyo.com/about',
  },
  {
    file: 'privacy.png',
    theme: 'guide',
    emoji: '🔒',
    label: '우리집 생신표',
    headline: ['개인정보처리방침'],
    sub: '입력한 생일은 서버로 가지 않아요',
    chips: ['기기에만 저장', '광고 쿠키 안내'],
    url: 'saengsinpyo.com/privacy',
  },
  ...GUIDES.map(g => ({
    file: `guide-${g.slug}.png`,
    theme: 'guide',
    emoji: g.emoji,
    label: '음력 생일 가이드',
    headline: splitHeadline(g.title),
    chips: g.tags.slice(0, 3),
    // 글 주소는 영문 로마자라 읽어도 뜻이 없고, 길어서 왼쪽 글자와 겹친다. 도메인만 둔다.
    url: 'saengsinpyo.com',
  })),
];

/**
 * 긴 제목을 두 줄로 나눈다. 한 줄 최대 약 11자라 그보다 길면
 * 가운데에 가장 가까운 띄어쓰기에서 자른다.
 */
function splitHeadline(title) {
  const t = title.replace(/\?$/, '?');
  if (t.length <= 11) return [t];
  const spaces = [...t.matchAll(/ /g)].map(m => m.index);
  if (!spaces.length) return [t];
  const mid = t.length / 2;
  const cut = spaces.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return [t.slice(0, cut), t.slice(cut + 1)];
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function renderHtml(card) {
  const c = THEMES[card.theme];
  const longest = Math.max(...card.headline.map(l => l.length));
  // 줄이 길면 글씨를 줄여 폭 안에 넣는다.
  // 두 줄이면 높이가 아래 칩에 닿으므로 짧은 줄이어도 96px을 넘기지 않는다.
  const byWidth = longest <= 8 ? 112 : longest <= 10 ? 100 : longest <= 12 ? 90 : 80;
  const size = card.headline.length >= 2 ? Math.min(byWidth, 96) : byWidth;

  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'KR'; src: local('Noto Sans KR'), local('Malgun Gothic'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    background: radial-gradient(circle at 88% 12%, ${c.bg2} 0, ${c.bg2} 220px, transparent 221px),
                radial-gradient(circle at 100% 100%, ${c.bg2} 0, ${c.bg2} 150px, transparent 151px),
                ${c.bg};
    color: ${c.ink};
    padding: 64px 76px;
    position: relative;
  }
  .top { display: flex; align-items: center; gap: 22px; }
  .emoji {
    width: 124px; height: 124px; border-radius: 34px; background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 82px; line-height: 1;
    font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  }
  .label { font-size: 38px; font-weight: 800; color: ${c.accent}; letter-spacing: -0.5px; }
  h1 {
    margin-top: 34px; font-size: ${size}px; font-weight: 900; line-height: 1.12;
    letter-spacing: -2.5px; max-width: 1050px;
  }
  .sub { margin-top: 18px; font-size: 46px; font-weight: 700; color: ${c.muted}; letter-spacing: -1px; }
  .chips { position: absolute; left: 76px; bottom: 64px; display: flex; gap: 14px; flex-wrap: nowrap; }
  .chip {
    font-size: 40px; font-weight: 800; color: ${c.chipInk}; background: ${c.chipBg};
    border: 3px solid ${c.bg2}; border-radius: 999px; padding: 10px 28px; white-space: nowrap;
    letter-spacing: -0.5px;
  }
  .url { position: absolute; right: 76px; top: 88px; font-size: 28px; font-weight: 700; color: ${c.muted}; }
</style></head>
<body>
  <div class="top">
    <div class="emoji">${card.emoji}</div>
    <div class="label">${escapeHtml(card.label)}</div>
  </div>
  <div class="url">${escapeHtml(card.url)}</div>
  <h1>${card.headline.map(escapeHtml).join('<br>')}</h1>
  ${card.sub ? `<div class="sub">${escapeHtml(card.sub)}</div>` : ''}
  <div class="chips">${card.chips.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('')}</div>
</body></html>`;
}

function main() {
  const chrome = CHROME_CANDIDATES.find(p => existsSync(p));
  if (!chrome) {
    console.error('Chrome이나 Edge를 찾지 못했습니다.');
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  const work = join(tmpdir(), `og-${Date.now()}`);
  mkdirSync(work, { recursive: true });

  const only = process.argv.slice(2);
  const cards = only.length ? CARDS.filter(c => only.includes(c.file)) : CARDS;

  for (const card of cards) {
    const htmlPath = join(work, card.file.replace('.png', '.html'));
    writeFileSync(htmlPath, renderHtml(card), 'utf8');
    const out = join(OUT_DIR, card.file);
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      `--screenshot=${out}`,
      pathToFileURL(htmlPath).href,
    ], { stdio: 'ignore' });
    console.log('만듦', `public/og/${card.file}`);
  }
  rmSync(work, { recursive: true, force: true });
}

main();
