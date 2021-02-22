/**
 * @file 存放常用的枚举类型（利用属性模拟枚举）
 *
 * @author alsritter(alsritter1@gmail.com)
 */

/**
 * 这里主要是标识所用的工具
 */
class Tool {
  /**
   * 单笔刷
   */
  static get DRAW(): number {
    return 0
  }

  /**
   * 选区刷
   */
  static get DRAWAREA(): number {
    return 1
  }

  /**
   * 油漆桶
   */
  static get FILL(): number {
    return 2
  }

  /**
   * 橡皮擦
   */
  static get ERASE(): number {
    return 3
  }

  /**
   * 选区擦
   */
  static get ERASEAREA(): number {
    return 4
  }

  /**
   * 出生点
   */
  static get Start(): number {
    return 5
  }

  /**
   * 终点
   */
  static get END(): number {
    return 6
  }

  /**
   * 返回当前选中的工具类型
   * @param {Number} index 索引
   */
  static returnToolType(index: number): number {
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
      case 5:
        return Tool.Start
      case 6:
        return Tool.END
      default:
        return Tool.DRAW
    }
  }
}

export { Tool }
