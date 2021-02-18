"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrushTools = void 0;

var _gridManager = require("./gridManager.js");

/**
 * @file 笔刷工具，这里主要用来修改数据并调用渲染工具
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */
class BrushTools {
  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，单笔刷
   * 还需要把数据存起来
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   */
  static singleDownBrush(gridManagerArray, layer, tileX, tileY, posX, posY) {
    // 将当前选中的格子存储起来
    gridManagerArray[layer].getGrid(posX, posY).tileX = tileX;
    gridManagerArray[layer].getGrid(posX, posY).tileY = tileY;
  }
  /**
   * 鼠标在画布上拖动时（点击时）实时刷新页面，选区刷还需
   * 要把数据存起来，这里需要加个判断，如果起点大于终点的
   * 位置则不刷新的格子
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   * @param {Number} startPosX 画布上的方块的起点索引
   * @param {Number} startPosY 画布上的方块的起点索引
   * @param {Number} endPosX 画布上的方块的当前索引
   * @param {Number} endPosy 画布上的方块的当前索引
   */


  static areaDownBrush(gridManagerArray, layer, tileX, tileY, startPosX, startPosY, endPosX, endPosY) {
    let maxPosX;
    let minPosX;
    let maxPosY;
    let minPosY;

    if (startPosX > endPosX) {
      maxPosX = startPosX;
      minPosX = endPosX;
    } else {
      maxPosX = endPosX;
      minPosX = startPosX;
    }

    if (startPosY > endPosY) {
      maxPosY = startPosY;
      minPosY = endPosY;
    } else {
      maxPosY = endPosY;
      minPosY = startPosY;
    } // 将当前选中的格子存储起来


    for (let i = minPosX; i <= maxPosX; i++) {
      for (let j = minPosY; j <= maxPosY; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = tileX;
        gridManagerArray[layer].getGrid(i, j).tileY = tileY;
      }
    }
  }
  /**
   * 填充当前画布
   *
   * @param {Number} rows
   * @param {Number} cols
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} tileX Tile 的索引
   * @param {Number} tileY Tile 的索引
   */


  static fillDownBrush(rows, cols, gridManagerArray, layer, tileX, tileY) {
    // 将当前选中的格子存储起来
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = tileX;
        gridManagerArray[layer].getGrid(i, j).tileY = tileY;
      }
    }
  }
  /**
   * 将当前选中的格子设置为 null
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} posX 画布上的方块的索引
   * @param {Number} posY 画布上的方块的索引
   */


  static Erase(gridManagerArray, layer, posX, posY) {
    gridManagerArray[layer].getGrid(posX, posY).tileX = null;
    gridManagerArray[layer].getGrid(posX, posY).tileY = null;
  }
  /**
   * 将当前选中的区域设置为 null
   *
   * @param {GridManager[]} gridManagerArray
   * @param {Number} layer 当前选中的图层
   * @param {Number} startPosX 画布上的方块的起点索引
   * @param {Number} startPosY 画布上的方块的起点索引
   * @param {Number} endPosX 画布上的方块的当前索引
   * @param {Number} endPosy 画布上的方块的当前索引
   */


  static areaErase(gridManagerArray, layer, startPosX, startPosY, endPosX, endPosY) {
    let maxPosX;
    let minPosX;
    let maxPosY;
    let minPosY;

    if (startPosX > endPosX) {
      maxPosX = startPosX;
      minPosX = endPosX;
    } else {
      maxPosX = endPosX;
      minPosX = startPosX;
    }

    if (startPosY > endPosY) {
      maxPosY = startPosY;
      minPosY = endPosY;
    } else {
      maxPosY = endPosY;
      minPosY = startPosY;
    } // 将当前选中的格子存储起来


    for (let i = minPosX; i <= maxPosX; i++) {
      for (let j = minPosY; j <= maxPosY; j++) {
        gridManagerArray[layer].getGrid(i, j).tileX = null;
        gridManagerArray[layer].getGrid(i, j).tileY = null;
      }
    }
  }

}

exports.BrushTools = BrushTools;