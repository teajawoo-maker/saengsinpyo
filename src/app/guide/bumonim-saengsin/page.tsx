import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '부모님·조부모님 음력 생신 양력 변환 | 우리집 생신표',
  description: '부모님, 할머니, 할아버지의 음력 생신을 올해 양력 날짜로 정확하게 변환하는 방법. 매년 달라지는 음력 생일을 쉽게 확인하세요.',
  keywords: ['부모님 생신', '할머니 생신 양력', '할아버지 음력 생신', '음력 양력 변환', '어머니 생신 날짜'],
};

export default function BumonimPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            부모님·조부모님 음력 생신<br />양력으로 바로 확인하기
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            "어머니 생신이 음력 몇 월 며칠인데, 올해 양력으로 언제지?" — 이런 고민, 이제 2초 만에 해결해 보세요.
          </p>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>왜 매년 양력 날짜가 바뀌나요?</h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>음력은 달의 움직임을 기준으로 하기 때문에 양력보다 약 10~11일 짧습니다. 그래서 같은 음력 날짜라도 양력으로 환산하면 해마다 달라져요.</p>
              <p>예를 들어 <strong>음력 9월 15일</strong>은:</p>
              <ul className="space-y-1 mt-1 ml-2">
                <li>• 2024년 → 양력 10월 17일</li>
                <li>• 2025년 → 양력 11월 5일</li>
                <li>• 2026년 → 양력 10월 25일</li>
              </ul>
              <p className="mt-2">이처럼 매년 10~40일가량 차이가 나서, 달력에서 그냥 찾으려면 상당히 어렵습니다.</p>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>어떻게 확인하면 되나요?</h2>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <div className="space-y-4">
                {[
                  { step: '1', title: '음력 생신 날짜 확인', desc: '먼저 부모님께 음력 생신 월/일을 여쭤보세요. 평달인지 윤달인지도 함께 확인하면 더 정확해요.' },
                  { step: '2', title: '계산기에 입력', desc: '우리집 생신표 계산기에 음력 월·일을 입력하고 "양력으로 변환하기"를 눌러요.' },
                  { step: '3', title: '올해·내년 날짜 확인', desc: '올해와 내년의 양력 날짜, D-DAY가 바로 표시돼요. 이미 지났으면 내년 날짜를 확인하세요.' },
                  { step: '4', title: '즐겨찾기 저장', desc: '저장 버튼으로 "어머니", "할머니" 등 호칭별로 저장해 두면 다음번에 바로 확인 가능해요.' },
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>형제자매와 함께 챙기려면?</h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>부모님 생신을 형제자매와 함께 챙기고 싶다면, 계산 결과를 공유하기 버튼으로 카카오톡이나 인스타그램 DM으로 바로 보낼 수 있어요.</p>
              <p>이미지 카드로 생성해서 보내면 더 보기 좋게 전달됩니다.</p>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              📌 입력한 음력 날짜와 호칭은 이 기기에만 저장되며, 운영자 서버로 전송되지 않습니다. 한국천문연구원(KASI) 공식 데이터를 기반으로 계산합니다.
            </p>
          </div>
        </div>

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            지금 바로 부모님 생신을 확인해 보세요
          </p>
          <Link href="/" className="inline-block py-3 px-6 rounded-xl text-sm font-bold"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            🎂 계산기로 이동
          </Link>
        </div>
      </article>
    </main>
  );
}
