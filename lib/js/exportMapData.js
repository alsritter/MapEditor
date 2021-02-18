"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportData = exportData;

var _canvasController = require("./canvasController.js");

function exportData() {
  const exportButton = document.getElementById('exportData');

  exportButton.onclick = e => {
    let maps = (0, _canvasController.getMapData)();
    let data = []; // 去除 Map的坐标信息

    for (let i = 0; i < maps.length; i++) {
      let tempMap = maps[i].getClone();
      let n_map = []; // 遍历 Map

      for (let j = 0; j < tempMap.length; j++) {
        let c_temp = tempMap[j];
        let n_temp = [];

        for (let k = 0; k < c_temp.length; k++) {
          n_temp.push({
            tileX: c_temp[k].tileX,
            tileY: c_temp[k].tileY
          });
        }

        n_map.push(n_temp);
      }

      data.push(n_map);
    }

    console.log(data);
    const content = JSON.stringify(data);
    const eleLink = document.createElement('a');
    eleLink.download = 'mapData.json';
    eleLink.style.display = 'none'; // 字符内容转变成blob地址

    let blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob); // 触发点击

    document.body.appendChild(eleLink);
    eleLink.click(); // 然后移除

    document.body.removeChild(eleLink);
  };
}