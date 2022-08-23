<template>
  <div class="handle-info">
    <div class="info-detail">
      <BztCheckDetail
        :list="infoDetail"
        v-if="handle == false || infoStatus == 5 || isEdit"

      />
      <EditInfoCom v-else :todoTask="todoTask" :showAction="false" ref="info" />
    </div>
    <!-- 以前的判断逻辑 新增的是5  重新改写
      v-if="
        handle != false && infoTheme != 5 && infoTheme != 3 && infoStatus != 5&&isEdit
      " -->
    <template
      v-if="
        handle != false && infoTheme != 3 && infoStatus != 5&&isEdit
      "
    >
      <el-form
        :model="infoForm"
        :rules="rules"
        ref="infoForm"
        label-suffix=":"
        label-width="180px"
        class="infoForm"
      >
        <div class="form-title">信息审核</div>
        <!-- <el-form-item label="审核结果" prop="auditResult">
          <el-radio-group v-model="infoForm.auditResult">
            <template
              v-for="(item, index) in dict.type.info_public_audit_status"
            >
              <template v-if="infoForm.infoTheme != 2">
                <el-radio
                  :key="`radio_${index}`"
                  :label="item.value"
                  v-if="item.value != 3"
                >
                  {{ item.label }}
                </el-radio>
              </template>
              <template v-else>
                <el-radio :key="`radio_${index}`" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </template>
            </template>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="审核结果"  prop="auditResult">
          <el-radio-group v-model="infoForm.auditResult">
            <template
              v-for="(item, index) in dict.type.info_public_audit_status"
            >
              <template v-if="infoForm.infoTheme != 2">
                <el-radio
                  :key="`radio_${index}`"
                  :label="item.value"
                  v-if="item.value != 3"
                >
                  {{ item.label }}
                </el-radio>
              </template>
              <template v-else>
                <el-radio :key="`radio_${index}`" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </template>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="理由"
          v-if="infoForm.auditResult == 2 || infoForm.auditResult == 3"
          prop="rejectReason"
        >
          <el-input type="textarea" v-model="infoForm.rejectReason"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <div class="footer" v-if="handle != false">
      <div class="cancelBtn" @click="examineInfo(false)">取消</div>
      <!-- <el-button
        class="submit-btn"
        @click="toCreatePro()"
        :loading="isLoading"
        v-if="infoTheme == 5"
      >
        创建项目
      </el-button> -->
      <el-button
        class="submit-btn"
        @click="distribution()"
        :loading="isLoading"
        v-if="infoStatus == 5 && infoTheme != 5 && infoTheme != 3"
      >
        分发通知
      </el-button>
      <el-button
        class="submit-btn"
        @click="infoPublic()"
        :loading="isLoading"
        v-else-if="infoTheme == 3"
      >
        立即发布通知
      </el-button>
      <template v-else>
        <template v-if="isEdit">
          <el-button
            class="submit-btn"
            @click="editInfo"
          >
          修改
          </el-button>
          <el-button
            class="submit-btn"
            @click="examineInfo(true)"
            :loading="isLoading"
          >
          确定
          </el-button>
        </template>
        <el-button
          class="submit-btn"
          @click="updateEdit"
          :loading="isLoading"
          v-if="!isEdit"
        >
        保存修改
        </el-button>
      </template>
    </div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event)"
      :appendTobody="true"
    >
      <template slot="body">
        <!-- <PublicInfoCom
          :todoTask="todoTask"
          @close="handleClose"
          @success="handleSuccess"
        /> -->
        <NoticeDistribution
          :todoTask="todoTask"
          @close="handleClose"
          @success="handleSuccess"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { BztCheckDetail, BztDialog } from "@components/basicCom/index";
