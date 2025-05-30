const xlsx = require('xlsx')
const fs = require('fs')

const useMap = (obj, server) => ({
  server,
  fullName: obj.fullName,
  car_id: obj.car_id,

  brand: obj.brand,
  nickName: obj.nickName,
  keyWords: obj.keyWords,
  carClass: obj.carClass,
  carClassOrder: {
    D: 1,
    C: 2,
    B: 3,
    A: 4,
    S: 5,
    R: 10,
  }[obj.carClass],
  star: obj.star,
  quality: obj.quality === 'ruby' ? 'legendary' : obj.quality,
  bps: [
    obj.star_1 > 0 ? obj.star_1 : 0,
    obj.star_2 > 0 ? obj.star_2 : 0,
    obj.star_3 > 0 ? obj.star_3 : 0,
    obj.star_4 > 0 ? obj.star_4 : 0,
    obj.star_5 > 0 ? obj.star_5 : 0,
    obj.star_6 > 0 ? obj.star_6 : 0,
  ],
  isKeyCar: obj.star_1 === '🔑',
  decals: [],
  decalsExclusive: [],
  bodyKit: !!obj.bodyParts,
  roadster: { 无顶: 'nofold', 可开合: 'fold', '': null }[obj.openCar] || null,
  nitroVisualsCount: 0,
  releaseVersion: obj.releaseVersion,
})

const exportJsonLines = (xlsxFilePath, sheetName) => {
  const table = xlsx.readFile(xlsxFilePath)
  const dataPath = `dist/${xlsxFilePath}.${sheetName}.line.json`
  const dataJson = xlsx.utils.sheet_to_json(table.Sheets[sheetName])
  // console.log(table.Sheets[sheetName]["!merges"])
  const dataLines = dataJson
    .map((obj) => useMap(obj))
    .map((dataItem) => JSON.stringify(dataItem))
    .join('\n')
  const dataBuffer = Buffer.from(dataLines)

  fs.writeFileSync(dataPath, dataBuffer)
}

//运行命令 node exportJsonLines 文件名 表名，即可导出文件

// node ./exportJsonLines.js ./狂野飙车9生涯数据-地图.xlsx forJson

const [, , xlsxFilePath, sheetName] = process.argv

try {
  if (xlsxFilePath && sheetName) {
    exportJsonLines(xlsxFilePath, sheetName)
    console.log('执行成功')
  }
} catch (e) {
  console.log(e)
}
