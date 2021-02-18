/**
 * @file 存放常用的枚举类型（利用属性模拟枚举）
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

/**
 * 这里主要是标识所用的工具
 */
class Tool {
  /**
   * 单笔刷
   */
  static get DRAW() {
    return 0
  }

  /**
   * 选区刷
   */
  static get DRAWAREA() {
    return 1
  }

  /**
   * 油漆桶
   */
  static get FILL() {
    return 2
  }

  /**
   * 橡皮擦
   */
  static get ERASE() {
    return 3
  }

  /**
   * 选区擦
   */
  static get ERASEAREA() {
    return 4
  }

  /**
   * 返回当前选中的工具类型
   * @param {Number} index 索引
   */
  static returnToolType(index) {
    switch (index) {
      case 0:
        return Tool.DRAW
      case 1:
        return Tool.DRAWAREA
      case 2:
        return Tool.FILL
      case 3:
        return Tool.ERASE
      case 4:
        return Tool.ERASEAREA
      default:
        return Tool.DRAW
    }
  }
}

Object.freeze(Tool) // 冻结对象，防止修改

/**
 * 这里主要是标识所用的工具
 */
class Layer {
  /**
   * 单笔刷
   */
  static get BG() {
    return 0
  }

  /**
   * 选区刷
   */
  static get COLLISION() {
    return 1
  }

  /**
   * 油漆桶
   */
  static get TRAPS() {
    return 2
  }

  /**
   * 前景 foreground
   */
  static get FG() {
    return 3
  }

  /**
   * 返回当前选中的图层
   * @param {Number} index 索引
   */
  static returnToolType(index) {
    switch (index) {
      case 0:
        return Layer.BG
      case 1:
        return Layer.COLLISION
      case 2:
        return Layer.TRAPS
      case 3:
        return Layer.FG
      default:
        return Layer.BG
    }
  }
}

Object.freeze(Layer) // 冻结对象，防止修改

export { Tool,Layer }
