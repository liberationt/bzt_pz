<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="true"
    >
      <template slot="body" v-if="infoForm != null">
        <el-form
          :model="infoForm"
          :rules="rules"
          ref="infoForm"
          label-suffix=":"
          label-width="180px"
          class="infoForm"
        >
          <template v-if="infoForm.status != null">
            <el-form-item
              label="驳回原因"
              class="reason"
              v-if="infoForm.status != 1"
            >
              <div class="reason-content">
                {{ infoForm.rejectReason }}
              </div>
            </el-form-item>
          </template>
          <el-form-item label="标题" prop="infoTitle">
            <el-input v-model="infoForm.infoTitle" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <!-- <el-input type="textarea" v-model="infoForm.content" /> -->
            <TinymceEditor
              editorName="content"
              :cur-value="infoForm.content"
              v-model="infoForm.content"
              :height="'200px'"
            />
          </el-form-item>

          <el-form-item label="附件" ref="uploadFile" prop="filesPath">
            <BztUploadFile
              :value="fileList"
              :limit="10"
              :fileSize="100"
              @upload-change="fileChange"
            />
          </el-form-item>

          <template v-if="infoForm.infoTheme == 1||infoForm.infoTheme == 2 ||infoForm.infoTheme == 4||infoForm.infoTheme == 5">
            <el-divider>审核人选择</el-divider>
          </template>
          <el-form-item
            label="标准化业务主管"
            prop="firstAuditUser"
            v-if="infoForm.infoTheme == 1||infoForm.infoTheme == 2||infoForm.infoTheme == 4||infoForm.infoTheme == 5"
            key="firstAuditUser"
          >
            <el-select v-model="infoForm.firstAuditUser" clearable filterable placeholder="请选择标准化业务主管">
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
            key="secondAuditUser"
            v-if="infoForm.infoTheme == 1||infoForm.infoTheme == 2||infoForm.infoTheme == 4||infoForm.infoTheme == 5"
          >
            <el-select v-model="infoForm.secondAuditUser" placeholder="请选择科技管理部部门领导" clearable filterable>
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
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import {
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";
const infoForm = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  status: null,
  infoPublishId: null,
  date: [],
  remark: "",
  businessObjId: "",
  receiver: "",
  firstAuditUser:'',
  secondAuditUser:'',
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
  dataShow: 0, // 通知公告是否展示时间日期 0不展示，1展示
};
const infoFormReq = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  status: null,
  infoPublishId: null,
  remark: "",
  receiver: "",
  firstAuditUser:null, //标准化业务主管
  secondAuditUser:null, //科技管理部部门领导
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
  dataShow: 0, // 通知公告是否展示时间日期 0不展示，1展示
};
export default {
  components: { BztDialog, BztUploadFile },
  computed: {
    ...mapGetters(["userInfo"]),
    pickerOptionsPlan() {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        if (this.infoForm.date != null && this.infoForm.date.length > 0) {
          return (
            new Date(this.infoForm.date[1]).getTime() > time.getTime() ||
            time.getTime() < Date.now() - 8.64e7
          );
        } else {
          return time.getTime() < Date.now() - 8.64e7;
        }
      };
      return disableTime;
    },
  },
  name: "PublicInfo",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: Array,
      default:()=>{
        return []
      },
    },
    data: {
      type: Object,
      default: {
        formData: {
          content: "",
          endDate: "",
          filesPath: "",
          infoTheme: null,
          infoTitle: "",
          startDate: "",
          businessObjId: "",
          status: null,
          fileList:[]
        }, // 表单数据
        type: 5, // 1:暂存 2:一级审核 3:二级审核 4:驳回修改 5:发布
      },
    },
    infoTheme: {
      type: String | Number,
      default: null,
    },
    showZCBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "选择审核人",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "立即发布",
      },
      changeUserDialog: {
        visible: false,
        title: "选择处理人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      infoForm: null,
      formatStr: "yyyy-MM-dd",
      rules: {
        content: { required: true, message: "请输入发布内容", trigger: ["blur"] },
        infoTheme: { required: true, message: "请选择主题", trigger: ["blur",'change' ]},
        infoTitle: { required: true, message: "请输入标题", trigger: "blur" },
        date: {
          required: true,
          message: "请选择起止时间",
          trigger: ["change", "blur"],
        },
        receiver: {
          required: true,
          message: "请选择处理人",
          trigger: ["change", "blur"],
        },
        businessObjId: {
          required: true,
          message: "请选择归口单位",
          trigger: ["change", "blur"],
        },
        file: {
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
        filesPath: {
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
        fileList:{
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
        firstAuditUser:{
          required: true,
          message: "请选择标准化业务主管",
          trigger: ["change", "blur"],
        },
        secondAuditUser:{
          required: true,
          message: "请选择科技管理部部门领导",
          trigger: ["change", "blur"],
        },
      },
      fileList: [],
      userList: [],
      directorList:[], //主管
      deptList:[]
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = val;
      this.dialogInfo.loadding = false;
      this.fileList = [];
      if (val == true) {
        this.dialogInfo.visible = this.visiable;
        this.dialogInfo.loadding = false;
        if (this.data.formData === null) {
          this.infoForm = _.cloneDeep(infoForm);
          this.infoForm.infoTheme = this.infoTheme;
        } else {
          this.infoForm = _.cloneDeep(this.data.formData);
          this.$set(this.infoForm, "date", [
            this.infoForm.startDate,
            this.infoForm.endDate,
          ]);
          this.filterFiles();
        }
        if (this.infoForm.infoTheme == 5) {
          this.getCheckUserList();
        }
      }
    },
    data(val) {
      this.dialogInfo.loadding = false;
      this.fileList = [];
      if (val.formData === null) {
        this.infoForm = _.cloneDeep(infoForm);
        this.infoForm.infoTheme = this.infoTheme;
      } else {
        this.infoForm = _.cloneDeep(val.formData);
        this.$set(this.infoForm, "date", [
          this.infoForm.startDate,
          this.infoForm.endDate,
        ]);
        if (this.infoForm.infoTheme == 2) {
          this.dialogInfo.title = "发起标准编制工作通知";
        }
        this.filterFiles();
      }
      if (this.infoForm.infoTheme == 5) {
        this.getCheckUserList();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.fileList = [];
    this.dialogInfo.loadding = false;
    if (this.data.formData === null) {
      this.infoForm = _.cloneDeep(infoForm);
      this.infoForm.infoTheme = this.infoTheme;
      this.fileList = [];
    } else {
      this.infoForm = _.cloneDeep(this.data.formData);
      this.$set(this.infoForm, "date", [
        this.infoForm.startDate,
        this.infoForm.endDate,
      ]);
      this.filterFiles();
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
          // this.userList = rows;
        }
      });
    },

    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.infoForm.fileList = e;
      let files = [];
      this.fileList.forEach((item) => {
        const file = {
          fileName: item.name,
          filePath: item.url,
        };
        files.push(file);
      });
      this.infoForm.filesPath =
        files.length === 0 ? null : JSON.stringify(files);
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (this.infoForm.filesPath != null) {
        JSON.parse(this.infoForm.filesPath).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filePath,
          };
          this.fileList.push(file);
        });
      }
    },
    /**
     * 关闭弹框 提交/暂存/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.dialogInfo.loadding = false;
        this.$refs.infoForm.validate((valid) => {
          if (
            valid 
          ) {
            let files = [];
            this.fileList.forEach((item) => {
              const file = {
                fileName: item.name,
                filePath: item.url,
              };
              files.push(file);
            });
            this.infoForm.filesPath =
              files.length === 0 ? null : JSON.stringify(files);

            let formData = _.cloneDeep(infoFormReq);
            Object.keys(formData).map((key) => {
              formData[key] = this.infoForm[key];
            });
            this.dialogInfo.loadding = true;
            if (formData.infoPublishId === null) {
              if (flag === 1) {
                formData.status = 1;
              } else {
                formData.status = this.data.type;
              }
              formData.businessObjId = this.infoForm.businessObjId;
              //更新外部结果
              Api.updateFinalReviewResults({
                projectApprovalIds:  this.businessObjId ,
                conclusion: 1,
              }).then((req) => {
                const { code, msg } = req;
                if (code === 200) {
                  Api.infoPublish(formData).then((res) => {
                    const { code, data, msg } = res;
                    if (code === 200) {
                      this.$message.success(
                        formData.status === 1 ? "信息已暂存" : "信息已发布"
                      );
                      this.$emit("save", true);
                    } else {
                      // this.$message.error(msg);
                    }
                    this.dialogInfo.visible = false;
                  });
                  this.dialogInfo.loadding = false;
                } 
              });
            } else {
              if (flag === 1) {
                formData.status = formData.status === 1 ? 1 : 4;
              } else {
                formData.status =
                  formData.status === 4
                    ? this.data.formData.secondAuditUser == null
                      ? 2
                      : 3
                    : 2;
              }
              this.dialogInfo.loadding = true;
              if (this.infoForm.infoTheme == 4) {
                formData.businessObjId = this.infoForm.businessObjId;
              }
              // Api.updateFinalReviewResults({
              //   projectApprovalIds: [this.businessObjId],
              //   conclusion: 1,
              // }).then((req) => {
              //   Api.updatePublish(formData).then((res) => {
              //     const { code, data, msg } = res;
              //     if (code === 200) {
              //       this.$message.success(
              //         formData.status === 4 ? "信息已暂存" : "信息已发布"
              //       );
              //       this.$emit("save", true);
              //     } else {
              //       // this.$message.error(msg);
              //     }
              //     this.dialogInfo.visible = false;
              //   });
              //   this.dialogInfo.loadding = false;
              // })
              Api.updatePublish(formData).then((res) => {
                const { code, data, msg } = res;
                if (code === 200) {
                  this.$message.success(
                    formData.status === 4 ? "信息已暂存" : "信息已发布"
                  );
                  this.$emit("save", true);
                } else {
                  // this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
              });
              this.dialogInfo.loadding = false;
            }
          } else {
            return false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", false);
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