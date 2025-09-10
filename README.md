# VegaVery Map Generator 🗺️

Google Sheets 데이터를 기반으로 팀별 지도 이미지를 자동 생성하는 서비스입니다.

**🚀 배포 상태**: Production Ready (재배포 트리거)

## 🚀 주요 기능

- **Google Sheets 연동**: 실시간 데이터 동기화
- **Google Maps 지도**: 정확한 위치 표시
- **SVG → PNG 변환**: 고품질 이미지 생성
- **자동 스케줄링**: 새벽 4시, 오후 2시 자동 업데이트
- **CDN 배포**: Vercel을 통한 전세계 빠른 접근

## 📋 생성되는 이미지 URL

```
https://your-app.vercel.app/generated-png/용인팀.png
https://your-app.vercel.app/generated-png/구덕팀.png
https://your-app.vercel.app/generated-png/신촌팀.png
https://your-app.vercel.app/generated-png/사직팀.png
... 등등
```

## ⚙️ 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_MAPS_API_KEY=your_maps_api_key
GOOGLE_APPLICATION_CREDENTIALS=./rhino-4483e-da5526cdd49f.json
```

## 🕐 자동 스케줄링

- **새벽 4시 (KST)**: 일일 업데이트
- **오후 2시 (KST)**: 실시간 업데이트

## 📁 파일 구조

```
├── server.js              # 메인 서버
├── data-processor.js       # 이미지 생성 로직
├── google-sheets.js        # Google Sheets API
├── api/
│   └── generate-images.js  # Vercel Cron 엔드포인트
├── public/
│   └── index.html         # 웹 인터페이스
├── generated-png/         # 생성된 PNG 파일들
└── vercel.json           # Vercel 설정
```

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 서버 시작
npm start

# 브라우저에서 확인
http://localhost:3000
```

## 📊 지원 데이터

- 팀명, 지역, 요일
- 집합장소, 좌표
- 코치, 매니저, 리더 정보
- 주차장 정보
- 특이사항 (자동 줄바꿈)

## 🎨 이미지 특징

- **크기**: 1000x1000px PNG
- **폰트**: Freesentation (CDN 로드)
- **지도**: Google Maps Static API
- **테두리**: 2px 검정 테두리
- **그라데이션**: 팀별 고유 색상

## 📱 사용법

1. Google Sheets에 데이터 입력
2. 자동으로 새벽 4시, 오후 2시에 업데이트
3. 고정 URL로 이미지 접근 가능

## 🛠️ 기술 스택

- **Backend**: Node.js, Express
- **Image**: Puppeteer, Sharp
- **API**: Google Sheets API, Google Maps API
- **Deploy**: Vercel
- **Cron**: Vercel Cron Jobs