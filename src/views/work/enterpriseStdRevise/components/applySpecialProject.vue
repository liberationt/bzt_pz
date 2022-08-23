<template>
  <div class="apply-project">
    <div class="header">
      <!-- <span v-if="applayStep == 0" class="link-text" @click="cancel">
        返回
      </span>
      <span v-else class="link-text" @click="jump(-1)"> 上一步 </span> -->
      <div class="title">{{ title }}</div>
      <!-- <span v-if="applayStep != 2" class="link-text" @click="jump(1)">
        下一步
      </span> -->
      <!-- <span v-else class="link-text"> </span> -->
    </div>
    <div class="steps">
      <SpecialProInfo
        v-if="applayStep == 0"
        :isEdit="true"
        ref="info"
        :formValue="applayProForm"
        @value-change="valChange"
      />
      <Predesc
        v-if="applayStep == 1"
        :isEdit="true"
        ref="preDesc"
        :formValue="applayProForm"
        @value-change="valChange"
      />
      <SchedulePlan
        v-if="applayStep == 2"
        :isEdit="true"
        ref="schedulePlan"
        :projectId="id"
        :formValue="applayProForm"
        @value-change="valChange"
      />
    </div>

    <div class="footer">
      <span class="btn-list">
        <span v-if="applayStep == 0" class="submit-btn" @click="cancel">
          返回
        </span>
        <span v-else class="submit-btn" @click="jump(-1)"> 上一步 </span>
        <div class="cancelBtn" @click="cancel">取消</div>
        <!-- <div class="yellow-btn" @click="save(1)">暂存</div> -->
        <div class="submit-btn" v-if="applayStep == 2" @click="save(2)">
          提交
        </div>
        <span v-if="applayStep != 2" class="submit-btn" @click="jump(1)">
          下一步
        </span>
        <span v-else class="step-end link-text"> </span>
        <!--  -->
        <div class="red-btn" v-if="isReject == 5" @click="checkRejectReason()">
          查看驳回/终止理由
        </div>
      </span>
    </div>

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      :visiable="rejectReasonVisible"
      :processInfo="{ id: id, projectType: 1 }"
      :title="`查看【${applayProForm.projectName}】驳回终止原因`"
      @close="checkRejectReason()"
    />
  </div>
