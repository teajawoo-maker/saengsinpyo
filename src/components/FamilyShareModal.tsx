'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { formatDDay } from '@/lib/lunarConverter';
import { ageAtBirthday, getMilestone } from '@/lib/age';
import { BASE_URL } from '@/lib/siteConfig';
import type { SavedBirthday } from '@/lib/storage';
import type { SolarResult } from '@/types/lunar';

const WEEKDAY_SUFFIX = '요일';

export interface FamilyRow {
  item: SavedBirthday;
  nearest: SolarResult | null;
}

interface Props {
  rows: FamilyRow[];
  onClose: () => void;
}

/** 생신표 전체를 이미지 한 장으로 만들어 가족 단톡방에 공유한다. */
export default function FamilyShareModal({ rows, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl]);

  const buildImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#1a1714',
      scale: 2,
      logging: false,
    });
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'));
  }, []);

  const saveImage = useCallback(async () => {
    setStatus('loading');
    try {
      const blob = await buildImage();
      if (!blob) { setStatus('idle'); return; }
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      const a = document.createElement('a');
      a.href = url;
      a.download = '우리집-생신표.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  }, [buildImage]);

  const shareImage = useCallback(async () => {
    setStatus('loading');
    try {
      const blob = await buildImage();
      if (!blob) { setStatus('idle'); return; }
      const file = new File([blob], '우리집-생신표.png', { type: 'image/png' });

      // 이미지 자체를 공유할 수 있으면 그렇게 하고, 안 되면 저장으로 넘긴다
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '우리집 생신표' }).catch(() => {});
        setStatus('idle');
        return;
      }
      await saveImage();
    } catch {
      setStatus('idle');
    }
  }, [buildImage, saveImage]);

  const copyText = useCallback(async () => {
    const lines = ['🎂 우리집 생신표', ''];
    for (const { item, nearest } of rows) {
      if (!nearest) continue;
      const age = item.birthYear ? ageAtBirthday(item.birthYear, nearest.year) : null;
      const milestone = age !== null ? getMilestone(age) : null;
      const agePart = age !== null ? ` (만 ${age}세${milestone ? ` · ${milestone.name}` : ''})` : '';
      lines.push(`${item.label} — ${nearest.month}월 ${nearest.day}일 ${formatDDay(nearest.dDay)}${agePart}`);
    }
    lines.push('', BASE_URL);
    const text = lines.join('\n');

    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert('클립보드에 복사됐어요!');
    }
  }, [rows]);

  const visible = rows.filter(r => r.nearest !== null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="w-full max-w-md rounded-t-3xl p-6 pb-8" style={{ background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            생신표 전체 공유
          </h3>
          <button type="button" onClick={onClose} className="text-2xl leading-none"
            aria-label="닫기" style={{ color: 'var(--text-muted)' }}>×</button>
        </div>

        {/* 이미지로 만들 카드 */}
        <div ref={cardRef} className="rounded-2xl p-5 mb-5"
          style={{ background: 'linear-gradient(135deg, #2a1f1c 0%, #1a1714 100%)' }}>
          <p className="text-center text-lg font-black mb-1" style={{ color: '#fff' }}>
            🎂 우리집 생신표
          </p>
          <p className="text-center text-xs mb-4" style={{ color: '#9c8878' }}>
            다가오는 순 · {visible.length}명
          </p>

          <div className="space-y-2.5">
            {visible.map(({ item, nearest }) => {
              const solar = nearest as SolarResult;
              const age = item.birthYear ? ageAtBirthday(item.birthYear, solar.year) : null;
              const milestone = age !== null ? getMilestone(age) : null;
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: milestone ? 'rgba(232,128,43,0.22)' : 'rgba(255,255,255,0.05)' }}>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold" style={{ color: '#fff' }}>{item.label}</span>
                      {age !== null && (
                        <span className="text-xs" style={{ color: '#9c8878' }}>만 {age}세</span>
                      )}
                      {milestone && (
                        <span className="text-xs font-bold" style={{ color: '#FFC93C' }}>
                          {milestone.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#9c8878' }}>
                      음력 {item.input.leapStatus === 'leap' ? '윤' : ''}{item.input.month}월 {item.input.day}일
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black" style={{ color: '#FFC93C' }}>
                      {formatDDay(solar.dDay)}
                    </p>
                    <p className="text-xs" style={{ color: '#9c8878' }}>
                      {solar.month}/{solar.day} {solar.dayOfWeek}{WEEKDAY_SUFFIX}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs mt-4" style={{ color: '#6b5b4d' }}>
            saengsinpyo.com · KASI 데이터 기반
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={shareImage} disabled={status === 'loading'}
            className="py-3 rounded-xl text-sm font-bold"
            style={{ background: '#FFC93C', color: '#4A3200' }}>
            {status === 'loading' ? '만드는 중…' : '📤 이미지 공유'}
          </button>
          <button type="button" onClick={copyText}
            className="py-3 rounded-xl text-sm font-bold"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
            📝 글로 공유
          </button>
        </div>

        {status === 'done' && (
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
            이미지가 저장됐어요. 카카오톡에서 사진으로 보내보세요.
          </p>
        )}
      </div>
    </div>
  );
}
