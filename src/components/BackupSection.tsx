'use client';

import { useRef, useState, useCallback } from 'react';
import { downloadBackup, importBackup } from '@/lib/storage';

interface Props {
  /** 저장된 항목 수. 0이면 내보낼 게 없다. */
  count: number;

}

/**
 * 생신표 백업과 복원.
 * localStorage에만 있는 값이라 기기를 바꾸거나 브라우저 데이터를 지우면
 * 전부 사라진다. 파일로 빼두고 되돌릴 수 있게 한다.
 */
export default function BackupSection({ count }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const show = useCallback((text: string, error = false) => {
    setMessage(text);
    setIsError(error);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 오도록 값을 비운다
    e.target.value = '';
    if (!file) return;

    try {
      const result = importBackup(await file.text());
      if (result.error) { show(result.error, true); return; }
      if (result.added === 0) {
        show(`이미 다 있는 생신이에요. (${result.skipped}개 건너뜀)`);
      } else {
        show(`${result.added}명 불러왔어요!${result.skipped ? ` (${result.skipped}개는 이미 있어서 건너뜀)` : ''}`);
      }

    } catch {
      show('파일을 읽지 못했어요.', true);
    }
  }, [show]);

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-4">
      <div className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <h2 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          생신표 백업
        </h2>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          생신표는 이 기기에만 저장돼요. 휴대폰을 바꾸거나 브라우저 기록을 지우면
          사라지니, 파일로 백업해 두세요.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button type="button"
            onClick={() => {
              if (count === 0) { show('저장된 생신이 없어요.', true); return; }
              downloadBackup();
              show('백업 파일을 저장했어요.');
            }}
            className="py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-95"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
            💾 백업 저장
          </button>
          <button type="button"
            onClick={() => fileRef.current?.click()}
            className="py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-95"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}>
            📂 백업 불러오기
          </button>
        </div>

        <input ref={fileRef} type="file" accept="application/json,.json"
          onChange={handleFile} className="hidden" aria-hidden="true" tabIndex={-1} />

        {message && (
          <p className="text-xs mt-3 text-center font-medium"
            style={{ color: isError ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
