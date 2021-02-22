/**
 * @file 渲染绘制，这里只负责渲染数据，不负责刷新数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import { TileManager } from '../data/TileManager'
import { GridManager, StartAndEndPos } from '../data/gridManager'
import { DrawTools } from './drawTools'
import { CacheMap, ModifiedPos } from '../data/cacheMap'

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
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
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
    flag: StartAndEndPos,
    cacheMap: CacheMap
  ): void {
    // 局部刷新
    const modif = cacheMap.getChange()

    DrawTools.drawGrid(ctx, space, canvas.width, space * rows, cols, rows)

    for (let i = 0; i < modif.length; i++) {
      // 先清空指定的位置
      DrawTools.clearTile(
        ctx,
        space,
        gridManagerArray[layer].getGrid(modif[i].x, modif[i].y).x,
        gridManagerArray[layer].getGrid(modif[i].x, modif[i].y).y
      )

      // 如果显示全部图层则，遍历刷新每一层的这个位置
      if (showAll) {
        for (let j = 0; j < gridManagerArray.length; j++) {
          RendererTools.changeTile(
            gridManagerArray,
            j,
            modif,
            i,
            tileManager,
            ctx,
            space
          )
        }
      } else {
        // 绘制 Map 里面已有的 Tile
        RendererTools.changeTile(
          gridManagerArray,
          layer,
          modif,
          i,
          tileManager,
          ctx,
          space
        )
      }
    }

    // 更新完成后要归零
    cacheMap.cleanChange()

    RendererTools.drawStartAndEnd(
      ctx,
      space,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).x,
      gridManagerArray[0].getGrid(flag.start.x, flag.start.y).y,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).x,
      gridManagerArray[0].getGrid(flag.end.x, flag.end.y).y
    )
  }

  /**
   * 修改指定位置的 Tile
   * @param gridManagerArray
   * @param layer
   * @param modif
   * @param index
   * @param tileManager
   * @param ctx
   * @param space
   */
  private static changeTile(
    gridManagerArray: GridManager[],
    layer: number,
    modif: ModifiedPos[],
    index: number,
    tileManager: TileManager,
    ctx: CanvasRenderingContext2D,
    space: number
  ): void {
    // 如果还是 null 或者为空的则直接跳过
    if (
      gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileX !=
        null &&
      gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileY !=
        null &&
      !DrawTools.isEmpty(
        tileManager,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileX,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileY
      ) // 这个判断得放在后面
    ) {
      DrawTools.drawTile(
        ctx,
        tileManager,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileX,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).tileY,
        space,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).x,
        gridManagerArray[layer].getGrid(modif[index].x, modif[index].y).y
      )
    }
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
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
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
    flag: StartAndEndPos,
    cacheMap: CacheMap
  ): void {
    RendererTools.refresh(
      ctx,
      canvas,
      space,
      rows,
      cols,
      gridManagerArray,
      layer,
      showAll,
      tileManager,
      flag,
      cacheMap
    )

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

    // 绘制阴影
    DrawTools.drawDark(
      ctx,
      space,
      gridManagerArray[layer].getGrid(posX, posY).x,
      gridManagerArray[layer].getGrid(posX, posY).y
    )

    // 绘制阴影也需要更新 cache
    cacheMap.setChange(posX, posY)
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
   * @param {CacheMap} cacheMap 缓存表标识哪块地方发生的变化
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
    flag: StartAndEndPos,
    cacheMap: CacheMap
  ): void {
    RendererTools.refresh(
      ctx,
      canvas,
      space,
      rows,
      cols,
      gridManagerArray,
      layer,
      showAll,
      tileManager,
      flag,
      cacheMap
    )

    // 绘制阴影
    DrawTools.drawDark(
      ctx,
      space,
      gridManagerArray[layer].getGrid(posX, posY).x,
      gridManagerArray[layer].getGrid(posX, posY).y
    )

    // 绘制阴影也需要更新 cache
    cacheMap.setChange(posX, posY)
  }
}
