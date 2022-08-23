<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event)"
      :appendTobody="false"
    >
      <template slot="body">
        <el-form
          :model="formValue"
          :rules="rules"
          ref="stdForm"
          label-suffix=":"
          label-width="100px"
          class="stdForm"
          v-if="formValue != null"
        >
          <el-form-item label="标准名称">
            {{ formValue.stdName }}
          </el-form-item>
          <el-form-item label="起止时间" prop="date">
            <el-date-picker
              v-model="formValue.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="处理人员" prop="userList">
            <el-input
              type="textarea"
              autosize
              placeholder="请选择处理人员"
              :value="getUserName(formValue.userList)"
              readonly
              @focus="changeMainEditor()"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <!-- 选择人员 -->
    <BztDialog :dialogInfo="changeUserDialog" v-if="changeUserDialog.visible==true" @close="closeChangeUser">
      <template slot="body">
        <SelectUserByDept
          :value="formValue.userList ? formValue.userList : ''"
          :disableUsers="userId"
          :onlyUser="true"
          :hasDeptId="true"
          :deptIds="userInfo.deptId.toString()"
          @user-change="userChange"
        />
        <!-- 
          :hasDeptId="true"
          roleKeys="stdLiaison"
          :onlyUser="true"
          :deptIds="userInfo.deptId.toString()" -->
      </template>
    </BztDialog>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { SelectUserByDept } from "@components/bussinessCom/index";
import { mapGetters } from "vuex";
export default {
  components: { BztDialog, BztUploadFile, SelectUserByDept },
  name: "assignTask",
  computed: {
    ...mapGetters(["userInfo"]),
    userId(){
      let userId = ""
      if(this.userIds){
        userId =this.userIds.split(",").filter(item=>item!= this.userInfo.userId)
      }
      console.log(userId.join(","),99)
      return userId.join(",")
    },
    pickerOptions(time) {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        return (
            new Date(this.formData.startTime).getTime() > time.getTime() ||
            time.getTime() > new Date(this.formData.endTime).getTime()
          );
      };
      return disableTime;
    },
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    formData: {
      type: Object,
      default: null,
    },
    processAs: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "分配任务",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确定",
      },
      changeUserDialog: {
        visible: false,
        title: "选择处理人员",
        width: "900px",
        footer: true,
        loadding: false,
      },
      tecCommitteesList: [],
      userList: [],
      rules: {
        stdName: {
          required: true,
          message: "请输入标准名称",
          trigger: "blur",
        },
        userList: {
          required: true,
          message: "请输选择处理人员",
          trigger: ["change", "blur"],
        },
        date:{
          required: true,
          message: "请选择起止时间",
          trigger: ["change", "blur"],
        }
      },
      currentAttachments: [],
      formValue: {
        stdName: "",
        userList: "",
        fileList: "",
        id: null,
        workItemId: "",
        date:''
      },
      userIds: "",
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      if (this.visiable === true) {
        this.getUserByTaskId();
        this.initPage();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.getUserByTaskId();
      this.initPage();
    }
  },
  methods: {
    /**
     * 获取已分配的人员
     */
    getUserByTaskId() {
      const req = { adviceTaskId: this.formData.adviceTaskId };
      Api.findUserIdByTaskId(req).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.userIds = data.join(",");
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 格式父组件传值
     */
    initPage() {
      console.log(this.formData,888)
      this.dialogInfo.loadding = false;
      Object.keys(this.formData).map((key) => {
        this.formValue[key] = this.formData[key];
      });

      // this.formValue["date"] = [this.formData.startTime, this.formData.endTime];
      // this.filterFiles();
    },
    /**
     * 获取人员name
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "" && ids != null) {
        JSON.parse(ids).forEach((item) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (item.userId == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(item.userId) });
          arr.push(user ? user.nickName : "-");
        });
      }
      return arr.length > 0 ? arr.join(",") : "";
    },
    /**
     * 选择主要起草人
     */
    changeMainEditor() {
      if (this.isEdit == true) {
        this.changeUserDialog.visible = true;
      }
    },
    /**
     * 确认选择主要起草人
     */
    closeChangeUser(e) {
      if(e==false){
        this.formValue.userList = ""
      }
        this.changeUserDialog.visible = false;
    },
    /**
     * 处理人员
     */
    userChange(e) {
      this.formValue.userList = JSON.stringify(e);
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.stdForm.validate((valid) => {
          if (valid) {
            this.dialogInfo.loadding = true;
            let formReq = {};
            Object.keys(this.formValue).map((key) => {
              if (key != "fileList") {
                formReq[key] = this.formValue[key];
              }
            });
            formReq["processAs"] = this.processAs;
            formReq["workItemId"] = this.formData.workItemId;
            formReq["startTime"] = this.formValue.date[0];
            formReq["endTime"] = this.formValue.date[1];
            Api.addPersonnelAdvice(formReq).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("已分配人员");
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