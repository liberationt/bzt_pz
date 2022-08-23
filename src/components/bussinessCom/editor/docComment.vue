<template>
  <div class="doc-comment-container">
    <header >
        <span>征求意见时间范围：{{projectData.stdRequestForAdviceStartTime}} 至 {{projectData.stdRequestForAdviceEndTime}}</span>
    </header>
    <div class="content comment-hr">
        <el-form size="mini" :model="form" label-position="top" >
            <div class="tips">
                提示：鼠标选中正文内容即可引用到右侧的意见栏中
            </div>
            <el-form-item label="意见处理" prop="status">
                <el-radio-group v-model="form.agree">
                    <el-radio v-for="(item, idx) in agreeOpintions" :key="idx" :label="item.value" :disabled="item.value == 0 && myOpinionCount > 0" >{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.agree == 1" label="发表意见(请点选章节或条款发表意见)" prop="feedback">
                <comment-panel ref="commentPanel" @refresh="getMyOpinionListData" :projectData="projectData" :selectionData="selectionData" />
            </el-form-item>

            <el-form-item v-if="form.agree == 0" label="提出人/提出单位">
                <div>
                    <el-breadcrumb separator="/">
                    <el-breadcrumb-item>{{userInfo.nickName}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{userInfo.dept.deptName}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-form-item>
            <el-form-item v-if="form.agree == 0" label="联系方式" prop="status">
                <el-input v-model="form.contactInformation" placeholder="联系方式" clearable />
            </el-form-item>
        </el-form>
    </div>
    <div style="padding: 10px;">
        <el-button :disabled="form.agree != 0 && myOpinionCount == 0" size="small" type="primary" icon="el-icon-finished" @click.stop.prevent="finishCheckVote" >结束征求意见</el-button>
        <div style="color:#C0C4CC;padding-top:10px"><i class="el-icon-warning"/> 请在规定时间范围内操作！</div>
        <div style="color:#C0C4CC;padding-top:10px"><i class="el-icon-warning"/> 提完所有意见或无意见时，点击结束按钮结束征求意见</div>
    </div>
    <!-- <div v-if="!isFinishCheckVote && !initLoading && params.readOnly != 'true'" class="tips">
        您已结束征求意见
    </div>
    <div v-if="params.readOnly == 'true'" class="tips">
        您当前以只读模式查看征求意见
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import commentPanel from "./commentPanel.vue"
export default {
  name:"docComment",
  components: {
    commentPanel
  },
  props:{
      projectData: Object,
      selectionData: Object
  },
  watch:{
    projectData:{
        handler(projectData) {
            if(!_.isEmpty(projectData)){
                this.setData()
            }
        },
        immediate: true,
        deep: true
    },
  },
  data(){
    return {
      form:{
          agree: 1,
          feedback: "",
          contactInformation: ""
      },
      agreeOpintions: [
          {"value":1, "label":"有意见"},{"value":0, "label":"无意见"}
      ],
      // 页面参数
      params:{
          businessId:null,
          businessCategory:null,
          readOnly:null,
          userId:null,
          userName:null,
          companyName:null,
          contactInformation:null
      },
      // 我的审查意见数量
      myOpinionCount: 0
    }
  },
  computed:{
        ...mapGetters(["userInfo"])
  },
  methods:{
        setData(){
            this.getMyOpinionListData();
        },
        // 获取审查意见的数据
        getMyOpinionListData(){
            const condition = {
                "projectId": this.projectData.id,
                "projectType": this.projectData.projectType,
                "createUser": this.userInfo.userId
            }
            Api.getOpinionList(condition).then(response=>{
                if(response.code === 200){
                    this.myOpinionCount = response.total;
                }
            })
        },
        // 完成征求意见
        finishCheckVote(){
            let sel = this;
            this.$confirm('确定结束征求意见吗？结束后将无法继续提意见', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(sel.form.agree == 0) {
                    let data = {
                        projectId: sel.projectData.id,
                        projectType: sel.projectData.projectType,
                        contactInformation: sel.form.contactInformation,
                        comment: "无意见",
                        agree: 0
                    }
                    Api.addOpinion(data).then(() => {
                        sel.handleOptionFinish();
                    });
                } else {
                    sel.handleOptionFinish();
                }
            }).catch(() => {});
        },
        handleOptionFinish(){
            const condition = {
                "projectId": this.projectData.id,
                "projectType": this.projectData.projectType
            };
            Api.addOpinionFinishList(condition).then(res => {
                this.$modal.msgSuccess("已完成意见反馈");
                this.$emit("finish");
            })
        },
  }
}
</script>

<style scoped lang="scss">
.doc-comment-container{
  font-size: 12px;
  >header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .content{
    padding: 10px 10px 0;
  }
  .comment-hr{
      border-bottom:1px solid #DDD;
  }
  .tips{
    background-color: #f0f9eb;
    color: #67c23a;
    padding:10px;
    margin-bottom:15px
  }
}
</style>