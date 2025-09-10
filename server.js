// 환경 변수 로드 (Vercel에서는 자동으로 process.env에 로드됨)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const fs = require('fs');
const generateAllImages = require('./generate-images');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use('/generated-maps', express.static(path.join(__dirname, 'generated-maps')));
app.use(express.static('public'));
app.use(express.json());

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 생성된 파일 목록 API
app.get('/api/files', (req, res) => {
  try {
    if (fs.existsSync('generated-files.json')) {
      const fileList = JSON.parse(fs.readFileSync('generated-files.json', 'utf8'));
      res.json(fileList);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('파일 목록 읽기 오류:', error);
    res.status(500).json({ error: '파일 목록을 불러올 수 없습니다.' });
  }
});

// 이미지 생성 API (CSV 파일 사용)
app.post('/api/generate', async (req, res) => {
  try {
    console.log('🚀 이미지 생성 요청을 받았습니다...');
    const savedFiles = await generateAllImages();
    
    if (savedFiles && savedFiles.length > 0) {
      res.json({ 
        success: true, 
        message: `${savedFiles.length}개의 이미지가 생성되었습니다.`,
        files: savedFiles.length
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '이미지 생성에 실패했습니다.' 
      });
    }
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '이미지 생성 중 오류가 발생했습니다.' 
    });
  }
});

// Google Sheets에서 이미지 생성 API
app.post('/api/generate-from-sheets', async (req, res) => {
  try {
    const { spreadsheetId, range } = req.body;
    
    if (!spreadsheetId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google Sheets ID가 필요합니다.' 
      });
    }

    console.log('🚀 Google Sheets에서 이미지 생성 요청을 받았습니다...');
    
    const DataProcessor = require('./data-processor');
    const processor = new DataProcessor();
    
    // SVG 템플릿 로드
    if (!processor.loadSvgTemplate()) {
      return res.status(500).json({ 
        success: false, 
        message: 'SVG 템플릿 로드에 실패했습니다.' 
      });
    }
    
    // Google Sheets에서 데이터 로드 (A:Z50 범위로 제한)
    await processor.loadGoogleSheetsData(spreadsheetId, range || 'A:Z50');
    
    // 모든 지역의 SVG 생성 및 저장
    const savedFiles = await processor.saveSvgsToFiles('generated-maps');
    
    if (savedFiles && savedFiles.length > 0) {
      // 생성된 파일 목록을 JSON으로 저장
      const fileList = savedFiles.map(file => ({
        fileName: file.fileName,
        regionName: file.regionInfo.지역,
        day: file.regionInfo.요일,
        time: file.regionInfo.시간,
        place: file.regionInfo.장소,
        meetingPoint: file.regionInfo.집합장소,
        parking: file.regionInfo.주차장,
        coordinates: file.regionInfo['집합장소(구글맵)'],
        filePath: file.filePath.replace(/\\/g, '/')
      }));
      
      fs.writeFileSync('generated-files.json', JSON.stringify(fileList, null, 2));
      
      res.json({ 
        success: true, 
        message: `Google Sheets에서 ${savedFiles.length}개의 이미지가 생성되었습니다.`,
        files: savedFiles.length
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '이미지 생성에 실패했습니다.' 
      });
    }
  } catch (error) {
    console.error('Google Sheets 이미지 생성 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: `Google Sheets 이미지 생성 중 오류: ${error.message}` 
    });
  }
});

// 생성된 파일 목록 API (SVG 우선, PNG 대체)
app.get('/api/png-files', (req, res) => {
  try {
    if (process.env.VERCEL) {
      // Vercel 환경에서는 PNG 생성을 건너뛰므로 성공 메시지만 반환
      console.log('⚠️ Vercel 환경: PNG 대신 생성 완료 메시지 반환');
      res.json([
        { 
          fileName: '생성완료.png', 
          teamName: '이미지 생성이 완료되었습니다', 
          filePath: '#' 
        }
      ]);
    } else {
      // 로컬 환경에서는 PNG 파일 목록 제공
      const pngDir = path.join(__dirname, 'generated-png');
      
      if (!fs.existsSync(pngDir)) {
        return res.json([]);
      }

      const files = fs.readdirSync(pngDir)
        .filter(file => file.endsWith('.png'))
        .map(file => {
          const teamName = file.replace('.png', '');
          return {
            fileName: file,
            teamName: teamName,
            filePath: path.join(pngDir, file)
          };
        });

      res.json(files);
    }
  } catch (error) {
    console.error('파일 목록 불러오기 오류:', error);
    res.status(500).json({ error: '파일 목록을 불러올 수 없습니다.' });
  }
});

// PNG 파일 정적 서빙
// PNG 파일 정적 서빙 (Vercel 환경 고려)
const pngStaticDir = process.env.VERCEL 
  ? '/tmp/generated-png'
  : path.join(__dirname, 'generated-png');
app.use('/generated-png', express.static(pngStaticDir));

app.listen(PORT, () => {
  console.log(`🌐 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 브라우저에서 http://localhost:${PORT} 을 열어보세요.`);
});
