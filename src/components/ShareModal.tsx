'use client';

import { useRef, useState, useCallback } from 'react';
import type { ConvertResult } from '@/types/lunar';
import { formatDate } from '@/lib/lunarConverter';
import { BASE_URL } from '@/lib/siteConfig';

interface Props {
  result: ConvertResult;
  label: string;
  lunarMonth: string;
  lunarDay: string;
  onClose: () => void;
}

export default function ShareModal({ result, label, lunarMonth, lunarDay, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const thisYear = result.thisYear;
  const nextYear = result.nextYear;
  const nearest = result.nearest;

  const buildImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: '#fff4e6',
      useCORS: true,
      logging: false,
    });
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'));
  }, []);

  const saveImage = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = `생신표_음력${lunarMonth}월${lunarDay}일.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [lunarMonth, lunarDay]);

  /**
   * 이미지를 공유 시트로 넘긴다. 카카오톡·인스타그램 등 기기에 깔린 앱이
   * 거기서 선택된다. 예전에는 instagram:// 을 열고 1.5초 뒤 웹을 또 열었는데,
   * 앱이 있어도 웹이 함께 떠서 어수선했다.
   * 공유 시트를 못 쓰는 환경에서는 이미지를 저장해 준다.
   */
  const shareImage = useCallback(async () => {
    setStatus('loading');
    try {
      const blob = await buildImage();
      if (!blob) { setStatus('idle'); return; }
      const file = new File([blob], `생신표_음력${lunarMonth}월${lunarDay}일.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '우리집 생신표' }).catch(() => {});
        setStatus('idle');
        return;
      }
      saveImage(blob);
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  }, [buildImage, saveImage, lunarMonth, lunarDay]);

  const shareText = useCallback(async () => {
    const lines = [
      `🎂 ${label || `음력 ${lunarMonth}월 ${lunarDay}일`} 생신`,
    ];
    if (thisYear) {
      lines.push(`올해: ${formatDate(thisYear)}`);
      lines.push(`D-DAY: ${nearest === thisYear && !thisYear.isPast ? `D-${thisYear.dDay}` : '지났어요'}`);
    }
    if (nextYear) {
      lines.push(`내년: ${formatDate(nextYear)}`);
    }
    lines.push('');
    lines.push('우리집 생신표에서 확인했어요');
    lines.push(BASE_URL);
    const text = lines.join('\n');

    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert('클립보드에 복사됐어요!');
    }
  }, [label, lunarMonth, lunarDay, thisYear, nextYear, nearest]);


  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6 pb-8"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>공유하기</h3>
          <button type="button" onClick={onClose} className="text-2xl leading-none" style={{ color: 'var(--text-muted)' }}>×</button>
        </div>

        {/* 미리보기 카드 (html2canvas 대상) */}
        <div
          ref={cardRef}
          className="rounded-2xl p-5 mb-5 mx-auto"
          style={{
            background: 'linear-gradient(150deg, #fff9ef 0%, #ffeed9 100%)',
            border: '1px solid #f3e3d1',
            maxWidth: '320px',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '24px' }}>🎂</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#9a806a' }}>우리집 생신표</p>
              {label && <p className="text-sm font-bold" style={{ color: '#2e2119' }}>{label}</p>}
            </div>
          </div>

          <p className="text-xs mb-3" style={{ color: '#9a806a' }}>
            음력 {lunarMonth}월 {lunarDay}일
          </p>

          {thisYear && (
            <div className="mb-3 rounded-xl p-3" style={{ background: '#ffffff', border: '1px solid #f5d9b8' }}>
              <p className="text-xs mb-1" style={{ color: '#9a806a' }}>올해 {thisYear.year}년</p>
              <p className="text-xl font-black" style={{ color: '#2e2119' }}>
                {thisYear.month}월 {thisYear.day}일 {thisYear.dayOfWeek}요일
              </p>
              <p className="text-sm font-bold mt-1" style={{ color: '#c94a0d' }}>
                {thisYear.isPast ? '지났어요' : thisYear.isToday ? 'D-DAY 🎉' : `D-${thisYear.dDay}`}
              </p>
            </div>
          )}

          {nextYear && (
            <div>
              <p className="text-xs mb-1" style={{ color: '#9a806a' }}>내년 {nextYear.year}년</p>
              <p className="text-sm" style={{ color: '#7c6553' }}>
                {nextYear.month}월 {nextYear.day}일 {nextYear.dayOfWeek}요일
              </p>
            </div>
          )}

          <p className="text-xs mt-4" style={{ color: '#b09a84', borderTop: '1px solid #f3e3d1', paddingTop: '8px' }}>
            saengsinpyo.com · KASI 데이터 기반
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={shareImage} disabled={status === 'loading'}
            className="py-3 rounded-xl text-sm font-bold transition-transform active:scale-95"
            style={{ background: 'var(--gold)', color: 'var(--gold-deep)' }}>
            {status === 'loading' ? '만드는 중…' : '📤 이미지 공유'}
          </button>
          <button type="button" onClick={shareText}
            className="py-3 rounded-xl text-sm font-bold transition-transform active:scale-95"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
            📝 글로 공유
          </button>
        </div>

        {status === 'done' && imageUrl && (
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
            이미지가 저장됐어요. 카카오톡이나 인스타그램에서 사진으로 보내보세요.
          </p>
        )}
      </div>
    </div>
  );
}
