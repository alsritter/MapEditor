<template>
  <div class="tileCanvasBox">
    <canvas id="tileCanvas" width="500" height="500">
      Does not support canvas;
    </canvas>
    <!-- <img :src="require('../assets/tiles.png')" alt="" srcset=""> -->
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import { useStore } from "vuex";

import DrawTools from "../ts/view/drawTools";
import GridManager from "../ts/data/gridManager";
import TileManager from "../ts/data/TileManager";
import BasePos from "../ts/data/VO/BasePos";

export default defineComponent({
  setup() {
    const store = useStore(); // 使用useStore方法
    onMounted(() => {
      // 先绘制网格
      const canvas = document.getElementById("tileCanvas") as HTMLCanvasElement;
      const img = new Image();
      img.src = "./static/img/tiles.png";

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        store.commit("initImageWidth", img.width); // 通知这个侧边栏最大能拉多大

        const _cols = 16;
        const _rows = 16;

        // 先获取每个图形格子的大小
        const _space = img.width / _cols;

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        const gridManager = new GridManager(_space, _cols, _rows);
        const _tileManager = new TileManager(ctx, _cols, _rows, img);

        DrawTools.drawBackground(ctx, canvas.width, canvas.height);
        DrawTools.drawAllTile(ctx, _tileManager, gridManager, _space);

        // 初始化 store 里面的 tileManager
        store.commit("initTileManager", _tileManager);

        // 通知当前 Tile 区域初始化完成了，其它区域可以开始加载了
        window.dispatchEvent(new CustomEvent("initTileCanvas"));

        // 根据鼠标点击取得格子
        canvas.onmousedown = e => {
          const temp = gridManager.getGrid(
            Math.floor(e.offsetY / _space),
            Math.floor(e.offsetX / _space)
          );
          DrawTools.drawDark(ctx, _space, temp.x, temp.y);

          // 修改下当前选中的 Tile的索引
          store.commit(
            "setTileIndex",
            new BasePos(
              Math.floor(e.offsetY / _space),
              Math.floor(e.offsetX / _space)
            )
          );
        };

        canvas.onmouseup = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          DrawTools.drawBackground(ctx, canvas.width, canvas.height);
          DrawTools.drawAllTile(ctx, _tileManager, gridManager, _space);
        };
      };
    });

    return {};
  }
});
</script>

<style lang="less" scoped>
canvas {
  border: 1px solid black;
  box-shadow: 2px 2px 3px rgba(27, 27, 27, 0.76);
}

.tileCanvasBox {
  margin-top: 20px;
  border: 10px solid;
  background-color: rgb(56, 56, 56);
}
</style>
