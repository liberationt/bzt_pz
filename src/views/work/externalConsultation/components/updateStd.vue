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
          <el-form-item label="标准名称" prop="stdName">
            <el-input
              v-model="formValue.stdName"
              placeholder="请输入标准名称"
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
          <el-form-item label="上传附件" prop="fileList">
            <!-- prop="currentAttachments" -->
            <BztUploadFile
              :value="formValue.fileList"
              :limit="1000"
              :fileSize="100"
              @upload-change="fileChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <!-- 选择人员 -->
     <!-- v-if="changeUserDialog.visible===true" -->
    <BztDialog :dialogInfo="changeUserDialog" v-if="changeUserDialog.visible===true" @close="closeChangeUser">
      <template slot="body">
        <!-- <SelectUserByDept
          :value="formValue.userList ? formValue.userList : ''"
          :hasDeptId="true"
          :roleKeys="'stdLiaison'"
          :checkDepAllUser="true"
          :isDefaultValue="true"
          :defaultCheckedValue="defaultCheckedValue"
          @user-change="userChange"
        /> -->
        <el-collapse v-model="activeName">
          <el-collapse-item title="部门网员" name="1">
            <SelectUserByDept
              :value="resive"
              :roleKeys="'stdLiaison'"
              :hasDeptId="true"
              @user-change="userChange"
            />
          </el-collapse-item>
          <el-collapse-item title="委员" name="2">
           <SelectUserByDept
              :value="otherResive"
              :hasDeptId="true"
              :roleKeys="''"
              @user-change="userChanges"
            />
          </el-collapse-item>
          
        </el-collapse>

      </template>
    </BztDialog>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
export default {
  components: { BztDialog, BztUploadFile, SelectUserByDept },
  name: "updateStd",
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
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      activeName:'1',
      resive:'',
      otherResive:'',
      dialogInfo: {
        visible: false,
        title: "添加标准",
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
        date: {
          required: true,
          message: "请输选择起止时间",
          trigger: ["change", "blur"],
        },
        fileList: {
          required: true,
          message: "请上传附件",
          trigger: ["change"],
        },
      },
      currentAttachments: [],
      formValue: {
        stdName: "",
        userList: "",
        date: "",
        fileList: "",
        id: null,
      },
      defaultCheckedValue:[],
      defaultCheckedValues:[]
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      if (this.visiable === true) {
        this.formValue.fileList = [];
        this.initPage();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.formValue.fileList = [];
      this.initPage();
    }
  },
  methods: {
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      console.log(this.formData);
      Object.keys(this.formData).map((key) => {
        this.formValue[key] = this.formData[key];
      });
      this.formValue["date"] = [this.formData.startTime, this.formData.endTime];
      this.filterFiles();
    },
    /**
     * 获取人员name
     */
    getUserName(ids) {
      console.log(ids,"getUserNamegetUserNamegetUserNamegetUserNamegetUserName");
      let arr = [];
      if (ids != "" && ids != null) {
        JSON.parse(ids).forEach((item) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (item.userId == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(item.userId) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
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
      this.changeUserDialog.visible = false;
      if(e===false){
        this.formValue.userList = ""
        this.resive = ""
        this.defaultCheckedValue = []  //重置已选中的部门id
        this.defaultCheckedValues = []  //重置已选中的部门id
        this.otherResive = ""
      }else{
        // if(this.resive&&this.otherResive){
        //   this.formValue.userList= JSON.stringify(JSON.parse(this.resive).concat(JSON.parse(this.otherResive)))
        // }
        let resive = this.resive?JSON.parse(this.resive):[];
        let otherResive = this.otherResive?JSON.parse(this.otherResive):[]
        this.formValue.userList= JSON.stringify(resive.concat(otherResive))
        this.resive = ""
        this.otherResive = ""
      }

      // console.log(this.formValue.userList,"this.formValue.userList")
    },
    /**
     * 处理人员
     */
    userChange(e,checkDepts=null) {
      this.defaultCheckedValue = checkDepts
      
      if(e&&e.length){
        e.forEach((item)=>{
          item.isWy = 0
        })
      }
      this.resive = JSON.stringify(e);
      // this.resive = JSON.stringify(e);
      // this.formValue.userList= this.resive.concat(this.otherResive)
    },
    userChanges(e,checkDepts=null){
      this.defaultCheckedValues = checkDepts
       if(e&&e.length){
        e.forEach((item)=>{
          item.isWy = 1
        })
      }
      this.otherResive = JSON.stringify(e);
      // this.formValue.userList= this.otherResive.concat(this.resive)
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.formValue.fileList = e;
      this.formValue.currentAttachments =
        this.formValue.fileList.length == 0
          ? ""
          : JSON.stringify(
              this.formValue.fileList.map((item) => {
                return { name: item.name, url: item.url };
              })
            );
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (
        this.formValue.currentAttachments != null &&
        this.formValue.currentAttachments != ""
      ) {
        JSON.parse(this.formValue.currentAttachments).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filepath,
          };
          this.fileList.push(file, this.formValue);
        });
      }
      console.log(this.fileList);
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.stdForm.validate((valid) => {
          if (valid) {
            this.formValue.startTime = this.formValue.date[0];
            this.formValue.endTime = this.formValue.date[1];
            this.dialogInfo.loadding = true;
            let formReq = {};
            Object.keys(this.formValue).map((key) => {
              if (key != "date" && key != "fileList") {
                formReq[key] = this.formValue[key];
              }
            });
            Api.addStdAdvice(formReq).then((res) => {
              this.dialogInfo.loadding = false;
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("标准已更新");
                this.dialogInfo.visible = false;
                this.$emit("save", null);
              } else {
                // this.$message.error(msg);
              }
            })
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