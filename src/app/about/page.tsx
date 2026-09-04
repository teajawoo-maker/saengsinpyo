import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '계산 기준 안내 | 우리집 생신표',
  description: '우리집 생신표의 음력 양력 변환 기준, 한국천문연구원 데이터 사용 방식, 윤달·30일 처리 원칙을 상세히 설명합니다.',
};

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 계산기로 돌아가기
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>계산 기준 안내</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            우리집 생신표가 어떤 기준으로 음력을 양력으로 변환하는지 설명합니다.
          </p>
        </header>

        <div className="space-y-5">
          <InfoBlock title="📊 데이터 기준">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• <strong>한국천문연구원(KASI)</strong> 음양력 데이터를 기반으로 계산합니다.</li>
              <li>• 지원 범위: <strong>1900년 ~ 2100년</strong></li>
              <li>• 중국 음력 라이브러리를 사용하지 않습니다. 한국과 중국은 표준시 차이로 윤달이 달라진 사례가 있습니다.</li>
              <li>• 지원 범위를 벗어난 날짜는 추정하지 않고 오류로 표시합니다.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="🌙 윤달 처리 원칙">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• <strong>평달 생신</strong>: 해당 연도의 평달 월·일로 1회 계산합니다. 같은 달에 윤달이 있어도 평달만 계산합니다.</li>
              <li>• <strong>윤달 생신 (윤달 있는 해)</strong>: 윤달 날짜로 1회 계산합니다.</li>
              <li>• <strong>윤달 생신 (윤달 없는 해)</strong>: 사용자가 선택한 규칙(평달 대체 또는 건너뛰기)을 따릅니다.</li>
              <li>• 윤달과 평달이 같은 해에 있어도 중복 알림을 생성하지 않습니다.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="📅 음력 30일 처리 원칙">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• 음력 달마다 날수(29일 또는 30일)가 다릅니다.</li>
              <li>• 30일 생신인데 그해 그 달이 29일까지만 있는 경우: 사용자가 선택한 규칙(29일로 계산 / 다음달 1일로 / 건너뛰기)을 따릅니다.</li>
              <li>• 기본값은 <strong>29일(그달 마지막 날)로 계산</strong>입니다.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="📆 '올해 생신' 정의">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• 올해 생신은 음력 연도 기준이 아닌, <strong>양력 1월 1일~12월 31일</strong> 사이에 해당하는 날짜입니다.</li>
              <li>• 음력 11~12월은 양력 연도가 넘어갈 수 있어서 음력 연도를 단순 대입하지 않습니다.</li>
              <li>• 오늘보다 이미 지난 올해 날짜는 '지났어요'로 표시하고, 내년 날짜를 안내합니다.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="🔒 개인정보 원칙">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• 입력한 호칭과 음력 날짜는 <strong>이 기기(브라우저 localStorage)에만 저장</strong>됩니다.</li>
              <li>• 운영자 서버로 가족 정보가 전송되지 않습니다.</li>
              <li>• 계산은 브라우저에서 직접 처리합니다.</li>
              <li>• 실명, 출생연도, 연락처를 수집하지 않습니다.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="⚠️ 이런 표현은 하지 않아요">
            <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>날짜 계산의 특성상 다음 표현은 사용하지 않습니다:</p>
              <ul className="mt-2 space-y-1" style={{ color: 'var(--text-muted)' }}>
                <li>• "윤달도 완벽하게 자동 처리" (가족 관습은 직접 선택해야 합니다)</li>
                <li>• "모든 음력 날짜를 100% 정확하게" (지원 범위와 라이브러리 한계가 있습니다)</li>
              </ul>
            </div>
          </InfoBlock>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            오류나 개선 의견이 있으시면 언제든지 알려주세요.
          </p>
          <a href="mailto:teajawoo@gmail.com"
            className="inline-block py-2.5 px-5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            📧 teajawoo@gmail.com
          </a>
        </div>
      </article>
    </main>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
      <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </div>
  );
}
