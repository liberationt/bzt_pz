<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="auditProForm"
        :rules="rules"
        ref="auditProForm"
        label-suffix=":"
        label-width="130px"
        class="auditProForm"
      >
        <!-- taskInfo.taskState == 6109 -->
        <el-form-item label="通知内容" v-if="taskInfo.taskState == 6109">
          {{ taskInfo.note }}
        </el-form-item>
        <el-form-item label="附件" v-if="taskInfo.taskState == 6109">
          <span class="link-text" @click="getFile()">
            《企业标准复审结论汇总表》.xlsx
          </span>
        </el-form-item>

        <el-form-item label="审核结论" prop="state" v-if="taskInfo.taskState!=14002">
          <el-radio-group v-model="auditProForm.state">
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="2"> 不通过 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="修改原因"
          prop="opinion"
          v-if="auditProForm.state == 2"
        >
          <el-input
            type="textarea"
            placeholder="请输入修改原因"
            v-model="auditProForm.opinion"
          />
        </el-form-item>
      </el-form>
      <Table v-if="taskInfo.taskState==14002" :taskState="taskInfo.taskState"  :tableData="tableData" :disabled="true" />
      
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
import Table from "./table.vue"

export default {
  components: { BztDialog ,Table},
  name: "aduit-pro",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    type:{
      type: Number,
      default: 2,
    },
    projectType:{
      type: Number,
      default: 13,
    },
    title: { type: String, default: "复审项目审核" },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准化审核",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      auditProForm: {
        rwTaskId: null,
        state: null,
        opinion: "",
        specialRevise: 0,
        type: null,
        workItemId: null,
      },
      rules: {
        state: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        opinion: {
          required: true,
          message: "请输入驳回原因",
          trigger: "blur",
        },
      },
      tableData: [{
          standardId:'',
          stdName: '',
          stdNo:'',
          isRelevant:'',
          conclusion:'',
          opinion:'',
          reason:'',
          processorTaskId:'',
          detailItems:[
            {

            }
          ],
          10:'',
          11:'',
          20:'',
          21:'',
          22:'',
          23:'',
          24:'',
          25:'',
          26:'',
        }]
    };
  },
  mounted() {
    if(this.taskInfo.taskState==14002){
      this.getInfo()
      this.dialogInfo.width = "1600px"
    }
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
  },

  methods: {
    getInfo(){
      this.tableData = []
      let tableData = {
        standardId:'',
        stdName: '',
        stdNo:'',
        id:'',
        isRelevant:'',
        conclusion:'',
        opinion:'',
        reason:'',
        processorTaskId:'',
        detailItems:[
          {

          }
        ],
        10:'',
        11:'',
        20:'',
        21:'',
        22:'',
        23:'',
        24:'',
        25:'',
        26:'',
      }
      let req = {
        rwTaskId: this.$route.params.rwTaskId ||this.taskInfo.id,
        type:this.type,
        projectType:this.projectType,
        processorTaskId:this.taskInfo.childTaskId
      }
      Api.findStandardByTaskId(req).then((res) => {
        const { code, msg,data } = res;
        if (code === 200) {
          data.forEach((item,i)=>{
            let detailItems = item.detailItems!=""&&item.detailItems!=null?item.detailItems.split(","):[]
            let object = {
              stdName:item.pdcaStdlist.stdName,
              stdNo:item.pdcaStdlist.stdNo,
              isRelevant:item.isRelevant,
              conclusion:item.conclusion,
              reason:item.reason,
              id:item.id
            }
            for(let key in tableData){
              if(detailItems.length&&detailItems.indexOf(key)!=-1){
                object[key] = true
              }
            }
            this.tableData.push(object)
          })
        } 
      });
    },
    /**
     * 下载文件
     * @param {*} 要下载的文件信息
     */
    fileDownLoad() {
      const req = {
        taskId: this.taskInfo.id,
        processAs: 6,
      };
      this.downloadByPost(
        "/scplat/RwProcessorTaskAssign/list",
        req,
        `《企业标准复审结论汇总表》.xlsx`
      );
    },
    /**
     * 获取复审结论汇总表
     */
    getFile() {
      const req = {
        taskId: this.taskInfo.id,
        processAs: 6,
      };

      Api.rwProcessorTaskAssignList(req).then((res) => {
        const { code, rows, msg } = res;
        if (code == 200) {
          if (rows.length > 0) {
            const files = JSON.parse(rows[0].currentAttachments);
            files.forEach((file) => {
              if (file.type == 1) {
                this.downLoadByURL(file.url, "《企业标准复审结论汇总表》.xlsx");
              }
            });
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.auditProForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);
            this.auditProForm.rwTaskId = this.taskInfo.id;
            this.auditProForm.workItemId = this.taskInfo.workItem;
            if (
              this.taskInfo.taskState == 6102 ||
              this.taskInfo.taskState == 6103 ||
              this.taskInfo.taskState == 6109
            ) {
              this.auditProForm.type =
                this.taskInfo.taskState == 6102
                  ? 1
                  : this.taskInfo.taskState == 6103
                  ? 2
                  : 3;
              if (this.taskInfo.taskState == 6103) {
                this.auditProForm.specialRevise =
                  this.auditProForm.state == 2 ? 1 : 0;
              }
              this.auditProForm["projectType"] = 6;
              Api.examineTask(this.auditProForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("操作成功");
                  this.$emit("save", false);
                } else {
                  // this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);

                this.dialogInfo.loadding = false;
              });
            } else if (this.taskInfo.taskState == 14002) {

              let flag = this.tableData.filter((item)=>{
                return !item.state || (item.state==2&& !item.reviseReasion)
              })

              if(flag&&flag.length){
                this.dialogInfo.loadding = false;
                return this.$message.warning("请选择审核结论/理由")
              }
              let rwTaskExamineNewDtos = []
              this.tableData.forEach((item)=>{
                rwTaskExamineNewDtos.push({
                  state:item.state,
                  opinion:item.reviseReasion?item.reviseReasion:'',
                  opinionId:item.id
                })
              })
              const req = {
                rwTaskId: this.auditProForm.rwTaskId,
                childId: this.taskInfo.childTaskId,
                state: this.auditProForm.state,
                workItemId: this.auditProForm.workItemId,
                opinion: this.auditProForm.opinion,
                projectType: 6,
                rwTaskExamineNewDtos
              };
              Api.leaderExamineNew(req).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("审核已提交");
                  this.$emit("save", false);
                } else {
                  // this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);
                this.dialogInfo.loadding = false;
              }).catch((err)=>{
                  this.dialogInfo.loadding = false;
              });
            }else if(this.taskInfo.taskState == 6112){
                const req ={
                   state: this.auditProForm.state,
                   id: this.taskInfo.id,
                   opinion: this.auditProForm.opinion,
                   workItemId: this.auditProForm.workItemId,
                }
                Api.examineRwTast(req).then(res=>{
                  const { code, msg } = res;
                  if (code === 200) {
                    this.$message.success("操作成功");
                    this.$emit("save", false);
                  } else {
                    // this.$message.error(msg);
                  }
                  this.dialogInfo.visible = false;
                  this.$set(this.dialogInfo, "loadding", false);

                  this.dialogInfo.loadding = false;
                })
            }
          }
        });
      } else {
        this.$set(this.dialogInfo, "loadding", false);
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", null);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form {
  width: 100%;
  .reason {
    line-height: 30px;
    margin-bottom: 15px;
    label {
      color: $red;
    }
    .reason-content {
      border-radius: 5px;
      background: $grey-light;
      line-height: 36px;
      color: $yellow;
      padding: 0px 15px;
      overflow: hidden;
    }
  }
  .el-form-item {
    margin-right: 15px;
    .el-form-item__label {
      font-weight: 400;
    }
    .el-form-item__content {
      .el-date-editor,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>