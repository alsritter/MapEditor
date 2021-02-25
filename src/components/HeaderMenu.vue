<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="rgb(56, 56, 56)"
    text-color="#fff"
    active-text-color="#fff"
  >
    <el-submenu index="1">
      <template #title>File</template>
      <el-menu-item index="1-1">
        <i class="icon-import iconfont"></i>
        <template #title>Import</template>
        <input type="file" id="btn_file" style="display:none" />
      </el-menu-item>
      <el-menu-item index="1-2">
        <i class="icon-Import iconfont"></i>
        <template #title>Export</template>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template #title>Edit</template>
      <el-menu-item index="2-1">
        <i class="icon-xingzhuang iconfont"></i>
        <template #title>TileMap Settings</template>
      </el-menu-item>
      <el-menu-item index="2-2" disabled>
        <i class="icon-xingzhuang iconfont"></i>
        <template #title>Canvas Settings</template>
      </el-menu-item>
      <el-menu-item index="2-3">
        <i class="icon-qingkong iconfont"></i>
        <template #title>Clear This Layer</template>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template #title>View</template>
      <el-menu-item index="3-1">
        <el-radio v-model="isShowAllLayer" label="1">Show All Layers</el-radio>
      </el-menu-item>
      <el-menu-item index="3-2">
        <el-radio v-model="isShowAllLayer" label="0">One Show Only</el-radio>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="4" disabled>Help</el-menu-item>
  </el-menu>
  <!-- 设置画布的大小 -->
  <el-dialog
    title="TileMap Setting"
    v-model="dialogVisible"
    width="325px"
    @closed="closeDialogVisible"
  >
    <div class="c-input">
      <label for="c-width">Width (tiles)</label>
      <el-input-number
        id="c-width"
        v-model="tempCols"
        controls-position="right"
        :min="10"
        :max="50"
      ></el-input-number>
    </div>
    <div class="c-input">
      <label for="c-height">Height (tiles)</label>
      <el-input-number
        id="c-height"
        v-model="tempRows"
        controls-position="right"
        :min="10"
        :max="50"
      ></el-input-number>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialogVisible">cancel</el-button>
        <el-button type="primary" @click="subNewCanvasSize">
          submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";

import { importData } from "../ts/importMapData";

export default defineComponent({
  setup() {
    const $store = useStore(); // 使用useStore方法

    const isShowAllLayer = ref("1");
    const dialogVisible = ref(false);

    // 用来记录临时数据
    const tempCols = ref(25);
    const tempRows = ref(25);

    watch(isShowAllLayer, () => {
      $store.commit("changeShowModel", isShowAllLayer.value == "1");
    });

    function handleSelect(index: string) {
      // 导入文件
      if (index === "1-1") {
        const importBtn = document.getElementById(
          "btn_file"
        ) as HTMLInputElement;
        importBtn.click();
        importData($store, importBtn);
      }
      // 导出文件
      else if (index === "1-2") {
        // 导出文件事件
        window.dispatchEvent(new CustomEvent("exportData"));
      }
      // 画布设置
      else if (index === "2-1") {
        dialogVisible.value = true;
      }
      // 清空画布
      else if (index === "2-3") {
        // 发出清空画布事件
        window.dispatchEvent(new CustomEvent("cleanCanvas"));
      }
    }

    return {
      isShowAllLayer,
      handleSelect,
      dialogVisible,
      tempCols,
      tempRows,
      closeDialogVisible() {
        // 关闭之后更新临时数据
        tempCols.value = $store.state.canvasColSize;
        tempRows.value = $store.state.canvasRowSize;

        dialogVisible.value = false;
      },
      subNewCanvasSize() {
        $store.commit("changeNewCanvasSize", {
          cols: tempCols.value,
          rows: tempRows.value
        });
        dialogVisible.value = false;
      }
    };
  }
});
</script>

<style lang="less" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.iconfont {
  margin-left: 10px;
  margin-right: 10px;
  color: rgb(173, 173, 173);
  font-size: 10px;
}

.c-input {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center; /*实现垂直居中*/
}
</style>

<style>
.el-dialog__header {
  background-color: #3b3b3b;
}

.el-dialog__title {
  color: white !important;
  font-weight: bold;
}

.el-popper.is-light {
  border: none !important;
  background: none !important;
}
</style>
