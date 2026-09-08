import Link from 'next/link';

/**
 * 없는 주소로 들어왔을 때.
 *
 * 이게 없으면 Next.js 기본 화면이 나오는데, 한국어 사이트인데
 * "404: This page could not be found."라는 영어 한 줄만 뜨고
 * 돌아갈 길도 없다. 링크가 바뀌었거나 오타로 들어온 사람이
 * 그냥 나가 버린다.
 */
export default function NotFound() {
  return (
    <main
      className="flex items-center justify-center px-4"
      style={{ background: 'var(--bg)', minHeight: '100dvh' }}
    >
      <div className="max-w-md w-full text-center py-16">
        <p className="text-6xl mb-5" aria-hidden="true">
          🎂
        </p>
        <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
          찾으시는 쪽이 없어요
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          주소가 바뀌었거나 잘못 입력하신 것 같아요.
          <br />
          아래에서 다시 시작해 보세요.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="py-3.5 px-6 rounded-2xl text-sm font-bold"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            🎂 생신 계산기로 가기
          </Link>
          <Link
            href="/guide"
            className="py-3.5 px-6 rounded-2xl text-sm font-semibold"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
            }}
          >
            📖 음력 생일 가이드 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
