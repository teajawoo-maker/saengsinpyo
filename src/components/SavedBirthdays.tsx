'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSaved, deleteBirthday, toggleStar, type SavedBirthday } from '@/lib/storage';
import { convertLunar, formatDDay, formatDate } from '@/lib/lunarConverter';

const LEAP_LABEL: Record<string, string> = {
  regular: '평달',
  leap: '윤달',
  unknown: '확인필요',
};

interface Props {
  onLoad: (item: SavedBirthday) => void;
  refreshKey: number;
}

export default function SavedBirthdays({ onLoad, refreshKey }: Props) {
  const [items, setItems] = useState<SavedBirthday[]>([]);

  const reload = useCallback(() => {
    try { setItems(getSaved()); } catch { setItems([]); }
  }, []);

  useEffect(() => { reload(); }, [reload, refreshKey]);

  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          저장된 생신 · 생일
        </h2>
        <div className="space-y-3">
          {items.map(item => {
            const result = convertLunar(item.input);
            const nearest = result.nearest;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border-light)' }}
                onClick={() => onLoad(item)}
              >
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); toggleStar(item.id); reload(); }}
                  className="text-lg shrink-0"
                  aria-label={item.starred ? '즐겨찾기 해제' : '즐겨찾기'}
                >
                  {item.starred ? '⭐' : '☆'}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    음력 {item.input.month}월 {item.input.day}일 · {LEAP_LABEL[item.input.leapStatus]}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {nearest ? (
                    <>
                      <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                        {formatDDay(nearest.dDay)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {nearest.month}/{nearest.day}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>계산 불가</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); deleteBirthday(item.id); reload(); }}
                  className="text-lg shrink-0 opacity-40 hover:opacity-80"
                  aria-label="삭제"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
