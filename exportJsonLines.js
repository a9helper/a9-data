const xlsx = require('xlsx')
const fs = require('fs')

const toFixed = (value, num) => Number(Number(value).toFixed(num))

const handle = {
  topSpeed: (value) => Number(Number(value).toFixed(1)),
  acceleration: (value) => Number(Number(value).toFixed(2)),
  handling: (value) => Number(Number(value).toFixed(2)),
  nitro: (value) => Number(Number(value).toFixed(2)),
  nitroDuration: (value) => Number(Number(value).toFixed(2)),
  car_id: (value) => '' + value,
  overTopSpeed: (value) => Number(Number(value).toFixed(1)),
  overAcceleration: (value) => Number(Number(value).toFixed(2)),
  overHandling: (value) => Number(Number(value).toFixed(2)),
  overNitro: (value) => Number(Number(value).toFixed(2)),
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
  const dataPath = `dist/${xlsxFilePath}.${sheetName}.line.json`
  const dataJson = xlsx.utils.sheet_to_json(table.Sheets[sheetName])
  // console.log(table.Sheets[sheetName]["!merges"])
  const dataLines = dataJson
    .map((obj) => useHandle(obj, handle))
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
