import { ImageResponse } from 'next/og';

export const alt = '우리집 생신표 — 음력 생일을 양력으로';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFF9F0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 120, marginBottom: 24 }}>🎂</div>
        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 700,
            color: '#2B2118',
            letterSpacing: '-2px',
          }}
        >
          우리집 생신표
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 38,
            color: '#8A7360',
            marginTop: 20,
          }}
        >
          음력 생일을 양력으로 바로 확인
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            padding: '16px 40px',
            borderRadius: 999,
            background: '#E8802B',
            color: '#fff',
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          saengsinpyo.com
        </div>
      </div>
    ),
    size
  );
}
