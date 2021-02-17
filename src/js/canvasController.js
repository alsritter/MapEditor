/**
 * @file 画布区域的控制器，这个需要等待 tileController 执行完后再执行，
 * 所以将这个 Controller 暴露出去让 tileController 执行
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

import { DrawTools } from './view/drawTools.js'
import { GridManager } from './data/gridManager.js'
import { getTileIndex, getTileManage } from './tileController.js'
import { TileManager } from './data/TileManager.js'
import { RendererTools } from './view/renderer.js'

export function drawCanvas() {
  // 先绘制网格
  const canvas = document.getElementById('canvas')

  // 玩家只能决定地图有多少块画布

  // 设置网格的行列
  const _gridColSize = 50
  const _gridRowSize = 15
  // 宽度不变，主要是高度会改变
  const _space = Math.ceil(canvas.width / _gridColSize)
  canvas.height = _space * _gridRowSize

  const gridManager = new GridManager(_space, _gridColSize, _gridRowSize)

  let ctx = canvas.getContext('2d')
  DrawTools.drawGrid(
    ctx,
    _space,
    canvas.width,
    _space * _gridRowSize,
    _gridColSize,
    _gridRowSize
  )

  // 临时存储当前选中的格子
  let tempGrid
  // 标识当前是否按下
  let isDown = false

  // 鼠标点击绘制
  canvas.onmousedown = (e) => {
    let tempX = Math.floor(e.offsetY / _space)
    let tempY = Math.floor(e.offsetX / _space)

    // 单笔刷点击时的绘制
    RendererTools.singleDownBrush(
      ctx,
      canvas,
      _space,
      _gridRowSize,
      _gridColSize,
      gridManager,
      getTileManage(),
      getTileIndex().x,
      getTileIndex().y,
      tempX,
      tempY
    )

    isDown = true
  }

  // 鼠标离开屏幕时
  canvas.onmouseout = (e) => {
    isDown = false
  }

  // 鼠标松开时
  canvas.onmouseup = (e) => {
    isDown = false
  }

  canvas.onmousemove = (e) => {
    let tempX = Math.floor(e.offsetY / _space)
    let tempY = Math.floor(e.offsetX / _space)

    // 如果超出屏幕则直接返回
    if (
      tempY > _gridColSize - 1 ||
      tempX > _gridRowSize - 1 ||
      tempX < 0 ||
      tempY < 0
    ) {
      return
    }

    // 只有在不同的格子里才要重绘（否则会在一个格子里面不断的重绘）
    if (tempGrid != gridManager.getGrid(tempX, tempY)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tempGrid = gridManager.getGrid(tempX, tempY)

      if (isDown) {
        // 单笔刷点击时的绘制
        RendererTools.singleDownBrush(
          ctx,
          canvas,
          _space,
          _gridRowSize,
          _gridColSize,
          gridManager,
          getTileManage(),
          getTileIndex().x,
          getTileIndex().y,
          tempX,
          tempY
        )
      } else {
        // 单笔刷未点击时的绘制
        RendererTools.singleNotDownBrush(
          ctx,
          canvas,
          _space,
          _gridRowSize,
          _gridColSize,
          gridManager,
          getTileManage(),
          getTileIndex().x,
          getTileIndex().y,
          tempX,
          tempY
        )
      }
    }
  }
}
