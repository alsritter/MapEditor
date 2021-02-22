import { getMapData } from './canvasController.js'

class Pos {
  constructor(tileX, tileY) {
    this.tileX = tileX
    this.tileY = tileY
  }
}

/**
 * 输出的结构应该是由全部所使用到的图块数据，以及下面几层都是引用这个图块的索引
 */
export function exportData() {
  const exportButton = document.getElementById('exportData')
  exportButton.onclick = (e) => {
    let maps = getMapData()

    let layerData = []

    // 存储用到了哪些图块，方便 Unity 一开始就生成好对应的 Sprite
    // TODO: 注意！！第一个格子是空子，Unity 读取它的时候需要忽略第一个格子
    let spritePos = [new Pos(0, 0)] // 默认创建一个

    // 第一层遍历是取得各个图层的数据
    for (let i = 0; i < maps.length; i++) {
      let tempMap = maps[i].getClone()

      let y_map = []
      // 这里两层 for 是遍历 Map 取得数据 
      for (let j = 0; j < tempMap.length; j++) {
        let c_temp = tempMap[j]

        let x_map = []

        for (let k = 0; k < c_temp.length; k++) {

          c_temp[k].tileX = c_temp[k].tileX == null ? 0 : c_temp[k].tileX
          c_temp[k].tileY = c_temp[k].tileY == null ? 0 : c_temp[k].tileY

         
          // 标识图块索引
          let p_temp = 0
          let isExist = false //标识是否存在

          // 判断当前是否存在这个 spritePos 存在则直接返回这个索引，否则先创建了再返回索引
          for (let p = 0; p < spritePos.length; p++) {
            if (
              spritePos[p].tileX == c_temp[k].tileX &&
              spritePos[p].tileY == c_temp[k].tileY
            ) {
              p_temp = p
              isExist = true
              break
            }
          }

          if (!isExist) {
            spritePos.push(new Pos(c_temp[k].tileX, c_temp[k].tileY))
            p_temp = spritePos.length - 1 // 数组长度减一表示最后一个
            isExist = false // 重置
          }

          x_map.push(p_temp)
        }
        y_map.push(x_map)
      }
      layerData.push(y_map)
    }

    let data = {
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
    let blob = new Blob([content])
    eleLink.href = URL.createObjectURL(blob)
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    document.body.removeChild(eleLink)
  }
}
