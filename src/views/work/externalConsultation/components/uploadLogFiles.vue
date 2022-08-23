<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="logFileForm"
        :rules="rules"
        ref="logFileForm"
        label-suffix=":"
        class="logFileForm"
      >
        <el-form-item label="" prop="currentAttachments">
          <BztUploadFile
            :value="fileList"
            :limit="10"
            :fileSize="100"
            type="drop"
            @upload-change="fileChange"
          />
        </el-form-item>

        <el-form-item label="已反馈至归口单位" prop="isFeedbackCompany" v-if="taskState==3108||taskState==32004">
          <el-radio-group v-model="logFileForm.isFeedbackCompany">
            <el-radio :label="0">已反馈</el-radio>
            <el-radio :label="1">未反馈</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";

export default {
  components: { BztDialog, BztUploadFile },
  name: "up-load-log-file",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    processAs: {
      type: String | Number,
      default: null,
    },
    extendAttachments: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    adviceTaskId: {
      type: Number,
      default: null,
    },
    childAdviceTaskId: {
      type: Number,
      default: null,
    },
    parentProcessorId: {
      type: Number,
      default: null,
    },
    parentId: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "提交意见汇总表",
    },
    workItemId: {
      type: String,
      default: "",
    },
    taskState:{
      type: String|Number,
      default:''
    }
  },
  watch: {
    visiable: {
      handler(val) {
        console.log(val);
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "上传审查会会议纪要",
        width: "600px",
        footer: true,
        loadding: false,
      },
      fileList: [],
      logFileForm: {
        id: null,
        extendAttachments: [],
        currentAttachments: [],
        processAs: "",
        isFeedbackCompany:""
      },
      rules: {
        currentAttachments: {
          required: true,
          message: "请上传会议纪要文件",
          trigger: ["blur", "change"],
        },
        isFeedbackCompany:{
          required: true,
          message: "请选择是否已反馈至归口单位",
          trigger: ["blur", "change"],
        }
      },
    };
  },

  mounted() {
    this.dialogInfo.title = this.title;
    this.dialogInfo.visible = this.visiable;
    // this.dialogInfo.loadding = false;
  },

  methods: {
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.logFileForm.currentAttachments =
        this.fileList.length > 0
          ? JSON.stringify(
              this.fileList.map((item) => {
                return { name: item.name, url: item.url };
              })
            )
          : "";
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.logFileForm.validate((valid) => {
          if (valid) {
            if (this.processAs == 6) {
              this.logFileForm.id = this.businessObjId;
              this.logFileForm.extendAttachments = this.extendAttachments;
              this.logFileForm.processAs = this.taskState==3111?1:this.processAs;
              this.logFileForm["startTime"] = this.startTime;
              this.logFileForm["endTime"] = this.startTime;
              this.logFileForm["childAdviceTaskId"] = null;
              this.logFileForm["adviceTaskId"] = this.adviceTaskId;
              this.logFileForm["parentProcessorId"] = this.parentProcessorId;
              this.logFileForm["parentId"] = this.parentId;
              this.logFileForm["workItemId"] = this.workItemId;

              Api.companyUpload(this.logFileForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("意见汇总表已上传");
                } else {
                  // this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$emit("save", null);
                this.dialogInfo.loadding = false;
              });
            } else {
              this.logFileForm.id = this.businessObjId;
              this.logFileForm.extendAttachments = JSON.stringify(
                this.extendAttachments
              );
              this.logFileForm.processAs = this.processAs;
              this.logFileForm["startTime"] = this.startTime;
              this.logFileForm["endTime"] = this.startTime;
              this.logFileForm["childAdviceTaskId"] = this.childAdviceTaskId;
              this.logFileForm["adviceTaskId"] = this.adviceTaskId;
              this.logFileForm["parentProcessorId"] = this.parentProcessorId;
              this.logFileForm["parentId"] = this.parentId;
              this.logFileForm["workItemId"] = this.workItemId;
              Api.updateAdviceCollectingTaskAssign(this.logFileForm).then(
                (res) => {
                  const { code, msg } = res;
                  if (code === 200) {
                    this.$message.success("意见汇总表已上传");
                  } else {
                    // this.$message.error(msg);
                  }
                  this.dialogInfo.visible = false;
                  this.$emit("save", null);
                  this.dialogInfo.loadding = false;
                }
              );
            }
          }
        });
      } else {
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