<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="needToExamineForm"
        :rules="rules"
        ref="needToExamineForm"
        label-suffix=":"
        label-width="160px"
        class="needToExamineForm"
      >
        <el-form-item label="是否组织线下会议" prop="reviewState">
          <el-radio-group v-model="needToExamineForm.reviewState">
            <el-radio :label="1"> 组织 </el-radio>
            <el-radio :label="0"> 不组织 </el-radio>
          </el-radio-group>
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
    title: { type: String, default: "标准化主管审核" },
    type: {
      type: Number,
      default: 0, // 0：审核，1：会签
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
        title: "标准化主管审核",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      needToExamineForm: {
        id: null,
        reviewState: null,
      },
      rules: {
        reviewState: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
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
        this.needToExamineForm.id = this.businessObjId;
        this.$refs.needToExamineForm.validate((valid) => {
          if (valid) {
            this.dialogInfo.loadding = true;
            this.$set(this.dialogInfo, "loadding", true);

            Api.enNeedMeetingUnderLine(this.needToExamineForm).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("审核已提交");
              } else {
                // this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);

              this.dialogInfo.loadding = false;
              this.dialogInfo.visible = false;
              this.$emit("save", null);
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