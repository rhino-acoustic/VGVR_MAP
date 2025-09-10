// 환경 변수 로드 (Vercel에서는 자동으로 process.env에 로드됨)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const fs = require('fs');
const DataProcessor = require('./data-processor');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use('/generated-png', express.static(path.join(__dirname, 'generated-png')));
app.use(express.static('public'));
app.use(express.json());

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 이미지 생성 API
app.post('/api/generate-images', async (req, res) => {
  try {
    console.log('🚀 PNG 이미지 생성 요청을 받았습니다...');
    
    const processor = new DataProcessor();
    const success = await processor.loadGoogleSheetsData();
    
    if (success) {
      const result = await processor.generateAllImages();
      if (result.success) {
        res.json({
          success: true,
          message: '이미지 생성이 완료되었습니다.',
          files: result.generatedFiles || 0,
          generatedFiles: result.generatedFiles || 0
        });
      } else {
        throw new Error(result.error);
      }
    } else {
      throw new Error('Google Sheets 데이터 로드 실패');
    }
    
  } catch (error) {
    console.error('❌ 이미지 생성 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PNG 파일 목록 API
app.get('/api/png-files', (req, res) => {
  try {
    const pngDir = path.join(__dirname, 'generated-png');
    
    if (!fs.existsSync(pngDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(pngDir)
      .filter(file => file.endsWith('.png'));

    res.json({ files });
  } catch (error) {
    console.error('PNG 파일 목록 불러오기 오류:', error);
    res.status(500).json({ error: 'PNG 파일 목록을 불러올 수 없습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 브라우저에서 http://localhost:${PORT} 을 열어보세요.`);
});
