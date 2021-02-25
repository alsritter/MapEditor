import { createStore } from "vuex";
import BasePos from "../ts/data/VO/BasePos";
import { Tool } from "../ts/data/ToolType";
import { Layer } from "../ts/data/LayerType";

import GridManager from "../ts/data/gridManager";
import Grid from "../ts/data/VO/Grid";
import StartAndEndPos from "../ts/data/VO/StartAndEndPos";

export default createStore({
  state: {
    tileIndex: new BasePos(10, 0),
    // 因为这个 TileManager 需要被构造，这里无法初始化，所以先使用 any 吧
    tileManager: {},
    gridManagerArray: new Array<GridManager>(),
    startAndEndPos: new StartAndEndPos(
      new Grid(0, 0, 0, 0),
      new Grid(0, 0, 0, 0)
    ),
    // 画布的大小
    canvasColSize: 25,
    canvasRowSize: 25,
    // 图片宽度
    imageWidth: 300,
    // 图片所占的格子大小
    imageColSize: 16,
    imageRowSize: 16,
    // 记录当前选中的工具
    currentTool: Tool.DRAW,
    currentLayer: Layer.BG,
    // 图层的显示模式
    isShowAllLayer: true
  },
  mutations: {
    initImageWidth(state, step) {
      state.imageWidth = step;
    },
    // 初始化这个瓦片管理
    initTileManager(state, step) {
      state.tileManager = step;
    },
    // 设置当前选中的位置
    setTileIndex(state, step) {
      state.tileIndex = step;
    },
    // 修改画布大小
    changeNewCanvasSize(state, step) {
      state.canvasColSize = step.cols;
      state.canvasRowSize = step.rows;
      // 发出画布大小改变事件
      window.dispatchEvent(new CustomEvent("canvasSizeChange"));
    },
    changeCurrentTool(state, step) {
      state.currentTool = step as Tool;
    },
    changeCurrentLayer(state, step) {
      state.currentLayer = step as Layer;
    },
    changeShowModel(state, step) {
      state.isShowAllLayer = step;
    },
    setMapData(state, step): void {
      state.gridManagerArray = step.newMap;
      state.startAndEndPos = step.newSA;
      window.dispatchEvent(new CustomEvent("importData")); // 发出导入数据
    }
  },
  actions: {},
  modules: {}
});
