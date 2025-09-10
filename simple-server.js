const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// CORS 설정
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://vgvr-map.vercel.app',
    'https://*.run.app'
  ],
  credentials: true
}));

app.use(express.json());

// 환경 변수 로드
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 마지막 업데이트 시간 추적
let lastUpdateTime = new Date().toISOString();

// 테스트 이미지 목록 API
app.get('/api/images', async (req, res) => {
  try {
    // 임시 테스트 데이터
    const testImages = [
      {
        name: '용인팀',
        filename: '용인팀.png',
        url: '/test-images/용인팀.png',
        size: 102400,
        lastModified: lastUpdateTime
      },
      {
        name: '수원팀',
        filename: '수원팀.png', 
        url: '/test-images/수원팀.png',
        size: 98304,
        lastModified: lastUpdateTime
      }
    ];

    res.json({
      images: testImages,
      lastUpdate: lastUpdateTime,
      totalImages: testImages.length,
      serverUrl: process.env.CLOUD_RUN_URL || `http://localhost:${port}`,
      message: 'Google Cloud Run 테스트 서버 실행 중'
    });
    
  } catch (error) {
    console.error('❌ 이미지 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 이미지 생성 트리거 API (테스트용)
app.post('/api/generate-images', async (req, res) => {
  try {
    console.log('🚀 테스트 이미지 생성 요청 받음');
    
    // 테스트용 지연
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    lastUpdateTime = new Date().toISOString();
    
    res.json({
      success: true,
      message: '테스트 이미지 생성 완료',
      lastUpdate: lastUpdateTime,
      imagesGenerated: true,
      totalImages: 2
    });
    
  } catch (error) {
    console.error('❌ 테스트 이미지 생성 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 상태 확인 API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    lastUpdate: lastUpdateTime,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    message: 'Google Cloud Run 테스트 서버'
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'VGVR Map Generator (Google Cloud Run)',
    status: 'healthy',
    lastUpdate: lastUpdateTime,
    version: 'test-1.0.0'
  });
});

app.listen(port, () => {
  console.log(`🚀 Google Cloud Run 서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`🧪 테스트 모드로 실행 중 (Puppeteer 없음)`);
});
