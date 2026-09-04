'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { convertLunar, solarToLunar, formatDDay } from '@/lib/lunarConverter';
import { ageAtBirthday, getMilestone } from '@/lib/age';
import { saveBirthday } from '@/lib/storage';
import type { LunarInput, ConvertResult, LeapStatus, ShortMonthFallback, LeapFallback, SolarResult, InputMode } from '@/types/lunar';
import type { SavedBirthday } from '@/lib/storage';

import MiniCalendar from './MiniCalendar';

const ShareModal = dynamic(() => import('./ShareModal'), { ssr: false });

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const SOLAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const CURRENT_YEAR = new Date().getFullYear();
// 최근 연도부터 보이도록 내림차순 (1900~올해)
const YEARS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i);

interface FormState {
  month: string;
  day: string;
  /** 태어난 해(선택). 넣으면 나이와 환갑·칠순을 함께 보여준다. */
  year: string;
  leapStatus: LeapStatus;
  shortMonthFallback: ShortMonthFallback;
  leapFallback: LeapFallback;
}

interface SolarFormState {
  year: string;
  month: string;
  day: string;
}

interface Props {
  onSaved?: () => void;
  initialItem?: SavedBirthday | null;
}

export default function LunarCalculator({ onSaved, initialItem }: Props) {
  const [form, setForm] = useState<FormState>({
    month: initialItem ? String(initialItem.input.month) : '',
    day: initialItem ? String(initialItem.input.day) : '',
    year: initialItem?.birthYear ? String(initialItem.birthYear) : '',
    leapStatus: initialItem?.input.leapStatus ?? 'regular',
    shortMonthFallback: initialItem?.input.shortMonthFallback ?? 'last',
    leapFallback: initialItem?.input.leapFallback ?? 'regular',
  });
  // 기본은 양력 입력. 주민등록상 양력 생일만 아는 사람이 대부분이라
  // 그쪽을 첫 화면으로 두고, 음력을 아는 경우를 보조 탭으로 둔다.
  // 저장된 항목을 불러온 경우엔 음력 입력이므로 음력 탭으로 시작한다.
  const [mode, setMode] = useState<InputMode>(initialItem ? 'lunar' : 'solar');
  const [solarForm, setSolarForm] = useState<SolarFormState>({ year: '', month: '', day: '' });
  const [solarError, setSolarError] = useState('');
  // 나이와 환갑·칠순 계산에 필요한 양력 생년. 양력으로 입력했거나
  // 생년이 저장된 항목을 불러온 경우에만 값이 있다.
  const [birthYear, setBirthYear] = useState<number | undefined>(initialItem?.birthYear);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveLabel, setSaveLabel] = useState(initialItem?.label ?? '');
  const [savedMsg, setSavedMsg] = useState('');

  const showLeapOptions = form.leapStatus === 'leap';
  const showShortMonthOptions = form.day === '30';

  const handleCalculate = useCallback(() => {
    const month = parseInt(form.month);
    const day = parseInt(form.day);
    if (!month || !day) return;
    const input: LunarInput = {
      month, day,
      leapStatus: form.leapStatus,
      shortMonthFallback: form.shortMonthFallback,
      leapFallback: form.leapFallback,
    };
    // 태어난 해는 선택 항목이다. 넣었으면 나이 계산에 쓴다.
    setBirthYear(form.year ? parseInt(form.year) : undefined);
    setResult(convertLunar(input));
  }, [form]);

  // 양력 생년월일 → 음력 생일을 찾고, 그 음력 생일의 올해/내년 양력 날짜까지 이어서 계산
  const handleSolarConvert = useCallback(() => {
    const year = parseInt(solarForm.year);
    const month = parseInt(solarForm.month);
    const day = parseInt(solarForm.day);
    if (!year || !month || !day) return;

    const lunar = solarToLunar({ year, month, day });
    if (lunar.error) {
      setSolarError(lunar.error);
      setResult(null);
      return;
    }
    setSolarError('');
    setBirthYear(year);

    const leapStatus: LeapStatus = lunar.isLeapMonth ? 'leap' : 'regular';
    setForm({
      month: String(lunar.lunarMonth),
      day: String(lunar.lunarDay),
      year: String(year),
      leapStatus,
      shortMonthFallback: 'last',
      leapFallback: 'regular',
    });
    setResult(
      convertLunar({
        month: lunar.lunarMonth,
        day: lunar.lunarDay,
        leapStatus,
        shortMonthFallback: 'last',
        leapFallback: 'regular',
      })
    );
  }, [solarForm]);

  const handleSave = useCallback(() => {
    const month = parseInt(form.month);
    const day = parseInt(form.day);
    if (!month || !day) return;
    const label = saveLabel.trim() || `음력 ${form.month}월 ${form.day}일`;
    const input: LunarInput = {
      month, day,
      leapStatus: form.leapStatus,
      shortMonthFallback: form.shortMonthFallback,
      leapFallback: form.leapFallback,
    };
    saveBirthday(label, input, birthYear);
    setSavedMsg(`'${label}' 저장됐어요!`);
    setShowSaveInput(false);
    setTimeout(() => setSavedMsg(''), 3000);
    onSaved?.();
  }, [form, saveLabel, birthYear, onSaved]);

  // 불러온 항목은 바로 결과까지 보여준다. 상태 초기값을 initialItem에서
  // 잡으므로, 다른 항목을 누르면 page에서 key를 바꿔 새로 마운트시킨다.
  useEffect(() => {
    if (initialItem) setResult(convertLunar(initialItem.input));
  }, [initialItem]);

  return (
    <>
      <div className="w-full max-w-md mx-auto px-4 pb-4">
        {/* 입력 카드 */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>

          {/* 입력 방식 전환 */}
          <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
            {([
              { value: 'solar', label: '양력만 알아요' },
              { value: 'lunar', label: '음력을 알아요' },
            ] as { value: InputMode; label: string }[]).map(opt => (
              <button key={opt.value} type="button"
                onClick={() => { setMode(opt.value); setResult(null); setSolarError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: mode === opt.value ? 'var(--bg-card)' : 'transparent',
                  color: mode === opt.value ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow: mode === opt.value ? 'var(--shadow)' : 'none',
                }}>
                {opt.label}
              </button>
            ))}
          </div>

          {mode === 'solar' ? (
            <>
              <h2 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                양력 생년월일 입력
              </h2>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                주민등록상 양력 생일을 넣으면 음력 생신이 며칠인지 찾아드려요.
              </p>

              <div className="flex gap-2 mb-4">
                <div style={{ flex: '1.3' }}>
                  <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>태어난 해</label>
                  <select value={solarForm.year} onChange={e => setSolarForm(f => ({ ...f, year: e.target.value }))}
                    className="w-full rounded-xl px-3 py-3 text-base"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: solarForm.year ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
                    <option value="">년도</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>월</label>
                  <select value={solarForm.month} onChange={e => setSolarForm(f => ({ ...f, month: e.target.value }))}
                    className="w-full rounded-xl px-3 py-3 text-base"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: solarForm.month ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
                    <option value="">월</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>일</label>
                  <select value={solarForm.day} onChange={e => setSolarForm(f => ({ ...f, day: e.target.value }))}
                    className="w-full rounded-xl px-3 py-3 text-base"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: solarForm.day ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
                    <option value="">일</option>
                    {SOLAR_DAYS.map(d => <option key={d} value={d}>{d}일</option>)}
                  </select>
                </div>
              </div>

              {solarError && (
                <p className="text-sm mb-3 text-center" style={{ color: 'var(--accent)' }}>{solarError}</p>
              )}

              {result && !result.error && form.month && (
                <div className="mb-4 rounded-xl p-4 text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>찾은 음력 생신</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    음력 {form.leapStatus === 'leap' ? '윤' : ''}{form.month}월 {form.day}일
                  </p>
                </div>
              )}

              <button type="button" onClick={handleSolarConvert}
                disabled={!solarForm.year || !solarForm.month || !solarForm.day}
                className="w-full py-4 rounded-xl text-base font-bold transition-all"
                style={{
                  background: solarForm.year && solarForm.month && solarForm.day ? 'var(--accent)' : 'var(--border)',
                  color: solarForm.year && solarForm.month && solarForm.day ? '#fff' : 'var(--text-muted)',
                  cursor: solarForm.year && solarForm.month && solarForm.day ? 'pointer' : 'not-allowed',
                }}>
                음력 생신 찾기
              </button>
            </>
          ) : (
            <>
          <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-secondary)' }}>
            음력 생일 입력
          </h2>

          {/* 월/일 */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>음력 월</label>
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-base"
                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: form.month ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
                <option value="">월 선택</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>음력 일</label>
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-base"
                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: form.day ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
                <option value="">일 선택</option>
                {DAYS.map(d => <option key={d} value={d}>{d}일</option>)}
              </select>
            </div>
          </div>

          {/* 태어난 해 — 선택. 있으면 나이와 환갑·칠순을 알려줄 수 있다 */}
          <div className="mb-4">
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>
              태어난 해 <span style={{ opacity: 0.7 }}>(선택 — 넣으면 나이·환갑을 알려드려요)</span>
            </label>
            <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-base"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: form.year ? 'var(--text-primary)' : 'var(--text-muted)', outline: 'none' }}>
              <option value="">모르거나 건너뛰기</option>
              {YEARS.map(y => <option key={y} value={y}>{y}년생</option>)}
            </select>
          </div>

          {/* 평달/윤달 */}
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>평달 / 윤달</label>
            <div className="flex gap-2">
              {([
                { value: 'regular', label: '평달' },
                { value: 'leap', label: '윤달' },
                { value: 'unknown', label: '잘 모르겠어요' },
              ] as { value: LeapStatus; label: string }[]).map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, leapStatus: opt.value }))}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: form.leapStatus === opt.value ? 'var(--accent)' : 'var(--bg)',
                    color: form.leapStatus === opt.value ? '#fff' : 'var(--text-secondary)',
                    border: `1.5px solid ${form.leapStatus === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {form.leapStatus === 'unknown' && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                평달 기준으로 임시 계산해요. 가족에게 확인 후 수정하시면 더 정확해요.
              </p>
            )}
          </div>

          {/* 윤달 옵션 */}
          {showLeapOptions && (
            <div className="mb-4 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>윤달이 없는 해에는?</p>
              <div className="flex gap-2">
                {([
                  { value: 'regular', label: '평달 날짜로' },
                  { value: 'skip', label: '건너뛰기' },
                ] as { value: LeapFallback; label: string }[]).map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm(f => ({ ...f, leapFallback: opt.value }))}
                    className="flex-1 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: form.leapFallback === opt.value ? 'var(--accent)' : 'transparent',
                      color: form.leapFallback === opt.value ? '#fff' : 'var(--text-secondary)',
                      border: `1.5px solid ${form.leapFallback === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 30일 옵션 */}
          {showShortMonthOptions && (
            <div className="mb-4 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>음력 30일이 없는 해에는?</p>
              <div className="flex gap-2">
                {([
                  { value: 'last', label: '29일로' },
                  { value: 'next', label: '다음달 1일로' },
                  { value: 'skip', label: '건너뛰기' },
                ] as { value: ShortMonthFallback; label: string }[]).map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm(f => ({ ...f, shortMonthFallback: opt.value }))}
                    className="flex-1 py-2 rounded-lg text-xs font-medium"
                    style={{
                      background: form.shortMonthFallback === opt.value ? 'var(--accent)' : 'transparent',
                      color: form.shortMonthFallback === opt.value ? '#fff' : 'var(--text-secondary)',
                      border: `1.5px solid ${form.shortMonthFallback === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 계산 버튼 */}
          <button type="button" onClick={handleCalculate} disabled={!form.month || !form.day}
            className="w-full py-4 rounded-xl text-base font-bold transition-all"
            style={{
              background: form.month && form.day ? 'var(--accent)' : 'var(--border)',
              color: form.month && form.day ? '#fff' : 'var(--text-muted)',
              cursor: form.month && form.day ? 'pointer' : 'not-allowed',
            }}>
            양력으로 변환하기
          </button>
            </>
          )}
        </div>

        {/* 결과 카드 */}
        {result && (
          <div className="rounded-2xl p-6 mb-4"
            style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
            {result.error ? (
              <p className="text-center text-sm" style={{ color: 'var(--accent)' }}>{result.error}</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    음력 {form.leapStatus === 'leap' ? '윤' : ''}{form.month}월 {form.day}일 결과
                  </h2>
                  <button type="button" onClick={() => setShowShare(true)}
                    aria-label="결과 공유하기"
                    className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-xl font-bold transition-transform active:scale-95"
                    style={{ background: '#FFC93C', color: '#4A3200', boxShadow: '0 2px 8px rgba(255, 201, 60, 0.5)' }}>
                    <span aria-hidden="true" style={{ fontSize: '15px' }}>📤</span>
                    공유하기
                  </button>
                </div>

                <ResultBlock label="올해" result={result.thisYear} isNearest={result.nearest === result.thisYear && !result.thisYear?.isPast} />
                <div className="my-3 h-px" style={{ background: 'var(--border-light)' }} />
                <ResultBlock label="내년" result={result.nextYear} isNearest={result.nearest === result.nextYear} />

                {/* 다가오는 생신의 나이와 환갑·칠순 안내 */}
                {birthYear && result.nearest && (() => {
                  const age = ageAtBirthday(birthYear, result.nearest.year);
                  const milestone = getMilestone(age);
                  return (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {result.nearest.year}년 생신에
                        </span>
                        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          만 {age}세
                        </span>
                      </div>
                      {milestone && (
                        <div className="mt-3 rounded-xl p-3 text-center"
                          style={{ background: 'var(--accent)', color: '#fff' }}>
                          <p className="text-base font-bold">🎉 {milestone.name} 생신이에요</p>
                          <p className="text-xs mt-1 opacity-90">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 다가오는 생신이 있는 달의 달력 */}
                {result.nearest && <MiniCalendar target={result.nearest} />}

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    한국천문연구원(KASI) 데이터 기반 계산 · 1900~2100년 지원
                  </p>
                </div>

                {/* 저장 영역 */}
                <div className="mt-3">
                  {savedMsg ? (
                    <p className="text-sm text-center font-medium py-2" style={{ color: 'var(--accent)' }}>{savedMsg}</p>
                  ) : showSaveInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="호칭 입력 (예: 어머니, 할머니)"
                        value={saveLabel}
                        onChange={e => setSaveLabel(e.target.value)}
                        maxLength={15}
                        className="flex-1 rounded-xl px-4 py-2 text-sm"
                        style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                      />
                      <button type="button" onClick={handleSave}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--accent)', color: '#fff' }}>
                        저장
                      </button>
                      <button type="button" onClick={() => setShowSaveInput(false)}
                        className="px-3 py-2 rounded-xl text-sm"
                        style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowSaveInput(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
                      ⭐ 즐겨찾기에 저장하기
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* 공유 모달 */}
      {showShare && result && (
        <ShareModal
          result={result}
          label={saveLabel}
          lunarMonth={form.month}
          lunarDay={form.day}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}

function ResultBlock({ label, result, isNearest }: { label: string; result: SolarResult | null; isNearest: boolean }) {
  if (!result) {
    return (
      <div className="py-2">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>해당 연도에 날짜가 없어요.</p>
      </div>
    );
  }
  return (
    <div className={`py-2 ${isNearest ? 'rounded-xl px-3 -mx-3' : ''}`}
      style={isNearest ? { background: 'var(--accent-light)' } : {}}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            {result.isToday && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>오늘!</span>
            )}
            {result.isPast && !result.isToday && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>지났어요</span>
            )}
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {result.month}월 {result.day}일 {result.dayOfWeek}요일
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{result.year}년</p>
          {result.note && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--accent)' }}>※ {result.note}</p>
          )}
        </div>
        <div className="text-right ml-4 shrink-0">
          <p className="text-2xl font-black" style={{ color: isNearest ? 'var(--accent)' : 'var(--text-muted)' }}>
            {formatDDay(result.dDay)}
          </p>
        </div>
      </div>
    </div>
  );
}
