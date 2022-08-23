<template>
  <el-dialog custom-class="dialog-component" :visible="visiable" center :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="true" :destroy-on-close="true" :fullscreen="true" @close="closeDialog">
    <template slot="title">
      <span class="title">{{ title }}</span>
    </template>
    <template>
      <div class="header">
        <el-switch v-model="syncScroll" active-text="同步滚动" style="position: absolute;right: 20px;">
        </el-switch>
      </div>
      <div class="doc-contents">
        <div class="content">
          <div class="tabs">
            <el-tabs type="border-card" v-model="leftActiveName">
              <el-tab-pane label="主版本" name="main" />
            </el-tabs>
          </div>
          <div class="editor-main">
            <edit-doc :docId="docId" @loaded="loadedOther=true" :syncScroll="syncScroll" mergeMaster />
          </div>
        </div>
        <div class="content">
          <div class="tabs">
            <el-tabs type="border-card" v-model="rightActiveName" @tab-click="handleClick">
              <el-tab-pane v-for="item in memberList" :key="item.userId" :name="String(item.userId)">
                <span slot="label"><i class="el-icon-user"></i> {{item.userName}}</span>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 其他人的文档 -->
          <div class="editor-main" v-for="item in memberList" :key="item.userId" :class="{'hide-editor':rightActiveName != item.userId }">
            <edit-doc v-if="loadedOther && rightActiveName == item.userId && item.commitData" :docId="docId" :commitId="item.commitData.commitRecordId" mergeBranch></edit-doc>
            <el-empty v-if="rightActiveName == item.userId && !item.commitData" description="未分配编写章节"></el-empty>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { listCommitRecord } from "@/api/editor";
import editDoc from "./editDoc";
import { mapGetters } from "vuex";
export default {
  name: "mergeDoc",
  components: {
    editDoc,
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
    memberList: Array,
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      leftActiveName: "main",
      rightActiveName: null,
      loadedOther: false,
      // 成员列表（同tab列表）
      cooperationList: [],
      // 文档对象
      documentData: {},
      currItem: {},
      syncScroll: true,
    };
  },
  methods: {
    handleClick(tab) {
      let memberItem = _.find(this.cooperationList, {
        userId: Number(this.rightActiveName),
      });
      this.currItem = memberItem;
    },
    getMemberList() {
      let memberList = this.memberList;
      listCommitRecord({ docId: this.docId }).then((res2) => {
        this.commitReloadList = res2.rows;
        memberList.forEach((m) => {
          let commitData = _.find(this.commitReloadList, {
            userId: String(m.userId),
          });
          m.commitData = commitData ? commitData : null;
          if (m.userId == this.userInfo.userId) {
            m.isMe = true;
          }
        });
        this.cooperationList = memberList;
        this.rightActiveName = String(this.cooperationList[0].userId);
      });
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
  },
  created() {
    this.getMemberList();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .dialog-component {
  height: 100%;
  width: 100%;
  position: relative;
  .el-dialog__body {
    position: relative;
    padding: 0;
    height: calc(100% - 51px);
    overflow: auto;
  }
  .header {
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    height: 40px;
  }

  .doc-contents {
    border-top: 1px solid #ddd;
    height: calc(100% - 40px);
    display: flex;
    .content {
      flex: 1;
      .tabs {
        height: 40px;
        overflow: hidden;
      }
      .editor-main {
        height: calc(100% - 40px);
      }
    }
  }
  .hide-editor {
    visibility: hidden;
    position: absolute;
  }
  /* .content {
            pointer-events: none;
            position: absolute;
            width: 100%;
            z-index:0;
            left: -10000px;
            top:25px;
            bottom:0;
            &.visible{
                pointer-events: auto;
                left: 0;
                z-index:1;
            }
        } */
}
</style>
