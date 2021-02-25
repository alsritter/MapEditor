<template>
  <div id="showType">
    <div class="title">Layer</div>
    <br />
    <input
      id="Background"
      type="radio"
      name="layerRadio"
      checked="true"
      value="0"
      v-model="layer"
    />
    <label for="Background">Background</label>

    <input
      type="radio"
      id="Collision"
      name="layerRadio"
      value="1"
      v-model="layer"
    />
    <label for="Collision">Collision</label>

    <input
      type="radio"
      id="Traps"
      name="layerRadio"
      value="2"
      v-model="layer"
    />
    <label for="Traps">Traps</label>

    <input
      type="radio"
      id="foreground"
      name="layerRadio"
      value="3"
      v-model="layer"
    />
    <label for="foreground">foreground</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  watch: {},
  setup() {
    const layer = ref("0");
    const store = useStore(); // 使用useStore方法

    watch(layer, () => {
      // 要把这个转成数字
      store.commit("changeCurrentLayer", new Number(layer.value).valueOf());
    });
    return {
      layer
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

#showType {
  background-color: rgb(34, 34, 34);
  padding: 15px;
  border-top-width: 1px;
  border-top-color: #eeeeee;
  border-top-style: inset;

  .title {
    border-radius: 3px;

    /* 指定这个 logo 的字体 */
    font-family: "BlackItalic";
    border-top-width: 1px;
    border-top-color: #eeeeee;
    border-top-style: inset;

    border-bottom-width: 2px;
    border-bottom-color: rgb(104, 33, 33);
    border-bottom-style: inset;

    height: 10%;
    background-color: rgb(230, 81, 81);
    box-shadow: 2px 2px 3px rgba(27, 27, 27, 0.76);
    line-height: 50px;
    text-align: center;
    font-size: 20pt;
  }

  input {
    display: none;
    z-index: 10;
  }

  input:checked + label {
    background: #5bc0de;
    color: #fff;
  }

  label {
    background: #eee;
    width: 100%;
    height: 30px;
    display: block;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>
