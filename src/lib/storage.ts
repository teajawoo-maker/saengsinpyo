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
  /**
   * 태어난 해의 음력 연도. 간지·띠를 구하는 데 쓴다.
   * 간지는 음력 설날에 바뀌어서 양력 생년으로 계산하면
   * 1~2월 초 출생자가 한 해 어긋난다.
   */
  birthLunarYear?: number;
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

/* ────────────────────────────────────────────────────────────
   화면과 저장소 잇기

   localStorage는 React 바깥의 저장소다. useEffect로 읽어 setState하면
   불필요한 재렌더가 한 번 더 생기고, 바뀔 때마다 부모가 신호를
   내려보내야 한다. 구독 방식으로 바꿔 useSyncExternalStore로 읽는다.
   ──────────────────────────────────────────────────────────── */

type Listener = () => void;
let listeners: Listener[] = [];

export function subscribe(listener: Listener): () => void {
  listeners = [...listeners, listener];
  return () => { listeners = listeners.filter(l => l !== listener); };
}

/**
 * 저장된 원본 문자열.
 * useSyncExternalStore는 값이 같으면 같은 참조여야 다시 그리지 않는다.
 * 배열을 새로 만들어 돌려주면 매번 달라지므로 문자열을 그대로 준다.
 */
export function getRawSnapshot(): string {
  try {
    return localStorage.getItem(KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

/** 서버에서는 저장소가 없다. 빈 목록으로 그린다. */
export function getServerSnapshot(): string {
  return '[]';
}

/**
 * 실제로 저장됐는지 알려준다.
 *
 * 시크릿 모드나 저장공간이 찬 경우 localStorage.setItem이 예외를 던진다.
 * 예전에는 이걸 조용히 삼켜서, 저장이 안 됐는데도 화면에는
 * "저장됐어요"라고 나왔다. 생신을 기억해 주는 게 이 서비스의 본질이라
 * 저장 실패를 사용자가 알아야 한다.
 */
function saveAll(items: SavedBirthday[]): boolean {
  let ok = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    ok = false;
  }
  // 실패했더라도 화면은 실제 저장소 상태를 다시 읽어야 한다
  for (const listener of listeners) listener();
  return ok;
}

/**
 * 저장된 항목을 최근 저장 순으로 돌려준다.
 * 화면에 보여줄 때는 다가오는 생신 순으로 다시 정렬한다.
 * 남은 날짜는 음력 변환을 해야 알 수 있어 여기서는 계산하지 않는다.
 */
export function getSaved(): SavedBirthday[] {
  return loadAll().sort((a, b) => b.savedAt - a.savedAt);
}

/** 저장에 실패하면 null을 준다. 화면에서 성공했다고 알리면 안 된다. */
export function saveBirthday(
  label: string,
  input: LunarInput,
  birthYear?: number,
  birthLunarYear?: number
): SavedBirthday | null {
  const items = loadAll();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item: SavedBirthday = {
    id, label, input, birthYear, birthLunarYear, savedAt: Date.now(), starred: false,
  };
  return saveAll([...items, item]) ? item : null;
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

/* ────────────────────────────────────────────────────────────
   백업과 복원

   생신표는 이 기기의 localStorage에만 있다. 브라우저 데이터를 지우거나
   휴대폰을 바꾸면 그대로 사라지고 되살릴 방법이 없다. 가족 생신을
   하나하나 입력해 둔 사람에게는 잃으면 안 되는 값이라 내보내기와
   가져오기를 제공한다.
   ──────────────────────────────────────────────────────────── */

interface BackupFile {
  app: 'saengsinpyo';
  version: 1;
  exportedAt: string;
  items: SavedBirthday[];
}

/** 백업 파일 내용을 만든다. */
export function exportBackup(): string {
  const payload: BackupFile = {
    app: 'saengsinpyo',
    version: 1,
    exportedAt: new Date().toISOString(),
    items: loadAll(),
  };
  return JSON.stringify(payload, null, 2);
}

/** 백업 파일을 내려받는다. */
export function downloadBackup(): void {
  const blob = new Blob([exportBackup()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `우리집-생신표-백업-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ImportResult {
  added: number;
  skipped: number;
  error?: string;
}

/** 한 항목이 실제로 쓸 수 있는 모양인지 확인한다. */
function isValidItem(value: unknown): value is SavedBirthday {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Partial<SavedBirthday>;
  if (typeof item.id !== 'string' || typeof item.label !== 'string') return false;
  const input = item.input;
  if (typeof input !== 'object' || input === null) return false;
  const { month, day } = input as Partial<LunarInput>;
  return (
    typeof month === 'number' && month >= 1 && month <= 12 &&
    typeof day === 'number' && day >= 1 && day <= 30
  );
}

/**
 * 백업을 지금 목록에 합친다.
 * 이미 있는 항목은 건드리지 않아, 실수로 두 번 불러와도 중복되지 않는다.
 */
export function importBackup(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { added: 0, skipped: 0, error: '백업 파일을 읽을 수 없어요. 파일이 손상됐는지 확인해 주세요.' };
  }

  const file = parsed as Partial<BackupFile>;
  if (file?.app !== 'saengsinpyo' || !Array.isArray(file.items)) {
    return { added: 0, skipped: 0, error: '우리집 생신표 백업 파일이 아니에요.' };
  }

  const existing = loadAll();
  const existingIds = new Set(existing.map(i => i.id));
  const merged = [...existing];
  let added = 0;
  let skipped = 0;

  for (const candidate of file.items) {
    if (!isValidItem(candidate)) { skipped += 1; continue; }
    if (existingIds.has(candidate.id)) { skipped += 1; continue; }
    merged.push(candidate);
    existingIds.add(candidate.id);
    added += 1;
  }

  if (!saveAll(merged)) {
    return { added: 0, skipped: 0, error: '저장 공간이 부족하거나 브라우저가 저장을 막고 있어요. 시크릿 모드가 아닌지 확인해 주세요.' };
  }
  return { added, skipped };
}
