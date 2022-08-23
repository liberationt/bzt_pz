<template>
  <div class="dialog">
    <el-dialog
      custom-class="dialog-component"
      :visible="dialogInfo.visible"
      center
      :width="dialogInfo.width"
      :close-on-press-escape="dialogInfo.isEdit !== true"
      :close-on-click-modal="dialogInfo.isEdit !== true"
      :append-to-body="appendTobody != false"
      :modal-append-to-body="appendTobody != false"
      :modal="dialogInfo.isFull != true"
      :destroy-on-close="false"
      :fullscreen="dialogInfo.isFull == true"
      @close="closeDialog(false)"
    >
      <template slot="title">
        <span class="title">{{ dialogInfo.title }}</span>
      </template>
      <slot name="body" class="body"></slot>

      <span
        slot="footer"
        class="dialog-footer"
        v-if="dialogInfo.footer == true || dialogInfo.footer == false"
      >
        <template v-if="dialogInfo.footer != false">
          <el-button @click="closeDialog(false)">取 消</el-button>
          <slot name="footer-btn"></slot>
          <el-button
            type="primary"
            @click="closeDialog(true)"
            :loading="dialogInfo.loadding == true"
          >
            {{
              dialogInfo.submintText == undefined ||
              dialogInfo.submintText == ""
                ? "确 定"
                : dialogInfo.submintText
            }}
          </el-button>
        </template>
        <slot name="footer" v-else></slot>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dialog-box",
  props: ["dialogInfo", "appendTobody"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    closeBranchDialog() {},
  },
  watch: {
    dialogInfo: {
      deep: true,
      handler(newVal, oldVal) {},
    },
  },
  methods: {
    closeDialog(flag = false) {
      if (flag === true) {
        this.loading = true;
      }
      this.$emit("close", flag);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog-component {
  .el-dialog__header {
    background: #ffffff;
    .title {
      font-size: 18px;
      line-height: 35px;
      font-weight: 500;
      padding: 0px 15px;
    }
  }
  .el-dialog__body {
    padding: 30px;
    max-height: 700px;
    height: auto;
    min-height: 150px;
    overflow-y: auto;
  }
  .el-dialog__footer {
    padding: 0 !important;
    background: #ffffff;
    .el-button {
      line-height: 30px;
      padding: 0px 15px;
      margin: 0 20px;
    }
    .dialog-footer {
      display: flex;
      text-align: center;
      flex-direction: row;
      justify-content: center;
      padding: 15px;
      .btn {
        width: auto;
        line-height: 30px;
        padding: 0px 15px;
        position: relative;
      }
    }
  }
}
::v-deep .el-form {
  width: 100%;
  font-size: 14px !important;
  .el-form-item {
    margin-right: 15px;
    .el-form-item__label {
      font-weight: 400;
    }
    .el-form-item__content {
      .el-date-editor,
      .el-select,
      .el-cascader,
      .el-input {
        width: 100%;
      }
      .el-textarea__inner {
      }
    }
  }
}
</style>