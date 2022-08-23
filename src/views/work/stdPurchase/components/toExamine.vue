<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-suffix=":"
        label-width="130px"
        class="examineForm"
      >
        <el-form-item label="审核结论" prop="reviewState">
          <el-radio-group
            v-model="examineForm.reviewState"
            @change="stateChange"
          >
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="2"> 驳回 </el-radio>
            <el-radio :label="3"> 终止 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="修改原因"
          prop="rejectReason"
          v-if="examineForm.reviewState != 1"
        >
          <el-input
            type="textarea"
            placeholder="请输入修改原因"
            v-model="examineForm.rejectReason"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";

export default {
  components: { BztDialog },
  name: "toExamine",
  dicts: ["info_publish_theme"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    title: { type: String, default: "标准化审核" },
    type: {
      type: Number,
      default: 0, // 0：审核，1：会签
    },
    sciTechDeptApproveUserId: {
      type: String,
      default: null,
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准化审核",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      examineForm: {
        id: null,
        reviewState: null,
        rejectReason: "",
      },
      rules: {
        reviewState: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        rejectReason: {
          required: true,
          message: "请输入驳回原因",
          trigger: "blur",
        },
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
  },

  methods: {
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.examineForm.id = this.businessObjId;
        this.examineForm["sciTechDeptApproveUserId"] =
          this.sciTechDeptApproveUserId;
        this.$refs.examineForm.validate(async(valid) => {
          if (valid) {
            this.dialogInfo.loadding=true
            this.examineForm.state = this.examineForm.reviewState
           await Api.stdLiaisonReview(this.examineForm).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("审核已提交");
              } else {
                this.$message.error(msg);
              }
              this.dialogInfo.visible = false;
              this.$emit("save", null);
            });
              this.dialogInfo.loadding = false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", null);
      }
    },
    /**
     * 审核结论 改变
     */
    stateChange(e) {
      this.examineForm.rejectReason = "";
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