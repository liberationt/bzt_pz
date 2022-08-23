<template>
  <div class="edit-doc-container">
    <div class="editor">
      <sam-editor v-if="!loading" :ref="`samEditor-${getDocRefId}`" :data="editorSetting" @change="changeEvent">
        <template v-slot:right>
          <div v-if="opinionProcessed" class="right-wrapper" :style="opinionProcessedRightStyle">
            <opinion-processed :projectData="projectData" @selected="handleSelectedOpinion" />
          </div>
        </template>
      </sam-editor>
    </div>
  </div>
</template>

<script>
import $bus from "@/utils/bus";
import 'sam-editor/dist/sam-editor.css';
import { defaultEditorSetting } from "@/components/bussinessCom/editor/editorOptions";
import { mapGetters } from "vuex";
import opinionProcessed from "@/components/bussinessCom/editor/opinionProcessed";
export default {
  name: "editDoc",
  components: {
    opinionProcessed,
  },
  props: {
    docId: String,
    readOnly: Boolean,
    commitId: String,
    syncScroll: Boolean,
    mergeBranch: Boolean,
    mergeMaster: Boolean,
    opinionProcessed: Boolean,
    projectData: Object
  },
  computed: {
    ...mapGetters(["userInfo"]),
    rightStyle() {
      return {
        width: `${this.rightWidth}px`,
        display: this.rightWidth === 0 ? "none" : "block",
        overflow:'auto'
      };
    },
    getDocRefId() {
      if (this.commitId) {
        return this.docId == null
          ? this.docId + "-" + this.commitId
          : this.docId + "-" + this.commitId;
      } else {
        return this.docId == null ? this.docId : this.docId;
      }
    },
    opinionProcessedRightStyle() {
      if (this.opinionProcessed) {
        return {
          width: `${this.rightWidth}px`,
          display: "block",
          overflow:'auto'
        };
      } else {
        return {
          width: `0px`,
          display: "none",
        };
      }
    },
  },
  data() {
    return {
      uuid: this.$editorUtils.guid(),
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
      let author = {
          userId: this.userInfo.userId,
          userName: this.userInfo.nickName,
          commitId: this.commitId ? this.commitId : "",
          isAdmin: true,
          lockedAll: false,
      }
      this.$set(this.editorSetting, "author", author);
      this.$set(this.editorSetting["page"], "id", this.docId);
      this.$set(this.editorSetting, "readonly", this.readOnly);
      this.$set(this.editorSetting, "mergeDoc", false);
      this.editorSetting.editorURL = process.env.VUE_APP_EDITOR_API_URL;
      this.editorSetting.nodeURL = process.env.VUE_APP_EDITOR_FORMULA_URL;
      this.editorSetting.pluginURL = process.env.VUE_APP_EDITOR_PLUGIN_URL;
      if(this.readOnly){
          this.editorSetting.menuBar = false;
      }
      // 合并时显示复制菜单
      if (this.mergeBranch) {
        this.editorSetting.contextmenu = "copyNode | compare-content"; // 右键菜单
        this.editorSetting.quickbars = "copy copyEntry compare"; // 选中文字后的快捷工具
        this.editorSetting.menu.file.items =
          "searchreplace preview print | exportFile | close-btn";
        this.editorSetting.toolbar1 =
          "undo redo |chapterTitle collect-chapter collect-unchapter | collect-list | paragraph-btn example-btn zhu-btn zhu-imgtable footer-btn | alignment indent2em fullscreen";
        this.editorSetting.toolbar2 = "";
        this.editorSetting.openSidebar = false;
        this.editorSetting.unlock = true;
        this.editorSetting.disabledSave = true;
      }
      if (this.mergeMaster) {
        this.editorSetting.contextmenu += "| insertNode | compare-content"; // 右键菜单
        this.editorSetting.quickbars += "| compare"; // 选中文字后的快捷工具
        this.editorSetting.toolbar1 =
          "undo redo | save | chapterTitle collect-chapter collect-unchapter | collect-list | paragraph-btn example-btn zhu-btn zhu-imgtable footer-btn | alignment indent2em fullscreen";
        this.editorSetting.toolbar2 = "";
        this.editorSetting.openSidebar = false;
      }
      console.info("init editor setting => ", this.editorSetting);
      this.loading = false;
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
          console.info("editor destroy=>", this.commitId);
          this.$emit("close");
          break;
        case "closeEditor":
          this.$emit("close");
          break;
        case "loaded":
          console.info("editor loaded=>", this.commitId);
          this.editorInstance = this.$refs[`samEditor-${this.getDocRefId}`];
          setTimeout(() => {
              this.$emit('loaded');
          }, 1000)
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
        case "onScroll":
          if (this.syncScroll) {
            $bus.$emit("scrollTop", {
              id: this.docId,
              top: data.top,
              uuid: this.uuid,
            });
          }
          break;
        case "compare":
          $bus.$emit("comparePage", { id: this.docId, page: data.page,uuid: this.uuid });
          break;
      }
    },
    /**
     * @description 同步滚动页面
     * @param {Int} top 位置
     */
    scrollTop(top = 0) {
      var $ref = this.$refs[`samEditor-${this.getDocRefId}`];
      $ref.interFaceAction({ act: "scrollTop", top });
    },
    /**
     * @description 比较页面内容
     * @param {Element} page 当前页面
     */
    comparePage(page = null) {
      // console.log('comparePage=>', page);
      var $ref = this.$refs[`samEditor-${this.getDocRefId}`];
      $ref.interFaceAction({ act: "comparePage", page });
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
  created() {
    this.setData();
  },
  mounted() {
    $bus.$on("scrollTop", (data) => {
      if (data.uuid !== this.uuid) {
        this.scrollTop(data.top);
      }
    });
    $bus.$on("comparePage", (data) => {
      if (data.uuid !== this.uuid) {
        this.comparePage(data.page);
      }
    });
  },
  beforeDestroy() {
    // 销毁注册的事件总线
    $bus.$off("scrollTop");
    $bus.$off("comparePage");
  },
};
</script>

<style scoped lang="scss">
.edit-doc-container {
  height: 100%;
  &.hide {
    visibility: hidden;
  }
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
</style>