'use client';

import { useMemo, useState } from 'react';
import DateSelect, { EMPTY_DATE, toDate, type DateValue } from '@/components/DateSelect';
import DayCountResult from '@/components/DayCountResult';
import { getBabyMilestones } from '@/lib/dayCount';
import { solarToLunar } from '@/lib/lunarConverter';

/** 아기 생일이라 올해부터 몇 해 전까지면 넉넉하다. */
function buildYears(): number[] {
  const now = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => now - i);
}

export default function BaegilCalculator() {
  const YEARS = useMemo(() => buildYears(), []);
  const [form, setForm] = useState<DateValue>(EMPTY_DATE);
  const [submitted, setSubmitted] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const date = toDate(form);
    if (!date) {
      setError(form.year && form.month && form.day ? '없는 날짜예요. 다시 확인해 주세요.' : '태어난 날을 모두 골라 주세요.');
      setSubmitted(null);
      return;
    }
    setError('');
    setSubmitted(date);
  };

  const milestones = submitted ? getBabyMilestones(submitted) : null;
  const lunar = submitted
    ? solarToLunar({ year: submitted.getFullYear(), month: submitted.getMonth() + 1, day: submitted.getDate() })
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <DateSelect
          idPrefix="baby"
          label="아기가 태어난 날"
          years={YEARS}
          value={form}
          onChange={v => setForm(v)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full mt-4 py-4 rounded-2xl text-base font-bold transition-transform active:scale-[0.98]"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          백일·돌 찾기
        </button>
        {error && (
          <p role="alert" className="text-sm mt-3 text-center" style={{ color: 'var(--accent-strong)' }}>
            {error}
          </p>
        )}
      </div>

      {milestones && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            결과
          </h2>
          <DayCountResult days={milestones} highlight="백일" />
          {lunar && !lunar.error && (
            <p className="text-sm mt-4 pt-4" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)' }}>
              이 아기의 음력 생일은 <strong>음력 {lunar.lunarMonth}월 {lunar.lunarDay}일</strong>
              {lunar.isLeapMonth && ' (윤달)'}입니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
