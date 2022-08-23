<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="updateFinalReResultForm"
        :rules="rules"
        ref="updateFinalReResultForm"
        label-suffix=":"
        label-width="150px"
        class="updateFinalReResultForm"
        v-if="updateFinalReResultForm != null"
      >
        <el-form-item label="所选项目">
          <div class="pro-name">
            <span v-for="(item, index) in projects" :key="item.id">
              {{ item.projectName }}
              <span v-if="index < projects.length">;</span>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="结论" prop="conclusion">
          <el-radio-group v-model="updateFinalReResultForm.conclusion">
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="3"> 终止 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="修改原因"
          prop="reason"
          v-if="updateFinalReResultForm.conclusion == 3"
        >
          <el-input
            type="textarea"
            placeholder="请输入修改原因"
            v-model="updateFinalReResultForm.reason"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
const updateFinalReResultForm = {
  projectApprovalIds: [],
  conclusion: "",
  reason: null,
};

export default {
  components: { BztDialog, BztUploadFile },
  name: "updateWBPSJG",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    projects: {
      type: Array,
      default: [],
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "更新最终评审结果";
        this.dialogInfo.visible = val;
        this.updateFinalReResultForm = this.deepClone(updateFinalReResultForm);
        this.updateFinalReResultForm.projectApprovalIds = [];
        this.projects.forEach((item, index) => {
          this.updateFinalReResultForm.projectApprovalIds.push(item.id);
        });
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "更新最终评审结果",
        width: "800px",
        footer: true,
        loadding: false,
      },
      date: [],
      updateFinalReResultForm: null,
      rules: {
        reason: {
          required: true,
          message: "请输入不通过理由",
          trigger: "blur",
        },
        conclusion: {
          required: true,
          message: "请选择结论",
          trigger: "change",
        },
      },
      fileList: [],
    };
  },
  created() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
  },

  methods: {
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.$refs.updateFinalReResultForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);
            Api.updateFinalReviewResults(this.updateFinalReResultForm).then(
              (res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("最终评审结果已更新");
                  this.dialogInfo.visible = false;
                  this.$set(this.dialogInfo, "loadding", false);
                  this.$emit("save", null);
                  this.dialogInfo.loadding = false;
                } else {
                  this.$message.error(msg);
                }
              }
            );
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.$emit("save", null);
        this.dialogInfo.loadding = false;
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
    .pro-name {
      border-radius: 5px;
      line-height: 36px;
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