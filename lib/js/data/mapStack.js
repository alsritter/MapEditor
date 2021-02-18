"use strict";

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapStack = void 0;

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _arr = new WeakMap();

/**
 * @file 因为 js好像没有栈这种数据结构，所以这里手动实现一个
 * 用于撤回操作（先进后出）
 *
 * @author author-alsritter(alsritter1@gmail.com)
 */

/**
 * 自定义的栈结构，主要用来维护 画布数据
 */
class MapStack {
  constructor() {
    _arr.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _arr, []);
  }
  /**
   * 压栈操作
   * @param {Object} map 
   */


  push(map) {
    _classPrivateFieldGet(this, _arr).push(map);
  }
  /**
   * 退栈操作
   */


  pop() {
    return _classPrivateFieldGet(this, _arr).pop();
  }
  /**
   * 获取栈顶元素
   */


  top() {
    return _classPrivateFieldGet(this, _arr)[_classPrivateFieldGet(this, _arr).length - 1];
  }
  /**
   * 获取栈长
   */


  size() {
    return _classPrivateFieldGet(this, _arr).length;
  }
  /**
   * 清空栈
   */


  clear() {
    _classPrivateFieldSet(this, _arr, []);

    return true;
  }

  toString() {
    return _classPrivateFieldGet(this, _arr).toString();
  }

}

exports.MapStack = MapStack;