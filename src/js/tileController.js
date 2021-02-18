/**
 * @file 取色器区域的控制器
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

import { DrawTools } from './view/drawTools.js'
import { GridManager } from './data/gridManager.js'
import { TileManager } from './data/TileManager.js'
import { drawCanvas } from './canvasController.js'
import { exportData } from './exportMapData.js'

/**
 * Tile 的索引
 */
class TileIndex {
  constructor() {
    this.x = 0
    this.y = 0
  }
}

const _tileIndex = new TileIndex()
let _tileManager // 需要把这个传递出去，所以这里需要提升到全局



function drawTiles() {
  // 先绘制网格
  const canvas = document.getElementById('tileCanvas')
  const img = new Image()
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height

    const _cols = 16
    const _rows = 16

    // 先获取每个图形格子的大小
    const _space = img.width / _cols

    let ctx = canvas.getContext('2d')
    const gridManager = new GridManager(_space, _cols, _rows)
    _tileManager = new TileManager(ctx, _cols, _rows, img)

    DrawTools.drawBackground(ctx, canvas.width, canvas.height)
    DrawTools.drawAllTile(ctx, _tileManager, gridManager, _space)

    // 根据鼠标点击取得格子
    canvas.onmousedown = (e) => {
      let temp = gridManager.getGrid(
        Math.floor(e.offsetY / _space),
        Math.floor(e.offsetX / _space)
      )
      DrawTools.drawDark(ctx, _space, temp.x, temp.y)

      // 修改下当前选中的 Tile的索引
      _tileIndex.x = Math.floor(e.offsetY / _space)
      _tileIndex.y = Math.floor(e.offsetX / _space)
    }

    canvas.onmouseup = (e) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      DrawTools.drawBackground(ctx, canvas.width, canvas.height)
      DrawTools.drawAllTile(ctx, _tileManager, gridManager, _space)
    }

    // 等待取色器执行完成再执行这块
    drawCanvas()
    // 等待上面的画布加载完成才能导出数据
    exportData()
  }

  img.src = './src/img/tiles.png'
}

window.addEventListener('load', drawTiles, false)

/**
 * 用来传递当前取色器取到的格子给下面的画布
 *
 * @returns {TileIndex} 返回 TileIndex
 */
export function getTileIndex() {
  return _tileIndex
}

/**
 * 用来传递当前的TileManager
 *
 * @returns {TileManager} 返回 TileManager
 */
export function getTileManage() {
  return _tileManager
}
