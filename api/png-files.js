const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const pngDir = path.join(process.cwd(), 'generated-png');
    
    if (!fs.existsSync(pngDir)) {
      fs.mkdirSync(pngDir, { recursive: true });
    }

    const files = fs.readdirSync(pngDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file,
        path: `/generated-png/${file}`,
        url: `/generated-png/${file}`
      }));

    console.log(`📁 PNG 파일 목록 반환: ${files.length}개 파일`);
    
    res.status(200).json({
      success: true,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('❌ PNG 파일 목록 오류:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      files: []
    });
  }
};
