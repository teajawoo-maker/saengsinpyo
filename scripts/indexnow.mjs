/**
 * 바뀐 주소를 검색엔진에 직접 알린다.
 *
 * 새 글을 올려도 검색엔진이 알아서 찾아올 때까지는 몇 주가 걸린다.
 * IndexNow는 "이 주소 지금 봐달라"고 먼저 알리는 약속이고,
 * 네이버가 여기에 참여한다. 한 곳에 보내면 참여하는 다른 곳
 * (빙 등)에도 함께 전달된다. 구글은 참여하지 않아 따로 기다려야 한다.
 *
 *   node scripts/indexnow.mjs            사이트맵의 모든 주소
 *   node scripts/indexnow.mjs /guide/x   특정 주소만
 */

const HOST = 'www.saengsinpyo.com';
const KEY = '7a1832fcd83496b801e815517082dffb';
const ENDPOINT = 'https://searchadvisor.naver.com/indexnow';

async function urlsFromSitemap() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`사이트맵을 못 읽었습니다 (HTTP ${res.status})`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length
    ? args.map(p => (p.startsWith('http') ? p : `https://${HOST}${p}`))
    : await urlsFromSitemap();

  // 키 파일이 실제로 열려야 검색엔진이 우리를 믿는다. 먼저 확인한다.
  const keyUrl = `https://${HOST}/${KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : '';
  if (keyBody !== KEY) {
    console.error(`키 파일 확인 실패: ${keyUrl}`);
    console.error(`  HTTP ${keyRes.status}, 내용 "${keyBody.slice(0, 40)}"`);
    console.error('  배포가 끝난 뒤에 다시 실행하세요.');
    process.exit(1);
  }
  console.log(`키 파일 확인됨: ${keyUrl}`);

  const body = { host: HOST, key: KEY, keyLocation: keyUrl, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // 200은 접수, 202는 접수했으나 키 확인 중. 둘 다 정상이다.
  const ok = res.status === 200 || res.status === 202;
  console.log(`${ok ? '보냈습니다' : '실패'} — HTTP ${res.status} ${res.statusText}`);
  for (const u of urlList) console.log('  ', u);
  if (!ok) {
    console.error(await res.text().catch(() => ''));
    process.exit(1);
  }
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
