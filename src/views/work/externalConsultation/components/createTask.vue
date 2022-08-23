<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <el-form
        :model="taskForm"
        :rules="rules"
        ref="taskForm"
        label-suffix=":"
        label-width="100px"
        class="taskForm"
        v-if="taskForm != null"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="归口单位" prop="ownerCompanyId">
          <TecCommittees
            :value="taskForm.ownerCompanyId"
            @change="changeTecCom"
          />
        </el-form-item>
        <el-form-item label="处理人员" prop="dispatchUser">
          <el-select v-model="taskForm.dispatchUser" placeholder="请选处理人员">
            <template v-for="(item, index) in userList">
              <el-option
                :key="`user_${index}`"
                :label="item.nickName"
                :value="Number(item.userId)"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileList" ref="fileList">
          <BztUploadFile
            :value="files"
            :limit="1000"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { TecCommittees } from "@components/bussinessCom/index";
const taskForm = {
  taskName: "",
  ownerCompanyId: null,
  dispatchUser: null,
  fileList: "",
};
export default {
  components: { BztDialog, BztUploadFile, TecCommittees },
  name: "createTask",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    fromData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "创办任务",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确定",
      },
      taskForm: null,
      tecCommitteesList: [],
      userList: [],
      rules: {
        taskName: {
          required: true,
          message: "请输入任务名称",
          trigger: "blur",
        },
        ownerCompanyId: {
          required: true,
          message: "请选择归口单位",
          trigger: ["change", "blur"],
        },
        dispatchUser: {
          required: true,
          message: "请输选择处理人员",
          trigger: ["change", "blur"],
        },
        fileList: {
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
      },
      files: [],
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      this.files = [];
      if (this.visiable === true) {
        this.initPage();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.initPage();
    }
  },
  methods: {
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      if (this.formData === null || this.formData === undefined) {
        this.taskForm = this.deepClone(taskForm);
      } else {
        this.taskForm = this.deepClone(val);
        this.filterFiles();
      }
      this.getCheckUserList();
    },
    /**
     * 获取可选人员
     */
    getCheckUserList() {
      Api.getTaskCheckList({
        roleKeys: "standardBusinessStaff",
        deptId: 0,
      }).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.userList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.files = e;
      this.taskForm.fileList =
        this.files.length > 0
          ? JSON.stringify(
              this.files.map((item) => {
                return { name: item.name, url: item.url };
              })
            )
          : "";
      if (this.taskForm.fileList != "") {
        this.$refs.fileList.clearValidate();
      }
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.files = [];
      if (this.taskForm.filesPath != null) {
        JSON.parse(this.taskForm.filesPath).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filepath,
          };
          this.files.push(file);
        });
      }
    },
    /**
     * 选择归口单位
     */
    changeTecCom(e) {
      this.taskForm.ownerCompanyId = e;
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.taskForm.validate((valid) => {
          if (valid) {
            // this.dialogInfo.loadding = true;
            Api.addAdviceCollectingTask(this.taskForm).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("任务已创建");
                this.dialogInfo.visible = false;
                this.$emit("save", null);
              } else {
                // this.$message.error(msg);
              }
              this.dialogInfo.loadding = false;
            });
          } else {
            return false;
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