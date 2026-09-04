'use client';

import type { LunarInput } from '@/types/lunar';

export interface SavedBirthday {
  id: string;
  label: string;       // 호칭 (예: 어머니, 할머니)
  input: LunarInput;
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

export function getSaved(): SavedBirthday[] {
  return loadAll().sort((a, b) => {
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    return b.savedAt - a.savedAt;
  });
}

export function saveBirthday(label: string, input: LunarInput): SavedBirthday {
  const items = loadAll();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item: SavedBirthday = { id, label, input, savedAt: Date.now(), starred: false };
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
