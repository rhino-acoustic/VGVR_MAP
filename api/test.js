export default async function handler(req, res) {
  try {
    console.log('🧪 Vercel 테스트 API 호출됨');
    
    // 환경변수 확인
    const envCheck = {
      GOOGLE_MAPS_API_KEY: !!process.env.GOOGLE_MAPS_API_KEY,
      GOOGLE_SHEETS_SPREADSHEET_ID: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      GOOGLE_APPLICATION_CREDENTIALS_JSON: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      VERCEL: process.env.VERCEL || 'undefined'
    };
    
    console.log('🔑 환경변수 체크:', envCheck);
    
    // Google Sheets 간단 테스트
    const DataProcessor = require('../data-processor');
    const processor = new DataProcessor();
    
    console.log('📊 DataProcessor 생성 완료');
    
    // 단순 SVG 템플릿 로드 테스트
    const svgLoaded = processor.loadSvgTemplate();
    console.log('📄 SVG 템플릿 로드:', svgLoaded);
    
    return res.status(200).json({
      success: true,
      message: 'Vercel 환경 테스트 성공',
      environment: envCheck,
      svgTemplateLoaded: svgLoaded,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Vercel 테스트 실패:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
