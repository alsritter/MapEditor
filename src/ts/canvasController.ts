import DrawTools from "../ts/view/drawTools";
import GridManager from "../ts/data/gridManager";
import RendererTools from "../ts/view/renderer";
import BrushTools from "../ts/data/brushTools";
import { Tool } from "../ts/data/ToolType";
import MapStack from "../ts/data/mapStack";
import CacheMap from "../ts/data/cacheMap";
import Grid from "../ts/data/VO/Grid";
import StartAndEndPos from "../ts/data/VO/StartAndEndPos";
import { Store } from "vuex";

/**
 * gridManagerArray 不能随便让它为 [] 否则指针会失效
 * @param $store
 * @param gridManagerArray
 * @param startAndEndPos
 */
export function canvasController(
  $store: Store<any>,
  gridManagerArray: GridManager[],
  startAndEndPos: StartAndEndPos
) {
  // 定义一个事件来通知刷新地图
  const refreshEvent = new CustomEvent("refreshData");

  // 取得画布
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  // 设置网格的行列
  const _gridColSize = $store.state.canvasColSize;
  const _gridRowSize = $store.state.canvasRowSize;

  let _space = 0;

  if (_gridColSize > _gridRowSize) {
    // 宽度不变，主要是高度会改变（取屏幕的五分之三）
    _space = Math.ceil((document.body.clientWidth * 3) / 5 / _gridColSize);
    canvas.height = _space * _gridRowSize;
    canvas.width = _space * _gridColSize;
  } else {
    // 取屏幕的五分之四
    _space = Math.ceil((document.body.clientHeight * 4) / 5 / _gridRowSize);
    canvas.height = _space * _gridRowSize;
    canvas.width = _space * _gridColSize;
  }

  let currentTool = Tool.DRAW;
  let currentLayer = 0;
  let isShowAll = true;

  // 先清空数组
  gridManagerArray.splice(0, gridManagerArray.length);
  // 这里实例化图层数量个 GridManager
  for (let i = 0; i < 4; i++) {
    gridManagerArray.push(new GridManager(_space, _gridColSize, _gridRowSize));
  }

  // 初始化缓存
  const cacheMap: CacheMap = new CacheMap(_gridColSize, _gridRowSize);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  DrawTools.drawGrid(
    ctx,
    _space,
    canvas.width,
    _space * _gridRowSize,
    _gridColSize,
    _gridRowSize
  );

  // 临时存储当前选中的格子
  let tempGrid: Grid;
  // 标识当前是否按下
  let isDown = false;
  // 记录按下时所在的格子
  const downPosition = { x: 0, y: 0 };
  // 记录绘图前的数据，方便撤回
  const recallMap = new MapStack();

  // 定义一个刷新事件的监听
  window.addEventListener("refreshData", () => {
    cacheMap.setAllChange(); // 缓存也要全部变更
    RendererTools.refresh(
      ctx,
      canvas,
      _space,
      _gridRowSize,
      _gridColSize,
      gridManagerArray,
      currentLayer,
      isShowAll,
      $store.state.tileManager,
      startAndEndPos,
      cacheMap
    );
  });

  // 定义一个刷新事件的监听
  window.addEventListener("importData", () => {
    cacheMap.setAllChange(); // 缓存也要全部变更
    // 先清空数组（不能随便让 gridManagerArray =[]）
    gridManagerArray.splice(0, gridManagerArray.length);
    gridManagerArray.push(...$store.state.gridManagerArray);
    startAndEndPos.start = $store.state.startAndEndPos.start;
    startAndEndPos.end = $store.state.startAndEndPos.end;

    RendererTools.refresh(
      ctx,
      canvas,
      _space,
      _gridRowSize,
      _gridColSize,
      gridManagerArray,
      currentLayer,
      isShowAll,
      $store.state.tileManager,
      startAndEndPos,
      cacheMap
    );
  });

  // 监听工具变化
  $store.watch(
    () => $store.state.currentTool,
    val => {
      currentTool = new Number(val).valueOf();
    }
  );

  // 监听显示模式
  $store.watch(
    () => $store.state.isShowAllLayer,
    val => {
      isShowAll = new Boolean(val).valueOf();
      window.dispatchEvent(refreshEvent); // 通知更新数据
    }
  );

  // 监听当前图层
  $store.watch(
    () => $store.state.currentLayer,
    val => {
      // 一定要使用包装类，否则会给坑的（string 类型和 number 类型居然显示的一样...）
      currentLayer = new Number(val).valueOf();
      window.dispatchEvent(refreshEvent); // 通知更新数据
    }
  );

  // 监听清空画布事件
  window.addEventListener("cleanCanvas", () => {
    // 清空了画布之前需要入栈
    recallMap.push({
      layer: currentLayer,
      map: gridManagerArray[currentLayer].getClone()
    });

    gridManagerArray[currentLayer].cleanMap();
    window.dispatchEvent(refreshEvent); // 通知更新数据
  });

  // 监听撤回键（使用栈）
  document.onkeydown = e => {
    if (e.ctrlKey == true && e.key == "z") {
      // 如果栈内不为空才撤回
      if (recallMap.size() !== 0) {
        // 弹栈
        const temp = recallMap.pop();
        gridManagerArray[temp.layer].setMap(temp.map);
        window.dispatchEvent(refreshEvent); // 通知更新数据
      }
    }
  };

  // 鼠标点击绘制
  canvas.onmousedown = e => {
    const tempX = Math.floor(e.offsetY / _space);
    const tempY = Math.floor(e.offsetX / _space);

    // 入栈时必须加上当前的 Layer
    recallMap.push({
      layer: currentLayer,
      map: gridManagerArray[currentLayer].getClone()
    });

    isDown = true;
    downPosition.x = tempX;
    downPosition.y = tempY;

    // 如果是空的则无法绘制

    // 因为橡皮擦不显示 Tile，只显示阴影，所以需要单独拿出来
    switch (currentTool) {
      // 单笔刷点击时的绘制
      case Tool.DRAW:
        BrushTools.singleDownBrush(
          gridManagerArray,
          $store.state.tileManager,
          currentLayer,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          tempX,
          tempY,
          cacheMap
        );
        break;
      case Tool.DRAWAREA: // 单击时的选区刷是单笔刷的效果
        BrushTools.singleDownBrush(
          gridManagerArray,
          $store.state.tileManager,
          currentLayer,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          tempX,
          tempY,
          cacheMap
        );
        break;
      // 油漆桶
      case Tool.FILL:
        BrushTools.fillDownBrush(
          _gridRowSize,
          _gridColSize,
          gridManagerArray,
          $store.state.tileManager,
          currentLayer,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          cacheMap
        );
        break;
      // 橡皮擦
      case Tool.ERASE:
        BrushTools.Erase(
          gridManagerArray,
          currentLayer,
          tempX,
          tempY,
          cacheMap
        );
        break;
      // 填充某个区域
      case Tool.FILLAREA:
        BrushTools.fillAreaDownBrush(
          _gridRowSize,
          _gridColSize,
          tempX,
          tempY,
          gridManagerArray,
          $store.state.tileManager,
          currentLayer,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          cacheMap
        );
        break;
      // 替换某块颜色
      case Tool.REPLACE:
        BrushTools.replaceBrush(
          _gridRowSize,
          _gridColSize,
          tempX,
          tempY,
          gridManagerArray,
          $store.state.tileManager,
          currentLayer,
          gridManagerArray[currentLayer].getGrid(tempX, tempY).tileX,
          gridManagerArray[currentLayer].getGrid(tempX, tempY).tileY,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          cacheMap
        );
        break;
      case Tool.START:
        BrushTools.setStartPosition(tempX, tempY, startAndEndPos, cacheMap);
        break;
      case Tool.END:
        BrushTools.setEndPosition(tempX, tempY, startAndEndPos, cacheMap);
        break;
    }
    // 因为橡皮擦、出生点和终点不显示 Tile，只显示阴影，所以需要单独拿出来
    if (
      currentTool == Tool.ERASE ||
      currentTool == Tool.START ||
      currentTool == Tool.END
    ) {
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
        $store.state.tileManager,
        tempX,
        tempY,
        startAndEndPos,
        cacheMap
      );
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
        $store.state.tileManager,
        $store.state.tileIndex.x,
        $store.state.tileIndex.y,
        tempX,
        tempY,
        startAndEndPos,
        cacheMap
      );
    }
  };

  // 鼠标离开屏幕时
  canvas.onmouseout = () => {
    isDown = false;
  };

  // 鼠标松开时
  canvas.onmouseup = () => {
    isDown = false;
  };

  // 鼠标移动时（核心区域）
  canvas.onmousemove = e => {
    const tempX = Math.floor(e.offsetY / _space);
    const tempY = Math.floor(e.offsetX / _space);

    // 如果超出屏幕则直接返回
    if (
      tempY > _gridColSize - 1 ||
      tempX > _gridRowSize - 1 ||
      tempX < 0 ||
      tempY < 0
    ) {
      return;
    }

    // 只有在不同的格子里才要重绘（否则会在一个格子里面不断的重绘）
    if (tempGrid != gridManagerArray[currentLayer].getGrid(tempX, tempY)) {
      tempGrid = gridManagerArray[currentLayer].getGrid(tempX, tempY);

      // 只有点击了才能使用笔刷
      if (isDown) {
        switch (currentTool) {
          // 单笔刷点击时的绘制
          case Tool.DRAW:
            BrushTools.singleDownBrush(
              gridManagerArray,
              $store.state.tileManager,
              currentLayer,
              $store.state.tileIndex.x,
              $store.state.tileIndex.y,
              tempX,
              tempY,
              cacheMap
            );
            break;
          // 如果是选区笔刷
          case Tool.DRAWAREA:
            BrushTools.areaDownBrush(
              gridManagerArray,
              $store.state.tileManager,
              currentLayer,
              $store.state.tileIndex.x,
              $store.state.tileIndex.y,
              downPosition.x,
              downPosition.y,
              tempX,
              tempY,
              cacheMap
            );
            break;
          // 橡皮擦
          case Tool.ERASE:
            BrushTools.Erase(
              gridManagerArray,
              currentLayer,
              tempX,
              tempY,
              cacheMap
            );
            break;
          // 选区橡皮擦
          case Tool.ERASEAREA:
            BrushTools.areaErase(
              gridManagerArray,
              currentLayer,
              downPosition.x,
              downPosition.y,
              tempX,
              tempY,
              cacheMap
            );
            break;
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
          $store.state.tileManager,
          tempX,
          tempY,
          startAndEndPos,
          cacheMap
        );
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
          $store.state.tileManager,
          $store.state.tileIndex.x,
          $store.state.tileIndex.y,
          tempX,
          tempY,
          startAndEndPos,
          cacheMap
        );
      }
    }
  };
}
