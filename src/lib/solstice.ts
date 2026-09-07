/**
 * 동지(冬至) 계산.
 *
 * 동지는 태양 황경이 270도가 되는 순간이라 해마다 양력 날짜가 12월 21일
 * 또는 22일로 달라진다. 12월 22일로 고정해 두면 21일인 해에 틀리고,
 * 한식(동지로부터 105일째)까지 함께 어긋난다.
 *
 * Jean Meeus, Astronomical Algorithms 27장의 방법을 쓴다.
 * 평균 동지 시각을 구한 뒤 주기항으로 보정한다. 오차는 1분 안쪽이라
 * 날짜를 가리는 데는 충분하다.
 */

const RAD = Math.PI / 180;

/**
 * 주기항 표 (Meeus 표 27.C).
 * [진폭, 각도(도), 각속도(도/율리우스세기)]
 */
const PERIODIC: [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

/** 평균 동지의 율리우스일 (Meeus 27.3, 1000~3000년) */
function meanDecemberSolsticeJde(year: number): number {
  const y = (year - 2000) / 1000;
  return (
    2451900.05952 +
    365242.74049 * y -
    0.06223 * y * y -
    0.00823 * y * y * y +
    0.00032 * y * y * y * y
  );
}

/** 율리우스일 → UTC 기준 Date */
function jdeToDate(jde: number): Date {
  // 율리우스일 2440587.5가 1970-01-01T00:00:00Z
  return new Date((jde - 2440587.5) * 86400000);
}

/**
 * 역학시(TD)와 세계시(UT)의 차이를 초로 돌려준다.
 * Meeus 공식은 역학시로 결과를 주므로 실제 시계 시각으로 바꾸려면 빼야 한다.
 * 2000년대에는 70초 안팎이라 대개 영향이 없지만, 동지가 자정 가까이
 * 떨어지는 해에는 날짜가 갈릴 수 있어 반영한다. (2025년 동지가 그런 경우다.)
 */
function deltaTSeconds(year: number): number {
  const t = year - 2000;
  return 62.92 + 0.32217 * t + 0.005589 * t * t;
}

/** 그 해 동지의 정확한 시각(UTC). */
export function getDongjiInstant(year: number): Date {
  const jde0 = meanDecemberSolsticeJde(year);
  const t = (jde0 - 2451545.0) / 36525;
  const w = (35999.373 * t - 2.47) * RAD;
  const deltaLambda = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w);

  let s = 0;
  for (const [a, b, c] of PERIODIC) {
    s += a * Math.cos((b + c * t) * RAD);
  }

  const td = jdeToDate(jde0 + (0.00001 * s) / deltaLambda);
  return new Date(td.getTime() - deltaTSeconds(year) * 1000);
}

/**
 * 한국 기준 동지 날짜(자정 기준 Date).
 * 절기는 그 순간이 속한 날을 가리키므로 한국 시간대(UTC+9)로 옮겨 판단한다.
 */
export function getDongji(year: number): Date {
  const instant = getDongjiInstant(year);
  // UTC 시각에 9시간을 더한 뒤 그 날짜만 취한다
  const kst = new Date(instant.getTime() + 9 * 3600 * 1000);
  return new Date(year, kst.getUTCMonth(), kst.getUTCDate());
}
