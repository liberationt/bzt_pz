<template>
  <div class="handle-com operation-line">
    <!-- 立项 -->
    <template v-if="projectPhase == '10'">
      <!-- v-if="type == '901'" -->
      <template>
        <div
          class="submit-btn"
          @click="applay"
          v-if="
            showApply === true && (type == '901' || type == '' || type == null)
          "
        >
          <i class="el-icon-edit-outline" />
          申请立项
        </div>
      </template>
      <template
        v-if="type == '902'"
        v-hasPermi="['externalStdRevise:deptAudit']"
      >
        <div class="submit-btn" @click="exportApplySuumaryFile(1)">
          <i class="el-icon-download" />
          导出立项申请汇总表
        </div>
        <div class="green-btn" @click="uploadMinutes(1)">
          <i class="el-icon-upload2" />
          上传汇总结论
        </div>
        <div class="green-btn" @click="batchAuditWindow(1, 1)">
          <svg-icon icon-class="batch" style="color: #ffffff" />
          <!-- 批量审核 -->
          在线审核
        </div>
      </template>
      <template
        v-if="type == '903'"
        v-hasPermi="['externalStdRevise:companyAudit']"
      >
        <!-- <div class="submit-btn" @click="exportApplySuumaryFile(1)">
          <i class="el-icon-download" />
          导出部门汇总表
        </div> -->
        <div class="submit-btn" @click="exportApplySuumaryFile(1)">
          <i class="el-icon-download" />
          导出立项申请汇总表
        </div>
        <div class="green-btn" @click="uploadMinutes(2)">
          <i class="el-icon-upload2" />
          <!-- 上传汇总结论 -->
          上传汇总结论
        </div>
        <div class="green-btn" @click="batchAuditWindow(1, 2)">
          <svg-icon icon-class="batch" style="color: #ffffff" />
          <!-- 批量审核 -->
          在线审核
        </div>
        <!-- <div class="yellow-btn" @click="openInterfacePerson">
          <i class="el-icon-edit-outline" />
          选择标准化对接人
        </div> -->
      </template>
      <template
        v-if="type == '904'"
        v-hasPermi="['externalStdRevise:updateResult']"
      >
        <div class="submit-btn" @click="exportPlanFile">
          <i class="el-icon-download" />
          导出企业标准制修订计划
        </div>
        <!-- <div class="submit-btn" @click="updatePSJGAction(0)">
          <i class="el-icon-upload2" />
          更新外部评审结果
        </div> -->
      </template>
    </template>

    <!-- 起草阶段 -->
    <template v-if="projectPhase == '20' && this.$route.query.hook">
      <div class="submit-btn" @click="addStd" v-if="showAddStdBtn == true">
        <i class="el-icon-edit-outline" />
        添加外部标准
      </div>
    </template>
    <!-- 上传汇总结论 -->
    <BztDialog :dialogInfo="dialogMinutesInfo" @close="saveMinutes">
      <template slot="body">
        <el-form
          :model="minutesForm"
          :rules="minutesRules"
          ref="minutesForm"
          label-suffix=":"
          label-width="280px"
          class="minutesForm"
          v-if="minutesForm != null"
        >
          <el-form-item
            :label="`${new Date().getFullYear()}年度企业技术标准立项申请汇总表`"
            prop="projectSummaryPath"
            ref="projectSummaryPath"
          >
            <BztUploadFile
              :value="minutesList1"
              :limit="1"
              :fileSize="100"
              :fileType="['xls', 'xlsx']"
              @upload-change="fileChange($event, 'minutes1')"
            />
          </el-form-item>
          <el-form-item label="评审会议纪要">
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

    <UpdateWBPSJG
      :projects="projects"
      :visiable="updateWBPSJGVisible"
      @save="updatePSJGAction(null)"
    />

    <!-- 添加外部制修订标准 -->
    <CreateStd
      :visiable="stdVisiable"
      :ownerDeptId="ownerDeptId"
      @save="saveStd"
      :hook="this.$route.query.hook"
    />

    <!-- 批量（在线）评审 -->
    <AuditOnline
      v-if="auditVisiable == true"
      :visiable="auditVisiable"
      :projectList="auditProjects"
      :reviewType="reviewType"
      @success="batchAuditWindow(0, null)"
    />
  </div>
