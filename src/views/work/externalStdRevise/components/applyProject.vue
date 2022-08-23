<template>
  <div class="apply-project">
    <div class="header">
      <div class="title">{{ title }}</div>
    </div>
    <div class="steps">
      <ExProInfo
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
        :projectId="projectId"
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
        <div class="yellow-btn" @click="save(1)">暂存</div>
        <div class="submit-btn" v-if="applayStep == 1" @click="save(2)">
          提交
        </div>
        <span v-if="applayStep != 1" class="submit-btn" @click="jump(1)">
          下一步
        </span>
        <span v-else> </span>
        <div class="red-btn" v-if="isReject == 5" @click="checkRejectReason()">
          查看驳回/终止理由
        </div>
      </span>
      <!-- <div class="green-btn" v-if="isReject == 5" @click="checkRejectReason()">
        查看驳回终止理由
      </div> -->
    </div>

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      :visiable="rejectReasonVisible"
      :processInfo="{ id: this.projectId, projectType: 2 }"
      :title="`查看【${applayProForm.projectName}】驳回终止原因`"
      @close="checkRejectReason()"
    />
  </div>
</template>
<script>
import {
  ExProInfo,
  Predesc,
  SchedulePlan,
  ProcessRejectReason,
} from "@components/bussinessCom/index";
import DataModel from "@utils/data-model";
import Api from "@api/process";
export default {
  name: "apply-project",
  components: { ExProInfo, Predesc, SchedulePlan, ProcessRejectReason },
  props: ["infoPublishId", "projectId"],
  data() {
    return {
      applayStep: 0,
      title: "项目信息",
      applayProForm: this.deepClone(DataModel.applyPorjectEXForm),
      rejectReasonVisible: false, // 查看驳回原因
      isReject: null,
    };
  },
  mounted() {
    const { infoPublishId } = this.$route.params;
    if (this.projectId != null) {
      this.getProjectDetail();
    }
    console.log(this.infoPublishId);
  },
  methods: {
    /**
     * 编辑时获取项目详情
     */
    getProjectDetail() {
      Api.getProjectApprovalDetail(this.projectId).then((res) => {
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
          this.applayProForm.projectName == "" ||
          this.applayProForm.projectName == null
        ) {
          str += "《项目名称》";
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
        if (
          this.applayProForm.ownerDeptId == null ||
          this.applayProForm.ownerDeptId == ""
        ) {
          result = true;
          str += "《归口单位》";
        }
        if (
          this.applayProForm.attachFiles == null ||
          this.applayProForm.attachFiles == ""
        ) {
          result = true;
          str += "《附件》";
        }
        console.log(this.applayProForm.projectType);
        if (
          this.applayProForm.stdType == null ||
          this.applayProForm.stdType == ""
        ) {
          result = true;
          str += "《标准类型》";
        }
      }
      return { str: str, result: result };
    },
    /**
     * 监听FormValue
     */
    valChange(e) {},
    /**
     * 暂存/提交
     */
    save(status) {
      // this.applayProForm.infoPublishId = this.infoPublishId;
      this.applayProForm.commitStatus = status;
      this.applayProForm.projectType = 2;
      if (status == 1) {
        if (this.applayProForm.projectName == "") {
          this.$message.warning("项目名称为必填字段请填写");
          return;
        }
      } else if (this.testForm() === true) {
        return;
      }
      this.checkProjectNameUnique(status);
    },
    checkProjectNameUnique(status) {
      const req = {
        projectName: this.applayProForm.projectName,
        projectType: 2,
        id: this.projectId ?? null,
      };
      Api.checkProjectNameUnique(req).then((res) => {
        const { code, msg } = res;
        if (code == 200) {
          if (msg == 0) {
            if (this.projectId == null) {
              Api.addProjectApproval(this.applayProForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success(
                    status == 1 ? "项目已暂存" : "项目已提交"
                  );
                  this.cancel();
                } else {
                  // this.$message.error(msg);
                }
              });
            } else {
              this.applayProForm.id = this.projectId;
              Api.updateProjectApproval(this.applayProForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success(
                    status == 1 ? "项目已暂存" : "项目已提交"
                  );
                  this.cancel();
                } else {
                  // this.$message.error(msg);
                }
              });
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
        this.applayProForm.projectName == "" ||
        this.applayProForm.projectName == null
      ) {
        str += "《项目名称》";
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
      if (
        this.applayProForm.ownerDeptId == null ||
        this.applayProForm.ownerDeptId == ""
      ) {
        result = true;
        str += "《归口单位》";
      }
      if (
        this.applayProForm.attachFiles == null ||
        this.applayProForm.attachFiles == ""
      ) {
        result = true;
        str += "《附件》";
      }
      if (
        this.applayProForm.stdType == null ||
        this.applayProForm.stdType == ""
      ) {
        result = true;
        str += "《标准类型》";
      }

      if (result == true) {
        this.$message.warning(`${str}为必填项`);
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
    width: calc(100% - 40px);
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
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background: #ffffff;
    box-shadow: $bule 1px 0px 15px -8px;
    z-index: 2;
    .btn-list {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>