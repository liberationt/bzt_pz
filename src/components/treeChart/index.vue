<template>
  <div class="treechart" :class="{ 'block-diagram': canvasStyle }">
    <table v-if="treeData" id="tree-canvas" ref="tree-canvas">
      <tr>
        <td
          :colspan="treeData.children ? treeData.children.length * 2 : 1"
          :class="{
            parentLevel: treeData.children,
            extend:
              treeData.children && treeData.children.length && treeData.extend,
          }"
        >
          <div class="node">
            <div class="person">
              <div class="sub-title" v-if="treeData.subTitle">
                {{ treeData.subTitle }}
              </div>
              <div
                class="avat"
                :class="{
                  ver: ver && !treeData.isRoot,
                  root: treeData.isRoot,
                  last: treeData.isLast,
                }"
                @click.stop="showData"
              >
                <div :title="treeData.title || treeData.label">
                  {{ treeData.title || treeData.label }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="extend_handle"
            v-if="treeData.children && treeData.children.length"
            title="展开或收起"
            @click.stop="toggleExtend(treeData)"
          ></div>
        </td>
      </tr>
      <!-- 这是一个递归组件,注意,这里还要调用,需要传递的数据这里也要传递,否则操作时拿不到子级的数据 -->
      <tr
        v-show="treeData"
        v-if="treeData.children && treeData.children.length && treeData.extend"
      >
        <td
          v-for="(child, index) in treeData.children"
          :key="index"
          colspan="2"
          class="childLevel"
        >
          <tree-chart :data="child" :ver="ver" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import $bus from "@/utils/bus";
export default {
  name: "tree-chart",
  props: {
    data: Object,
    ver: {
      type: Boolean,
      default: false,
    },
    bgcolor: {
      type: String,
      default: "#ffcc00",
    },
    canvasStyle: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    data: {
      // 遍历当前的数据
      handler(data) {
        let extendKey = (jsonData) => {
          jsonData.extend =
            jsonData.extend === void 0 ? true : !!jsonData.extend;
          if (Array.isArray(jsonData.children) && jsonData.children.length) {
            jsonData.children.forEach((c) => {
              extendKey(c);
            });
          }
          return jsonData;
        };
        if (data) {
          this.treeData = extendKey(data);
          //console.log("this.treeData==>", this.treeData)
        }
      },
      immediate: true,
    },
  },
  data: () => ({
    treeData: {},
  }),
  methods: {
    toggleExtend(treeData) {
      treeData.extend = !treeData.extend;
      this.$forceUpdate();
    },
    showData() {
      $bus.$emit("show", this.treeData);
    },
    treeSaveImage(title) {
      let canvasID = this.$refs["tree-canvas"];
      let that = this;
      let a = document.createElement("a");
      html2canvas(canvasID).then((canvas) => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = "none";
        a.style.display = "none";
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
        a.setAttribute("href", URL.createObjectURL(blob));
        //这块是保存图片操作  可以设置保存的图片的信息
        a.setAttribute("download", title + ".png");
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
    },
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./treeChart";

::v-deep .avat {
  width: auto !important;
  min-width: 120px !important;
  writing-mode: unset !important;
  text-align: center !important;
}
.block-diagram .node .person .avat,
.block-diagram .node .person .avat.root {
  transition: all 0.3s;
  background-color: white !important;
  color: black !important;
  box-shadow: none !important;
  border: 1px solid black !important;
  border-radius: 0;
}
.block-diagram .node .person .avat.root {
  transition: all 0.3s;
  // padding: 7px 10px;
}
.block-diagram {
  transition: all 0.3s;
  .childLevel::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 100%;
    height: 15px;
    border-left: 1px solid black;
    transform: translate3d(-1px, 0, 0);
  }

  .childLevel::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -15px;
    border-top: 1px solid black;
  }

  .childLevel:first-child:before,
  .childLevel:last-child:before {
    display: none;
  }

  .childLevel:first-child:after {
    left: 50%;
    height: 15px;
    border: 1px solid;
    border-color: black transparent transparent black;
    border-radius: 0;
    transform: translate3d(1px, 0, 0);
  }

  .childLevel:last-child:after {
    right: 50%;
    height: 15px;
    border: 1px solid;
    border-color: black black transparent transparent;
    border-radius: 0;
    transform: translate3d(-1px, 0, 0);
  }

  .childLevel:first-child.childLevel:last-child::after {
    left: auto;
    border-radius: 0;
    border-color: transparent black transparent transparent;
    transform: translate3d(0, 0, 0);
  }
  .extend_handle {
    color: black;
  }
  .extend::after {
    border-left: 1px solid black;
  }
  .node .person .sub-title {
    // padding-bottom: 2px;
  }
}
</style>
