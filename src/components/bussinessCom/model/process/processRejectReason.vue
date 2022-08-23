<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <div class="process-reject-reason">
        <div class="info-detail">
          <BztCheckDetail :list="rejectReasonList" />
        </div>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import Api from "@api/process";
import { BztCheckDetail, BztDialog } from "@components/basicCom/index";
const auditForm = {
  rejectReason: "",
  auditResult: null,
  hook: "",
  infoPublishId: "",
};
export default {
  components: { BztCheckDetail, BztDialog },
  name: "process-reject-reason",
  dicts: [
    "info_publish_theme",
    "info_publish_status",
    "info_public_audit_status",
  ],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "查看驳回原因",
    },
    processInfo: {
      type: Object,
      default: {
        bussnessId: "",
      },
    },
    projectId:{
      type: [String,Number],
      default: "",
    },
    isGZ:{
      type: Boolean,
      default: false,
    },
    projectType:{
      type: [Number,String],
      default:''
    }
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看驳回原因",
        width: "900px",
        footer: false,
      },
      rules: {
        // rejectReason: {
        //   required: true,
        //   message: "请输入驳回理由",
        //   trigger: "blur",
        // },
        auditResult: {
          required: true,
          message: "请选择审核结果",
          trigger: "blur",
        },
      },
      rejectReasonList: [],
      isLoading: false,
      infoTitle: "",
      infoStatus: "",
      rejectReason: "",
    };
  },
  watch: {
    visiable: {
      deep: true,
      handler(val, oldVal) {
        this.dialogInfo.visible = this.visiable;
        this.dialogInfo.title = this.title;
        if (val == true) {
          this.getRejectReason();
        }
      },
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title = this.title;
    if (this.visiable == true) {
      this.getRejectReason();
    }
  },
  methods: {
    /**
     * 获取任务详情
     */
    getRejectReason() {
      if(this.isGZ==true){
        const instanceId = this.$route.query.instanceId||''
        Api.getStdPurchaseHistory(instanceId).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            this.rejectReasonList = [];
            data.forEach((item) => {
              if (item.conclusion != 1) {
                const newItem = {
                  title: `驳回节点: [ ${
                    item.activityName != null ? item.activityName :this.processInfo.rejectNodeName? this.processInfo.rejectNodeName : "标准会签"
                  } ] `,
                  column: 1,
                  border: true,
                  // labelWidth: "80px",
                  content: {
                    content: {
                      label: item.conclusion == 2 ? "驳回原因" : "终止原因",
                      value: item.opinion,
                      type: 0,
                    },
                    opinionAt: {
                      label: item.conclusion == 2 ? "驳回时间" : "终止时间",
                      value: this.parseTime(
                        item.opinionAt,
                        "{y}-{m}-{d} {h}:{i}:{s}"
                      ),
                      type: 0,
                    },
                    conclusion: {
                      label: "结论",
                      value: item.conclusion == 2 ? "不通过" : "终止",
                      type: 0,
                    },
                  },
                };
                this.rejectReasonList.push(newItem);
              }
            });
          } else {
            // this.$message.error(msg);
          }
        });
      }else{
        const req = {
          orderByColumn: "createAt",
          isAsc: "desc",
          pageNum: 1,
          pageSize: 10000,
          projectId: this.projectId?this.projectId:this.processInfo.id,
          projectType: this.projectType||this.processInfo.projectType,
          instanceId:this.processInfo.instanceId
        };
        Api.checkRejectReason(req).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            this.rejectReasonList = [];
            data.list.forEach((item) => {
              if (item.conclusion != 1) {
                const newItem = {
                  title: `驳回节点: [ ${
                    item.activityName != null ? item.activityName :this.processInfo.rejectNodeName? this.processInfo.rejectNodeName : "标准会签"
                  } ] `,
                  column: 1,
                  border: true,
                  // labelWidth: "80px",
                  content: {
                    content: {
                      label: item.conclusion == 2 ? "驳回原因" : "终止原因",
                      value: item.opinion,
                      type: 0,
                    },
                    opinionAt: {
                      label: item.conclusion == 2 ? "驳回时间" : "终止时间",
                      value: this.parseTime(
                        item.opinionAt,
                        "{y}-{m}-{d} {h}:{i}:{s}"
                      ),
                      type: 0,
                    },
                    conclusion: {
                      label: "结论",
                      value: item.conclusion == 2 ? "不通过" : "终止",
                      type: 0,
                    },
                  },
                };
                this.rejectReasonList.push(newItem);
              }
            });
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 关闭弹框
     */
    closeDialog(e) {
      this.$emit("close", null);
    },
  },
};
</script>
<style lang="scss" scoped>
.process-reject-reason {
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