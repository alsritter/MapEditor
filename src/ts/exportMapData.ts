/**
 * @file 用于导出数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

// import { getMapData, getStartAndEndPos } from "./canvasController";
import BasePos from "./data/VO/BasePos";
import GridManager from "../ts/data/gridManager";
import StartAndEndPos from "../ts/data/VO/StartAndEndPos";

/**
 * 输出的结构应该是由全部所使用到的图块数据，以及下面几层都是引用这个图块的索引
 */

/**
 * 导出数据
 * @param gridManagerArray 地图数据
 * @param startAndEndPos 起点和终点
 * @param imageColsSize 图片一行的格子
 * @param imageRowsSize 图片一列的格子
 */
export function exportData(
  gridManagerArray: GridManager[],
  startAndEndPos: StartAndEndPos,
  imageColsSize: number,
  imageRowsSize: number
): void {
  const maps = gridManagerArray;

  const layerData: number[][][] = [];

  // 存储用到了哪些图块，方便 Unity 一开始就生成好对应的 Sprite

  // TODO: 注意！！第一个格子是空子，Unity 读取它的时候需要忽略第一个格子
  const spritePos = [new BasePos(0, 0)]; // 默认创建一个

  // 第一层遍历是取得各个图层的数据
  for (let i = 0; i < maps.length; i++) {
    const tempMap = maps[i].getClone();

    const yMap: number[][] = [];
    // 这里两层 for 是遍历 Map 取得数据
    for (let j = 0; j < tempMap.length; j++) {
      const xMap: number[] = [];

      for (let k = 0; k < tempMap[j].length; k++) {
        tempMap[j][k].tileX =
          tempMap[j][k].tileX == null ? 0 : tempMap[j][k].tileX;
        tempMap[j][k].tileY =
          tempMap[j][k].tileY == null ? 0 : tempMap[j][k].tileY;

        // 标识图块索引
        let pTemp = 0;
        let isExist = false; //标识是否存在

        // 判断当前是否存在这个 spritePos 存在则直接返回这个索引，否则先创建了再返回索引
        for (let p = 0; p < spritePos.length; p++) {
          if (
            spritePos[p].x == tempMap[j][k].tileX &&
            spritePos[p].y == tempMap[j][k].tileY
          ) {
            pTemp = p;
            isExist = true;
            break;
          }
        }

        if (!isExist) {
          spritePos.push(
            new BasePos(tempMap[j][k].tileX!, tempMap[j][k].tileY!)
          );
          pTemp = spritePos.length - 1; // 数组长度减一表示最后一个
          isExist = false; // 重置
        }

        xMap.push(pTemp);
      }
      yMap.push(xMap);
    }
    layerData.push(yMap);
  }

  const data = {
    image: {
      cols: imageColsSize,
      rows: imageRowsSize
    },
    start: {
      x: startAndEndPos.start.x,
      y: startAndEndPos.start.y
    },
    end: {
      x: startAndEndPos.end.x,
      y: startAndEndPos.end.y
    },
    sprites: spritePos,
    background: layerData[0],
    collision: layerData[1],
    traps: layerData[2],
    foreground: layerData[3]
  };

  const content = JSON.stringify(data);
  const eleLink = document.createElement("a");
  // 给这个文件设置一个不同的文件名后缀
  eleLink.download = "mapData.mapdata";
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}
