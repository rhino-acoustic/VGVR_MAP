# Vercel 배포 가이드 🚀

## 1. Vercel 계정 및 프로젝트 설정

### 1-1. GitHub 연동
1. GitHub에 프로젝트 push
2. [Vercel 대시보드](https://vercel.com) 접속
3. "New Project" → GitHub 리포지토리 선택
4. "Import" 클릭

### 1-2. 빌드 설정
- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build` (자동 감지)
- **Output Directory**: `.` (기본값)
- **Install Command**: `npm install` (자동)

## 2. 환경 변수 설정 ⚙️

Vercel 대시보드 → Settings → Environment Variables에서 다음 변수들을 추가하세요:

### 필수 환경 변수:
```bash
# Google Sheets API
GOOGLE_SHEETS_SPREADSHEET_ID=1BH-rKmO-wZ_example_id
GOOGLE_APPLICATION_CREDENTIALS=./rhino-4483e-da5526cdd49f.json

# Google Maps API  
GOOGLE_MAPS_API_KEY=AIzaSyCOxHoHE_GF2NAJxaUFzPo9fbIQKG7upes

# 서버 설정
NODE_ENV=production
```

### Environment 설정:
- **Production**: 실제 서비스용
- **Preview**: PR/브랜치 테스트용  
- **Development**: 로컬 개발용

## 3. Google Service Account 파일 설정 📁

### 방법 1: 파일 업로드 (권장)
1. `rhino-4483e-da5526cdd49f.json` 파일을 프로젝트 루트에 위치
2. `.gitignore`에서 해당 파일이 제외되지 않도록 확인
3. GitHub에 푸시

### 방법 2: 환경변수로 설정
```bash
# JSON 내용을 한 줄로 변환해서 환경변수로 설정
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"rhino-4483e",...}
```

## 4. 자동 스케줄링 설정 ⏰

### Vercel Cron Jobs 설정 (vercel.json에서 이미 설정됨):
```json
{
  "crons": [
    {
      "path": "/api/generate-images",
      "schedule": "0 19 * * *"  // 한국시간 새벽 4시
    },
    {
      "path": "/api/generate-images", 
      "schedule": "0 5 * * *"   // 한국시간 오후 2시
    }
  ]
}
```

## 5. 배포 완료 후 확인사항 ✅

### 5-1. 기본 동작 확인
- `https://your-app.vercel.app` 접속
- "📊 이미지 생성하기" 버튼 클릭
- 이미지 생성 확인

### 5-2. PNG 링크 확인
생성된 PNG 이미지들이 다음 URL로 접근 가능:
```
https://your-app.vercel.app/generated-png/용인팀.png
https://your-app.vercel.app/generated-png/구덕팀.png
https://your-app.vercel.app/generated-png/신촌팀.png
...등등
```

### 5-3. 자동 스케줄링 확인
- Vercel 대시보드 → Functions → Cron Jobs에서 실행 로그 확인
- 새벽 4시, 오후 2시에 자동 실행되는지 확인

## 6. 도메인 설정 (선택사항) 🌐

### 커스텀 도메인 연결:
1. Vercel 대시보드 → Settings → Domains
2. 도메인 추가 (예: `maps.vegavery.com`)
3. DNS 설정 (A/CNAME 레코드)

## 7. 트러블슈팅 🔧

### 환경변수 인식 안됨:
- Environment Variables에서 모든 환경(Production, Preview, Development)에 설정했는지 확인
- 재배포 (`Deployments` → `Redeploy`)

### PNG 생성 실패:
- Functions 로그에서 오류 확인
- Puppeteer 메모리 제한 확인 (vercel.json의 maxDuration 설정)

### Cron Job 실행 안됨:
- Pro 플랜 이상에서만 Cron Jobs 사용 가능
- GMT 시간대 기준으로 스케줄 설정 확인

## 8. 최종 PNG URL 형식 📱

배포 완료 후 각 팀의 PNG 이미지는 다음 고정 URL로 접근:

```
https://your-vercel-app.vercel.app/generated-png/팀명.png
```

예시:
- `https://vegavery-maps.vercel.app/generated-png/용인팀.png`
- `https://vegavery-maps.vercel.app/generated-png/구덕팀.png`
- `https://vegavery-maps.vercel.app/generated-png/신촌팀.png`

이 링크들은 자동 업데이트되므로 다른 서비스에서 직접 참조 가능합니다! 🎯
