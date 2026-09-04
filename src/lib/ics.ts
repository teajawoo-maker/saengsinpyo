import { getSolarForYears } from '@/lib/lunarConverter';
import { ageAtBirthday, getMilestone } from '@/lib/age';
import type { SavedBirthday } from '@/lib/storage';

/** 캘린더에 넣을 연수. 너무 길면 파일이 커지고 짧으면 금방 끝난다. */
const YEARS_AHEAD = 10;

/**
 * ICS 규격에서 특수한 의미를 갖는 문자를 escape 한다.
 * 쉼표·세미콜론·역슬래시는 값 구분자라 그대로 넣으면 줄이 깨진다.
 */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 종일 일정용 날짜 (YYYYMMDD) */
function dateStamp(year: number, month: number, day: number): string {
  return `${year}${pad(month)}${pad(day)}`;
}

/** 하루 뒤 날짜. 종일 일정의 DTEND는 다음 날을 가리켜야 한다. */
function nextDayStamp(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  return dateStamp(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * ICS 본문은 한 줄이 75옥텟을 넘으면 안 된다.
 * 넘치는 부분은 다음 줄 맨 앞에 공백 하나를 두고 이어 쓴다.
 * 한글은 UTF-8에서 3바이트라 글자 수가 아니라 바이트로 세야 한다.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = '';
  let currentBytes = 0;

  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    // 이어지는 줄은 앞 공백 한 칸을 쓰므로 한도가 1옥텟 줄어든다
    const limit = out.length === 0 ? 75 : 74;
    if (currentBytes + charBytes > limit) {
      out.push(current);
      current = char;
      currentBytes = charBytes;
    } else {
      current += char;
      currentBytes += charBytes;
    }
  }
  if (current) out.push(current);

  return out.join('\r\n ');
}

/**
 * 저장된 생신들을 .ics 캘린더 문자열로 만든다.
 *
 * 음력 생일은 해마다 양력 날짜가 바뀌므로 매년 반복(RRULE)으로는
 * 표현할 수 없다. 연도별 날짜를 각각 계산해 개별 일정으로 넣는다.
 */
export function buildIcs(items: SavedBirthday[]): string {
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: YEARS_AHEAD }, (_, i) => thisYear + i);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//saengsinpyo.com//우리집 생신표//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:우리집 생신표',
    'X-WR-TIMEZONE:Asia/Seoul',
  ];

  for (const item of items) {
    const occurrences = getSolarForYears(item.input, years);

    for (const solar of occurrences) {
      const age = item.birthYear ? ageAtBirthday(item.birthYear, solar.year) : null;
      const milestone = age !== null ? getMilestone(age) : null;

      const title = milestone
        ? `🎉 ${item.label} ${milestone.name}`
        : `🎂 ${item.label} 생신`;

      const descParts = [
        `음력 ${item.input.leapStatus === 'leap' ? '윤' : ''}${item.input.month}월 ${item.input.day}일`,
      ];
      if (age !== null) descParts.push(`만 ${age}세`);
      if (milestone) descParts.push(`${milestone.name} — ${milestone.description}`);
      if (solar.note) descParts.push(solar.note);
      descParts.push('우리집 생신표 saengsinpyo.com');

      lines.push(
        'BEGIN:VEVENT',
        `UID:${item.id}-${solar.year}@saengsinpyo.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${dateStamp(solar.year, solar.month, solar.day)}`,
        `DTEND;VALUE=DATE:${nextDayStamp(solar.year, solar.month, solar.day)}`,
        `SUMMARY:${escapeText(title)}`,
        `DESCRIPTION:${escapeText(descParts.join(' · '))}`,
        'TRANSP:TRANSPARENT',
        'BEGIN:VALARM',
        'TRIGGER:-P3D',           // 3일 전 알림
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(`${item.label} 생신이 3일 남았어요`)}`,
        'END:VALARM',
        'END:VEVENT'
      );
    }
  }

  lines.push('END:VCALENDAR');

  // ICS는 줄바꿈이 CRLF여야 하고, 각 줄은 75옥텟로 접어야 한다
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** 만든 .ics를 파일로 내려받게 한다. */
export function downloadIcs(items: SavedBirthday[]): void {
  const blob = new Blob([buildIcs(items)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '우리집-생신표.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 브라우저가 파일을 읽을 시간을 준 뒤 해제한다
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
