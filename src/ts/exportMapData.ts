import { getMapData } from './canvasController'

class Pos {

  tileX: number
  tileY: number

  constructor(tileX: number, tileY: number) {
    this.tileX = tileX
    this.tileY = tileY
  }
}

/**
 * 输出的结构应该是由全部所使用到的图块数据，以及下面几层都是引用这个图块的索引
 */
export function exportData(): void {
  const exportButton = document.getElementById('exportData') as HTMLButtonElement
  exportButton.onclick = () => {
    const maps = getMapData()

    const layerData: number[][][] = []

    // 存储用到了哪些图块，方便 Unity 一开始就生成好对应的 Sprite

    // TODO: 注意！！第一个格子是空子，Unity 读取它的时候需要忽略第一个格子
    const spritePos = [new Pos(0, 0)] // 默认创建一个

    // 第一层遍历是取得各个图层的数据
    for (let i = 0; i < maps.length; i++) {
      const tempMap = maps[i].getClone()

      const y_map: number[][] = []
      // 这里两层 for 是遍历 Map 取得数据 
      for (let j = 0; j < tempMap.length; j++) {

        const x_map: number[] = []

        for (let k = 0; k < tempMap[j].length; k++) {

          tempMap[j][k].tileX = tempMap[j][k].tileX == null ? 0 : tempMap[j][k].tileX
          tempMap[j][k].tileY = tempMap[j][k].tileY == null ? 0 : tempMap[j][k].tileY


          // 标识图块索引
          let p_temp = 0
          let isExist = false //标识是否存在

          // 判断当前是否存在这个 spritePos 存在则直接返回这个索引，否则先创建了再返回索引
          for (let p = 0; p < spritePos.length; p++) {
            if (
              spritePos[p].tileX == tempMap[j][k].tileX &&
              spritePos[p].tileY == tempMap[j][k].tileY
            ) {
              p_temp = p
              isExist = true
              break
            }
          }

          if (!isExist) {
            spritePos.push(new Pos(tempMap[j][k].tileX, tempMap[j][k].tileY))
            p_temp = spritePos.length - 1 // 数组长度减一表示最后一个
            isExist = false // 重置
          }

          x_map.push(p_temp)
        }
        y_map.push(x_map)
      }
      layerData.push(y_map)
    }

    const data = {
      sprites: spritePos,
      background: layerData[0],
      collision: layerData[1],
      traps: layerData[2],
      foreground: layerData[3]
    }

    console.log(data)

    const content = JSON.stringify(data)
    const eleLink = document.createElement('a')
    eleLink.download = 'mapData.json'
    eleLink.style.display = 'none'

    // 字符内容转变成blob地址
    const blob = new Blob([content])
    eleLink.href = URL.createObjectURL(blob)
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    document.body.removeChild(eleLink)
  }
}
