<template>
  <el-card shadow="always">
    <el-select
      v-model="value"
      placeholder="selection tool"
      @change="changeTool"
    >
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <i class="iconfont" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </el-option>
      </el-option-group>
    </el-select>
    <div class="title">Selection Your Tool</div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const value = ref("0");
    const store = useStore(); // 使用useStore方法

    function changeTool(e: number) {
      store.commit("changeCurrentTool", new Number(e).valueOf());
    }

    return {
      options: [
        {
          label: "Tool",
          options: [
            {
              value: "0",
              label: "Pen Tool",
              icon: "icon-pen"
            },
            {
              value: "1",
              label: "Draw Area Tool",
              icon: "icon-pen"
            },
            {
              value: "2",
              label: "Fill ALL Tool",
              icon: "icon-paint-bucket"
            },
            {
              value: "7",
              label: "Fill Area Tool",
              icon: "icon-paint-bucket"
            },
            {
              value: "8",
              label: "Replace Tiles Tool",
              icon: "icon-paint-bucket"
            },
            {
              value: "3",
              label: "Erase Tool",
              icon: "icon-eraser"
            },
            {
              value: "4",
              label: "Erase Area Tool",
              icon: "icon-eraser"
            }
          ]
        },
        {
          label: "Point",
          options: [
            {
              value: "5",
              label: "Set birth point",
              icon: "icon-ffffff"
            },
            {
              value: "6",
              label: "Set End point",
              icon: "icon-destination"
            }
          ]
        }
      ],
      changeTool,
      value
    };
  }
});
</script>

<style lang="less" scoped>
/* 引入字体文件 */
@font-face {
  font-family: "BlackItalic";
  src: url("../assets/fonts/EskapadeFraktur-BlackItalic.OTF");
}

.iconfont {
  margin-left: 10px;
  margin-right: 10px;
  color: rgb(173, 173, 173);
  font-size: 10px;
}

.title {
  /* 指定这个 logo 的字体 */
  font-family: "BlackItalic";
  margin-top: 15px;
  text-align: center;
  z-index: -1;
}
</style>
