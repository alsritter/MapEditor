/**
 * @file 保存 Tile 在图中的位置
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

/**
 * 单个 Tile 在图片的位置
 */
class Tile {
  /**
   * Tile 在贴图里面的位置，以及保存它的路径偏移量（贴图位置和路径偏移量无关，后者是保存它显示在屏幕的位置）
   * @param {Number} x Tile 在贴图里的起始 x
   * @param {Number} y Tile 在贴图里的起始 y
   * @param {Boolean}} isEmpty 是否是空的
   */
  constructor(x, y, isEmpty) {
    this.x = x
    this.y = y
    this.isEmpty = isEmpty
  }
}

/**
 * TileImage 里面的 Tile
 */
export class TileManager {
  // 使用 # 号可以标识私有变量
  #cols
  #rows
  #img
  #tileMap
  #sWidth
  #sHeight

  /**
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context 用于检测图像是否是空的
   * @param {Number} cols Tile贴图的宽度（一列有多少个 Tile）
   * @param {Number} rows Tile贴图的高度（一行有多少个 Tile）
   * @param {HTMLImageElement} img 这里传入的 Tile 贴图，必须放在 onload 里面执行
   */
  constructor(ctx, cols, rows, img) {
    this.#cols = cols
    this.#rows = rows
    this.#img = img

    this.#tileMap = []
    this.#sWidth = 0 // 每个单元格的宽度
    this.#sHeight = 0 // 每个单元格的高度

    this.#sWidth = this.#img.width / this.#cols // 切图的宽度
    this.#sHeight = this.#img.height / this.#rows // 切图的高度

    for (let col = 0; col < this.#cols; col++) {
      let temp = []
      for (let row = 0; row < this.#rows; row++) {
        // 还要判断当前的图是否是空的
        let tempX = row * this.#sHeight
        let tempY = col * this.#sWidth
        temp.push(
          new Tile(
            tempX,
            tempY,
            this.#tileIsEmpty(ctx, img, tempX, tempY, this.#sWidth)
          )
        )
      }
      this.#tileMap.push(temp)
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context 用于检测图像是否是空的
   * @param {HTMLImageElement} img 这里传入的 Tile 贴图，必须放在 onload 里面执行
   * @param {Number} x 起点x
   * @param {Number} y 起点y
   * @param {Number} space 大小
   * @returns {Boolean} true 表示是空的
   */
  #tileIsEmpty(ctx, img, x, y, space) {
    // 清除画布
    ctx.clearRect(0, 0, space, space)
    // 图片绘制在画布上
    ctx.drawImage(img, x, y, space, space, 0, 0, space, space)
    // 获取图片像素信息
    let imageData = ctx.getImageData(0, 0, space, space).data
    // 只要超过 三分之一的内容就表示当前图像不是空的（因为是 RGBA 所以需要除 4）
    let imageLength = Math.floor(Math.floor(imageData.length / 4))
    let temp = 0

    for (let index = 3; index < imageData.length; index += 4) {
      if (imageData[index] > 0) {
        temp += 1
      }
    }

    return temp < Math.floor(imageLength / 10)
  }

  /**
   * @returns {Number} 返回 cols
   */
  getCols() {
    return this.#cols
  }

  /**
   * @returns {Number} 返回 rows
   */
  getRows() {
    return this.#rows
  }

  /**
   *
   * @param {Number} x Tile 的索引
   * @param {Number} y Tile 的索引
   * @returns {Tile} 返回 index 执行的 Tile
   */
  getTile(x, y) {
    return this.#tileMap[x][y]
  }

  /**
   * @returns {HTMLImageElement} 返回 Image
   */
  getImage() {
    return this.#img
  }

  /**
   * @returns {Number} 返回 Tile的高度
   */
  getHeight() {
    return this.#sHeight
  }

  /**
   * @returns {Number} 返回 Tile的宽度
   */
  getWidth() {
    return this.#sWidth
  }
}
