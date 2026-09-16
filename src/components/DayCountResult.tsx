import type { CountedDay } from '@/lib/dayCount';
import { formatCounted, formatDDay } from '@/lib/dayCount';

/**
 * 센 날들을 줄줄이 보여 준다.
 * 백일이든 49재든 보여 주는 모양은 같아서 한 군데로 모았다.
 */
export default function DayCountResult({
  days,
  highlight,
}: {
  days: CountedDay[];
  highlight?: string;
}) {
  return (
    <ul className="space-y-2">
      {days.map(day => {
        const isMain = day.name === highlight;
        const past = day.dDay < 0;
        return (
          <li
            key={day.name}
            className="rounded-2xl px-4 py-3"
            style={{
              background: isMain ? 'var(--accent-light)' : 'var(--bg-card)',
              border: `1px solid ${isMain ? 'var(--border)' : 'var(--border-light)'}`,
              opacity: past && !isMain ? 0.72 : 1,
            }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={isMain ? 'text-base font-black' : 'text-sm font-bold'}
                style={{ color: isMain ? 'var(--accent-strong)' : 'var(--text-primary)' }}
              >
                {day.name}
                {day.nth > 0 && (
                  <span className="text-xs font-normal ml-1.5" style={{ color: 'var(--text-muted)' }}>
                    {day.nth}일째
                  </span>
                )}
              </span>
              <span
                className="text-xs font-bold shrink-0"
                style={{ color: past ? 'var(--text-muted)' : 'var(--accent)' }}
              >
                {formatDDay(day.dDay)}
              </span>
            </div>
            <p className={isMain ? 'text-base font-bold mt-0.5' : 'text-sm mt-0.5'} style={{ color: 'var(--text-secondary)' }}>
              {formatCounted(day.date)}
            </p>
            {day.note && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                ※ {day.note}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
