<template>
  <canvas id="canvas" width="1000" height="600">
    Does not support canvas;
  </canvas>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import { useStore } from "vuex";

import GridManager from "../ts/data/gridManager";
import Grid from "../ts/data/VO/Grid";
import StartAndEndPos from "../ts/data/VO/StartAndEndPos";

import { canvasController } from "../ts/canvasController";
import { exportData } from "../ts/exportMapData";

// 将这个提取为全局的（核心的地图数据）
const gridManagerArray: GridManager[] = [];
// 记录出生点和终点的位置
const startAndEndPos: StartAndEndPos = new StartAndEndPos(
  new Grid(0, 0, 0, 0),
  new Grid(0, 0, 0, 0)
);

export default defineComponent({
  setup() {
    const $store = useStore(); // 使用useStore方法

    onMounted(() => {
      // 等待 TileCanvas 执行完成才开始渲染这个 DrawCanvas
      window.addEventListener("initTileCanvas", () => {
        canvasController($store, gridManagerArray, startAndEndPos);
      });

      // 当变更了画布大小再重新执行一次
      window.addEventListener("canvasSizeChange", () => {
        canvasController($store, gridManagerArray, startAndEndPos);
      });

      // 收到导出文件信号时导出数据
      window.addEventListener("exportData", () => {
        exportData(
          gridManagerArray,
          startAndEndPos,
          $store.state.imageColSize,
          $store.state.imageRowSize
        );
      });
    });
    return {};
  }
});
</script>

<style lang="less" scoped>
canvas {
  border: 1px solid black;
}
</style>
