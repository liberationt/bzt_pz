<template>
  <div
    class="viewdoc-container"
    v-loading="outlineData === null && outlineList.length > 0"
  >
    <template>
      <div class="left-wrapper">
        <div class="left-main" :class="{ calc: editOutline }">
          <el-scrollbar class="scrollbar ver">
            <!-- <outline
              ref="outline"
              allLevel
              :data="outlineData"
              :merged="!editOutline"
              @change="changeOutline"
            /> -->
            <outline ref="outline" allLevel :data="outlineData" :merged="!editOutline" :author="author" @change="changeOutline" />
          </el-scrollbar>
        </div>
        <div v-if="editOutline" class="left-footer">
          <el-button type="cyan" size="mini" @click.stop.prevnt="saveOutline"
            >保存大纲</el-button
          >
        </div>
      </div>
      <div class="main-wrapper">
        <div class="btns" v-if="editOutline">
          <el-button
            type="cyan"
            size="mini"
            icon="el-icon-document-copy"
            @click="openCooperationDialog"
            style="position: absolute; left: 10px"
            >协作分配</el-button
          >
          <!-- <el-dropdown split-button size="mini" @command="handleCommand" style="margin-left: 10px;">
                  排版方式
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="singleSided">单面排版</el-dropdown-item>
                      <el-dropdown-item command="doubleSided">双面面排版</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
              <el-button size="mini" @click.stop.prevnt="actEvnt('export')">导出文档</el-button>
              <el-button size="mini" type="cyan" @click.stop.prevnt="actEvnt('editDocment')">全文编辑</el-button>
              <el-button size="mini" @click.stop.prevnt="loadDocData">刷新文档</el-button> -->
        </div>
        <div class="content">
          <sam-editor
            v-if="outlineData"
            ref="samEditor"
            :data="editorSetting"
            @change="changeEvent"
          >
            <template v-slot:right>
              <div
                v-if="opinionVisible"
                class="right-wrapper"
                :style="rightStyle"
              >
                <doc-comment
                  :projectData="projectData"
                  :selectionData="selectionData"
                  @finish="getOpinionFinishListData"
                ></doc-comment>
              </div>
              <div
                v-if="opinionProcessedVisible"
                class="right-wrapper"
                :style="rightStyle"
              >
                <opinion-processed
                  ref="opinionProcessed"
                  :projectData="projectData"
                  @selected="handleSelectedOpinion"
                />
              </div>
            </template>
          </sam-editor>
        </div>
      </div>
    </template>

    <cooperation-dialog
      v-if="cooperationDialogVisible"
      :docId="docId"
      :userId="userInfo.userId"
      :memberList="memberList"
      :mainEditorId="mainEditorId"
      :visible="cooperationDialogVisible"
      @close="closeCooperationDialog"
    ></cooperation-dialog>
  </div>
</template>

