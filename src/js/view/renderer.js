/**
 * @file 渲染绘制
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

import { TileManager } from '../data/TileManager.js'
import { GridManager } from '../data/gridManager.js'
import { DrawTools } from './drawTools.js'

export class RendererTools {
  /**
   * 鼠标在画布上拖动时（未点击）实时刷新页面，单笔刷
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLElement} canvas
   * @param {Number} space
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager} gridManager
   * @param {TileManager} tileManager
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   */
  static singleNotDownBrush(
    ctx,
    canvas,
    space,
    rows,
    cols,
    gridManager,
    tileManager,
    tileX,
    tileY,
    posX,
    posY
  ) {
    // 绘制网格
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    // 绘制 Map 里面已有的 Tile
    DrawTools.drawMapTile(ctx, tileManager, gridManager, space)
    // 显示当前选中的 Tile
    DrawTools.drawTile(
      ctx,
      tileManager,
      tileX,
      tileY,
      space,
      gridManager.getGrid(posX, posY).x,
      gridManager.getGrid(posX, posY).y
    )
    // 绘制阴影
    DrawTools.drawDarkTile(
      ctx,
      space,
      gridManager.getGrid(posX, posY).x,
      gridManager.getGrid(posX, posY).y
    )
  }

  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，单笔刷
   * 还需要把数据存起来
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLElement} canvas
   * @param {Number} space
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager} gridManager
   * @param {TileManager} tileManager
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   */
  static singleDownBrush(
    ctx,
    canvas,
    space,
    rows,
    cols,
    gridManager,
    tileManager,
    tileX,
    tileY,
    posX,
    posY
  ) {
    // 将当前选中的格子存储起来
    gridManager.getGrid(posX, posY).tileX = tileX
    gridManager.getGrid(posX, posY).tileY = tileY

    // 绘制网格
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    // 绘制 Map 里面已有的 Tile
    DrawTools.drawMapTile(ctx, tileManager, gridManager, space)
    // 显示当前选中的 Tile
    DrawTools.drawTile(
      ctx,
      tileManager,
      tileX,
      tileY,
      space,
      gridManager.getGrid(posX, posY).x,
      gridManager.getGrid(posX, posY).y
    )
  }
}
