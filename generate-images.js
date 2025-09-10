const DataProcessor = require('./data-processor');
const fs = require('fs');
const path = require('path');

async function generateAllImages() {
  console.log('🚀 지역별 이미지 생성을 시작합니다...');
  
  const processor = new DataProcessor();
  
  // SVG 템플릿 로드
  if (!processor.loadSvgTemplate()) {
    console.error('❌ SVG 템플릿 로드에 실패했습니다.');
    return;
  }
  
  try {
    // CSV 데이터 로드
    await processor.loadCsvData('sample-data.csv');
    
    // 모든 지역의 SVG 생성 및 저장
    const savedFiles = await processor.saveSvgsToFiles('generated-maps');
    
    console.log(`✅ ${savedFiles.length}개의 지역별 이미지가 생성되었습니다.`);
    
    // 생성된 파일 목록을 JSON으로 저장 (웹페이지에서 사용)
    const fileList = savedFiles.map(file => ({
      fileName: file.fileName,
      teamName: file.regionInfo.팀명,
      day: file.regionInfo.요일,
      time: file.regionInfo.수업시간,
      place: file.regionInfo.집합장소명,
      coach: file.regionInfo.코치명,
      manager: file.regionInfo.매니저,
      parking: file.regionInfo.주차장관련,
      coordinates: file.regionInfo.좌표,
      filePath: file.filePath.replace(/\\/g, '/')
    }));
    
    fs.writeFileSync('generated-files.json', JSON.stringify(fileList, null, 2));
    console.log('📝 파일 목록이 generated-files.json에 저장되었습니다.');
    
    return savedFiles;
    
  } catch (error) {
    console.error('❌ 이미지 생성 중 오류가 발생했습니다:', error);
  }
}

// 직접 실행시
if (require.main === module) {
  generateAllImages();
}

module.exports = generateAllImages;
