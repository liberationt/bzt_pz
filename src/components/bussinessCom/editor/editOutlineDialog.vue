<template>
  <el-dialog
    custom-class="dialog-component"
    :visible="visiable"
    center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :destroy-on-close="true"
    :fullscreen="true"
    @close="closeDialog"
  >
    <template slot="title">
      <span class="title">{{ title }}</span>
    </template>
    <template>
      <view-doc
        :docId="docId"
        :editOutline="true"
        :memberList="memberList"
        :mainEditorId="mainEditorId"
      ></view-doc>
    </template>
  </el-dialog>
</template>
<script>
import "sam-editor/dist/sam-editor.css";
import { defaultEditorSetting } from "@/components/bussinessCom/editor/editorOptions";
import { mapGetters } from "vuex";
import viewDoc from "./viewDoc";
export default {
  name: "sam-editor-dialog",
  components: {
    viewDoc,
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "编辑大纲",
    },
    docId: String,
    projectData: Object,
    memberList: Array,
    mainEditorId: {
      type: Object,
      default: null,
    },
  },
  watch: {
    data: {
      handler(data) {
        if (data != null) {
          this.loading = true;
          this.setData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      // 编辑器实例
      editorInstance: null,
      // 编辑器设置
      editorSetting: _.cloneDeep(defaultEditorSetting),
      loading: true,
      selectionData: [],
      showCloseDialog: true,
      rightWidth: 350,
    };
  },
  methods: {
    setData() {
      this.$storage.session.remove("teamworkData");
      this.$set(this.editorSetting, "author", this.data.author);
      this.$set(this.editorSetting["page"], "id", this.data.docId);
      this.$set(this.editorSetting["page"], "number", this.data.stdNo);
      if (this.data.readOnly) {
        this.$set(this.editorSetting, "readonly", true);
        this.$set(this.editorSetting, "mergeDoc", true);
      } else {
        this.$set(this.editorSetting, "readonly", false);
        this.$set(this.editorSetting, "mergeDoc", false);
      }
      this.editorSetting.editorURL = process.env.VUE_APP_EDITOR_API_URL;
      this.editorSetting.nodeURL = process.env.VUE_APP_EDITOR_FORMULA_URL;
      this.editorSetting.pluginURL = process.env.VUE_APP_EDITOR_PLUGIN_URL;
      console.info("init editor setting => ", this.editorSetting, this.data);
      this.showCloseDialog = true;
      this.loading = false;
    },
    closeDialog() {
      if (this.visiable == true) {
        this.$confirm(`请确认内容已保存？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.$emit("close");
          })
          .catch((error) => {});
      }
    },
    /**
     * @description 接收编辑器上报事件
     * @param {Object} data
     */
    changeEvent(data) {
      console.log("about revice change=>", data);
      this.emitData = { ...data };
      switch (data.act) {
        case "destroy":
          this.showCloseDialog = false;
          this.$emit("close");
          break;
        case "closeEditor":
          this.showCloseDialog = false;
          this.$emit("close");
          break;
        case "loaded":
          this.editorInstance = this.$refs.samEditor;
          break;
        case "click":
          console.log("click", data);
          break;
        case "mouseupEvent":
          var outlineArr = [];
          data.node.forEach((node) => {
            let arr = this.recurrenceParentNodes(node);
            outlineArr.push(arr);
          });
          this.selectionData = {
            text: data.selection,
            nodes: data.node,
            outlineArr,
          };
          console.log("selectionData =>", this.selectionData);
          break;
      }
    },
    /**
     * @description 页面排版
     * @param {String} act
     */
    handleCommand(act) {
      this.editorInstance.interFaceAction({
        act: "set_pagetype",
        data: { act },
      });
    },

    /**
     * @description 编辑器接口调用示例
     * @param {String} act
     */
    async actEvnt(act) {
      switch (act) {
        case "close":
          if (this.editorInstance) {
            // 调用销毁接口后直接从监听中再处理
            this.editorInstance.interFaceAction({
              act: "destroy",
            });
          }
          /* setTimeout(() => {
            this.$emit("close");
          }, 500); */
          break;
        // 导出文档
        case "export":
          this.editorInstance.interFaceAction({
            act: "export_doc",
            data: { type: "docx", docName: this.data.stdName },
          });
          break;
        // 获取大纲结构
        case "outline":
          var outlineData = this.editorInstance.interFaceAction({
            act: "get_outline",
          });
          console.log("outlineData", outlineData);
          break;
        // 重置文档内容
        case "reset":
          this.editorInstance.interFaceAction({
            act: "resetContent",
            htmlContent:
              '<div class="info-block" style="padding: 25mm 25mm 20mm 20mm; width: 210mm; height: 297mm;" data-outlineid="4444"><p>示例文本</p></div>',
          });
          break;
        // 获取结构化数据
        case "struct":
          var filePath = await this.editorInstance.interFaceAction({
            act: "submitSaveStructData",
          });
          console.log("struct", filePath);
          break;
        // 获取所有标签
        case "getTags":
          var tagList = this.editorInstance.interFaceAction({
            act: "get_tags",
          });
          console.log("tagList", tagList);
          break;
        // 合并页面文档
        case "merge":
          this.editorInstance.interFaceAction({ act: "megerDoc" });
          break;
      }
    },
    /**
     * @description 根据编辑器的当前节点，递归获取大纲结构数据
     * @param {Element}  startNode 当前节点
     */
    recurrenceParentNodes(startNode = null) {
      var outlineData = this.editorInstance.interFaceAction({
        act: "get_outline",
      });
      console.log("outlineData", outlineData);
      var outlineNode = null,
        outlineArr = [];
      // 往上递归获取父节点
      const getParent = (node) => {
        let parentNode = node.parentElement;
        if (parentNode.dataset && parentNode.dataset.outlineid) {
          return parentNode;
        } else {
          return getParent(parentNode);
        }
      };
      if (startNode.dataset && startNode.dataset.outlineid) {
        outlineNode = startNode;
      } else {
        outlineNode = getParent(startNode);
      }
      // 如果节点为结构化的条目
      if (outlineNode) {
        outlineArr = this.$editorUtils.getParentNode(
          outlineData,
          outlineNode.dataset.outlineid,
          { idKey: "outlineId", parentKey: "parentId", children: "children" }
        );
      }
      return outlineArr;
    },
    // 跳转至意见指定位置
    handleSelectedOpinion(outlineId) {
      let foucsAction = {
        outlineId: outlineId,
        act: "foucsId",
      };
      this.editorInstance.interFaceAction(foucsAction);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
::v-deep .dialog-component {
  position: relative;
  width: 100%;
  height: 100%;
  .el-dialog__body {
    position: relative;
    padding: 0;
    height: calc(100% - 51px);
    overflow: auto;
    .editor {
      height: 100%;
    }
    .btns {
      height: 45px;
      background-color: #f6f6f6;
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      + .editor {
        height: calc(100% - 45px);
      }
    }
  }
}
</style>
