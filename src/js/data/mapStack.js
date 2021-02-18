/**
 * @file 因为 js好像没有栈这种数据结构，所以这里手动实现一个
 * 用于撤回操作（先进后出）
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

/**
 * 自定义的栈结构，主要用来维护 画布数据
 */
export class MapStack {
  #arr

  constructor() {
    this.#arr = []
  }

  /**
   * 压栈操作
   * @param {Object} map 
   */
  push(map) {
    this.#arr.push(map)
  }
 
  /**
   * 退栈操作
   */
  pop() {
    return this.#arr.pop()
  }
  /**
   * 获取栈顶元素
   */
  top() {
    return this.#arr[this.#arr.length - 1]
  }
  
  /**
   * 获取栈长
   */
  size() {
    return this.#arr.length
  }
  
  /**
   * 清空栈
   */
  clear() {
    this.#arr = []
    return true
  }

  toString() {
    return this.#arr.toString()
  }
}
