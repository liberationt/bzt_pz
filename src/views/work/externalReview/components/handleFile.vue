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
          label="审核结论"
          prop="state"
          v-if="taskInfo.childTaskState == 15007"
        >
          <el-radio-group v-model="uploadForm.state">
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="2"> 不通过 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="修改原因"
          prop="opinion"
          v-if="uploadForm.state == 2"
        >
          <el-input
            type="textarea"
            placeholder="请输入修改原因"
            v-model="uploadForm.opinion"
          />
        </el-form-item>
         <el-form-item label="会议纪要">
          <BztUploadFile
            :value="minutesList2"
            :limit="1"
            :fileSize="100"
            @upload-change="fileChange($event, 'minutes2')"
          />
        </el-form-item>

        <el-form-item label="相关附件">
          <BztUploadFile
            :value="minutesList1"
            :limit="1"
            :fileSize="100"
            :fileType="['xls', 'xlsx']"
            @upload-change="fileChange($event, 'minutes1')"
          />
        </el-form-item>
        <el-divider>选择审核人</el-divider>      
        <el-form-item label="部门领导" prop="lastSecondAuditUser">
          <el-select
            v-model="uploadForm.lastSecondAuditUser"
            filterable
            clearable
            placeholder="请选择部部门领导"
            :disabled="taskInfo.taskStatus == 5 || disabled"
          >
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
          this.taskInfo.taskState == 15001
            ? this.title
            : this.taskInfo.taskState == 7108
            ? "起草复审结论通知"
            : "部门复审结论审核";
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准化审核",
        width: "800px",
        footer: true,
        loadding: false,
      },
      uploadForm: {
        currentAttachments: null,
        state: "",
        lastSecondAuditUser: "",
        opinion:''
      },
      rules: {
        state: {
          required: true,
          message: "请选择审核结论",
          trigger: "blur",
        },
        lastSecondAuditUser: {
          required: true,
          message: "请选择审核人",
          trigger: "blur",
        },
        opinion: {
          required: true,
          message: "请输入理由",
          trigger: "blur",
        },
      },
      minutesList1: [],
      minutesList2: [],
      note: "",
      lastFirstAuditUser: "",
      lastSecondAuditUser: "",
      directorList: [],
      deptList: [],
      disabled: false,
    };
  },

  mounted() {
    // this.getDeptList('standardBusinessSupervisor')
    this.getDeptList("principalLeader", this.userInfo.deptId);
    if (this.taskInfo.childTaskState == 15007||this.taskInfo.secondAuditUser!='') {
      this.getNote();
    }
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
  },

  methods: {
    getNote() {
      let rwTaskId = this.taskInfo.childTaskId;
      Api.getRwProcessorTask(rwTaskId).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.uploadForm.note = data;
          this.disabled = data.deptLeader?true:false;
          this.uploadForm.lastSecondAuditUser = data.deptLeader?Number(data.deptLeader):'';
          let fileList = JSON.parse(data.fileList);
          this.minutesList1 = fileList.filter((item) => item.type == 1);
          this.minutesList2 = fileList.filter((item) => item.type == 2);
        }
      });
    },
    //获取人员
    getDeptList(roleKeys, deptIds = null) {
      let data = {
        roleKeys,
      };
      if (deptIds) {
        data.deptIds = deptIds;
      }
      listUserByDeptsAndRoleKeys(data).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if (deptIds) {
            //部门主管
            this.deptList = data;
          } else {
            //标准化业务主管:
            this.directorList = data;
          }
        }
      });
    },
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
        this.$refs.uploadForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);
            if (this.taskInfo.childTaskState == 15007) {
              const req = {
                id: this.taskInfo.childTaskId,
                parentTaskId: this.taskInfo.id,
                state: this.uploadForm.state,
                opinion: this.uploadForm.opinion,
                workItemId: this.taskInfo.workItem,
              };
              Api.leaderExamineHandle(req).then((res) => {
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
            } else {
              if(!this.minutesList2.length){
                this.dialogInfo.loadding = false;
                return this.$message.warning("请上传会议纪要")
              }
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
              const req = {
                id: this.taskInfo.childTaskId,
                fileList: JSON.stringify(arr),
                deptLeader: this.uploadForm.lastSecondAuditUser,
              };
              Api.choiceLeader(req).then((res) => {
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