<template>
  <div class="schedule-plan">
    <div class="schedule-plan-title">
      企业技术标准计划项目申请表
      <div
        class="operation-line"
        style="float: right"
        v-if="
          showEditBtn() === true ||
          (formValue.projectState == 1004 && formValue.workItemId != null)
        "
      >
        <div
          class="submit-btn"
          v-if="eidtBzjd == false"
          @click="eidtBzjd = true"
        >
          <i class="el-icon-edit-outline" />
          编辑
        </div>
        <template v-if="eidtBzjd == true">
          <div class="submit-btn" @click="save()">保存</div>
          <div class="cancelBtn" @click="eidtBzjd = false">取消</div>
        </template>
      </div>
    </div>
    <el-form
      class="schedule-plan-form"
      label-width="160px"
      label-suffix=":"
      v-if="formValue != null"
      label-position="left"
    >
      <el-form-item
        label="完成草案"
        style="width: 100%"
        :rules="[
          { required: true, message: '完成草案计划完成时间', trigger: 'blur' },
        ]"
      >
        <label>计划完成时间:</label>
        <el-date-picker
          v-model="formValue.stdDraftDeadline"
          type="date"
          placeholder="选择日期"
          :format="formatStr"
          :value-format="formatStr"
          :picker-options="getPickerOptions('stdDraftDeadline')"
          v-if="isEdit == true || eidtBzjd == true"
        />
        <span v-else>{{ formValue.stdDraftDeadline }}</span>
      </el-form-item>
      <el-form-item
        label="完成征求意见"
        style="width: 100%"
        :rules="[
          {
            required: true,
            message: '完成征求意见计划完成时间',
            trigger: 'blur',
          },
        ]"
      >
        <label>计划完成时间:</label>
        <el-date-picker
          v-model="formValue.stdForAdviceDeadline"
          type="date"
          placeholder="选择日期"
          :format="formatStr"
          :value-format="formatStr"
          :picker-options="getPickerOptions('stdForAdviceDeadline')"
          v-if="isEdit == true || eidtBzjd == true"
        />
        <span v-else>{{ formValue.stdForAdviceDeadline }}</span>
      </el-form-item>
      <el-form-item
        label="完成标准审核"
        style="width: 100%"
        :rules="[
          {
            required: true,
            message: '完成标准审核计划完成时间',
            trigger: 'blur',
          },
        ]"
      >
        <label>计划完成时间:</label>
        <el-date-picker
          v-model="formValue.stdForReviewDeadline"
          type="date"
          placeholder="选择日期"
          :format="formatStr"
          :value-format="formatStr"
          :picker-options="getPickerOptions('stdForReviewDeadline')"
          v-if="isEdit == true || eidtBzjd == true"
        />
        <span v-else>{{ formValue.stdForReviewDeadline }}</span>
      </el-form-item>
      <el-form-item
        label="完成报批稿"
        style="width: 100%"
        :rules="[
          {
            required: true,
            message: '完成报批稿计划完成时间',
            trigger: 'blur',
          },
        ]"
      >
        <label>计划完成时间:</label>
        <el-date-picker
          v-model="formValue.stdForApprovalDeadline"
          type="date"
          placeholder="选择日期"
          :format="formatStr"
          :value-format="formatStr"
          :picker-options="getPickerOptions('stdForApprovalDeadline')"
          v-if="isEdit == true || eidtBzjd == true"
        />
        <span v-else>{{ formValue.stdForApprovalDeadline }}</span>
      </el-form-item>
      <el-form-item
        label="完成评审"
        style="width: 100%"
        :rules="[
          {
            required: true,
            message: '完成评审计划完成时间',
            trigger: 'blur',
          },
        ]"
      >
        <label>计划完成时间:</label>
        <el-date-picker
          v-model="formValue.stdMultiAggreementDeadline"
          type="date"
          placeholder="选择日期"
          :format="formatStr"
          :value-format="formatStr"
          :picker-options="getPickerOptions('stdMultiAggreementDeadline')"
          v-if="isEdit == true || eidtBzjd == true"
        />
        <span v-else>{{ formValue.stdMultiAggreementDeadline }}</span>
      </el-form-item>
    </el-form>
    <div
      class="operation-line"
      v-if="
        formValue.projectState == 1004 &&
        formValue.workItemId != null &&
        isEdit == false &&
        eidtBzjd == false
      "
    >
      <!-- v-if="formValue.projectState == 1004" -->
      <el-button class="yellow-btn" :loading="isLoading" @click="next()"
        >已审核，流程下一步
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import infoApi from "@api/infoModule";
const infoForm = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  status: null,
  infoPublishId: null,
  date: [],
  remark: "",
  businessObjId: "",
  receiver: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
};
export default {
  name: "schedule-plan",
  props: {
    formValue: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: String || Number,
      default: "",
    },
  },
  watch: {
    formValue: {
      deep: true,
      handler(val) {
        this.$emit("value-change", val);
      },
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      formatStr: "yyyy-MM-dd",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      isLoading: false,
      eidtBzjd: false,
      infoDetial: _.cloneDeep(infoForm),
    };
  },
  mounted() {
    this.getInfoDetail();
  },
  methods: {
    /**
     * 是否显示编辑按钮
     */
    showEditBtn() {
      let show = false;
      // if (this.formValue.workItemId != null) {
      if (this.formValue.applyUser == this.userInfo.userId) {
        // this.formValue.interfacePersonIds.split(",").forEach((item) => {
        //   if (item == this.userInfo.userId) {
        //     }
        // });
        show = true;
      }
      return show;
    },
    /**
     * 保存
     */
    save() {
      this.formValue.id =
        this.formValue.projectPhase == "10" ||
        this.formValue.projectPhase == "" ||
        this.formValue.projectPhase == null
          ? this.projectId
          : this.formValue.foundationProjectId;
      Api.updateProjectApproval(this.formValue).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.$message.success("修改成功");
          this.eidtBzjd = false;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 流程流程流转下一步
     */
    next() {
      // this.isLoading = true;
      console.log(0);
      this.$emit("process-to-next", null);
    },
    /**
     * 获取信息详情
     */
    getInfoDetail() {
      this.infoDetial = _.cloneDeep(infoForm);
      if (this.formValue.infoPublishId == null) {
        this.$message.warning("请选择所属立项通知");
      }
      infoApi.getInfoDetail(this.formValue.infoPublishId).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.infoDetial = _.cloneDeep(data);
        } else {
          // this.$message.error(msg);
        }
      });
    },
    getPickerOptions(key) {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        if (this.infoDetial[key] && this.infoDetial[key] != null) {
          return (
            new Date(this.infoDetial[key]).getTime() < time.getTime() ||
            time.getTime() < new Date(this.infoDetial['endDate']).getTime()
          );
        } else {
          return time.getTime() <new Date(this.infoDetial['endDate']).getTime();
        }
      };
      return disableTime;
    },
  },
};
</script>
<style lang="scss" scoped>
.schedule-plan {
  padding: 15px;
  .schedule-plan-title {
    line-height: 20px;
    font-size: 16px;
    font-weight: 600;
    border-left: 3px solid $bule;
    margin: 25px 0px;
    padding-left: 10px;
  }
  .operation-line {
    justify-content: center;
  }
}
::v-deep .schedule-plan-form {
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  margin: 25px auto;
  .el-form-item {
    float: left;
    font-size: 14px;
    .el-form-item__label {
      font-size: 15px;
      font-weight: 400;
      color: $bule;
    }
    .el-form-item__content {
      label {
        font-size: 14px;
        font-weight: 400;
        margin-right: 60px;
      }
      .el-date-editor {
        width: 320px;
      }
    }
  }
}
</style>