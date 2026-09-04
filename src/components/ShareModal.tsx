'use client';

import { useRef, useState, useCallback } from 'react';
import type { ConvertResult } from '@/types/lunar';
import { formatDate } from '@/lib/lunarConverter';

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

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setStatus('loading');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#1a1714',
        useCORS: true,
        logging: false,
      });
      setImageUrl(canvas.toDataURL('image/png'));
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  }, []);

  const downloadImage = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `생신표_음력${lunarMonth}월${lunarDay}일.png`;
    a.click();
  }, [imageUrl, lunarMonth, lunarDay]);

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
    lines.push('https://saengsinpyo.com');
    const text = lines.join('\n');

    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert('클립보드에 복사됐어요!');
    }
  }, [label, lunarMonth, lunarDay, thisYear, nextYear, nearest]);

  const shareToInstagram = useCallback(async () => {
    // 인스타그램은 직접 공유 API 없음 → 이미지 저장 후 인스타 DM으로 이동
    if (imageUrl) {
      downloadImage();
    }
    setTimeout(() => {
      window.open('instagram://camera', '_blank');
      // 앱이 없으면 스토어로
      setTimeout(() => {
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
      }, 1500);
    }, 300);
  }, [imageUrl, downloadImage]);

  const shareToKakao = useCallback(async () => {
    const text = `🎂 ${label || `음력 ${lunarMonth}월 ${lunarDay}일 생신`}\n올해: ${thisYear ? formatDate(thisYear) : '확인 불가'}\n\n우리집 생신표 → https://saengsinpyo.com`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert('클립보드에 복사됐어요!\n카카오톡에 붙여넣기 하세요.');
    }
  }, [label, lunarMonth, lunarDay, thisYear]);

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
            background: 'linear-gradient(135deg, #2a1f1c 0%, #1a1714 100%)',
            border: '1px solid #3a2f2a',
            maxWidth: '320px',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '24px' }}>🎂</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#a89e95' }}>우리집 생신표</p>
              {label && <p className="text-sm font-bold" style={{ color: '#f0ebe5' }}>{label}</p>}
            </div>
          </div>

          <p className="text-xs mb-3" style={{ color: '#6b6258' }}>
            음력 {lunarMonth}월 {lunarDay}일
          </p>

          {thisYear && (
            <div className="mb-3 rounded-xl p-3" style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)' }}>
              <p className="text-xs mb-1" style={{ color: '#a89e95' }}>올해 {thisYear.year}년</p>
              <p className="text-xl font-black" style={{ color: '#f0ebe5' }}>
                {thisYear.month}월 {thisYear.day}일 {thisYear.dayOfWeek}요일
              </p>
              <p className="text-sm font-bold mt-1" style={{ color: '#e05a4e' }}>
                {thisYear.isPast ? '지났어요' : thisYear.isToday ? 'D-DAY 🎉' : `D-${thisYear.dDay}`}
              </p>
            </div>
          )}

          {nextYear && (
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b6258' }}>내년 {nextYear.year}년</p>
              <p className="text-sm" style={{ color: '#a89e95' }}>
                {nextYear.month}월 {nextYear.day}일 {nextYear.dayOfWeek}요일
              </p>
            </div>
          )}

          <p className="text-xs mt-4" style={{ color: '#3a2f2a', borderTop: '1px solid #2a2520', paddingTop: '8px' }}>
            saengsinpyo.com · KASI 데이터 기반
          </p>
        </div>

        {/* 이미지 생성 버튼 */}
        {status === 'idle' && (
          <button
            type="button"
            onClick={generateImage}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            이미지 카드 생성하기
          </button>
        )}
        {status === 'loading' && (
          <div className="w-full py-3 rounded-xl text-sm text-center mb-3" style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}>
            이미지 생성 중...
          </div>
        )}
        {status === 'done' && imageUrl && (
          <button
            type="button"
            onClick={downloadImage}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            📷 이미지 저장하기
          </button>
        )}

        {/* 공유 버튼 목록 */}
        <div className="grid grid-cols-3 gap-3">
          <ShareButton emoji="💬" label="카카오톡" onClick={shareToKakao} color="#FAE100" textColor="#3C1E1E" />
          <ShareButton emoji="📸" label="인스타그램 DM" onClick={shareToInstagram} color="#E1306C" textColor="#fff" />
          <ShareButton emoji="📋" label="텍스트 복사" onClick={shareText} color="var(--bg)" textColor="var(--text-secondary)" />
        </div>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          인스타그램은 이미지 저장 후 DM에서 직접 첨부해 주세요.
        </p>
      </div>
    </div>
  );
}

function ShareButton({ emoji, label, onClick, color, textColor }: {
  emoji: string; label: string; onClick: () => void; color: string; textColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all"
      style={{ background: color, color: textColor, border: '1px solid var(--border)' }}
    >
      <span className="text-xl">{emoji}</span>
      <span className="leading-tight text-center">{label}</span>
    </button>
  );
}
