/**
 * @file 笔刷工具，这里主要用来修改数据并调用渲染工具
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import GridManager from './gridManager'
import TileManager from './TileManager'
import CacheMap from './cacheMap'
import StartAndEndPos from './VO/StartAndEndPos'

export default class BrushTools {
  /**
   * 设置出生点的位置
   *
   * @param {Number} posX 画布上的方块的索引（注意只是索引，并不是坐标）
   * @param {Number} posY 画布上的方块的索引
   * @param {StartAndEndPos} flag 出生点
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static setStartPosition(
    posX: number,
    posY: number,
    flag: StartAndEndPos,
    cacheMap: CacheMap
  ): void {
    flag.start.x = posX
    flag.start.y = posY

    // 这个设置一个点的比较特殊，需要更新全部（因为这个点完后，之前位置的颜色就没了）

    // cacheMap.setChange(posX, posY)
    cacheMap.setAllChange()
  }

  /**
   * 设置终点的位置
   *
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   * @param {StartAndEndPos} flag 结束点
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static setEndPosition(
    posX: number,
    posY: number,
    flag: StartAndEndPos,
    cacheMap: CacheMap
  ): void {
    flag.end.x = posX
    flag.end.y = posY

    cacheMap.setAllChange()
  }

  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，单笔刷
   * 还需要把数据存起来
   *
   * @param {GridManager[]} gridManagerArray
   * @param {TileManager} tileManager 用于判断当前是否是空的
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static singleDownBrush(
    gridManagerArray: GridManager[],
    tileManager: TileManager,
    layer: number,
    tileX: number,
    tileY: number,
    posX: number,
    posY: number,
    cacheMap: CacheMap
  ): void {
    if (tileManager.isEmpty(tileX, tileY)) return

    // 将当前选中的格子存储起来
    gridManagerArray[layer].getGrid(posX, posY).tileX = tileX
    gridManagerArray[layer].getGrid(posX, posY).tileY = tileY

    // 同时通知 cacheMap 更新
    cacheMap.setChange(posX, posY)
  }

  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，选区刷还需
   * 要把数据存起来，这里需要加个判断，如果起点大于终点的
   * 位置则不刷新的格子
   *
   * @param {GridManager[]} gridManagerArray
   * @param {TileManager} tileManager 用于判断当前是否是空的
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} startPosX 画布上的方块的起点索引
   * @param {Number} startPosY 画布上的方块的起点索引
   * @param {Number} endPosX 画布上的方块的当前索引
   * @param {Number} endPosy 画布上的方块的当前索引
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static areaDownBrush(
    gridManagerArray: GridManager[],
    tileManager: TileManager,
    layer: number,
    tileX: number,
    tileY: number,
    startPosX: number,
    startPosY: number,
    endPosX: number,
    endPosY: number,
    cacheMap: CacheMap
  ): void {
    if (tileManager.isEmpty(tileX, tileY)) return

    let maxPosX: number
    let minPosX: number
    let maxPosY: number
    let minPosY: number

    if (startPosX > endPosX) {
      maxPosX = startPosX
      minPosX = endPosX
    } else {
      maxPosX = endPosX
      minPosX = startPosX
    }

    if (startPosY > endPosY) {
      maxPosY = startPosY
      minPosY = endPosY
    } else {
      maxPosY = endPosY
      minPosY = startPosY
    }

    // 将当前选中的格子存储起来
    for (let i = minPosX; i <= maxPosX; i++) {
      for (let j = minPosY; j <= maxPosY; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = tileX
        gridManagerArray[layer].getGrid(i, j).tileY = tileY
        // 同时通知 cacheMap 更新
        cacheMap.setChange(i, j)
      }
    }
  }

  /**
   * 填充当前画布
   *
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager[]} gridManagerArray
   * @param {TileManager} tileManager 用于判断当前是否是空的
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static fillDownBrush(
    rows: number,
    cols: number,
    gridManagerArray: GridManager[],
    tileManager: TileManager,
    layer: number,
    tileX: number,
    tileY: number,
    cacheMap: CacheMap
  ): void {
    if (tileManager.isEmpty(tileX, tileY)) return

    // 将当前选中的格子存储起来
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = tileX
        gridManagerArray[layer].getGrid(i, j).tileY = tileY
        // 同时通知 cacheMap 更新
        cacheMap.setChange(i, j)
      }
    }
  }

  /**
   * 将当前选中的格子设置为 null
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static Erase(
    gridManagerArray: GridManager[],
    layer: number,
    posX: number,
    posY: number,
    cacheMap: CacheMap
  ): void {
    gridManagerArray[layer].getGrid(posX, posY).tileX = null
    gridManagerArray[layer].getGrid(posX, posY).tileY = null
    // 同时通知 cacheMap 更新
    cacheMap.setChange(posX, posY)
  }

  /**
   * 将当前选中的区域设置为 null
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} startPosX 画布上的方块的起点索引
   * @param {Number} startPosY 画布上的方块的起点索引
   * @param {Number} endPosX 画布上的方块的当前索引
   * @param {Number} endPosy 画布上的方块的当前索引
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
   */
  static areaErase(
    gridManagerArray: GridManager[],
    layer: number,
    startPosX: number,
    startPosY: number,
    endPosX: number,
    endPosY: number,
    cacheMap: CacheMap
  ): void {
    let maxPosX: number
    let minPosX: number
    let maxPosY: number
    let minPosY: number

    if (startPosX > endPosX) {
      maxPosX = startPosX
      minPosX = endPosX
    } else {
      maxPosX = endPosX
      minPosX = startPosX
    }

    if (startPosY > endPosY) {
      maxPosY = startPosY
      minPosY = endPosY
    } else {
      maxPosY = endPosY
      minPosY = startPosY
    }

    // 将当前选中的格子存储起来
    for (let i = minPosX; i <= maxPosX; i++) {
      for (let j = minPosY; j <= maxPosY; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = null
        gridManagerArray[layer].getGrid(i, j).tileY = null
        // 同时通知 cacheMap 更新
        cacheMap.setChange(i, j)
      }
    }
  }
}
