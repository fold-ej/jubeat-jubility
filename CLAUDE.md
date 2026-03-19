# jubeat Jubility Visualizer

## 프로젝트 개요

jubeat의 실력 지표인 **유빌리티(Jubility)**를 계산하고, 유빌리티에 포함되는 곡들을 격자형 이미지로 시각화하는 브라우저 콘솔 스크립트.

- 별도 서버 없이, e-amusement 공식 사이트에서 콘솔에 붙여넣기만 하면 동작
- Canvas API로 PNG 이미지 생성 → 자동 다운로드

---

## jubeat 기본 지식

### 게임 구조
- 코나미의 아케이드 리듬 게임
- 곡마다 **3가지 난이도**: BSC (Basic), ADV (Advanced), EXT (Extreme)
- 각 난이도마다 **레벨** 존재 (소수점 포함, 예: Lv10.2)
- **플레이 모드**: 노말 모드 / 하드 모드
  - 같은 곡, 같은 난이도를 노말 또는 하드로 플레이 가능
  - 하드모드는 판정 범위가 절반이 되어 난이도 상승

### 시즌(작품)
- 현재 시즌: **beyond the Ave.**
- 시즌마다 신곡이 추가됨
- 시즌 곡 = **픽업(PICKUP)**, 이전 시즌 곡 = **커먼(COMMON)**

### 스코어 체계
- 판정: PERFECT, GREAT, GOOD, POOR, MISS
- 점수: 최대 1,000,000점
- 등급: E, D, C, B, A, S, SS, SSS, EXC (EXC = 풀 퍼펙트)

### 뮤직 레이트 (MUSIC RATE)
- 이번 시즌에 플레이한 곡에만 부여됨 (점수가 있어도 뮤직 레이트가 없을 수 있음)
- 공식:
  ```
  MUSIC RATE = {(PERFECT + 0.2×GREAT + 0.05×GOOD) / 최대COMBO수} × 100
  (하드모드는 ×120)
  ```
- 노말: 최대 100%, 하드: 최대 120%

### 유빌리티 (Jubility)
- 실력 지표, 높을수록 잘하는 것
- **공식**: `jubility = LEVEL × 12.5 × (MUSIC RATE / 99)` (소수점 둘째 자리 이하 버림 → 소수점 첫째 자리까지)
- 예: Lv10.0 EXC(뮤직레이트 100%) → 10.0 × 12.5 × (100/99) = 126.2
- **반영 곡 수**: 총 60곡
  - 픽업 상위 30곡 + 커먼 상위 30곡
- 각 난이도는 별개 엔트리로 취급 (같은 곡 BSC/ADV/EXT 각각 반영 가능)
- 같은 곡·같은 난이도에서 노말/하드 둘 다 플레이한 경우, 뮤직 레이트가 높은 쪽만 적용

---

## 기술 구현 상세

### 데이터 소스

#### e-amusement 공식 사이트 (로그인 필요)
- **곡 목록**: `https://p.eagate.573.jp/game/jubeat/beyond/playdata/music.html`
  - 페이지네이션: `?page=2`, `?page=3`, ... (약 23페이지)
  - `table.music_data` 내 각 행: 자켓 이미지, 곡명, BSC/ADV/EXT 스코어
  - 곡 ID(`mid`)는 `a.popup-link`의 href에 포함
  - 하드모드 목록: `music_hard.html` (같은 구조)

- **곡 상세 (뮤직레이트/레벨)**: `music_detail.html?mid={id}`
  - `#music_score > div > table` — 난이도별 테이블
  - 각 테이블: `LEVEL:10.2`, `MUSIC RATE: 98.4%`
  - 하드모드 상세: `music_detail_hard.html?mid={id}`
  - 난이도 이미지 파일명: `msc_dif_txt_00_0.png`(BSC), `_1.png`(ADV), `_2.png`(EXT)

- **자켓 이미지**: `/game/jubeat/common/jacket/{digit}/id{mid}.gif` (같은 도메인, CORS 문제 없음)

#### b4j 사이트 (픽업 곡 구분용)
- URL: `https://b4j-beyond.mono-logic.com/user.php?rid={rid}&d={filter}`
- 버전 필터: `selver15` = "beyond the Ave." (픽업)
- 곡 구조: `.music_main` > `.music_main_musicname` (곡명), `a[href*="mid="]` (곡 ID)
- 폼 POST로 필터 적용 가능 (페이지 리로드 없이 fetch로 처리)

### 스크립트 동작 흐름

1. 노말/하드 모드 곡 목록 수집 (각 ~23페이지 페이지네이션)
2. 스코어가 있는 곡들의 상세 페이지에서 LEVEL + MUSIC RATE 파싱
3. 같은 곡/난이도에서 노말 vs 하드 중 높은 뮤직레이트 채택
4. 유빌리티 계산 → 픽업 상위 30 + 커먼 상위 30 선택
5. Canvas API로 격자형 이미지 생성 및 PNG 다운로드

### 픽업/커먼 분류

- **COMMON_MIDS**를 스크립트에 직접 내장 (1001곡)
- COMMON_MIDS에 없는 곡 = PICKUP으로 자동 분류
- 새 픽업 곡이 추가되어도 COMMON_MIDS에 없으므로 자동으로 PICKUP 처리
- 시즌 변경 시: COMMON_MIDS에 이전 시즌 곡 추가 필요
- 새 커먼 곡 추출: b4j 사이트에서 필터 POST → `.music_main_musicname` 파싱

### 주의사항

- 난이도 감지: 파일명 끝 `_0.png`/`_1.png`/`_2.png`으로 판별해야 함 (`includes('_0')` 사용 시 모두 BSC로 매칭되는 버그 있었음)
- 대량 fetch: ~1000곡 상세 페이지 요청 → 동시 5개 + 150~250ms 랜덤 딜레이로 서버 부하 방지
- 브라우저 `copy()` 함수 미지원 환경 있음 → 파일 다운로드 방식 사용
- e-amusement 사이트 인코딩: Shift-JIS (DOMParser로 처리 시 문제 없음)

---

## 파일 구조

```
jubeat-jubility/
├── CLAUDE.md          ← 이 파일
└── jubility.js        ← 메인 스크립트 (브라우저 콘솔에 붙여넣기용)
```

---

## 사용법

1. e-amusement 사이트 로그인
2. `music.html` 페이지 이동
3. 개발자 도구(F12) → Console
4. `jubility.js` 전체 복사 → 붙여넣기
5. 약 2~4분 후 PNG 이미지 자동 다운로드
