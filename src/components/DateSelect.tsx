'use client';

export interface DateValue {
  year: string;
  month: string;
  day: string;
}

export const EMPTY_DATE: DateValue = { year: '', month: '', day: '' };

/** 셋이 모두 채워졌을 때만 날짜를 준다. 없는 날(2월 31일 등)이면 null. */
export function toDate(v: DateValue): Date | null {
  if (!v.year || !v.month || !v.day) return null;
  const y = Number(v.year);
  const m = Number(v.month);
  const d = Number(v.day);
  const date = new Date(y, m - 1, d);
  // Date는 2월 31일을 3월 3일로 넘겨 버린다. 넘어갔으면 없는 날이다.
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

const SELECT_CLASS = 'w-full rounded-xl px-3 py-3 text-base';

function selectStyle(filled: boolean) {
  return {
    background: 'var(--bg)',
    border: '1.5px solid var(--border)',
    color: filled ? 'var(--text-primary)' : 'var(--text-muted)',
    outline: 'none',
  };
}

/**
 * 년·월·일 고르는 칸 한 벌.
 *
 * 화면마다 똑같은 셀렉트를 다시 만들지 않도록 떼어 뒀다.
 * id를 각자 다르게 줘야 라벨이 제 칸을 가리킨다.
 */
export default function DateSelect({
  idPrefix,
  label,
  years,
  value,
  onChange,
}: {
  idPrefix: string;
  label: string;
  years: number[];
  value: DateValue;
  onChange: (v: DateValue) => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="flex-[1.3]">
        <label htmlFor={`${idPrefix}-year`} className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
        <select
          id={`${idPrefix}-year`}
          value={value.year}
          onChange={e => onChange({ ...value, year: e.target.value })}
          className={SELECT_CLASS}
          style={selectStyle(!!value.year)}
        >
          <option value="">년도</option>
          {years.map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor={`${idPrefix}-month`} className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>
          월
        </label>
        <select
          id={`${idPrefix}-month`}
          value={value.month}
          onChange={e => onChange({ ...value, month: e.target.value })}
          className={SELECT_CLASS}
          style={selectStyle(!!value.month)}
        >
          <option value="">월</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor={`${idPrefix}-day`} className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>
          일
        </label>
        <select
          id={`${idPrefix}-day`}
          value={value.day}
          onChange={e => onChange({ ...value, day: e.target.value })}
          className={SELECT_CLASS}
          style={selectStyle(!!value.day)}
        >
          <option value="">일</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}일</option>
          ))}
        </select>
      </div>
    </div>
  );
}
