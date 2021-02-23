/**
 * @file 因为 js好像没有栈这种数据结构，所以这里手动实现一个
 * 用于撤回操作（先进后出）
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import Grid from './VO/Grid'

/**
 * 自定义的栈结构，主要用来维护 画布数据
 */
export default class MapStack {
  private arr: Array<{ layer: number, map: Grid[][] }>

  constructor() {
    this.arr = []
  }

  /**
   * 压栈操作
   * @param { { layer: number, map: Grid[][] }} mapInfo 
   */
  push(mapInfo: { layer: number, map: Grid[][] }): void {
    this.arr.push(mapInfo)
  }

  /**
   * 退栈操作
   */
  pop(): { layer: number; map: Grid[][] } {
    return this.arr.pop()
  }
  /**
   * 获取栈顶元素
   */
  top(): { layer: number, map: Grid[][] } {
    return this.arr[this.arr.length - 1]
  }

  /**
   * 获取栈长
   */
  size(): number {
    return this.arr.length
  }

  /**
   * 清空栈
   */
  clear(): boolean {
    this.arr = []
    return true
  }

  toString(): string {
    return this.arr.toString()
  }
}
