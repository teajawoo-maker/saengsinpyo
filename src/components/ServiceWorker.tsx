'use client';

import { useEffect } from 'react';

/**
 * 서비스워커를 등록한다. 홈 화면에 추가할 수 있는 앱으로 인정받기 위한 것이다.
 * 첫 화면을 그리는 일과 겹치지 않도록 다 그린 뒤에 등록한다.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 등록에 실패해도 사이트는 그대로 쓸 수 있다
      });
    };
    if (document.readyState === 'complete') register();
    else {
      window.addEventListener('load', register, { once: true });
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
