<template>
  <el-dialog
    custom-class="dialog-component"
    :visible="visiable"
    center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :destroy-on-close="true"
    :fullscreen="true"
    @close="closeDialog(false)"
  >
    <template slot="title">
      <span class="title">{{ title }}</span>
    </template>
    <template>
      <iframe
        ref="fIframe"
        class="iframeClass"
        :src="pathUrl"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
    </template>
  </el-dialog>
</template>
<script>
import { setConfigObject } from "@api/editor";
import Api from "@/api/draft.js";
export default {
  name: "editor-dialog",
  props: {
    visiable: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "创建大纲",
    },
    pathUrl: {
      type: String,
      default: "",
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    businessCategory: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    visiable(val) {
      console.log(val);
    },
  },
  data() {
    return {};
  },
  mounted() {
    window.addEventListener("message", this.linstenerFun);
  },
  methods: {
    closeDialog(e) {
      this.$confirm(`关闭前请您先确认是否已保存数据？`, "提示", {
        confirmButtonText: "关闭",
        cancelButtonText: "取消",
        center: true,
      }).then(() => {
        this.$emit("close", e);
      });
    },
    linstenerFun(e) {
      const { data } = e;
      const { businessId, method, type } = data;
      if (type == "outlineClose") {
        if (method == "insert") {
        }
        this.setObject(businessId);
      }
    },
    /**
     * setOBJ
     */
    setObject(id) {
      const req = {
        businessCategory: this.businessCategory,
        businessId: id,
        configKey: "insert",
        configValue: "{'flag':1}",
      };
      setConfigObject(req).then((res) => {
        const { code, msg } = res;
        if (code != 200) {
          console.log(msg);
        } else {
          if (this.isDraft == true) {
            Api.updateDraft({ draftId: id, hasDocument: 1 }).then((res) => {
              // 编辑草案
              this.updateDraftDialog.loadding = false;
              const { code, msg } = res;
              if (code == 200) {
                this.$message.success("编辑草案成功");
                this.updateDraftDialog.visible = false;
              } else {
                this.$message.error(msg);
              }
            });
          }
        }
      });
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.linstenerFun);
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog-component {
  position: relative;
  width: 100%;
  height: 100%;
  .el-dialog__body {
    position: relative;
    padding: 0;
    height: calc(100% - 51px);
    overflow: auto;
  }
}
</style>