/*
  홈 화면에 추가하려면 서비스워커가 하나 있어야 한다.
  크롬은 fetch를 다루는 서비스워커가 없으면 설치 안내를 띄우지 않는다.

  일부러 아무것도 저장하지 않는다. 이 사이트는 날짜를 다루는 곳이라
  낡은 화면을 꺼내 보여 주면 틀린 날짜를 보여 주게 된다. 예를 들어
  '올해 생신'은 해가 바뀌면 달라지고, 'D-12' 같은 숫자는 매일 달라진다.
  그래서 요청은 늘 네트워크로 보낸다.
*/

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // 예전에 저장해 둔 것이 있으면 지운다
  event.waitUntil(
    caches
      .keys()
      .then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', () => {
  // 가로채지 않고 브라우저에 그대로 맡긴다.
  // 이 핸들러가 있어야 설치할 수 있는 앱으로 인정된다.
});
