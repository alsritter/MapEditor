"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridManager = void 0;

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/**
 * @file 存放格子的位置数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */
class Grid {
  /**
   * 存储一个格子的位置（左上角）
   * @param {Number} x 当前格子在 Map里面的x轴坐标
   * @param {Number} y 当前格子在 Map里面的y轴坐标
   * @param {Number | null} tileX 这个格子对应的 Tile索引
   * @param {Number | null} tileY 这个格子对应的 Tile索引
   */
  constructor(x, y, tileX, tileY) {
    this.x = x;
    this.y = y;
    this.tileX = tileX;
    this.tileY = tileY;
  }

} // 存储的 Map 示意图
// let map = [
//   [ 0,  4,  8,  4,  8, 12],
//   [ 1,  5,  9,  5,  9, 13],
//   [13,  6, 10,  6, 10, 14],
//   [ 2,  5,  9,  5,  9, 14],
//   [13,  6, 10,  6, 10, 13],
//   [ 3,  7, 11,  4,  8, 15]
// ];


var _map = new WeakMap();

var _cols = new WeakMap();

var _rows = new WeakMap();

class GridManager {
  /**
   *
   * @param {Number} space 一个格子的大小
   * @param {Number} cols 一行有多少个格子
   * @param {Number} rows 一列一多少个格子
   */
  constructor(space, cols, rows) {
    _map.set(this, {
      writable: true,
      value: void 0
    });

    _cols.set(this, {
      writable: true,
      value: void 0
    });

    _rows.set(this, {
      writable: true,
      value: void 0
    });

    // 先初始化 Map
    _classPrivateFieldSet(this, _map, []);

    _classPrivateFieldSet(this, _cols, cols);

    _classPrivateFieldSet(this, _rows, rows);

    for (let i = 0; i < rows; i++) {
      let temp = [];

      for (let j = 0; j < cols; j++) {
        // 初始化先赋值为 null
        temp.push(new Grid(j * space, i * space, null, null));
      }

      _classPrivateFieldGet(this, _map).push(temp);
    }
  }
  /**
   * 获取 Grid
   *
   * @param {Number} x 一行的第几个格子
   * @param {Number} y 一列的第几个格子
   * @returns {Grid} 返回 Grid
   */


  getGrid(x, y) {
    return _classPrivateFieldGet(this, _map)[x][y];
  }
  /**
   * @returns {Number} 返回 Cols
   */


  getColNum() {
    return _classPrivateFieldGet(this, _cols);
  }
  /**
   * @returns {Number} 返回 Rows
   */


  getRowNum() {
    return _classPrivateFieldGet(this, _rows);
  }
  /**
   * 深拷贝数据
   * @returns {Object} 返回克隆的 Map
   */


  getClone() {
    return JSON.parse(JSON.stringify(_classPrivateFieldGet(this, _map)));
  }
  /**
   * 修改当前的 Map
   * @param {Object} newMap
   */


  setMap(newMap) {
    _classPrivateFieldSet(this, _map, newMap);
  }
  /**
   * 清空当前画布
   */


  cleanMap() {
    for (let i = 0; i < _classPrivateFieldGet(this, _map).length; i++) {
      let temp = _classPrivateFieldGet(this, _map)[i];

      for (let j = 0; j < temp.length; j++) {
        temp[j].tileX = null;
        temp[i].tileY = null;
      }

      _classPrivateFieldGet(this, _map)[i] = temp;
    }
  }

}

exports.GridManager = GridManager;