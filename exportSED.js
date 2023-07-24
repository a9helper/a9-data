const xlsx = require('xlsx')
const fs = require('fs')
const dayjs = require('dayjs')

const dayFromExcel=(value) =>
dayjs('1900-01-01')
  .add(value + 2 * 365, 'day')
  .format('YYYY-MM-DD')


const handle = {
  topSpeed: (value) => Number(Number(value).toFixed(1)),
  acceleration: (value) => Number(Number(value).toFixed(2)),
  handling: (value) => Number(Number(value).toFixed(2)),
  nitro: (value) => Number(Number(value).toFixed(2)),
  nitroDuration: (value) => Number(Number(value).toFixed(2)),
  car_id: (value) => '' + value,
  注册日期: dayFromExcel,
  合同开始日期: dayFromExcel,
  合同到期日期: dayFromExcel,
}

const copy = (obj) => JSON.parse(JSON.stringify(obj))

const useHandle = (obj, handle) => {
  let res = copy(obj)
  Object.keys(handle).forEach((key) => {
    if (res[key]) {
      res[key] = handle[key](res[key])
    }
  })
  return res
}

const exportJsonLines = (xlsxFilePath, sheetName) => {
  const table = xlsx.readFile(xlsxFilePath)
  const dataPath = `dist\\${xlsxFilePath}.${sheetName}.line.json`
  const dataJson = xlsx.utils.sheet_to_json(table.Sheets[sheetName])
  // console.log(table.Sheets[sheetName]["!merges"])
  const dataLines = dataJson.map((obj) => ({
    car_id: obj.car_id,
    fullName: obj.fullName,
    nickName: obj.nickName,
    isKeyCar: !!obj.keyCar,
    rankLimits: [],
    star: obj.star,
  }))
  const dataBuffer = Buffer.from(JSON.stringify(dataLines))

  fs.writeFileSync(dataPath, dataBuffer)
}

//运行命令 node exportJson文件名 表名，即可导出文件

// node ./exportJson.js ./狂野飙车9生涯数据-地图.xlsx forJson

const [, , xlsxFilePath, sheetName] = process.argv

try {
  if (xlsxFilePath && sheetName) {
    exportJsonLines(xlsxFilePath, sheetName)
    console.log('执行成功')
  }
} catch (e) {
  console.log(e)
}
