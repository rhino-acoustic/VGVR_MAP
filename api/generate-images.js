const DataProcessor = require('../data-processor');

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    console.log('🚀 Vercel에서 PNG 이미지 생성 요청을 받았습니다...');
    
    const processor = new DataProcessor();
    const success = await processor.loadGoogleSheetsData();
    
    if (success) {
      const result = await processor.generateAllImages();
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: '이미지 생성이 완료되었습니다.',
          files: result.generatedFiles || 0,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(result.error);
      }
    } else {
      throw new Error('Google Sheets 데이터 로드 실패');
    }
    
  } catch (error) {
    console.error('❌ Vercel 이미지 생성 실패:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
