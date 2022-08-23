<template>
  <div class="handle-com operation-line">
    <!-- 立项 -->
    <template v-if="projectPhase == 10">
      <template>
        <!--  v-if="type == '1001'" -->
        <div class="submit-btn" @click="applay" v-if="showApply === true">
          <i class="el-icon-edit-outline" />
          申请立项
        </div>
      </template>
      <template
        v-if="type == '1002'"
        v-hasPermi="['enterpriseStdRevise:deptAudit']"
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
        v-if="type == '1003'"
        v-hasPermi="['enterpriseStdRevise:companyAudit']"
      >
        <div class="submit-btn" @click="exportApplySuumaryFile(1)">
          <i class="el-icon-download" />
          导出立项汇总表
        </div>
        <div class="puerple-btn" @click="exportApplicationForm">
          <i class="el-icon-download" />
          导出立项申请表
        </div>
        <div class="green-btn" @click="uploadMinutes(2)">
          <i class="el-icon-upload2" />
          上传汇总结论
        </div>
        <div class="green-btn" @click="batchAuditWindow(1, 2)">
          <svg-icon icon-class="batch" style="color: #ffffff" />
          <!-- 批量审核 -->
          在线审核
        </div>
        <div class="yellow-btn" @click="openInterfacePerson">
          <i class="el-icon-edit-outline" />
          选择标准化对接人
        </div>
      </template>
      <template
        v-if="type == '1005'"
        v-hasPermi="['enterpriseStdRevise:infoPublish']"
      >
        <div class="submit-btn" @click="exportPlanFile">
          <i class="el-icon-download" />
          导出企业标准制修订计划
        </div>
        <div class="green-btn" @click="infoPublic">
          <i class="el-icon-edit-outline" />
          发布标准编制工作通知
        </div>
      </template>
      <template v-if="type == '1005'">
        <div class="submit-btn" @click="applaySpecial">
          <i class="el-icon-edit-outline" />
          申请特殊立项
        </div>
      </template>
      <!-- <template v-if="type == '1006' || type == '1007'">
        <div class="submit-btn" @click="applay">
          <i class="el-icon-edit-outline" />
          审核标准编制工作通知
        </div>
      </template>
      <template v-if="type == '1008'">
        <div class="submit-btn" @click="applay">
          <i class="el-icon-edit-outline" />
          发布标准编制工作通知
        </div>
      </template> -->
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

    <!-- 选择标准化对接人 -->
    <BztDialog :dialogInfo="dialogInterFacePerson" v-if="dialogInterFacePerson.visible==true" @close="saveInterFacePerson">
      <template slot="body">
        <SelectUserByDept
          :value="interfacrPersonForm.interfacePersonIds.join(',')"
          :roleKeys="'standardBusinessStaff'"
          :hasDeptId="false"
          @user-change="userChange"
        />
      </template>
    </BztDialog>

    <!--发布标准编制工作通知 -->
    <PublicInfo
      v-if="deliverNoticeVisiable == true"
      :visiable="deliverNoticeVisiable"
      :showZCBtn="false"
      :businessObjId="
        projectList
          .map((pro) => {
            return pro.id;
          })
          .join(',')
      "
      :data="infoData"
      :infoTheme="2"
      ref="publicInfo"
      @save="saveInfo"
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
import {  PublicInfo } from "@/components/bussinessCom/index";
import SelectUserByDept from "@/components/bussinessCom/model/selectDept";
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
    AuditOnline,
  },
  name: "handle-com",
  props: ["projectPhase", "type", "projects", "reqInfoPublishId"],
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
        // meetingMinutesPath: {
        //   required: true,
        //   message: "请上传汇总结论文件",
        //   trigger: ["change", "blur"],
        // },
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
      isShow1003: false,
      auditVisiable: false,
      auditProjects: [],
      reviewType: 1,
      unProjects: [],
    };
  },
  watch: {
    type(val) {
      this.getInfoPublic();
      if (this.projectPhase == 10 && this.type == 1005) {
        this.getPorjects();
      }
      if (this.type == 1003 || this.type == 1005) {
        this.isShow();
      }
    },
    reqInfoPublishId(val) {
      if (this.projectPhase == 10 && this.type == 1005) {
        this.getPorjects();
      }
    },
  },
  mounted() {
    this.getInfoPublic();
    if (this.projectPhase == 10 && this.type == 1005) {
      this.getPorjects();
    }
    if (this.type == 1003 || this.type == 1005) {
      this.isShow();
    }
    console.log(this.userInfo);
  },
  created() {
    // this.getInfoPublic();
    // if (this.projectPhase == 10 && this.type == 1005) {
    //   this.getPorjects();
    // }
  },
  methods: {
    /**
     * 获取权限
     */
    isShow() {
      if (this.type == 1003 || this.type == 1005) {
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
        infoTheme: "1",
        status: "5",
        isPublish: 1,
      };
      infoApi.infoPblicList(req).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          // if (total > 0) {
          //   if (this.type == null || this.type == "1001") {
          //     this.showApply = true;
          //   }
          // }
          this.showApply =
            total > 0
              ? this.type == null ||
                this.type == "1001" ||
                this.type == "null" ||
                this.type == ""
                ? true
                : false
              : false;
          if (total > 0) {
            this.infoPublishId = rows[0].infoPublishId;
          }
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
        infoPublishId: this.reqInfoPublishId,
      };
      Api.getProjectApprovalList(req).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.projectList = rows;
          console.log(this.projectList);
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
     * 申请特殊立项
     */
    applaySpecial() {
      this.$emit("apply", null);
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
      this.minutesForm.projectType = 1;
      this.dialogMinutesInfo.visible = true;
    },
    /**
     * 保存取消上传汇总结论
     */
    async saveMinutes(e) {
      if (e == true) {
        this.$refs.minutesForm.validate(async (val) => {
          if (val) {
            // this.dialogMinutesInfo.loadding = true;
            this.$set(this.dialogMinutesInfo, "loadding", true);
            const res = await Api.importFileByDept(this.minutesForm);
            this.$set(this.dialogMinutesInfo, "loadding", false);
            this.dialogMinutesInfo.loadding = false;
            const { code, data, msg } = res;
            if (code === 200) {
              this.$message.success("汇总结论上传成功");
              this.dialogMinutesInfo.visible = false;
              this.$emit("success", true);
            }
          }
        });
      } else {
        this.dialogMinutesInfo.visible = false;
        this.$set(this.dialogMinutesInfo, "loadding", false);
        this.$emit("success", false);
      }
      this.dialogMinutesInfo.loadding = false;
    },
    /**
     * 上传附件
     * @param {*} file 上传成功的附件信息
     * @param {*} name 附件位置 minutes1：年度标准立项汇总表，minutes2：评审会议纪要
     */
    fileChange(file, name) {
      if (file.length > 0) {
        switch (name) {
          case "minutes1":
            this.minutesForm.projectSummaryPath = file[0].url;
            break;
          case "minutes2":
            this.minutesForm.meetingMinutesPath = file[0].url;
            this.minutesForm.meetingMinutesName = file[0].name;
            break;
        }
      } else {
        this.meetingMinutesPath = "";
        this.meetingMinutesName = "";
      }
    },
    /**
     * 选择对接人
     */
    openInterfacePerson() {
      if (this.projects.length == 0) {
        this.$message.warning("还未选择项目，请选择项目！");
      } else if (this.testInterfacePersonProject() == true) {
        this.$message.warning(
          `已选择的项目中包含进行中的项目：${this.unProjects.join(",")}`
        );
      } else {
        this.interfacrPersonForm = this.deepClone(interfacrPersonForm);
        this.interfacrPersonForm.projectApprovalIds = this.projects.map(
          (pro) => {
            return pro.id;
          }
        );
        this.dialogInterFacePerson.visible = true;
      }
    },
    /**
     * 判断项目是否已完成
     */
    testInterfacePersonProject() {
      let has = false;
      this.unProjects = [];
      this.projects.forEach((item) => {
        if (item.projectStatus != 6) {
          has = true;
          this.unProjects.push(`《${item.projectName}》`);
        }
      });
      return has;
    },
    /**
     * 获取选择的人员
     */
    userChange(e) {
      if(e&&e.length){
        this.interfacrPersonForm.interfacePersonIds = e;
      }
    },
    /**
     * 保存对接人
     */
    saveInterFacePerson(e) {
      if (e === true) {
        this.dialogInterFacePerson.loadding = true;
        this.$set(this.dialogInterFacePerson, "loadding", true);
        if (this.interfacrPersonForm.interfacePersonIds.length > 0) {
          Api.selectedInterfacePerson(this.interfacrPersonForm).then((res) => {
            this.dialogInterFacePerson.loadding = false;
            this.$set(this.dialogInterFacePerson, "loadding", false);
            const { code, data, msg } = res;
            if (code === 200) {
              this.$message.success("标准化对接人已设置");
              this.$emit("success", true);
              this.dialogInterFacePerson.visible = false;
            } else {
              // this.$message.error(msg);
            }
          });
        } else {
          this.$message.warning("还未选择对接人,请选择对接人");
        }
      } else {
        this.$set(this.dialogInterFacePerson, "loadding", false);
        this.dialogInterFacePerson.visible = false;
        this.$emit("success", false);
      }
    },
    /**
     * 发布信息通知
     */
    infoPublic() {
      // console.log(this.projects);
      // if (this.projects.length == 0) {
      //   this.$message.warning("还未选择项目，请选择项目！");
      // } else if (this.testIsWorkItem() == true) {
      //   this.$message.warning(
      //     `已选择的项目中存在不可操作的项目${this.unProjects.join(",")}`
      //   );
      // } else {
      //   this.deliverNoticeVisiable = true;
      // }
      if (this.reqInfoPublishId == null || this.reqInfoPublishId == "") {
        this.$message.warning("请选择立项通知");
        return;
      }
      const req = {
        infoPublishId: this.reqInfoPublishId,
      };
      Api.isSendOut(req).then((res) => {
        const { code, data } = res;
        if (data == 0) {
          this.$message.warning("此立项通知下还有项目未通过公司级评审");
        } else if (data == 1) {
          this.deliverNoticeVisiable = true;
          this.$nextTick(()=>{
            this.$refs.publicInfo.dialogInfo.title = "选择审核人"
          })
        }
          // this.deliverNoticeVisiable = true;
      });
    },
    /**
     * 判断是否是当前用户可处理得项目
     */
    testIsWorkItem() {
      let has = false;
      this.unProjects = [];
      this.projects.forEach((item) => {
        if (!item.workItemId || item.workItemId == null) {
          this.unProjects.push(`《${item.projectName}》`);
          has = true;
        }
      });
      return has;
    },
    /**
     * 保存(取消)信息
     */
    saveInfo(e) {
      this.deliverNoticeVisiable = false;
      if (e == true) {
        this.$emit("success", true);
      }
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
  width: 100%;
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