/**
 * @file 维护一个缓存表，主要用来监听变化，使刷新时只需局部更新
 *
 * 虽然可以通过记录移动的上一个位置来指定更新哪里，但是遇到油漆桶
 * 选区笔这类特殊的变更多个格子的工具上面那种方法就不合适了，所以
 * 这里维护一个 cache 表，不管是什么工具都是需要先修改这个缓存表
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import BasePos from "./VO/BasePos";

export default class CacheMap {
  private cols: number;
  private rows: number;
  private map: boolean[][];

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;

    this.map = [];

    // 每个数组都需要先初始化 默认是 false
    for (let i = 0; i < rows; i++) {
      const temp: boolean[] = [];
      for (let j = 0; j < cols; j++) {
        temp.push(false);
      }
      this.map.push(temp);
    }
  }

  /**
   * 返回被修改的位置
   * @returns {ModifiedPos[]} 里面是被修改的位置，需要被更新
   */
  getChange(): BasePos[] {
    const list: BasePos[] = [];

    // 如果有被修改的则把这个位置添加到 List 里面
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.map[i][j]) {
          list.push(new BasePos(i, j));
        }
      }
    }

    return list;
  }

  /**
   * 标识这个地方被修改了
   * @param x 被修改的 x 坐标
   * @param y 被修改的 y 坐标
   */
  setChange(x: number, y: number): void {
    this.map[x][y] = true;
  }

  /**
   * 全部改变
   */
  setAllChange(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.map[i][j] = true;
      }
    }
  }

  /**
   * 当更新完成之后要归零
   */
  cleanChange(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.map[i][j] = false;
      }
    }
  }
}
