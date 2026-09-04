'use client';

import type { LunarInput } from '@/types/lunar';

export interface SavedBirthday {
  id: string;
  label: string;       // 호칭 (예: 어머니, 할머니)
  input: LunarInput;
  /**
   * 양력 생년. 나이와 환갑·칠순 같은 기념 생신을 계산하는 데 쓴다.
   * 연도 없이 음력 월/일만 입력한 경우도 있어 선택 항목이다.
   */
  birthYear?: number;
  savedAt: number;
  starred: boolean;
}

const KEY = 'saengsinpyo_saved';

function loadAll(): SavedBirthday[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedBirthday[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: SavedBirthday[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { /* 저장공간 부족 등 */ }
}

/**
 * 저장된 항목을 최근 저장 순으로 돌려준다.
 * 화면에 보여줄 때는 다가오는 생신 순으로 다시 정렬한다.
 * 남은 날짜는 음력 변환을 해야 알 수 있어 여기서는 계산하지 않는다.
 */
export function getSaved(): SavedBirthday[] {
  return loadAll().sort((a, b) => b.savedAt - a.savedAt);
}

export function saveBirthday(
  label: string,
  input: LunarInput,
  birthYear?: number
): SavedBirthday {
  const items = loadAll();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item: SavedBirthday = { id, label, input, birthYear, savedAt: Date.now(), starred: false };
  saveAll([...items, item]);
  return item;
}

export function deleteBirthday(id: string): void {
  saveAll(loadAll().filter(i => i.id !== id));
}

export function toggleStar(id: string): void {
  saveAll(loadAll().map(i => i.id === id ? { ...i, starred: !i.starred } : i));
}

export function updateLabel(id: string, label: string): void {
  saveAll(loadAll().map(i => i.id === id ? { ...i, label } : i));
}
