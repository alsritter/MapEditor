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
import { Tool } from './data/tool.js'

export function drawCanvas() {
  // 取得画布
  const canvas = document.getElementById('canvas')
  // 取得绘图工具选择
  const toolType = document.getElementById('brushTools')

  toolType.onchange = (e) => {
    console.log(toolType.options[toolType.selectedIndex].text)
  }

  function getToolType() {
    return Tool.returnToolType(toolType.selectedIndex)
  }

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
  // 记录按下时所在的格子
  const downPosition = { x: 0, y: 0 }
  // 记录绘图前的数据，方便撤回
  let tempMap = gridManager.getClone()

  // 监听撤回键
  document.onkeydown = (e) => {
    if (e.ctrlKey == true && e.key == 'z') {
      console.log('撤回')
      gridManager.setMap(tempMap)
      // 然后马上刷新画面
      DrawTools.drawGrid(
        ctx,
        _space,
        canvas.width,
        _space * _gridRowSize,
        _gridColSize,
        _gridRowSize
      )

      // 绘制 Map 里面已有的 Tile
      DrawTools.drawMapTile(ctx, getTileManage(), gridManager, _space)
    }
  }

  // 鼠标点击绘制
  canvas.onmousedown = (e) => {
    let tempX = Math.floor(e.offsetY / _space)
    let tempY = Math.floor(e.offsetX / _space)

    if (getToolType() === Tool.DRAW) {
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
    } else if (getToolType() === Tool.FILL) {
      RendererTools.fillDownBrush(
        ctx,
        canvas,
        _space,
        _gridRowSize,
        _gridColSize,
        gridManager,
        getTileManage(),
        getTileIndex().x,
        getTileIndex().y
      )
    }

    isDown = true
    downPosition.x = tempX
    downPosition.y = tempY
    tempMap = gridManager.getClone()
  }

  // 鼠标离开屏幕时
  canvas.onmouseout = (e) => {
    isDown = false
  }

  // 鼠标松开时
  canvas.onmouseup = (e) => {
    isDown = false
  }

  // 鼠标移动时（核心区域）
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
        if (getToolType() === Tool.DRAW) {
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
        } // 如果是选区笔刷
        else if (getToolType() === Tool.DRAWAREA) {
          // console.log(downPosition.x, downPosition.y, tempX, tempY)
          RendererTools.areaDownBrush(
            ctx,
            canvas,
            _space,
            _gridRowSize,
            _gridColSize,
            gridManager,
            getTileManage(),
            getTileIndex().x,
            getTileIndex().y,
            downPosition.x,
            downPosition.y,
            tempX,
            tempY
          )
        } else if (getToolType() === Tool.ERASE) {
          console.log('橡皮擦')
        } else if (getToolType() === Tool.ERASEAREA) {
          console.log('选区橡皮擦')
        }
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
