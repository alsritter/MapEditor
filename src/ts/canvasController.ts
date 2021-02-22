/**
 * @file 画布区域的控制器，这个需要等待 tileController 执行完后再执行，
 * 所以将这个 Controller 暴露出去让 tileController 执行
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import { DrawTools } from './view/drawTools'
import { Grid, GridManager } from './data/gridManager'
import { getTileIndex, getTileManage } from './tileController'
import { RendererTools } from './view/renderer'
import { BrushTools } from './data/brushTools'
import { Tool } from './data/enumType'
import { MapStack } from './data/mapStack'

// 将这个提取为全局的（核心的地图数据）
const gridManagerArray: GridManager[] = new Array<GridManager>()

/**
 * @returns {GridManager[]} 返回 Map
 */
export function getMapData(): GridManager[] {
  return gridManagerArray
}

export function drawCanvas(): void {
  // 取得画布
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // 取得绘图工具选择
  const toolType = document.getElementById('brushTools') as HTMLSelectElement
  // 取得图层
  const layer = document.getElementById('layer') as HTMLSelectElement
  // 显示模式
  const showType = document.getElementById('showType') as HTMLDivElement
  // 清空画布
  const cleanButton = document.getElementById('clearCanvas') as HTMLButtonElement

  // 设置网格的行列
  const _gridColSize = 50
  const _gridRowSize = 15
  // 宽度不变，主要是高度会改变
  const _space = Math.ceil(canvas.width / _gridColSize)
  canvas.height = _space * _gridRowSize

  let currentTool = Tool.DRAW
  let currentLayer = 0
  let isShowAll = true

  // 使用的工具
  toolType.onchange = () => {
    console.log(toolType.options[toolType.selectedIndex].text)
    currentTool = Tool.returnToolType(toolType.selectedIndex)
  }

  layer.onchange = () => {
    console.log(layer.options[layer.selectedIndex].text)
    currentLayer = layer.selectedIndex
  }

  // 这里实例化图层数量个 GridManager
  for (let i = 0; i < layer.options.length; i++) {
    gridManagerArray.push(new GridManager(_space, _gridColSize, _gridRowSize))
  }

  const ctx = canvas.getContext('2d')

  DrawTools.drawGrid(
    ctx,
    _space,
    canvas.width,
    _space * _gridRowSize,
    _gridColSize,
    _gridRowSize
  )

  // 临时存储当前选中的格子
  let tempGrid: Grid
  // 标识当前是否按下
  let isDown = false
  // 记录按下时所在的格子
  const downPosition = { x: 0, y: 0 }
  // 记录绘图前的数据，方便撤回
  const tempMap = new MapStack()

  // 改变了显示模式也需要刷新
  showType.onclick = (e) => {
    if ((e.target as HTMLInputElement).tagName == 'INPUT') {
      isShowAll = (e.target as HTMLInputElement).value== '0'
      console.log(isShowAll)

      RendererTools.refresh(
        ctx,
        canvas,
        _space,
        _gridRowSize,
        _gridColSize,
        gridManagerArray,
        currentLayer,
        isShowAll,
        getTileManage()
      )
    }
  }

  // 监听清空画布
  cleanButton.onclick = () => {
    // 清空了画布之前需要入栈
    tempMap.push({
      layer: currentLayer,
      map: gridManagerArray[currentLayer].getClone()
    })

    gridManagerArray[currentLayer].cleanMap()
    RendererTools.refresh(
      ctx,
      canvas,
      _space,
      _gridRowSize,
      _gridColSize,
      gridManagerArray,
      currentLayer,
      isShowAll,
      getTileManage()
    )
    console.log('清空当前图层')
  }

  // 监听撤回键（使用栈）
  document.onkeydown = (e) => {
    if (e.ctrlKey == true && e.key == 'z') {
      // 如果栈内不为空才撤回
      if (tempMap.size() !== 0) {
        // 弹栈
        const temp = tempMap.pop()
        gridManagerArray[temp.layer].setMap(temp.map)
        console.log(tempMap.size())

        RendererTools.refresh(
          ctx,
          canvas,
          _space,
          _gridRowSize,
          _gridColSize,
          gridManagerArray,
          currentLayer,
          isShowAll,
          getTileManage()
        )
        console.log('撤回')
      }
    }
  }

  // 鼠标点击绘制
  canvas.onmousedown = (e) => {
    const tempX = Math.floor(e.offsetY / _space)
    const tempY = Math.floor(e.offsetX / _space)

    // 入栈时必须加上当前的 Layer
    tempMap.push({
      layer: currentLayer,
      map: gridManagerArray[currentLayer].getClone()
    })

    isDown = true
    downPosition.x = tempX
    downPosition.y = tempY

    // 如果是空的则无法绘制

    // 因为橡皮擦不显示 Tile，只显示阴影，所以需要单独拿出来
    switch (currentTool) {
      // 单笔刷点击时的绘制
      case Tool.DRAW:
        BrushTools.singleDownBrush(
          gridManagerArray,
          getTileManage(),
          currentLayer,
          getTileIndex().x,
          getTileIndex().y,
          tempX,
          tempY
        )
        break
      // 油漆桶
      case Tool.FILL:
        BrushTools.fillDownBrush(
          _gridRowSize,
          _gridColSize,
          gridManagerArray,
          getTileManage(),
          currentLayer,
          getTileIndex().x,
          getTileIndex().y
        )
        break
      // 橡皮擦
      case Tool.ERASE:
        BrushTools.Erase(gridManagerArray, currentLayer, tempX, tempY)
        break
    }
    // 因为橡皮擦不显示 Tile，只显示阴影，所以需要单独拿出来
    if (currentTool == Tool.ERASE) {
      // 刷新画布
      RendererTools.refreshAndShowDark(
        ctx,
        canvas,
        _space,
        _gridRowSize,
        _gridColSize,
        gridManagerArray,
        currentLayer,
        isShowAll,
        getTileManage(),
        tempX,
        tempY
      )
    } else {
      // 单笔刷未点击时的绘制
      RendererTools.refreshAndShowTile(
        ctx,
        canvas,
        _space,
        _gridRowSize,
        _gridColSize,
        gridManagerArray,
        currentLayer,
        isShowAll,
        getTileManage(),
        getTileIndex().x,
        getTileIndex().y,
        tempX,
        tempY
      )
    }
  }

  // 鼠标离开屏幕时
  canvas.onmouseout = () => {
    isDown = false
  }

  // 鼠标松开时
  canvas.onmouseup = () => {
    isDown = false
  }

  // 鼠标移动时（核心区域）
  canvas.onmousemove = (e) => {
    const tempX = Math.floor(e.offsetY / _space)
    const tempY = Math.floor(e.offsetX / _space)

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
    if (tempGrid != gridManagerArray[currentLayer].getGrid(tempX, tempY)) {
      tempGrid = gridManagerArray[currentLayer].getGrid(tempX, tempY)

      // 只有点击了才能使用笔刷
      if (isDown) {
        switch (currentTool) {
          // 单笔刷点击时的绘制
          case Tool.DRAW:
            BrushTools.singleDownBrush(
              gridManagerArray,
              getTileManage(),
              currentLayer,
              getTileIndex().x,
              getTileIndex().y,
              tempX,
              tempY
            )
            break
          // 如果是选区笔刷
          case Tool.DRAWAREA:
            BrushTools.areaDownBrush(
              gridManagerArray,
              getTileManage(),
              currentLayer,
              getTileIndex().x,
              getTileIndex().y,
              downPosition.x,
              downPosition.y,
              tempX,
              tempY
            )
            break
          // 橡皮擦
          case Tool.ERASE:
            BrushTools.Erase(gridManagerArray, currentLayer, tempX, tempY)
            break
          // 选区橡皮擦
          case Tool.ERASEAREA:
            BrushTools.areaErase(
              gridManagerArray,
              currentLayer,
              downPosition.x,
              downPosition.y,
              tempX,
              tempY
            )
            break
        }
      }

      // 因为橡皮擦不显示 Tile，只显示阴影，所以需要单独拿出来
      if (currentTool == Tool.ERASE) {
        // 刷新画布
        RendererTools.refreshAndShowDark(
          ctx,
          canvas,
          _space,
          _gridRowSize,
          _gridColSize,
          gridManagerArray,
          currentLayer,
          isShowAll,
          getTileManage(),
          tempX,
          tempY
        )
      } else {
        // 单笔刷未点击时的绘制
        RendererTools.refreshAndShowTile(
          ctx,
          canvas,
          _space,
          _gridRowSize,
          _gridColSize,
          gridManagerArray,
          currentLayer,
          isShowAll,
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