import PublicInfoCom from "./publicInfoCom.vue";
import EditInfoCom from "./editInfoCom.vue";
import NoticeDistribution from "./noticeDistribution.vue";
const auditForm = {
  rejectReason: "",
  auditResult: null,
  hook: "",
  infoPublishId: "",
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  status: null,
  remark: "",
  receiver: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, //
  dataShow: 0, // 通知公告是否展示时间日期 0不展示，1展示
};
export default {
  components: {
    BztCheckDetail,
    BztDialog,
    PublicInfoCom,
    EditInfoCom,
    NoticeDistribution,
  },
  name: "HandleInfo",
  dicts: [
    "info_publish_theme",
    "info_publish_status",
    "info_public_audit_status",
    "technical_committees",
  ],
  props: {
    todoTask: {
      type: Object,
      default: {
        bussnessId: "",
      },
    },
    handle: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "起草征集外部标准立项通知",
        width: "900px",
      },
      infoForm: this.deepClone(auditForm),
      rules: {
        rejectReason: {
          required: true,
          message: "请输入驳回理由",
          trigger: "blur",
        },
        auditResult: {
          required: true,
          message: "请选择审核结果",
          trigger: "blur",
        },
      },
      infoDetail: [
        {
          title: "信息内容",
          column: 1,
          border: true,
          // labelWidth: "80px",
          content: {
            infoTheme: {
              label: "主题",
              value: "",
              filter: (data) => {
                return this.selectDictLabel(
                  this.dict.type.info_publish_theme,
                  data
                );
              },
              type: 5,
            },
            infoTitle: {
              label: "标题",
              value: "",
              type: 0,
            },
            content: {
              label: "内容",
              value: "",
              type: 6,
            },
            filesPath: {
              label: "附件",
              value: "",
              type: 2,
            },
            startDate: {
              label: "立项开始日期",
              value: "",
              type: 0,
            },
            endDate: {
              label: "立项结束日期",
              value: "",
              type: 0,
            },
            status: {
              label: "状态",
              value: "",
              color: (data) => {
                return data === 4 || data === 6
                  ? "red"
                  : data === 5
                  ? "green"
                  : "";
              },
              filter: (data) => {
                const str = this.selectDictLabel(
                  this.dict.type.info_publish_status,
                  data
                );
                return data === 4 || data === 6
                  ? `${str} （ 原因：${this.rejectReason}）`
                  : str;
              },
              type: 5,
            },
            remark: {
              label: "备注",
              value: "",
              type: 0,
            },
          },
        },
      ],
      isLoading: false,
      infoTitle: "",
      infoStatus: "",
      rejectReason: "",
      infoTheme: null,
      hook: "",
      ownerDeptId: null,
      isDisplay: 1,
      isEdit:true
    };
  },
  watch: {
    todoTask: {
      deep: true,
      handler(val, oldVal) {
        this.getTaskDetail();
      },
    },
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    /**
     * 获取任务详情
     */
    getTaskDetail() {
      this.infoForm = this.deepClone(auditForm);
      if (this.todoTask.businessObjId) {
        Api.getInfoDetail(this.todoTask.businessObjId).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            Object.keys(this.infoForm).map((key) => {
              this.infoForm[key] = data[key];
            });
            this.infoForm.rejectReason = "";
            this.infoTitle = data.infoTitle;
            this.rejectReason = data.rejectReason;
            this.infoStatus = data.status;
            this.infoTheme = data.infoTheme;
            this.ownerDeptId = data.businessObjId;
            if (data.infoTheme == 1) {
              this.infoDetail = [
                {
                  title: "信息内容",
                  column: 1,
                  border: true,
                  // labelWidth: "80px",
                  content: {
                    infoTheme: {
                      label: "主题",
                      value: "",
                      filter: (data) => {
                        return this.selectDictLabel(
                          this.dict.type.info_publish_theme,
                          data
                        );
                      },
                      type: 5,
                    },
                    infoTitle: {
                      label: "标题",
                      value: "",
                      type: 0,
                    },
                    content: {
                      label: "内容",
                      value: "",
                      type: 6,
                    },
                    stdDraftDeadline: {
                      label: "草案稿计划完成时间",
                      value: "",
                      type: 0,
                    },
                    stdForAdviceDeadline: {
                      label: "征求意见稿计划完成时间",
                      value: "",
                      type: 0,
                    },
                    stdForApprovalDeadline: {
                      label: "报批稿计划完成时间",
                      value: "",
                      type: 0,
                    },
                    stdForReviewDeadline: {
                      label: "送审稿计划完成时间",
                      value: "",
                      type: 0,
                    },
                    firstAuditUser: {
                      label: "标准化业务主管",
                      value: "",
                      type: 7,
                    },
                    secondAuditUser: {
                      label: "科技管理部部门领导",
                      value: "",
                      type: 7,
                    },
                    stdMultiAggreementDeadline: {
                      label: "会签计划完成时间",
                      value: "",
                      type: 0,
                    },
                    filesPath: {
                      label: "附件",
                      value: "",
                      type: 2,
                    },
                    status: {
                      label: "状态",
                      value: "",
                      color: (data) => {
                        return data === 4 || data === 6
                          ? "red"
                          : data === 5
                          ? "green"
                          : "";
                      },
                      filter: (data) => {
                        const str = this.selectDictLabel(
                          this.dict.type.info_publish_status,
                          data
                        );
                        return data === 4 || data === 6
                          ? `${str} （ 原因：${this.rejectReason}）`
                          : str;
                      },
                      type: 5,
                    },
                    remark: {
                      label: "备注",
                      value: "",
                      type: 0,
                    },
                  },
                },
              ];
            } else if (data.infoTheme == 2) {
              this.infoDetail = [
                {
                  title: "信息内容",
                  column: 1,
                  border: true,
                  // labelWidth: "80px",
                  content: {
                    infoTheme: {
                      label: "主题",
                      value: "",
                      filter: (data) => {
                        return this.selectDictLabel(
                          this.dict.type.info_publish_theme,
                          data
                        );
                      },
                      type: 5,
                    },
                    infoTitle: {
                      label: "标题",
                      value: "",
                      type: 0,
                    },
                    content: {
                      label: "内容",
                      value: "",
                      type: 6,
                    },
                    filesPath: {
                      label: "附件",
                      value: "",
                      type: 2,
                    },
                    status: {
                      label: "状态",
                      value: "",
                      color: (data) => {
                        return data === 4 || data === 6
                          ? "red"
                          : data === 5
                          ? "green"
                          : "";
                      },
                      filter: (data) => {
                        const str = this.selectDictLabel(
                          this.dict.type.info_publish_status,
                          data
                        );
                        return data === 4 || data === 6
                          ? `${str} （ 原因：${this.rejectReason}）`
                          : str;
                      },
                      type: 5,
                    },
                    remark: {
                      label: "备注",
                      value: "",
                      type: 0,
                    },
                  },
                },
              ];
            } else if (data.infoTheme == 3 || data.infoTheme == 5) {
              this.infoDetail = [
                {
                  title: "信息内容",
                  column: 1,
                  border: true,
                  labelWidth: `data.infoTheme == 3 || data.infoTheme == 4?'80px':'100px'`,
                  content: {
                    infoTheme: {
                      label: "主题",
                      value: "",
                      filter: (data) => {
                        return this.selectDictLabel(
                          this.dict.type.info_publish_theme,
                          data
                        );
                      },
                      type: 5,
                    },
                    infoTitle: {
                      label: "标题",
                      value: "",
                      type: 0,
                    },
                    content: {
                      label: "内容",
                      value: "",
                      type: 6,
                    },
                    filesPath: {
                      label: "附件",
                      value: "",
                      type: 2,
                    },
                    //2220726新增外部状态为5 
                    // startDate: {
                    //   label: `${
                    //     data.infoTheme == 3 || data.infoTheme == 4
                    //       ? "立项"
                    //       : "制修订"
                    //   }开始日期`,
                    //   value: "",
                    //   type: 0,
                    // },
                    // endDate: {
                    //   label: `${
                    //     data.infoTheme == 3 || data.infoTheme == 4
                    //       ? "立项"
                    //       : "制修订"
                    //   }结束日期`,
                    //   value: "",
                    //   type: 0,
                    // },
                    // businessObjId: {
                    //   label: "归口单位",
                    //   value: "",
                    //   filter: (data) => {
                    //     if (data.infoTheme == 4) {
                    //       return this.selectDictLabel(
                    //         this.dict.type.technical_committees,
                    //         data
                    //       );
                    //     } else {
                    //       return this.selectDictLabel(
                    //         this.dict.type.technical_committees,
                    //         Number(data.split(",")[0])
                    //       );
                    //     }
                    //   },
                    //   type: 5,
                    // },
                    // receiver: {
                    //   label: "处理人",
                    //   value: "",
                    //   filter: (data) => {
                    //     console.log(data);
                    //     return this.getUserName(data);
                    //   },
                    //   type: 5,
                    // },
                    status: {
                      label: "状态",
                      value: "",
                      color: (data) => {
                        return data === 4 || data === 6
                          ? "red"
                          : data === 5
                          ? "green"
                          : "";
                      },
                      filter: (data) => {
                        const str = this.selectDictLabel(
                          this.dict.type.info_publish_status,
                          data
                        );
                        return data === 4 || data === 6
                          ? `${str} （ 原因：${this.rejectReason}）`
                          : str;
                      },
                      type: 5,
                    },
                    remark: {
                      label: "备注",
                      value: "",
                      type: 0,
                    },
                  },
                },
              ];
            } else if (data.infoTheme == 4) {
              this.infoDetail = [
                {
                  title: "信息内容",
                  column: 1,
                  border: true,
                  labelWidth: `data.infoTheme == 3 || data.infoTheme == 4?'80px':'100px'`,
                  content: {
                    infoTheme: {
                      label: "主题",
                      value: "",
                      filter: (data) => {
                        return this.selectDictLabel(
                          this.dict.type.info_publish_theme,
                          data
                        );
                      },
                      type: 5,
                    },
                    infoTitle: {
                      label: "标题",
                      value: "",
                      type: 0,
                    },
                    content: {
                      label: "内容",
                      value: "",
                      type: 6,
                    },
                    filesPath: {
                      label: "附件",
                      value: "",
                      type: 2,
                    },
                    startDate: {
                      label: `${
                        data.infoTheme == 3 || data.infoTheme == 4
                          ? "立项"
                          : "制修订"
                      }开始日期`,
                      value: "",
                      type: 0,
                    },
                    endDate: {
                      label: `${
                        data.infoTheme == 3 || data.infoTheme == 4
                          ? "立项"
                          : "制修订"
                      }结束日期`,
                      value: "",
                      type: 0,
                    },
                    technicalCommittees: {
                      label: "归口单位",
                      value: "",
                      filter: (data) => {
                        if (data.infoTheme == 4) {
                          return this.selectDictLabel(
                            this.dict.type.technical_committees,
                            data
                          );
                        } else {
                          return this.selectDictLabel(
                            this.dict.type.technical_committees,
                            Number(data.split(",")[0])
                          );
                        }
                      },
                      type: 5,
                    },
                    status: {
                      label: "状态",
                      value: "",
                      color: (data) => {
                        return data === 4 || data === 6
                          ? "red"
                          : data === 5
                          ? "green"
                          : "";
                      },
                      filter: (data) => {
                        const str = this.selectDictLabel(
                          this.dict.type.info_publish_status,
                          data
                        );
                        return data === 4 || data === 6
                          ? `${str} （ 原因：${this.rejectReason}）`
                          : str;
                      },
                      type: 5,
                    },
                    remark: {
                      label: "备注",
                      value: "",
                      type: 0,
                    },
                    firstAuditUser: {
                      label: "标准化业务主管",
                      value: "",
                      type: 7,
                    },
                    secondAuditUser: {
                      label: "科技管理部部门领导",
                      value: "",
                      type: 7,
                    },
                  },
                },
              ];
            }
            this.infoDetail = this.filterDetailParam(this.infoDetail, data);
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 内容审核审核操作
     * @param {*} e true:提交审核，false:取消审核
     */
    examineInfo(e) {
      if (e === false) {
        this.$emit("close", null);
      } else {
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            this.isLoading = true;
            // if (this.$refs.info.getInfo() != null) {
            //   Object.keys(this.infoForm).map((key) => {
            //     if (key != "auditResult" && key != "rejectReason")
            //       this.infoForm[key] = this.$refs.info.getInfo()[key] ?? null;
            //   });
            // }
            this.infoForm.hook = this.todoTask.hook ?? "";
            this.infoForm.infoPublishId = this.todoTask.businessObjId ?? "";
            Api.auditInfo(this.infoForm).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success(`信息：${this.infoTitle}已审核`);
                this.$emit("success", null);
              } else {
                // this.$messag.error(msg);
              }
            });
          }
        });
      }
    },

    /**
     * 编辑按钮
     */
    editInfo(){
      this.isEdit = false
    },

    /**
     * 保存修改
     */
    updateEdit(){
      if(this.$refs.info.handleInfo()){
        this.isLoading = true;
        // if (this.$refs.info.getInfo() != null) {
        //   Object.keys(this.infoForm).map((key) => {
        //     if (key != "auditResult" && key != "rejectReason")
        //       this.infoForm[key] = this.$refs.info.getInfo()[key] ?? null;
        //   });
        // }
        // this.infoForm.hook = this.todoTask.hook ?? "";
        // this.infoForm.infoPublishId = this.todoTask.businessObjId ?? "";
        Api.updatePublish( this.$refs.info.getInfo()).then((res) => {
          this.isLoading = false;
          this.getTaskDetail();
          // const { code, data, msg } = res;
          // if (code === 200) {
          //   this.$message.success(`信息：${this.infoTitle}已审核`);
          //   this.$emit("success", null);
          // } else {
          //   // this.$messag.error(msg);
          // }
        }).catch(()=>{
          this.isLoading = false;
        });
        this.isEdit = true
      }
    },

    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
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
     * 创建外部制修订
     */
    toCreatePro() {
      if (this.infoTheme == 5) {
        this.$router.push(
          `/work/externalStdRevise?phase=20&hook=${this.infoForm.hook}&ownDeptId=${this.ownerDeptId}`
        );
      }
    },
    /**
     * 立即发布通知
     */
    infoPublic() {
      this.dialogInfo.visible = true;
    },
    /**
     * 取消
     */
    handleClose() {
      this.dialogInfo.visible = false;
      this.$emit("close", null);
    },
    /**
     * 分发通知
     */
    distribution() {
      this.dialogInfo.title = "分发通知";
      this.dialogInfo.visible = true;
    },
    handleSuccess() {
      this.dialogInfo.visible = false;
      this.$emit("success", null);
    },
    closeDialog() {
      this.dialogInfo.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.handle-info {
  .infoForm {
    margin-top: 25px;
    .form-title {
      font-size: 16px;
      font-weight: 600;
      border-left: $bule 3px solid;
      line-height: 18px;
      padding-left: 8px;
      margin-bottom: 15px;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>