# 프로젝트 가이드 (CLAUDE.md)

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **린터**: ESLint (eslint-config-next)
- **패키지 매니저**: npm

## 디렉토리 구조

```
src/
  app/           # App Router 페이지 및 레이아웃
    layout.tsx   # 루트 레이아웃
    page.tsx     # 홈 페이지 (/)
    globals.css  # 전역 CSS (Tailwind 임포트 포함)
public/          # 정적 파일 (이미지 등)
```

## 주요 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm run start

# 린트 검사
npm run lint
```

## 코드 규칙

### TypeScript
- `any` 타입 사용 금지 — 명시적 타입 선언 필수
- 컴포넌트 props는 `interface`로 정의
- 파일 확장자: `.tsx` (JSX 포함), `.ts` (순수 로직)

### 컴포넌트
- React Server Components 우선 사용 (클라이언트 상태 필요 시에만 `"use client"` 선언)
- 컴포넌트 파일명: PascalCase (예: `UserCard.tsx`)
- 페이지 파일명: `page.tsx` (App Router 규칙 준수)

### 스타일링 (Tailwind CSS)
- 인라인 스타일(`style={{}}`) 대신 Tailwind 유틸리티 클래스 사용
- 복잡한 반복 스타일은 `cn()` 유틸리티로 분리
- 다크 모드: `dark:` 접두사 활용

### 파일 임포트
- 절대 경로 임포트 사용: `@/components/...`, `@/lib/...`
- 상대 경로(`../../`) 사용 지양

### 폴더 관례
```
src/
  app/           # 라우팅 페이지
  components/    # 재사용 가능한 UI 컴포넌트
  lib/           # 유틸리티 함수, 헬퍼
  types/         # 공유 TypeScript 타입 정의
  hooks/         # 커스텀 React 훅 (클라이언트 전용)
```

## 환경 변수

- `.env.local` 파일에 비밀 값 보관 (절대 git에 커밋하지 말 것)
- 클라이언트에 노출할 값만 `NEXT_PUBLIC_` 접두사 사용

## 주의 사항

- `npm run build` 후 타입/빌드 오류가 없는지 반드시 확인
- 새 패키지 설치 후 `package.json`과 `package-lock.json` 모두 커밋
- App Router에서 `pages/` 디렉토리 혼용 금지
