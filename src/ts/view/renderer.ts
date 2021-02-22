/**
 * @file 渲染绘制，这里只负责渲染数据，不负责刷新数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import { TileManager } from '../data/TileManager'
import { GridManager, StartAndEndPos } from '../data/gridManager'
import { DrawTools } from './drawTools'

export class RendererTools {
  /**
   * 绘制起点和终点
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} space
   * @param {Number} b_x
   * @param {Number} b_y
   * @param {Number} e_x
   * @param {Number} e_y
   */
  private static drawStartAndEnd(
    ctx: CanvasRenderingContext2D,
    space: number,
    b_x: number,
    b_y: number,
    e_x: number,
    e_y: number
  ) {
    // 绘制起点
    DrawTools.drawColor(ctx, space, b_x, b_y, 'rgba(238, 49, 49, 0.5)')

    // 绘制终点
    DrawTools.drawColor(ctx, space, e_x, e_y, 'rgba(0, 122, 204, 0.5)')
  }

  /**
   * 基本修改了页面数据都需要调用这个刷新（不绘制选中的 Tile）
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLElement} canvas
   * @param {Number} space
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Boolean} showAll 是否显示全部图层，true 表示是
   * @param {TileManager} tileManager
   * @param {StartAndEndPos} flag 起点和终点的位置
   */
  static refresh(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    space: number,
    rows: number,
    cols: number,
    gridManagerArray: GridManager[],
    layer: number,
    showAll: boolean,
    tileManager: TileManager,
    flag: StartAndEndPos
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    // 如果显示全部图层则，遍历刷新
    if (showAll) {
      for (let i = 0; i < gridManagerArray.length; i++) {
        // 绘制 Map 里面已有的 Tile
        DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[i], space)
      }
    } else {
      // 绘制 Map 里面已有的 Tile
      DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[layer], space)
    }

    RendererTools.drawStartAndEnd(
      ctx,
      space,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).x,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).y,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).x,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).y,
    )
  }

  /**
   * 作用同上，但是会绘制选中的 Tile
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {Number} space
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager[]} gridManagerArray
   * @param {Layer} layer 当前选中的图层
   * @param {Boolean} showAll 是否显示全部图层，true 表示是
   * @param {TileManager} tileManager
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   * @param {StartAndEndPos} flag 起点和终点的位置
   */
  static refreshAndShowTile(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    space: number,
    rows: number,
    cols: number,
    gridManagerArray: GridManager[],
    layer: number,
    showAll: boolean,
    tileManager: TileManager,
    tileX: number,
    tileY: number,
    posX: number,
    posY: number,
    flag: StartAndEndPos
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    // 如果显示全部图层则，遍历刷新
    if (showAll) {
      for (let i = 0; i < gridManagerArray.length; i++) {
        // 绘制 Map 里面已有的 Tile
        DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[i], space)
      }
    } else {
      // 绘制 Map 里面已有的 Tile
      DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[layer], space)
    }

    // 显示当前选中的 Tile
    DrawTools.drawTile(
      ctx,
      tileManager,
      tileX,
      tileY,
      space,
      gridManagerArray[layer].getGrid(posX, posY).x,
      gridManagerArray[layer].getGrid(posX, posY).y
    )

    RendererTools.drawStartAndEnd(
      ctx,
      space,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).x,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).y,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).x,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).y,
    )

    // 绘制阴影
    DrawTools.drawDark(
      ctx,
      space,
      gridManagerArray[layer].getGrid(posX, posY).x,
      gridManagerArray[layer].getGrid(posX, posY).y
    )
  }

  /**
   * 作用同上，但是只绘制阴影
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {Number} space
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager[]} gridManagerArray
   * @param {Layer} layer 当前选中的图层
   * @param {Boolean} showAll 是否显示全部图层，true 表示是
   * @param {TileManager} tileManager
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   * @param {StartAndEndPos} flag 起点和终点的位置
   */
  static refreshAndShowDark(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    space: number,
    rows: number,
    cols: number,
    gridManagerArray: GridManager[],
    layer: number,
    showAll: boolean,
    tileManager: TileManager,
    posX: number,
    posY: number,
    flag: StartAndEndPos
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    // 如果显示全部图层则，遍历刷新
    if (showAll) {
      for (let i = 0; i < gridManagerArray.length; i++) {
        // 绘制 Map 里面已有的 Tile
        DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[i], space)
      }
    } else {
      // 绘制 Map 里面已有的 Tile
      DrawTools.drawMapTile(ctx, tileManager, gridManagerArray[layer], space)
    }

    RendererTools.drawStartAndEnd(
      ctx,
      space,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).x,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).y,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).x,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).y,
    )

    // 绘制阴影
    DrawTools.drawDark(
      ctx,
      space,
      gridManagerArray[layer].getGrid(posX, posY).x,
      gridManagerArray[layer].getGrid(posX, posY).y
    )
  }
}
