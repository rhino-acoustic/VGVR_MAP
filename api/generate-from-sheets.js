const DataProcessor = require('../data-processor');

module.exports = async (req, res) => {
  try {
    console.log('🚀 Google Sheets 기반 이미지 생성 시작');
    
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const processor = new DataProcessor();
    
    // SVG 템플릿 로드
    if (!processor.loadSvgTemplate()) {
      throw new Error('SVG 템플릿 로드 실패');
    }

    // Google Sheets 데이터 로드
    await processor.loadGoogleSheetsData();

    // 이미지 생성
    const results = await processor.generateImages();
    
    console.log('✅ Google Sheets 기반 이미지 생성 완료');
    
    res.status(200).json({
      success: true,
      message: '이미지 생성 완료',
      timestamp: new Date().toISOString(),
      results: {
        totalGenerated: results.length,
        images: results.map(r => ({
          team: r.regionInfo.팀명,
          fileName: r.fileName,
          svgGenerated: true,
          pngGenerated: true
        }))
      }
    });

  } catch (error) {
    console.error('❌ Google Sheets 기반 이미지 생성 실패:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
