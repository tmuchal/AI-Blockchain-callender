# 🌏 Asia AI · Blockchain Calendar

> 글로벌 AI · 블록체인 컨퍼런스 일정을 한눈에 — 가로형 타임라인 캘린더

**👉 [라이브 서비스 보기](https://tmuchal.github.io/AI-Blockchain-callender/)**

---

## 📅 서비스 소개

- **가로형 타임라인** — 1년치 행사를 월별 수평 바 차트로 한눈에 확인
- **픽셀 티라노사우루스** — 캘린더 위를 자유롭게 돌아다니는 귀여운 공룡
- **D-day 카운트다운** — 각 행사까지 남은 날짜 실시간 표시
- **상세 모달** — 클릭하면 행사 정보(장소·참가비·공식 링크) 팝업
- **글로벌 행사 수록** — Consensus, ETH, Bitcoin Conference, Web Summit 등 주요 컨퍼런스 포함

---

## 🔧 로컬 실행

```bash
git clone https://github.com/tmuchal/AI-Blockchain-callender.git
cd AI-Blockchain-callender
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 🗓 행사 추가 방법

`src/events.ts` 파일에 항목 추가:

```ts
{
  id: 'my-event-2026',
  name: 'My Conference 2026',
  location: '서울, 한국',
  startDate: '2026-09-01',
  endDate: '2026-09-03',
  color: '#4f6ef7',
  url: 'https://example.com',
  emoji: '🇰🇷',
  description: '행사 설명을 입력하세요.',
  tags: ['Web3', 'AI', 'Korea'],
  attendees: '1,000+',
  ticketPrice: '무료',
}
```

---

## 🛠 기술 스택

- **React 19** + **TypeScript**
- **Vite** — 빌드 도구
- **GitHub Actions** — 자동 배포 (GitHub Pages)

---

## 📦 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.
