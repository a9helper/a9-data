const xlsx = require('xlsx')
const fs = require('fs')

const toFixed = (value, num) => Number(Number(value).toFixed(num))

const handle = {
  server: (value) => value,
  fullName: (value) => String(value).replaceAll('🔑', ''),
  car_id: (value) => value,
  brand: (value) => value,
  brandLogoImageUrl: () => '',
  nickName: (value) => value,
  keyWords: (value) => value,
  carClass: (value) => value,
  carClassOrder: (value, row) =>
    ({
      D: 10,
      C: 20,
      B: 30,
      A: 40,
      S: 50,
      R: 60,
    }[row.carClass]),
  star: (value) => Number(value),
  quality: (value) => value,
  bps: (value, row) => [
    Number(row.star_1) || 0,
    Number(row.star_2) || 0,
    Number(row.star_3) || 0,
    Number(row.star_4) || 0,
    Number(row.star_5) || 0,
    Number(row.star_6) || 0,
  ],
  isKeyCar: (value, row) => row.star_1 == '🔑',
  decals: () => [],
  decalsAnimated: () => [],
  decalsAction: () => [],
  // decalsExclusive: Decal[]  // 去掉
  bodyKit: (value, row) => Boolean(row.bodyParts),
  roadster: 1,
  // nitroVisualsCount: number // 考虑去掉
  releaseVersion: (value) => value,
  carImageUrl: () => '',
  nitroVisuals: () => [],

  rank: (value) => Number(value),
  topSpeed: (value) => Number(Number(value).toFixed(1)),
  acceleration: (value) => Number(Number(value).toFixed(2)),
  handling: (value) => Number(Number(value).toFixed(2)),
  nitro: (value) => Number(Number(value).toFixed(2)),
  nitroDuration: (value) => Number(Number(value).toFixed(2)),

  rankOC: (value, row) => Number(Number(row.overRank)),
  topSpeedOC: (value, row) => Number(Number(row.overTopSpeed).toFixed(1)),
  accelerationOC: (value, row) =>
    Number(Number(row.overAcceleration).toFixed(2)),
  handlingOC: (value, row) => Number(Number(row.overHandling).toFixed(2)),
  nitroOC: (value, row) => Number(Number(row.overNitro).toFixed(2)),
  speedNitro: (value, row) => Number(row.nitroSpeed),
  speedBlue: (value, row) => Number(row.blueSpeed),
  speedOrange: 0,
  speedPurple: 0,
  speedAir: (value, row) => Number(row.airSpeed),

  driftV: 0,
  driftT: 0,
  driftR: 0,
  floatyV: 0,
  floatyT: 0,
  floatyR: 0, // r=v*t/2pi

  stageCount: (value) => value,
  costList: [],
  stageCost: (value) => value,

  uncommonPartCost: (value) => value,
  uncommonPart: (value) => value,
  rarePart: (value) => value,
  epicPart: (value) => value,
  legendaryPart: 0,
  partCost: (value) => value,

  totalCost: (value) => value,

  getMethod: (value) => value,
  // 亮相方式不转移到车单，车单专指通行证时代的获取方式。
  // 更新：亮相方式专门开一个分类总结页面，车单只显示常驻赛事，不稳定的限时赛事自行查询。
  packLevel: (value) => value,
  storeEpic: false,
  storeClash: false,
  storeGauntlet: false,
  elite: false,
  worldLeague: false, // 隐藏车、未发布的车、未加入多人的车，赋值为null
  rewardsWorldLeague: [],
  rewardsWorldRank: false,
  rewardsClassCup: false,
  rewardsGoal: false, // 蓝牛子
  rewardsStarWay: false, // 星路
  rewardsShowRoom: false, // 国服还没有上
  rewardsHunt: false,
  rewardsMastery: false, // 限国服
  rewardsSponsor: false, // 国服还没有上
  rewardsDailyEvent: false, // SLR国服
  rewardsRoadTest: false, // FF01
  rewardsLoot: false, // 战利品
  rewardsExclusive: false, // 独家赛事
}

const copy = (obj) => JSON.parse(JSON.stringify(obj))

const useHandle = (obj, handle) => {
  let res = {}
  Object.keys(handle).forEach((key) => {
    const ForV = handle[key]
    if (typeof ForV === 'function') {
      res[key] = ForV(obj[key], obj)
    } else {
      res[key] = copy(ForV)
    }
    // res[key] = handle[key](obj[key], obj)
  })
  return res
}

const exportJsonLines = (xlsxFilePath, sheetName, server) => {
  const table = xlsx.readFile(xlsxFilePath)
  const dataPath = `dist/unite.${xlsxFilePath}.${sheetName}.line.json`
  const dataJson = xlsx.utils.sheet_to_json(table.Sheets[sheetName])
  // console.log(table.Sheets[sheetName]["!merges"])
  const dataLines = dataJson
    .map((obj) => useHandle({ server, ...obj }, handle))
    .map((dataItem) => JSON.stringify(dataItem))
    .join('\n')
  const dataBuffer = Buffer.from(dataLines)

  fs.writeFileSync(dataPath, dataBuffer)
}

//运行命令 node exportJsonLines 文件名 表名，即可导出文件

// node ./exportJsonLines.js ./狂野飙车9生涯数据-地图.xlsx forJson

const [, , xlsxFilePath, sheetName, server] = process.argv

try {
  if (xlsxFilePath && sheetName) {
    exportJsonLines(xlsxFilePath, sheetName, server)
    console.log('执行成功')
  }
} catch (e) {
  console.log(e)
}
