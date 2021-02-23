import BasePos from './BasePos'

/**
 * 单个 Tile 在图片的位置
 */
export default class Tile extends BasePos {
  x: number
  y: number
  isEmpty: boolean

  /**
   * Tile 在贴图里面的位置，以及保存它的路径偏移量（贴图位置和路径偏移量无关，后者是保存它显示在屏幕的位置）
   * @param {Number} x Tile 在贴图里的起始 x
   * @param {Number} y Tile 在贴图里的起始 y
   * @param {Boolean}} isEmpty 是否是空的
   */
  constructor(x: number, y: number, isEmpty: boolean) {
    super(x, y)
    this.isEmpty = isEmpty
  }
}
