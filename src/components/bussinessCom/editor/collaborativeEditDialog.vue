<template>
  <el-dialog custom-class="dialog-component" :visible="visiable" center :close-on-press-escape="false"
    :close-on-click-modal="false" :append-to-body="true" :destroy-on-close="true" :fullscreen="true"
    @close="closeDialog">
    <template slot="title">
      <span class="title">{{ title }}</span>
    </template>
    <el-tabs type="border-card" v-model="activeTab" @tab-click="handleTabClick" >
      <el-tab-pane v-for="item in memberList" :key="item.userId" :name="String(item.userId)" >
        <span slot="label"><i :class="{'el-icon-user':!item.isMe,'el-icon-user-solid':item.isMe}"></i> {{item.userName}}</span>
      </el-tab-pane>
    </el-tabs>
    <!-- 自己的文档 -->
    <div v-if="checkIsMember && myItem.commitData" :class="{'hide-editor':activeTab != myItem.userId }" class="editor-main">
      <edit-doc :docId="docId" :readOnly="!myItem.isMe" :commitId="myItem.commitData.commitRecordId"></edit-doc>
    </div>
    <!-- 其他人的文档 -->
    <div v-for="item in memberList" :key="item.userId" :class="{'hide-editor':activeTab != item.userId || !item.commitData || item.isMe }" class="editor-main">
      <edit-doc v-if="!item.isMe && activeTab == item.userId && item.commitData" :docId="docId" :readOnly="!item.isMe" :commitId="item.commitData.commitRecordId"></edit-doc>
    </div>
    <el-empty v-if="!currItem.commitData" description="未分配编写章节"></el-empty>
  </el-dialog>
</template>
<script>
import { listCommitRecord,getDocument } from "@/api/editor";
import { mapGetters } from "vuex";
import editDoc from "./editDoc";
export default {
  name: "sam-editor-dialog",
  components: {
    editDoc
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "多人协同编纂",
    },
    docId: String,
    memberList: Array,
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      activeTab: "",
      currItem: {},
      checkIsMember: false,
      myItem: {},
      // 文档对象
      documentData:{},
      cooperationList:[]
    };
  },
  methods: {
    handleTabClick(tab, event){
      let memberItem = _.find(this.cooperationList,{userId:Number(this.activeTab)});
      this.currItem = memberItem;
    },
    getMemberList(){
        let memberList = this.memberList;
        listCommitRecord({docId: this.docId}).then(res2=>{
        this.commitReloadList = res2.rows;
        memberList.forEach(m=>{
            let commitData = _.find(this.commitReloadList,{userId:String(m.userId)});
            m.commitData = commitData ? commitData : null;
            if(m.userId == this.userInfo.userId){
            m.isMe = true;
            }
        })
        // 把当前用户放在第一位
        let myItem = null;
        for (var i = 0; i < memberList.length; i++) {
            if (memberList[i].isMe) {
            myItem = _.cloneDeep(memberList[i]);
            memberList.splice(i, 1);
            break;
            }
        }
        if(myItem != null){
            memberList.unshift(myItem);
        }
        this.cooperationList = memberList;
        this.activeTab = String(this.cooperationList[0].userId)
         this.currItem = this.cooperationList[0];
        // 获取我的文档
        let member = _.find(this.cooperationList,{userId: Number(this.userInfo.userId)})
        this.checkIsMember = member ? true : false;
        this.myItem = member;
        })
    },
    getDocument(){
      getDocument(this.docId).then(res=>{
        this.documentData = res.data;
      })
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
    // this.getDocument();
    this.getMemberList();
  },
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
   .header{
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
  }
   .el-tabs__nav{
    padding: 0 20px;
    .el-icon-user-solid{
      color: #67C23A;
    }
  }
  .editor-main{
    height: calc(100vh - 94px);
  }
   .el-tabs__content{
    padding: 0;
    // .el-tab-pane{
    //   height: 100%;
    //   .editor-main{
    //     height: 100%;
    //   }
    // }
  }
  .hide-editor{
    visibility: hidden;
    position: absolute;
  }
}
</style>
