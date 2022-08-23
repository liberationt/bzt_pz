<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="aduitForm"
        :rules="rules"
        ref="aduitForm"
        label-suffix=":"
        label-width="130px"
        class="aduitForm"
      >
        <el-form-item label="审核结果" prop="auditResult">
          <el-radio-group v-model="aduitForm.auditResult">
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="2"> 不通过 </el-radio>
            <el-radio :label="3"> 终止 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="不通过/终止原因"
          prop="rejectReason"
          v-if="aduitForm.auditResult != 1"
        >
          <el-input
            type="textarea"
            placeholder="请输入修改原因"
            v-model="aduitForm.rejectReason"
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
  name: "aduit-special-pro",
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
    title: { type: String, default: "特殊立项审核" },
    hook: {
      type: String,
      default: "",
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
        title: "特殊立项审核",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      aduitForm: {
        projectId: null,
        auditResult: null,
        rejectReason: "",
        hook: "",
      },
      rules: {
        auditResult: {
          required: true,
          message: "请选择审核结果",
          trigger: ["blur", "change"],
        },
        rejectReason: {
          required: true,
          message: "请输入驳回/终止原因",
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
        this.aduitForm.projectId = this.businessObjId;
        this.aduitForm.hook = this.hook;
        this.$refs.aduitForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);

            Api.auditSpecialProjectApplication(this.aduitForm).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("已审核");
              } else {
                // this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);
              this.dialogInfo.visible = false;
              this.$emit("save", null);
              this.dialogInfo.loadding = false;
            });
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