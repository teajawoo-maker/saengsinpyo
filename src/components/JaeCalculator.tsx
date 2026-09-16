'use client';

import { useMemo, useState } from 'react';
import DateSelect, { EMPTY_DATE, toDate, type DateValue } from '@/components/DateSelect';
import DayCountResult from '@/components/DayCountResult';
import { getMemorialDays, getSamuje, formatCounted } from '@/lib/dayCount';
import { solarToLunar } from '@/lib/lunarConverter';

function buildYears(): number[] {
  const now = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => now - i);
}

/** 3일장이면 돌아가신 날이 첫날, 사흘째가 발인이다. */
function defaultFuneral(death: Date): Date {
  const d = new Date(death);
  d.setDate(d.getDate() + 2);
  return d;
}

export default function JaeCalculator() {
  const YEARS = useMemo(() => buildYears(), []);
  const [form, setForm] = useState<DateValue>(EMPTY_DATE);
  const [funeralForm, setFuneralForm] = useState<DateValue>(EMPTY_DATE);
  const [useCustomFuneral, setUseCustomFuneral] = useState(false);
  const [submitted, setSubmitted] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const date = toDate(form);
    if (!date) {
      setError(form.year && form.month && form.day ? '없는 날짜예요. 다시 확인해 주세요.' : '돌아가신 날을 모두 골라 주세요.');
      setSubmitted(null);
      return;
    }
    if (useCustomFuneral && !toDate(funeralForm)) {
      setError('장례를 치른 날을 모두 골라 주세요.');
      setSubmitted(null);
      return;
    }
    setError('');
    setSubmitted(date);
  };

  const jaeDays = submitted ? getMemorialDays(submitted) : null;
  const funeralDate = submitted
    ? (useCustomFuneral ? toDate(funeralForm) : defaultFuneral(submitted))
    : null;
  const samuje = funeralDate ? getSamuje(funeralDate) : null;
  const lunar = submitted
    ? solarToLunar({ year: submitted.getFullYear(), month: submitted.getMonth() + 1, day: submitted.getDate() })
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <DateSelect
          idPrefix="death"
          label="돌아가신 날"
          years={YEARS}
          value={form}
          onChange={v => setForm(v)}
        />

        <label className="flex items-start gap-2 mt-4 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={useCustomFuneral}
            onChange={e => setUseCustomFuneral(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            장례를 3일장이 아닌 날로 치렀어요
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              삼우제는 장례를 치른 날이 기준이라, 3일장이 아니면 직접 골라야 정확합니다.
            </span>
          </span>
        </label>

        {useCustomFuneral && (
          <div className="mt-3">
            <DateSelect
              idPrefix="funeral"
              label="장례를 치른 날"
              years={YEARS}
              value={funeralForm}
              onChange={v => setFuneralForm(v)}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full mt-4 py-4 rounded-2xl text-base font-bold transition-transform active:scale-[0.98]"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          49재 날짜 찾기
        </button>
        {error && (
          <p role="alert" className="text-sm mt-3 text-center" style={{ color: 'var(--accent-strong)' }}>
            {error}
          </p>
        )}
      </div>

      {samuje && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            삼우제
          </h2>
          <DayCountResult days={[samuje]} highlight="삼우제" />
          {!useCustomFuneral && funeralDate && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              ※ 3일장으로 보고 장례일을 {formatCounted(funeralDate)}로 계산했습니다.
            </p>
          )}
        </div>
      )}

      {jaeDays && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            재 지내는 날
          </h2>
          <DayCountResult days={jaeDays} highlight="49재" />
          {lunar && !lunar.error && (
            <p className="text-sm mt-4 pt-4" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)' }}>
              돌아가신 날의 음력은 <strong>음력 {lunar.lunarMonth}월 {lunar.lunarDay}일</strong>
              {lunar.isLeapMonth && ' (윤달)'}입니다. 해마다 지내는 제사는 이 음력 날짜를 씁니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
