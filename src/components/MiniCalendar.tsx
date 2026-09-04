'use client';

import type { SolarResult } from '@/types/lunar';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  /** 달력에 표시할 생신 날짜 */
  target: SolarResult;
}

/**
 * 생신이 있는 달의 달력. 해당 날짜를 강조하고, 같은 달이면 오늘도 함께 표시한다.
 */
export default function MiniCalendar({ target }: Props) {
  const { year, month, day } = target;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  // 앞쪽 빈칸 + 날짜들
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
      <p className="text-sm font-semibold mb-3 text-center" style={{ color: 'var(--text-secondary)' }}>
        {year}년 {month}월
      </p>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className="text-center text-xs font-medium py-1"
            style={{ color: i === 0 ? '#D94F4F' : i === 6 ? '#4F7FD9' : 'var(--text-muted)' }}>
            {w}
          </div>
        ))}

        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;

          const isBirthday = d === day;
          const isToday = isCurrentMonth && d === todayDate;
          const dow = i % 7;

          return (
            <div key={d}
              className="flex items-center justify-center text-sm rounded-lg"
              style={{
                aspectRatio: '1',
                fontWeight: isBirthday ? 700 : 400,
                background: isBirthday ? 'var(--accent)' : isToday ? 'var(--accent-light)' : 'transparent',
                color: isBirthday
                  ? '#fff'
                  : isToday
                    ? 'var(--accent)'
                    : dow === 0 ? '#D94F4F' : dow === 6 ? '#4F7FD9' : 'var(--text-primary)',
                border: isToday && !isBirthday ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              }}>
              {d}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-block rounded" style={{ width: 10, height: 10, background: 'var(--accent)' }} />
          생신
        </span>
        {isCurrentMonth && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block rounded" style={{ width: 10, height: 10, background: 'var(--accent-light)', border: '1.5px solid var(--accent)' }} />
            오늘
          </span>
        )}
      </div>
    </div>
  );
}