</template>
<script>
import infoApi from "@api/infoModule";
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { SelectUserByDept, PublicInfo } from "@/components/bussinessCom/index";
import UpdateWBPSJG from "./handle/updateWBPSJG.vue";
import CreateStd from "./createStd.vue";
import { mapGetters } from "vuex";
import AuditOnline from "./handle/auditOnline.vue";

const minutesForm = {
  meetingMinutesName: "",
  meetingMinutesPath: "",
  projectSummaryPath: "",
  importType: null,
};
const interfacrPersonForm = {
  projectApprovalIds: [],
  interfacePersonIds: [],
};
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztDialog,
    BztUploadFile,
    SelectUserByDept,
    PublicInfo,
    UpdateWBPSJG,
    CreateStd,
    AuditOnline,
  },
  name: "handle-com",
  props: ["projectPhase", "type", "projects", "ownerDeptId"],
  // dicts: ["info_publish_theme", "info_publish_status"],
  data() {
    return {
      showApply: false,
      infoPublishId: "",
      dialogMinutesInfo: {
        visible: false,
        title: "上传汇总结论",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确定",
      },
      dialogInterFacePerson: {
        visible: false,
        title: "选择对接人",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确定",
      },
      minutesForm: this.deepClone(minutesForm),
      minutesRules: {
        meetingMinutesPath: {
          required: true,
          message: "请上传汇总结论文件",
          trigger: ["change", "blur"],
        },
        projectSummaryPath: {
          required: true,
          message: "请上传年度标准立项汇总表",
          trigger: ["change", "blur"],
        },
      },
      minutesList1: [],
      minutesList2: [],
      interfacrPersonForm: this.deepClone(interfacrPersonForm),
      deliverNoticeVisiable: false,
      infoData: {
        formData: null,
        type: null,
      },
      projectList: [],
      updateWBPSJGVisible: false,
      stdVisiable: false,
      infoHook: null,
      showAddStdBtn: false,
      isShow1003: false,
      auditVisiable: false,
      auditProjects: [],
      reviewType: 1,
    };
  },
  watch: {
    type(val) {
      this.getInfoPublic();
      this.checkHook();
      if (this.projectPhase == 10 && this.type == 1005) {
        this.getPorjects();
      } else if (this.projectPhase == 20) {
        this.checkHook();
      }
      if (this.projectPhase == 10 && (this.type == 903 || this.type == "904")) {
        this.isShow();
      }
    },
  },
  mounted() {
    this.getInfoPublic();
    this.checkHook();
    if (this.projectPhase == 10 && this.type == 904) {
      this.getPorjects();
    } else if (this.projectPhase == 20) {
      this.checkHook();
    }
    if (this.projectPhase == 10 && (this.type == 903 || this.type == "904")) {
      this.isShow();
    }
  },
  methods: {
    isShow() {
      if (this.type == "903" || this.type == "904") {
        Api.getInfoPublishUser(this.type).then((res) => {
          const { code, data, msg } = res;
          if (code == 200) {
            this.isShow1003 = false;
            data.forEach((user) => {
              if (user.userId == this.userInfo.userId) {
                this.isShow1003 = true;
              }
            });
          } else {
            this.$meassage.error(msg);
          }
        });
      }
    },
    /**
     * 获取立项发布按钮权限
     */
    getInfoPublic() {
      const req = {
        infoTheme: "4",
        status: "5",
        isPublish: 1,
      };
      infoApi.infoPblicList(req).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.showApply = total > 0 ? true : false;
          if (total > 0) {
            this.infoPublishId = rows[0].infoPublishId;
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 查询hook是否已被占用
     */
    checkHook() {
      const req = {
        projectPhase: "20",
        projectName: "",
        scplatMode: "",
        applyCompanyId: "",
        projectStatus: "",
        projectState: null,
        projectType: 5,
        hook: this.$route.query.hook,
        pageNum: 1,
        pageSize: 10,
      };
      Api.enReviseList(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.showAddStdBtn = data.total == 0 ? true : false;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取待发布通知的项目列表
     */
    getPorjects() {
      const req = {
        projectState: 1005,
        projectType: 1,
        notFinished: 1,
      };
      Api.getProjectApprovalList(req).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.projectList = rows;
          console.log(this.projects, rows);
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 申请立项
     */
    applay() {
      // this.$router.push({
      //   path: `/work/enterpriseStdRevise/applyProject/${this.infoPublishId}`,
      // });
      this.$emit("apply", this.infoPublishId);
    },
    /**
     * 导出理想申请汇总表
     */
    exportApplySuumaryFile(flag) {
      this.$emit("export", flag);
    },
    /**
     * 导出制修订计划汇总表
     */
    exportPlanFile() {
      this.$emit("exportPlanFile", null);
    },
    /**
     * 导出企业技术标准计划项目申请汇总表
     */
    exportApplicationForm() {
      this.$emit("exportApplicationForm", null);
    },
    /**
     * 上传汇总结论
     */
    uploadMinutes(type) {
      this.minutesForm = this.deepClone(minutesForm);
      this.minutesList1 = [];
      this.minutesList2 = [];
      this.minutesForm.importType = type;
      this.minutesForm.projectType = 2;
      this.dialogMinutesInfo.visible = true;
    },
    /**
     * 保存取消上传汇总结论
     */
    saveMinutes(e) {
      if (e == true) {
        this.$refs.minutesForm.validate((val) => {
          if (val) {
            this.dialogMinutesInfo.loadding = true;
            this.$set(this.dialogMinutesInfo, "loadding", true);
            Api.importFileByDept(this.minutesForm).then((res) => {
              const { code, data, msg } = res;
              this.dialogMinutesInfo.loadding = false;
              this.$set(this.dialogMinutesInfo, "loadding", false);
              if (code === 200) {
                this.$message.success("汇总结论上传成功");
                this.dialogMinutesInfo.visible = false;
                this.$emit("success", true);
              } else {
                // this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.dialogMinutesInfo.visible = false;
        this.$emit("success", false);
      }
    },
    /**
     * 上传附件
     * @param {*} file 上传成功的附件信息
     * @param {*} name 附件位置 minutes1：年度标准立项汇总表，minutes2：评审会议纪要
     */
    fileChange(file, name) {
      switch (name) {
        case "minutes1":
          this.minutesForm.projectSummaryPath = file[0].url;
          if(file&&file.length){
            this.$refs.projectSummaryPath.clearValidate()
          }
          break;
        case "minutes2":
          this.minutesForm.meetingMinutesPath = file[0].url;
          this.minutesForm.meetingMinutesName = file[0].name;
          break;
      }
    },
    /**
     * 选择对接人
     */
    openInterfacePerson() {
      if (this.projects.length == 0) {
        this.$message.warning("还未选择项目，请选择项目！");
      } else {
        this.interfacrPersonForm = this.deepClone(interfacrPersonForm);
        this.interfacrPersonForm.projectApprovalIds = this.projects.map(
          (pro) => {
            console.log(pro);
            return pro.id;
          }
        );
        this.dialogInterFacePerson.visible = true;
      }
    },
    /**
     * 获取选择的人员
     */
    userChange(e) {
      this.interfacrPersonForm.interfacePersonIds = e;
    },
    /**
     * 保存对接人
     */
    saveInterFacePerson(e) {
      if (e === true) {
        this.dialogInterFacePerson.loadding = true;
        if (this.interfacrPersonForm.interfacePersonIds.length > 0) {
          Api.selectedInterfacePerson(this.interfacrPersonForm).then((res) => {
            this.dialogInterFacePerson.loadding = false;
            const { code, data, msg } = res;
            if (code === 200) {
              this.$message.success("标准化对接人已设置");
              this.dialogInterFacePerson.visible = false;
              this.$emit("success", true);
            } else {
              // this.$message.error(msg);
            }
          });
        } else {
          this.$message.warning("还未选择对接人,请选择对接人");
        }
      } else {
        this.dialogInterFacePerson.visible = false;
        this.$emit("success", false);
      }
    },
    /**
     * 发布信息通知
     */
    infoPublic() {
      // if (this.projects.length == 0) {
      //   this.$message.warning("还未选择项目，请选择项目！");
      // } else {
      //   }
      this.deliverNoticeVisiable = true;
    },
    /**
     * 保存(取消)信息
     */
    saveInfo(e) {
      this.deliverNoticeVisiable = false;
      this.$emit("success", e);
    },
    /**
     * 更新外部评审结果
     */
    updatePSJGAction(e) {
      if (e == 0) {
        if (this.projects.length == 0) {
          this.$message.warning("还未选择项目，请选择项目！");
        } else {
          let ids = [];
          this.projects.forEach((item) => {
            ids.push(item.id);
          });
          // Api.checkFinalReviewUser(ids.join(",")).then((res) => {
          //   const { code, msg } = res;
          //   if (code == 200) {
          //     this.updateWBPSJGVisible = true;
          //   } else {
          //     this.$message.warning(msg);
          //   }
          // });
          this.updateWBPSJGVisible = true;
        }
      } else {
        this.updateWBPSJGVisible = false;
        this.$emit("success", null);
      }
    },
    checkFinalReviewUser() {
      let ids = [];
      this.projects.forEac((item) => {
        ids.push(item.id);
      });
    },
    /**
     * 添加外部标准
     */
    addStd() {
      this.stdVisiable = true;
    },
    /**
     * 保存提交/取消外部标准创建
     */
    saveStd() {
      this.checkHook();
      this.$emit("success", null);
      this.stdVisiable = false;
    },
    getRoles(data) {
      let has = false;
      this.userInfo.roles.forEach((item) => {
        if (item.roleKey == data) {
          has = true;
        }
      });
      return has;
    },
    /**
     * 批量（线上审核）
     * 打开（关闭）批量（线上审核）弹框
     *
     * @param {*} flag 1：打开弹框；0：关闭弹框
     *
     */
    batchAuditWindow(flag, reviewType) {
      if (flag == 1) {
        this.reviewType = reviewType;
        this.auditProjects = [];
        let hasNull = false;
        let strName = [];
        let has = false;
        let names = [];
        this.projects.forEach((item) => {
          if (item.workItemId && item.workItemId != null) {
            this.auditProjects.push(item);
          } else {
            hasNull = true;
            names.push(`《${item.projectName}》`);
          }
          if (item.projectStatus == 6) {
            has = true;
            strName.push(`《${item.projectName}》`);
          }
        });
        if (this.auditProjects.length == 0) {
          this.$message.warning("未选择与自己相关的项目，请先选择");
          return;
        } else if (hasNull == true) {
          this.$message.warning(
            `项目：${strName.join(",")}不是与自己相关的项目，请取消`
          );
          return;
        } else if (has == true) {
          this.$message.warning(
            `项目：${names.join(",")}状态为待选择接口对接人，请取消`
          );
          return;
        }
        this.auditVisiable = true;
      } else {
        this.auditVisiable = false;
        this.$emit("success", true);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.handle-com {
  // width: 100%;
}
::v-deep .el-form {
  width: 100%;
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