import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/pageMeta';
import Link from 'next/link';

export const metadata: Metadata = pageMetadata({
  title: '개인정보처리방침 | 우리집 생신표',
  description: '우리집 생신표는 입력한 생일 정보를 서버로 보내지 않습니다. 광고 쿠키와 저장 방식, 삭제 방법을 안내합니다.',
  path: '/privacy',
  image: 'privacy.png',
  imageAlt: '개인정보처리방침',
});

/**
 * 개인정보처리방침.
 *
 * 애드센스는 광고 쿠키를 쓴다는 사실을 알리는 방침이 사이트에 있어야 한다.
 * 적힌 내용은 실제 코드와 맞춰 두었다. 분석 도구를 붙이거나 서버로 무언가를
 * 보내게 바꾸면 이 쪽도 반드시 함께 고쳐야 한다.
 */
export default function PrivacyPage() {
  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 생신 계산기
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            개인정보처리방침
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            우리집 생신표(이하 &lsquo;사이트&rsquo;)는 회원가입이 없고, 입력하신 생일 정보를 운영자 서버로
            보내지 않습니다. 어떤 정보가 어디에 남는지 정리했습니다.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="1. 사이트가 직접 수집하는 정보">
            <p>
              <strong>없습니다.</strong> 사이트에는 회원가입·로그인이 없고, 운영자가 방문자를 분석하는
              도구도 쓰지 않습니다.
            </p>
          </Section>

          <Section title="2. 입력한 생일 정보는 어디에 저장되나요">
            <p>
              &lsquo;즐겨찾기에 저장하기&rsquo;로 저장한 호칭·생일·설정은 <strong>지금 쓰고 계신 기기의
              브라우저 안에만</strong> 저장됩니다(브라우저 로컬 저장소). 운영자를 포함해 누구에게도
              전송되지 않으며, 운영자는 그 내용을 볼 수 없습니다.
            </p>
            <p className="mt-2">
              그래서 기기를 바꾸거나 브라우저 데이터를 지우면 함께 사라집니다. 옮기려면 첫 화면의
              백업 기능으로 파일을 내려받아 새 기기에서 불러오세요.
            </p>
            <p className="mt-2">
              <strong>지우는 방법</strong> — 저장 목록에서 항목별로 삭제하거나, 브라우저 설정에서 이
              사이트의 데이터를 삭제하면 모두 지워집니다.
            </p>
          </Section>

          <Section title="3. 광고와 쿠키">
            <p>
              사이트는 운영비를 위해 <strong>Google 애드센스</strong> 광고를 싣습니다.
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>Google을 비롯한 제3자 광고 사업자는 쿠키를 사용해, 이용자가 이 사이트나 다른
                웹사이트를 방문한 기록을 바탕으로 광고를 보여줄 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>Google은 광고 쿠키를 사용하여 이용자의 이 사이트 및 다른 사이트 방문 기록을
                바탕으로 Google과 파트너가 광고를 게재할 수 있도록 합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>
                  맞춤 광고를 원하지 않으면{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    Google 광고 설정
                  </a>
                  에서 끌 수 있습니다. 제3자 사업자의 쿠키는{' '}
                  <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    aboutads.info
                  </a>
                  에서 해제할 수 있습니다.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              Google이 수집하는 정보와 쓰는 방식은{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Google 파트너 사이트 정책
              </a>
              을 따릅니다.
            </p>
          </Section>

          <Section title="4. 호스팅">
            <p>
              사이트는 Vercel에서 운영됩니다. Vercel은 서비스 제공과 보안을 위해 접속 기록(IP 주소,
              브라우저 종류, 접속 시각 등)을 처리할 수 있습니다. 운영자는 이를 방문자 식별에 쓰지 않습니다.
            </p>
          </Section>

          <Section title="5. 문의">
            <p>
              개인정보에 관한 문의는{' '}
              <a href="mailto:teajawoo@gmail.com" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                teajawoo@gmail.com
              </a>
              으로 보내 주세요.
            </p>
          </Section>

          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            시행일 2026년 9월 17일
          </p>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
      <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  );
}
