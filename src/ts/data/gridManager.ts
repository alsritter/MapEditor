/**
 * @file 存放格子的位置数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

export class Grid {

  x: number
  y: number
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
    this.x = x
    this.y = y
    this.tileX = tileX
    this.tileY = tileY
  }
}

// 存储的 Map 示意图
// let map = [
//   [ 0,  4,  8,  4,  8, 12],
//   [ 1,  5,  9,  5,  9, 13],
//   [13,  6, 10,  6, 10, 14],
//   [ 2,  5,  9,  5,  9, 14],
//   [13,  6, 10,  6, 10, 13],
//   [ 3,  7, 11,  4,  8, 15]
// ];

export class GridManager {
  private map: Grid[][]
  private cols: number
  private rows: number

  /**
   *
   * @param {Number} space 一个格子的大小
   * @param {Number} cols 一行有多少个格子
   * @param {Number} rows 一列一多少个格子
   */
  constructor(space: number, cols: number, rows: number) {
    // 先初始化 Map
    this.map  = new Array<Array<Grid>>();
    this.cols = cols
    this.rows = rows

    for (let i = 0; i < rows; i++) {
      const temp = []
      for (let j = 0; j < cols; j++) {
        // 初始化先赋值为 null
        temp.push(new Grid(j * space, i * space, null, null))
      }
      this.map.push(temp)
    }
  }

  /**
   * 获取 Grid
   *
   * @param {Number} x 一行的第几个格子
   * @param {Number} y 一列的第几个格子
   * @returns {Grid} 返回 Grid
   */
  getGrid(x: number, y: number): Grid {
    return this.map[x][y]
  }

  /**
   * @returns {Number} 返回 Cols
   */
  getColNum(): number {
    return this.cols
  }

  /**
   * @returns {Number} 返回 Rows
   */
  getRowNum(): number {
    return this.rows
  }

  /**
   * 深拷贝数据
   * @returns {Grid[][]} 返回克隆的 Map
   */
  getClone(): Grid[][] {
    return JSON.parse(JSON.stringify(this.map))
  }

  /**
   * 修改当前的 Map
   * @param {Grid[][]} newMap
   */
  setMap(newMap: Grid[][]): void {
    this.map = newMap
  }

  /**
   * 清空当前画布
   */
  cleanMap(): void {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j <  this.map[i].length; j++) {
        this.map[i][j].tileX = null
        this.map[i][j].tileY = null
      }
    }
  }
}
