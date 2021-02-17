/**
 * @file 存放绘制工具
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import { GridManager } from '../data/gridManager.js'
import { TileManager } from '../data/TileManager.js'

export class DrawTools {
  /**
   * 绘制网格
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {Number} space 一个格子的大小
   * @param {Number} width 画布的宽度
   * @param {Number} height 画布的高度
   * @param {Number} gridWithSize 一行多少个格子
   * @param {Number} gridHeightSize 一列有多少个格子
   */
  static drawGrid(ctx, space, width, height, gridWithSize, gridHeightSize) {
    // 采用遍历的方式，绘画x轴的线条
    for (let i = 0; i < gridWithSize; i++) {
      ctx.beginPath() // 开启路径，设置不同的样式
      ctx.moveTo(space * i - 0.5, 0) // -0.5是为了解决像素模糊问题
      ctx.lineTo(space * i - 0.5, height)
      ctx.setLineDash([1, 2]) //绘制虚线
      ctx.strokeStyle = '#2a2a2a' // 设置每个线条的颜色
      ctx.stroke()
    }

    // 同理y轴
    for (let i = 0; i < gridHeightSize; i++) {
      ctx.beginPath() // 开启路径，设置不同的样式
      ctx.moveTo(0, space * i - 0.5)
      ctx.lineTo(width, space * i - 0.5)
      ctx.strokeStyle = '#2a2a2a'
      ctx.stroke()
    }
  }

  /**
   * 让指定的位置变暗
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {Number} space 一个格子的大小
   * @param {Number} x 绘制目的地的 x
   * @param {Number} y 绘制目的地的 y
   */
  static drawDarkTile(ctx, space, x, y) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.rect(x, y, space, space)
    ctx.fill()
    ctx.closePath()
  }

  /**
   * 在指定位置绘制一个 Tile 注意这个 X Y 是以这个 ctx 为原点的
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {TileManager} map 传入 TileManager
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} space 一个格子的大小
   * @param {Number} x 绘制目的地的 x
   * @param {Number} y 绘制目的地的 y
   */
  static drawTile(ctx, map, tileX, tileY, space, x, y) {
    ctx.drawImage(
      map.getImage(),
      map.getTile(tileX, tileY).x,
      map.getTile(tileX, tileY).y,
      map.getWidth(),
      map.getHeight(),
      x,
      y,
      space,
      space
    )
  }

  /**
   * 绘制背景方格
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {Number} width 画布的宽度
   * @param {Number} height 画布的高度
   */
  static drawBackground(ctx, width, height) {
    let emptyBox = ctx.createImageData(width, height)
    let emptyBoxData = emptyBox.data

    // 通过 canvas宽高 来遍历一下 canvas 上的所有像素点
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let point = (i * width + j) << 2 // << 相当于 * 4
        let rgbData = ((i >> 2) + (j >> 2)) & (1 == 1) ? 204 : 255 // >> 2 相当于 / 4 取整， & 1相当于 % 2
        emptyBoxData[point] = rgbData
        emptyBoxData[point + 1] = rgbData
        emptyBoxData[point + 2] = rgbData
        emptyBoxData[point + 3] = 255
      }
    }

    ctx.putImageData(emptyBox, 0, 0)
  }

  /**
   * 绘制 pos 里面存储的 Tile
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {TileManager} map 传入 TileManager
   * @param {GridManager} pos 传入 位置列表
   * @param {Number} space 一个格子的大小
   */
  static drawMapTile(ctx, map, pos, space) {
    for (let i = 0; i < pos.getRowNum(); i++) {
      for (let j = 0; j < pos.getColNum(); j++) {
        // 如果还是 null 则直接跳过
        if (
          pos.getGrid(i, j).tileX != null &&
          pos.getGrid(i, j).tileY != null
        ) {
          DrawTools.drawTile(
            ctx,
            map,
            pos.getGrid(i, j).tileX,
            pos.getGrid(i, j).tileY,
            space,
            pos.getGrid(i, j).x,
            pos.getGrid(i, j).y
          )
        }
      }
    }
  }

  /**
   * 绘制 Map里面的全部 Tile
   *
   * @param {CanvasRenderingContext2D} ctx 传入 canvas 的 Context
   * @param {TileManager} map 传入 TileManager
   * @param {GridManager} pos 传入 位置列表
   * @param {Number} space 一个格子的大小
   */
  static drawAllTile(ctx, map, pos, space) {
    for (let i = 0; i < map.getCols(); i++) {
      for (let j = 0; j < map.getRows(); j++) {
        DrawTools.drawTile(
          ctx,
          map,
          i,
          j,
          space,
          pos.getGrid(i, j).x,
          pos.getGrid(i, j).y
        )
      }
    }
  }
}
