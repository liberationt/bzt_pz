<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="uploadForm"
        :rules="rules"
        ref="uploadForm"
        label-suffix=":"
        label-width="210px"
        class="uploadForm"
      >
        <el-form-item
          label="《企业标准复审结论汇总表》"
          prop="projectSummaryPath"
        >
          <BztUploadFile
            :value="minutesList1"
            :limit="1"
            :fileSize="100"
            :fileType="['xls', 'xlsx']"
            @upload-change="fileChange($event, 'minutes1')"
          />
        </el-form-item>
        <el-form-item
          label="会议纪要"
          prop="projectSummaryPath"
        >
          <BztUploadFile
            :value="minutesList2"
            :limit="1"
            :fileSize="100"
            @upload-change="fileChange($event, 'minutes2')"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import { listUserByDeptsAndRoleKeys } from "@api/system/user";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: { BztDialog, BztUploadFile },
  name: "upload-result",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    title: { type: String, default: "上传复审结论汇总表" },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title =
          this.taskInfo.taskState == 14001
            ? this.title
            : this.taskInfo.taskState == 6108
            ? "起草复审结论通知"
            : "部门复审结论审核";
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      deptList:[],
      dialogInfo: {
        visible: false,
        title: "标准化审核",
        width: "800px",
        footer: true,
        loadding: false,
      },
      uploadForm: {
        currentAttachments: null,
        date: null,
        lastSecondAuditUser:''
      },
      rules: {
        projectSummaryPath: {
          required: true,
          message: "请选择网员",
          trigger: "change",
        },
        note: {
          required: true,
          message: "请输入通知内容",
          trigger: "blur",
        },
        lastSecondAuditUser: {
          required: true,
          message: "请选择审核人",
          trigger: "blur",
        },
      },
      minutesList1: [],
      minutesList2: [],
      note: "",
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
  },

  methods: {
    /**
     * 上传附件
     * @param {*} file 上传成功的附件信息
     * @param {*} name 附件位置 minutes1：汇总表，minutes2：会议纪要
     */
    fileChange(file, name) {
      if (file.length > 0) {
        switch (name) {
          case "minutes1":
            this.minutesList1 = file;
            break;
          case "minutes2":
            this.minutesList2 = file;
            break;
        }
      } else {
        switch (name) {
          case "minutes1":
            this.minutesList1 = [];
            break;
          case "minutes2":
            this.minutesList2 = [];
            break;
        }
      }
    },
    
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        if (this.minutesList1.length == 0) {
          this.$message.warning("请上传汇总表");
          return;
        }
        if (this.minutesList2.length == 0) {
          this.$message.warning("请上传会议纪要");
          return;
        }
        this.$set(this.dialogInfo, "loadding", true);

        let arr = [];
        this.minutesList1.forEach((item) => {
          const newItem = {
            url: item.url,
            name: item.name,
            type: 1,
          };
          arr.push(newItem);
        });
        this.minutesList2.forEach((item) => {
          const newItem = {
            url: item.url,
            name: item.name,
            type: 2,
          };
          arr.push(newItem);
        });
        if (this.taskInfo.childTaskState == 15001) {
          const req = {
              currentAttachments: JSON.stringify(arr),
              taskId: this.taskInfo.id,
              processorTaskId: this.taskInfo.childTaskId,
              processorId: this.userInfo.userId,
              processAs: 2,
              hasFinished: 1,
              projectType: 7,
            };
            Api.importOpinion(req).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("已审核");
                this.$emit("save", false);
              } else {
                // this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);
              this.dialogInfo.loadding = false;
            });
        } else if (this.taskInfo.taskState == 7107) {
          const req = {
            currentAttachments: JSON.stringify(arr),
            taskId: this.taskInfo.id,
            // childId: this.taskInfo.childTaskId,
            processorId: this.userInfo.userId,
            processAs: 6,
            hasFinished: 1,
            projectType: 7
          };
          Api.importDetail(req).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success("已审核");
              this.$emit("save", false);
            } else {
              // this.$message.error(msg);
            }
            this.$set(this.dialogInfo, "loadding", false);
            this.dialogInfo.loadding = false;
          });
        }
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