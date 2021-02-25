<template>
  <el-container>
    <el-header>
      <HeaderMenu />
    </el-header>
    <el-container>
      <el-aside :width="detailWidth + 'px'">
        <TileCanvas />
        <br />
        <LayerSelect />
      </el-aside>
      <div id="resize" ref="resize"></div>
      <el-main>
        <DrawCanvas />
        <el-affix position="bottom" :offset="0">
          <ToolsCard />
        </el-affix>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import { useStore } from "vuex";

import TileCanvas from "../components/TileCanvas.vue";
import DrawCanvas from "../components/DrawCanvas.vue";
import LayerSelect from "../components/LayerSelect.vue";
import HeaderMenu from "../components/HeaderMenu.vue";
import ToolsCard from "../components/ToolsCard.vue";

export default defineComponent({
  components: {
    TileCanvas,
    DrawCanvas,
    LayerSelect,
    HeaderMenu,
    ToolsCard
  },
  setup() {
    const resize = ref<HTMLDivElement>();
    const detailWidth = ref(537);
    const store = useStore(); // 使用useStore方法

    // 组件挂在结束时开始执行
    onMounted(() => {
      if (resize.value == undefined) {
        return;
      }

      resize.value.onmousedown = e => {
        if (resize.value == undefined) {
          return;
        }
        // 颜色改变提醒
        resize.value.style.background = "#818181";
        let startX = e.clientX;

        document.onmousemove = e => {
          // 计算并应用位移量
          const endX = e.clientX;
          const moveLen = endX - startX;

          detailWidth.value += moveLen;
          // 边界值处理
          detailWidth.value < 250 && (detailWidth.value = 250);
          detailWidth.value > store.state.imageWidth + 25 &&
            (detailWidth.value = store.state.imageWidth + 25);

          startX = endX;
        };

        // 恢复
        document.onmouseup = () => {
          if (resize.value == undefined) {
            return;
          }

          // 颜色恢复
          resize.value.style.background = "";
          document.onmousemove = null;
          document.onmouseup = null;
        };

        return false;
      };
    });

    return {
      detailWidth,
      resize
    };
  }
});
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  width: 100%;

  // 禁止文字被鼠标选中
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .el-header {
    background-color: rgb(56, 56, 56);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.904);
    z-index: 10;
  }

  .el-aside {
    background-color: rgb(90, 90, 90);
    box-shadow: 2px 0px 3px rgba(8, 8, 8, 0.897);
  }

  .el-main {
    // background-color: rgb(38 38 38);
    display: flex;
    display: -webkit-flex;
    // justify-content: center;
    align-items: center;
  }

  #resize {
    width: 5px;
    height: 100%;
    cursor: w-resize;
  }

  .el-affix {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
