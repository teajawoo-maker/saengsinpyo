/**
 * 바뀐 주소를 검색엔진에 직접 알린다.
 *
 * 새 글을 올려도 검색엔진이 알아서 찾아올 때까지는 몇 주가 걸린다.
 * IndexNow는 "이 주소 지금 봐달라"고 먼저 알리는 약속이고,
 * 네이버가 여기에 참여한다. 한 곳에 보내면 참여하는 다른 곳
 * (빙 등)에도 함께 전달된다. 구글은 참여하지 않아 따로 기다려야 한다.
 *
 *   npm run indexnow               사이트맵의 모든 주소
 *   npm run indexnow guide/tti-ganji   특정 주소만
 *
 * 윈도우 Git Bash는 /로 시작하는 인자를 윈도우 경로로 바꿔 버린다.
 * (/guide/x → C:/Program Files/Git/guide/x) 그래서 앞의 /는 빼고 적는다.
 * 실수로 붙여도 아래에서 알아보고 되돌린다.
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

/**
 * 사람이 적은 인자 하나를 온전한 주소로 만든다.
 * Git Bash가 앞의 /를 윈도우 경로로 바꿔 놓은 것도 되돌린다.
 */
function toUrl(arg) {
  if (arg.startsWith('http')) return arg;
  // C:/Program Files/Git/guide/x 처럼 바뀐 것에서 실제 경로만 뽑는다
  const mangled = arg.match(/^[A-Za-z]:[/\\].*?[/\\]Git[/\\](.*)$/);
  const path = mangled ? mangled[1] : arg;
  return `https://${HOST}/${path.replace(/^\/+/, '')}`;
}

async function main() {
  const args = process.argv.slice(2);
  const known = await urlsFromSitemap();
  const urlList = args.length ? args.map(toUrl) : known;

  // 사이트맵에 없는 주소를 보내면 검색엔진이 통째로 거절한다.
  // 오타나 경로가 망가진 것을 여기서 먼저 잡는다.
  const unknown = urlList.filter(u => !known.includes(u));
  if (unknown.length) {
    console.error('사이트맵에 없는 주소입니다. 배포됐는지, 오타가 없는지 확인하세요:');
    for (const u of unknown) console.error('  ', u);
    console.error('\n사이트맵에 있는 주소:');
    for (const u of known) console.error('  ', u);
    process.exit(1);
  }

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