</template>
<script>
import {
  ProInfo,
  Predesc,
  SchedulePlan,
  ProcessRejectReason,
  SpecialProInfo,
} from "@components/bussinessCom/index";
import DataModel from "@utils/data-model";
import Api from "@api/process";
export default {
  name: "apply-special-project",
  components: {
    ProInfo,
    Predesc,
    SchedulePlan,
    ProcessRejectReason,
    SpecialProInfo,
  },
  props: ["infoPublishId", "projectId"],
  data() {
    return {
      rejectReasonVisible: false,
      applayStep: 0,
      title: "项目信息",
      applayProForm: this.deepClone(DataModel.applySpecialPorjectForm),
      isReject: null,
      hook: "",
      id: null,
    };
  },
  mounted() {
    const { id, hook } = this.$route.params;
    if (id != undefined && hook != undefined) {
      this.id = id;
      this.hook = hook;
    }
    if (this.projectId != null) {
      this.id = this.projectId;
    }
    if (this.id != null) {
      this.getProjectDetail();
    }
  },
  methods: {
    /**
     * 编辑时获取项目详情
     */
    getProjectDetail() {
      Api.getProjectApprovalDetail(this.id).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          Object.keys(this.applayProForm).map((key) => {
            this.applayProForm[key] = data[key];
          });
          this.isReject = data.projectStatus;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 上一步/下一步
     * @param {*} e -1:跳转上一步,1:下一步
     */
    jump(e) {
      if (e > 0 && this.testNextStep(this.applayStep).result == true) {
        let str = this.testNextStep(this.applayStep).str;
        this.$confirm(`字段：${str}为必填项！`, "提示", {
          confirmButtonText: "继续，下一步",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.applayStep += e;
            switch (this.applayStep) {
              case 0:
                this.title = "项目信息";
                break;
              case 1:
                this.title = "编制说明";
                break;
              case 2:
                this.title = "标准编制进度计划";
                break;
            }
          })
          .catch(() => {});
      } else {
        this.applayStep += e;
        switch (this.applayStep) {
          case 0:
            this.title = "项目信息";
            break;
          case 1:
            this.title = "编制说明";
            break;
          case 2:
            this.title = "标准编制进度计划";
            break;
        }
      }
    },
    /**
     * 下一步验证
     */
    testNextStep(step) {
      let result = false;
      let str = "";
      if (step == 0) {
        if (
          this.applayProForm.infoPublishId == "" ||
          this.applayProForm.infoPublishId == null
        ) {
          str += "《立项信息通知》";
          result = true;
        }
        if (
          this.applayProForm.specialApplyReason == "" ||
          this.applayProForm.specialApplyReason == null
        ) {
          str += "《特殊流程申请原因》";
          result = true;
        }
        if (
          this.applayProForm.projectName == "" ||
          this.applayProForm.projectName == null
        ) {
          str += "《项目名称》";
          result = true;
        }
        if (
          this.applayProForm.scplatMode != 0 &&
          this.applayProForm.scplatMode != 1
        ) {
          result = true;
          str += "《制定或修订》";
        }
        if (
          this.applayProForm.scplatMode == 1 &&
          (this.applayProForm.oldStdId == null ||
            this.applayProForm.oldStdId == "")
        ) {
          str += "《被修订标准号》";
          result = true;
        }
        if (
          this.applayProForm.mainEditorIds == "" ||
          this.applayProForm.mainEditorIds == null
        ) {
          str += "《主要起草人》";
          result = true;
        }
        if (
          this.applayProForm.stdDraftUrl == "" ||
          this.applayProForm.stdDraftUrl == null
        ) {
          str += "《大纲草案》";
          result = true;
        }
        if (
          this.applayProForm.keyTechniqueContent == "" ||
          this.applayProForm.keyTechniqueContent == null
        ) {
          str += "《关键技术内容》";
          result = true;
        }
        if (
          this.applayProForm.applyReason == "" ||
          this.applayProForm.applyReason == null
        ) {
          str += "《申请理由》";
          result = true;
        }
      }

      if (step == 2) {
        if (
          this.applayProForm.stdDraftDeadline == "" ||
          this.applayProForm.stdDraftDeadline == null
        ) {
          str += "《草案稿计划完成时间》";
          result = true;
        }
        if (
          this.applayProForm.stdForAdviceDeadline == "" ||
          this.applayProForm.stdForAdviceDeadline == null
        ) {
          str += "《征求意见稿计划完成时间》";
          result = true;
        }
        if (
          this.applayProForm.stdForApprovalDeadline == "" ||
          this.applayProForm.stdForApprovalDeadline == null
        ) {
          str += "《送审稿计划完成时间》";
          result = true;
        }
        if (
          this.applayProForm.stdMultiAggreementDeadline == "" ||
          this.applayProForm.stdMultiAggreementDeadline == null
        ) {
          str += "《会签计划完成时间》";
          result = true;
        }
      }

      if (
        this.applayProForm.applyReason.length < 300 &&
        result != true &&
        step == 0
      ) {
        str += "《申请理由不少于300字》";
        result = true;
      }

      return { str: str, result: result };
    },
    /**
     * 监听FormValue
     */
    valChange(e) {},
    /**
     *提交
     */
    save() {
      this.applayProForm.projectType = 1;
      if (this.testForm() === true) {
        return;
      }
      this.checkProjectNameUnique();
    },
    checkProjectNameUnique() {
      const req = {
        projectName: this.applayProForm.projectName,
        projectType: 1,
        id: this.id ?? null,
      };
      Api.checkProjectNameUnique(req).then((res) => {
        const { code, msg } = res;
        if (code == 200) {
          if (msg == 0) {
            if (this.id == null) {
              let loadingInstance = this.Loading.service({ fullscreen: true });
              Api.addSpecialProjectApproval(this.applayProForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("项目已提交");
                  this.cancel();
                } else {
                  // this.$message.error(msg);
                }
                this.$nextTick(() => {
                  // 以服务的方式调用的 Loading 需要异步关闭
                  loadingInstance.close();
                });
              });
            } else {
              let loadingInstance = this.Loading.service({ fullscreen: true });
              this.applayProForm.id = this.id;
              this.applayProForm["hook"] = this.hook;
              this.applayProForm["commitStatus"] = 3;
              Api.updateSpecialProjectApproval(this.applayProForm).then(
                (res) => {
                  const { code, msg } = res;
                  if (code === 200) {
                    this.$message.success("项目已提交");
                    this.$store.dispatch("tagsView/delView", this.$route);
                    this.$router.push("/maintenance/task");
                  } else {
                    // this.$message.error(msg);
                  }
                  this.$nextTick(() => {
                    // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                  });
                }
              );
            }
          } else {
            this.$message.warning("项目名称不能重复");
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 提交验证
     */
    testForm() {
      let result = false;
      let str = "字段：";
      if (
        this.applayProForm.infoPublishId == "" ||
        this.applayProForm.infoPublishId == null
      ) {
        str += "《立项信息通知》";
        result = true;
      }

      if (
        this.applayProForm.specialApplyReason == "" ||
        this.applayProForm.specialApplyReason == null
      ) {
        str += "《特殊流程申请原因》";
        result = true;
      }
      if (
        this.applayProForm.projectName == "" ||
        this.applayProForm.projectName == null
      ) {
        str += "《项目名称》";
        result = true;
      }
      if (
        this.applayProForm.applyReason == "" ||
        this.applayProForm.applyReason == null
      ) {
        str += "《申请理由》";
        result = true;
      }
      if (
        this.applayProForm.keyTechniqueContent == "" ||
        this.applayProForm.keyTechniqueContent == null
      ) {
        str += "《关键技术内容》";
        result = true;
      }
      if (
        this.applayProForm.mainEditorIds == "" ||
        this.applayProForm.mainEditorIds == null
      ) {
        str += "《主要起草人》";
        result = true;
      }
      if (
        this.applayProForm.stdDraftUrl == "" ||
        this.applayProForm.stdDraftUrl == null
      ) {
        str += "《大纲草案》";
        result = true;
      }
      if (
        this.applayProForm.stdDraftDeadline == "" ||
        this.applayProForm.stdDraftDeadline == null
      ) {
        str += "《草案稿计划完成时间》";
        result = true;
      }
      if (
        this.applayProForm.stdForAdviceDeadline == "" ||
        this.applayProForm.stdForAdviceDeadline == null
      ) {
        str += "《征求意见稿计划完成时间》";
        result = true;
      }
      if (
        this.applayProForm.stdForApprovalDeadline == "" ||
        this.applayProForm.stdForApprovalDeadline == null
      ) {
        str += "《送审稿计划完成时间》";
        result = true;
      }
      if (
        this.applayProForm.stdMultiAggreementDeadline == "" ||
        this.applayProForm.stdMultiAggreementDeadline == null
      ) {
        str += "《会签计划完成时间》";
        result = true;
      }
      if (
        this.applayProForm.scplatMode == 1 &&
        (this.applayProForm.oldStdId == null ||
          this.applayProForm.oldStdId == "")
      ) {
        str += "《被修订标准号》";
        result = true;
      }
      if (
        this.applayProForm.scplatMode != 0 &&
        this.applayProForm.scplatMode != 1
      ) {
        result = true;
        str += "《制定或修订》";
      }

      if (result == true) {
        this.$message.warning(`${str}为必填项`);
      }

      if (this.applayProForm.applyReason.length < 300 && result != true) {
        this.$message.warning("申请理由不少于300字");
        result = true;
      }

      return result;
    },
    /**
     * 取消
     */
    cancel() {
      // this.infoPublishId = null;
      this.$emit("close", null);
    },
    /**
     * 查看驳回终止
     */
    checkRejectReason() {
      this.rejectReasonVisible = !this.rejectReasonVisible;
      // console.log(this.rejectReasonVisible);
    },
  },
};
</script>
<style lang="scss" scoped>
.apply-project {
  width: 100%;
  height: 100%;
  margin-top: 0px;
  .header {
    position: fixed;
    height: 60px;
    width: calc(100vw - 40px);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: -20px;
    padding-top: 20px;
    background: #ffffff;
    z-index: 1;
    box-shadow: $bule 1px 4px 10px -10px;
    z-index: 2;
    .title {
      font-size: 17px;
      font-weight: 400;
      line-height: 40px;
      text-align: center;
    }
  }
  .steps {
    width: 100%;
    // height: calc(100% - 80px);
    overflow-y: auto;
    padding: 60px 0;
  }
  .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background: #ffffff;
    box-shadow: $bule 1px 0px 15px -8px;
    z-index: 1;

    .btn-list {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>