<script>
import Api from "@api/process";
import { outline } from "sam-editor";
import "sam-editor/dist/sam-editor.css";
import { listOutline } from "@/api/editor";
import docComment from "./docComment.vue";
import {
  letters,
  defaultEditorSetting,
} from "@/components/bussinessCom/editor/editorOptions";
import opinionProcessed from "@/components/bussinessCom/editor/opinionProcessed";
import cooperationDialog from "./cooperationDialog";
import { mapGetters } from "vuex";
export default {
  name: "viewDoc",
  props: {
    docId: String,
    projectData: Object,
    editOutline: Boolean,
    memberList: Array,
    mainEditorId: {
      type: Object,
      default: null,
    },
  },
  components: {
    outline,
    docComment,
    opinionProcessed,
    cooperationDialog,
  },
  watch: {
    //   projectData: {
    //     handler(projectData) {
    //       if (projectData != null) {
    //         this.initData();
    //       }
    //     },
    //     immediate: true,
    //     deep: true,
    //   },
  },
  data() {
    return {
      outlineList: [],
      outlineData: null,
      editorInstance: null,
      editorSetting: _.cloneDeep(defaultEditorSetting),
      selectionData: null,
      rightWidth: 350,
      // 征求意见完成人员列表
      opinionFinishList: [],
      // 多人协作窗口
      cooperationDialogVisible: false,
      author: {
        isAdmin: false
      }
    };
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
    opinionVisible() {
      // 非征求意见阶段，不显示征求意见面板
      if (!this.projectData) return false;
      if (this.projectData.projectState != 1106) return false;
      // 是否为征求意见人员
      let advicerUserIds = this.projectData.advicerIds
        .split(",")
        .map((i) => Number(i));
      if (advicerUserIds.includes(this.userInfo.userId)) {
        let user = _.find(this.opinionFinishList, {
          createUser: this.userInfo.userId,
        });
        return user ? false : true;
      } else {
        return false;
      }
    },
    opinionProcessedVisible() {
      // 意见处理
      if (!this.projectData || this.projectData.projectState != 1107)
        return false;
      return true;
    },
  },
  methods: {
    initData() {
      this.$storage.session.remove("teamworkData");
      // var viewDocData = this.$storage.session.get('viewDoc');
      // console.log('viewDocData', viewDocData)
      if (this.docId) {
        this.author.isAdmin = this.editOutline;
        this.editorSetting.page.id = this.docId;
        this.editorSetting.editorURL = process.env.VUE_APP_EDITOR_API_URL;
        this.editorSetting.nodeURL = process.env.VUE_APP_EDITOR_FORMULA_URL;
        this.editorSetting.pluginURL = process.env.VUE_APP_EDITOR_PLUGIN_URL;
        this.editorSetting.mergeDoc = this.editOutline ? false : true;
        this.editorSetting.menuBar = false;
        this.listOutline(this.docId);
        if (this.projectData && this.projectData.projectState == 1106) {
          this.getOpinionFinishListData();
        }
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
    async exportDoc() {
      var docFile = await this.editorInstance.interFaceAction({
        act: "export_doc",
        data: {
          type: "docx",
          docName: this.projectData.projectName,
          onlyPath: true,
        },
      });
      docFile = "/editorPath" + docFile;
      console.log("docFile=>", docFile);
      return docFile;
    },
    /**
     * @description 编辑器接口调用示例
     * @param {String} act
     */
    async actEvnt(act) {
      switch (act) {
        // 导出文档
        case "export":
          this.editorInstance.interFaceAction({
            act: "export_doc",
            data: { type: "docx", docName: this.projectData.projectName },
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
        // 打标签(以批注示例)
        case "tag":
          var uuid = this.$editorUtils.guid();
          var data = {
            id: uuid,
            author: this.$editorUtils.randomString(6),
            date: this.$moment().format("YYYY-MM-DD hh:mm:ss"),
            text: this.$editorUtils.randomString(),
          };
          if (this.selectionData) {
            var content = [];
            // 如果该节点未打过标签
            if (!this.selectionData.node.dataset.tag) {
              let innerHtml = this.selectionData.node.innerHTML;
              let reg = new RegExp(this.selectionData.text, "g");
              content.push(data);
              content = JSON.stringify(content);
              innerHtml = innerHtml.replace(
                reg,
                `<span title="批注" class="comment" data-id="${uuid}" data-tag="tag">${this.selectionData.text}</span>`
              );
              this.selectionData.node.innerHTML = innerHtml;
              var tagNode = this.selectionData.node.querySelector(
                `span[data-id="${uuid}"]`
              );
              tagNode.dataset.content = content;
              // 否则增加内容
            } else {
              content = JSON.parse(this.selectionData.node.dataset.content);
              content.push(data);
              this.selectionData.node.dataset.content = JSON.stringify(content);
            }
            // 保存大纲的正文数据
            if (this.selectionData.outlineArr.length) {
              console.log(
                "this.selectionData.outlineArr",
                this.selectionData.outlineArr
              );
            }
            this.selectionData = null;
          } else {
            this.$message.error("请先选中文本文字后处理标签！");
          }
          break;
        case "editDocment":
          this.$storage.session.remove("teamworkData");
          this.$router.push({
            path: "/about",
            query: { id: this.editorSetting.page.id },
          });
          break;
      }
    },
    // 重新加载文档
    async loadDocData() {
      this.outlineData = [];
      // 加载完大纲后回调重新加载文档
      await this.listOutline(this.docId);
      var res = await this.editorInstance.interFaceAction({
        act: "loadDocData",
        docId: this.docId,
      });
      console.info("loadDocData res=>", res);
      // 更新意见处理结果
      if (this.opinionProcessedVisible) {
        this.$refs.opinionProcessed.getOpinionList();
      }
      return true;
    },
    /**
     * @description 选中了大纲节点快速定位到页面位置
     * @param {Object} item
     */
    selectedItem(item) {
      console.info("selectedItem=>", item);
      item.data.act = "foucsId";
      this.editorInstance.interFaceAction(item.data);
    },
    /**
     * @description 协同作业
     * @param {Object} data
     */
    async changeOutline(data) {
      console.log("changeOutline=>", data);
      switch (data.act) {
        case "selectItem":
        case "selectNode":
          data.act = "foucsId";
          this.selectedItem(data);
          break;
        case "add":
        case "remove":
          let actName =
            data.act === "add" ? "afterAddOutline" : "afterRemoveOutline";
          delete data.act;
          console.info("act=>", actName, data);
          this.outlineData = await this.editorInstance.interFaceAction({
            act: actName,
            ...data,
          });
          console.info("outlineData=>", this.outlineData);
          break;
        case "updateOutlineTitle":
          this.editorInstance.interFaceAction(data);
          break;
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
          console.log("selectionData=>", this.selectionData);
          break;
      }
    },
    /**
     * @description 根据编辑器的当前节点，递归获取大纲结构数据
     * @param {Element}  startNode 当前节点
     */
    recurrenceParentNodes(startNode = null) {
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
          this.outlineData,
          outlineNode.dataset.outlineid,
          { idKey: "outlineId", parentKey: "parentId", children: "children" }
        );
      }
      return outlineArr;
    },

    /**
     * @description 列出大纲数据
     * @param {String} docId 文档ID
     */
    async listOutline(docId, callBack = null) {
      var condition = {
        docId,
        orderByColumn: "level_num",
        isAsc: "asc",
      };
      var res = await listOutline(condition);
      if (res.code === 200 && res.rows) {
        if (res.rows.length) {
          let outlineDatas = res.rows.map((item) => {
            let data = this.$editorUtils.clearDataByField(item, [
              "commitId",
              "createTime",
              "createUser",
              "delFlag",
              "deleteTime",
              "deleteUser",
              "pageNum",
              "params",
              "remark",
              "searchValue",
              "searchValueArray",
              "updateTime",
              "updateUser",
              "pageSize",
              "orderByColumn",
              "isAsc",
            ]);
            // 附录项及附录条款
            if ([8, 9].includes(item.outlineType)) {
              data.appendix = true;
              data.letter = letters[parseInt(item.outlineCatalog) - 1];
              data.docattr = item.outlineType === 8 ? "specs" : "means";
            }
            return data;
          });
          outlineDatas = _.orderBy(
            outlineDatas,
            ["outlineType", "orderNum"],
            ["asc", "asc"]
          );
          this.outlineList = outlineDatas;
          this.outlineData = this.$editorUtils.handleTree(
            outlineDatas,
            "outlineId",
            "parentId",
            "children",
            "0"
          );
          console.log("this.outlineData", this.outlineData);
          callBack && callBack();
        }
      }
    },
    // 获取已完成意见的人员列表
    getOpinionFinishListData() {
      const condition = {
        projectId: this.projectData.id,
        projectType: this.projectData.projectType,
      };
      Api.getOpinionFinishList(condition).then((response) => {
        if (response.code === 200) {
          this.opinionFinishList = response.rows;
        }
      });
    },
    // 跳转至意见指定位置
    handleSelectedOpinion(outlineId) {
      let foucsAction = {
        outlineId: outlineId,
        act: "foucsId",
      };
      this.editorInstance.interFaceAction(foucsAction);
    },
    openCooperationDialog() {
      this.cooperationDialogVisible = true;
    },
    closeCooperationDialog() {
      this.cooperationDialogVisible = false;
    },
    // 保存大纲
    saveOutline() {
      this.editorInstance.interFaceAction({ act: "saveDoc" });
      // this.$refs.outline.saveOutlineData();
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.viewdoc-container {
  display: flex;
  height: 100%;
  .left-wrapper {
    width: 300px;
    border-top: 1px #ddd solid;
    .left-main {
      height: 100%;
      &.calc {
        height: calc(100% - 50px);
      }
    }
    .left-footer {
      background: #f6f6f6;
      border-top: 1px #ddd solid;
      height: 50px;
      padding: 10px;
      .el-button {
        float: right;
      }
    }
  }
  .main-wrapper {
    flex: 1;
    .btns {
      height: 45px;
      background-color: #f7f7f7;
      border-left: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      + .content {
        height: calc(100% - 45px);
      }
    }
    .content {
      // height: calc(100% - 45px);
      height: 100%;
    }
  }
  .el-button--cyan {
    background-color: #20b2aa;
    border-color: #20b2aa;
    color: #fff;
    &:hover {
      background: #48d1cc;
      border-color: #48d1cc;
      color: #fff;
    }
  }
}
::v-deep .el-empty {
  .el-empty__description p {
    font-size: 15px !important;
  }
}
</style>
