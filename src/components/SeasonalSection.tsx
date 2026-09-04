'use client';

import { useEffect, useState } from 'react';
import { getUpcomingSeasonalDays, formatSeasonalDate, getDDayLabel, type SeasonalDay } from '@/lib/seasonalDays';

export default function SeasonalSection() {
  const [days, setDays] = useState<SeasonalDay[]>([]);

  useEffect(() => {
    setDays(getUpcomingSeasonalDays(4));
  }, []);

  if (days.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          다가오는 명절 · 절기
        </h2>
        <div className="space-y-3">
          {days.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{d.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatSeasonalDate(d.date)} · {d.description}</p>
                </div>
              </div>
              <span
                className="text-sm font-bold shrink-0 ml-2"
                style={{ color: getDDayLabel(d.date) === '오늘' ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {getDDayLabel(d.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
