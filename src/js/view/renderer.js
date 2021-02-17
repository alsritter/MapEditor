/**
 * @file 渲染绘制，这里并不是完全的数据和渲染分离，但是懒得抽象了
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

import { TileManager } from '../data/TileManager.js'
import { GridManager } from '../data/gridManager.js'
import { DrawTools } from './drawTools.js'

export class RendererTools {
  /**
   * 基本修改了页面数据都需要调用这个刷新
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
  static baseRenderer(
    ctx,
    space,
    canvas,
    rows,
    cols,
    tileManager,
    gridManager,
    tileX,
    tileY,
    posX,
    posY
  ) {
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
    RendererTools.baseRenderer(
      ctx,
      space,
      canvas,
      rows,
      cols,
      tileManager,
      gridManager,
      tileX,
      tileY,
      posX,
      posY
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

    RendererTools.baseRenderer(
      ctx,
      space,
      canvas,
      rows,
      cols,
      tileManager,
      gridManager,
      tileX,
      tileY,
      posX,
      posY
    )
  }

  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，选区刷还需
   * 要把数据存起来，这里需要加个判断，如果起点大于终点的
   * 位置则不刷新的格子
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
   * @param {Number} startPosX 画布上的方块的起点索引
   * @param {Number} startPosY 画布上的方块的起点索引
   * @param {Number} endPosX 画布上的方块的当前索引
   * @param {Number} endPosy 画布上的方块的当前索引
   */
  static areaDownBrush(
    ctx,
    canvas,
    space,
    rows,
    cols,
    gridManager,
    tileManager,
    tileX,
    tileY,
    startPosX,
    startPosY,
    endPosX,
    endPosy
  ) {
    // 如果起点大于终点的位置则不刷新的格子
    if (startPosX > endPosX || startPosY > endPosy) {
      // 绘制网格
      DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)
      // 绘制 Map 里面已有的 Tile
      DrawTools.drawMapTile(ctx, tileManager, gridManager, space)
      return
    }

    // 将当前选中的格子存储起来
    for (let i = startPosX; i <= endPosX; i++) {
      for (let j = startPosY; j <= endPosy; j++) {
        gridManager.getGrid(i, j).tileX = tileX
        gridManager.getGrid(i, j).tileY = tileY
      }
    }

    RendererTools.baseRenderer(
      ctx,
      space,
      canvas,
      rows,
      cols,
      tileManager,
      gridManager,
      tileX,
      tileY,
      endPosX,
      endPosy
    )
  }

  /**
   * 填充当前画布
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
   */
  static fillDownBrush(
    ctx,
    canvas,
    space,
    rows,
    cols,
    gridManager,
    tileManager,
    tileX,
    tileY
  ) {
    // 将当前选中的格子存储起来
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        gridManager.getGrid(i, j).tileX = tileX
        gridManager.getGrid(i, j).tileY = tileY
      }
    }

    // 绘制网格
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)
    // 绘制 Map 里面已有的 Tile
    DrawTools.drawMapTile(ctx, tileManager, gridManager, space)
  }
}
