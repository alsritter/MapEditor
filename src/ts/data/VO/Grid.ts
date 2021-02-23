import BasePos from "./BasePos"

export default class Grid extends BasePos {
  tileX: number
  tileY: number

  /**
   * 存储一个格子的位置（左上角）
   * @param {Number} x 当前格子在 Map里面的x轴坐标
   * @param {Number} y 当前格子在 Map里面的y轴坐标
   * @param {Number | null} tileX 这个格子对应的 Tile索引
   * @param {Number | null} tileY 这个格子对应的 Tile索引
   */
  constructor(x: number, y: number, tileX: number, tileY: number) {
    super(x, y)
    this.tileX = tileX
    this.tileY = tileY
  }
}
