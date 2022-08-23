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
        label-width="160px"
        class="taskForm"
        v-if="taskForm != null"
      >
        <el-form-item label="任务名称" prop="projectName">
          <el-input
            v-model="taskForm.projectName"
            placeholder="请输入任务名称"
          />
        </el-form-item>
        <el-form-item label="归口单位" prop="ownerCompanyId">
          <TecCommittees
            :value="taskForm.ownerCompanyId"
            @change="changeTecCom"
          />
        </el-form-item>
        <el-form-item label="标准文件" prop="fileList" ref="files">
          <BztUploadFile
            :value="files"
            :limit="1"
            :fileSize="100"
            @upload-change="fileChange($event)"
          />
        </el-form-item>
        <el-form-item
            label="标准化业务主管"
            prop="firstAuditUser"
          >
          <el-select v-model="taskForm.firstAuditUser" filterable clearable placeholder="请选择标准化业务主管">
            <template v-for="(item, index) in directorList">
              <el-option
                :key="`user_${index}`"
                :label="`${item.nickName}(${item.userName})`"
                :value="Number(item.userId)"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="科技管理部部门领导"
          prop="secondAuditUser"
        >
          <el-select v-model="taskForm.secondAuditUser" filterable clearable placeholder="请选择科技管理部部门领导">
            <template v-for="(item, index) in deptList">
              <el-option
                :key="`user_${index}`"
                :label="`${item.nickName}(${item.userName})`"
                :value="Number(item.userId)"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import Api from "@api/process";
import { BztDialog, BztTable, BztUploadFile } from "@components/basicCom/index";
import { TecCommittees } from "@components/bussinessCom/index";
import { listUserByDeptsAndRoleKeys } from "@api/system/user";

const taskForm = {
  projectName: "",
  standardIdList: null,
  projectType: 7,
  rwTaskId: null,
  fileList: "",
  ownerCompanyId: null,
  firstAuditUser:'',
  secondAuditUser:'',
};
export default {
  name: "createTask",
  components: { BztDialog, BztTable, TecCommittees, BztUploadFile },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    taskDetail: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "发起复审任务",
        width: "800px",
        footer: true,
        loadding: false,
        submintText: "提交",
      },
      taskForm: null,
      rules: {
        projectName: {
          required: true,
          message: "请输入复审任务名称",
          trigger: "blur",
        },
        ownerCompanyId: {
          required: true,
          message: "请选择归口单位",
          trigger: "change",
        },
        fileList: {
          required: true,
          message: "请上传标准文件",
          trigger: "blur",
        },
        firstAuditUser:{
          required: true,
          message: "请选择标准化业务主管",
          trigger: "change",
        },
        secondAuditUser:{
          required: true,
          message: "请选择科技管理部部门领导",
          trigger: "change",
        }
      },
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "210",
        },
        {
          title: "标准名称",
          key: "stdName",
        },
      ],
      tabAction: [
        { label: "删除", action: "remove", color: "rgba(214, 71, 48)" },
      ],
      files: [],
      directorList:[],
      deptList:[],
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
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
    this.getDeptList('standardBusinessSupervisor')
    this.getDeptList('principalLeader',200)
  },
  methods: {
    //获取人员
    getDeptList(roleKeys,deptIds=null){
      let data = {
        roleKeys
      }
      if(deptIds){
        data.deptIds = deptIds
      }
      listUserByDeptsAndRoleKeys(data).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if(deptIds){
            //部门主管
            this.deptList = data
          }else{
            //标准化业务主管:
            this.directorList = data
          }
        }
      });
    },
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      this.taskForm = this.deepClone(taskForm);
      if (this.taskInfo != null) {
        this.taskForm.rwTaskId = this.taskInfo.id;
        this.taskForm.projectType = this.taskInfo.taskType;
        this.taskForm.projectName = this.taskInfo.taskName;
        this.taskForm.ownerCompanyId = this.taskInfo.ownerCompanyId;
        Api.getAttachmentFile({
          businessObjId: this.taskInfo.id,
          businessObjType: 7,
        }).then((res) => {
          if (res.code == 200) {
            this.files = res.data.filter((item) => {
              return { name: item.name, url: item.url };
            });
            this.taskForm.fileList = JSON.stringify(this.files);
          }
        });
      }
    },
    /**
     * 上传附件
     * @param {*} file 上传成功的附件信息
     * @param {*} name 附件位置 minutes1：年度标准立项汇总表，minutes2：评审会议纪要
     */
    fileChange(file) {
      this.files = file;
      if (file.length > 0) {
        this.taskForm.fileList = JSON.stringify(file);
        this.$refs.files.clearValidate();
      } else {
        this.taskForm.fileList = "";
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
            this.dialogInfo.loadding = true;
            this.$set(this.dialogInfo, "loadding", true);
            Api.addRwTask(this.taskForm).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("操作成功");
                this.dialogInfo.visible = false;
                this.$emit("save", false);
              } else {
                // this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);
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
.pro-list {
  // margin-top: 140px;
}
::v-deep .taskForm {
  width: 100%;
  overflow: hidden;
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