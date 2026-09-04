'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getSaved, deleteBirthday, toggleStar, type SavedBirthday } from '@/lib/storage';
import { convertLunar, formatDDay } from '@/lib/lunarConverter';
import { ageAtBirthday, getMilestone } from '@/lib/age';
import { downloadIcs } from '@/lib/ics';
import type { SolarResult } from '@/types/lunar';

const FamilyShareModal = dynamic(() => import('./FamilyShareModal'), { ssr: false });

const LEAP_LABEL: Record<string, string> = {
  regular: '평달',
  leap: '윤달',
  unknown: '확인필요',
};

interface Row {
  item: SavedBirthday;
  nearest: SolarResult | null;
}

interface Props {
  onLoad: (item: SavedBirthday) => void;
  refreshKey: number;
}

export default function SavedBirthdays({ onLoad, refreshKey }: Props) {
  const [items, setItems] = useState<SavedBirthday[]>([]);
  const [showShare, setShowShare] = useState(false);

  const reload = useCallback(() => {
    try { setItems(getSaved()); } catch { setItems([]); }
  }, []);

  useEffect(() => { reload(); }, [reload, refreshKey]);

  // 생신표의 핵심은 "누가 제일 먼저인가"다. 다가오는 순으로 정렬한다.
  // 날짜를 계산할 수 없는 항목은 맨 뒤로 보낸다.
  const rows = useMemo<Row[]>(() => {
    return items
      .map(item => ({ item, nearest: convertLunar(item.input).nearest }))
      .sort((a, b) => {
        if (!a.nearest) return 1;
        if (!b.nearest) return -1;
        return a.nearest.dDay - b.nearest.dDay;
      });
  }, [items]);

  if (rows.length === 0) return null;

  return (
    <>
    <div className="w-full max-w-md mx-auto px-4 mb-4">
      <div className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            우리집 생신표
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            다가오는 순 · {rows.length}명
          </span>
        </div>

        <div className="space-y-3">
          {rows.map(({ item, nearest }) => {
            const age = item.birthYear && nearest
              ? ageAtBirthday(item.birthYear, nearest.year)
              : null;
            const milestone = age !== null ? getMilestone(age) : null;
            const isSoon = nearest !== null && nearest.dDay >= 0 && nearest.dDay <= 30;

            return (
              <div key={item.id}
                className="rounded-xl p-3 cursor-pointer transition-all"
                style={{
                  background: milestone ? 'var(--accent-light)' : 'var(--bg)',
                  border: `1px solid ${milestone ? 'var(--accent)' : 'var(--border-light)'}`,
                }}
                onClick={() => onLoad(item)}>

                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={e => { e.stopPropagation(); toggleStar(item.id); reload(); }}
                    className="text-lg shrink-0"
                    aria-label={item.starred ? '즐겨찾기 해제' : '즐겨찾기'}>
                    {item.starred ? '⭐' : '☆'}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.label}
                      </p>
                      {age !== null && (
                        <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                          만 {age}세
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      음력 {item.input.month}월 {item.input.day}일 · {LEAP_LABEL[item.input.leapStatus]}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {nearest ? (
                      <>
                        <p className="text-sm font-bold"
                          style={{ color: isSoon ? 'var(--accent)' : 'var(--text-secondary)' }}>
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

                  <button type="button"
                    onClick={e => { e.stopPropagation(); deleteBirthday(item.id); reload(); }}
                    className="text-lg shrink-0 opacity-40 hover:opacity-80"
                    aria-label={`${item.label} 삭제`}>
                    ×
                  </button>
                </div>

                {milestone && (
                  <div className="mt-2.5 pt-2.5 flex items-center gap-2"
                    style={{ borderTop: '1px solid var(--border-light)' }}>
                    <span className="text-xs px-2 py-1 rounded-lg font-bold shrink-0"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      🎉 {milestone.name}
                    </span>
                    <span className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {nearest?.year}년 생신이 {milestone.name}이에요
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 가족 단톡방에 뿌리거나 휴대폰 캘린더에 넣기 */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => setShowShare(true)}
            className="py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95"
            style={{ background: '#FFC93C', color: '#4A3200' }}>
            📤 전체 공유
          </button>
          <button type="button" onClick={() => downloadIcs(items)}
            className="py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-95"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
            📅 캘린더 저장
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
          캘린더 저장은 앞으로 10년치 생신을 한 번에 넣어요
        </p>
      </div>
    </div>

    {showShare && (
      <FamilyShareModal rows={rows} onClose={() => setShowShare(false)} />
    )}
    </>
  );
}
