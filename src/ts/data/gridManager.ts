/**
 * @file 存放格子的位置数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import Grid from './VO/Grid'


export default class GridManager {
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
    this.map = new Array<Array<Grid>>();
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
      for (let j = 0; j < this.map[i].length; j++) {
        this.map[i][j].tileX = null
        this.map[i][j].tileY = null
      }
    }
  }
}
