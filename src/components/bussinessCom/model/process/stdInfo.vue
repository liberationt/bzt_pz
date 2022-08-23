<template>
  <div class="std-info">
    <template v-if="hasDoc != false">
      <iframe
        ref="editorIframe"
        class="iframeClass"
        :src="url"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
      <!-- :src="`${process.env.VUE_APP_EDITOR_URL}stdEditor/docView`" -->
    </template>
    <template v-else>
      <el-empty description="暂无大纲，请先编辑保存大纲" />
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import StdEidtorView from "@/views/stdEditor/stdEidtorView.vue";
import { getConfigByKey } from "@/api/editor.js";
export default {
  components: { StdEidtorView },
  name: "std-info",
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
      type: String,
      default: "",
    },
    businessCategory: {
      type: Number,
      default: 4,
    },
  },
  watch: {
    formValue: {
      deep: true,
      handler(val) {
        this.initEditorView();
        this.$emit("value-change", val);
      },
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      hasDoc: true,
      formatStr: "yyyy-MM-dd",
      url: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  mounted() {
    this.initEditorView();
  },
  methods: {
    /**
     * 获取预览页面
     */
    initEditorView() {
      const req = {
        businessCategory: this.businessCategory,
        businessId: this.formValue.id,
        configKey: "insert",
      };
      getConfigByKey(req).then((res) => {
        const { code, data, msg } = res;
        if (code == 200) {
          if (data != null) {
            if (this.formValue.projectPhase != 30) {
              // 预览
              this.url = encodeURI(
                `${
                  process.env.VUE_APP_EDITOR_URL
                }editor?t=${Date.now()}&businessId=${
                  this.formValue.id
                }&businessCategory=${
                  this.businessCategory
                }&readOnly=true&coverVisible=true&userId=${
                  this.userInfo.userId
                }&userName=${this.userInfo.nickName}`
              );
            } else if (
              this.formValue.projectState != 1107 &&
              this.formValue.projectState != 1208
            ) {
              // 征求意见
              // console.log(this.userInfo);
              this.url = encodeURI(
                `${
                  process.env.VUE_APP_EDITOR_URL
                }option?t=${Date.now()}&businessId=${
                  this.formValue.id
                }&businessCategory=${
                  this.businessCategory
                }&readOnly=false&userId=${this.userInfo.userId}&userName=${
                  this.userInfo.nickName
                }&companyName=${this.userInfo.dept.deptName}`
              );
            } else {
              // 征求意见
              this.url = encodeURI(
                `${
                  process.env.VUE_APP_EDITOR_URL
                }editor?t=${Date.now()}&businessId=${
                  this.formValue.id
                }&businessCategory=${this.businessCategory}&userId=${
                  this.userInfo.userId
                }&userName=${this.userInfo.nickName}&opinionProcessed=true`
              );
            }
          } else {
            this.hasDoc = false;
          }
        }
      });
    },
    /**
     * 是否显示编辑按钮
     */
    showEditBtn() {
      let show = false;
      if (
        this.formValue.interfacePersonIds != "" &&
        this.formValue.interfacePersonIds != null &&
        this.formValue.projectState == 1004
      ) {
        this.formValue.interfacePersonIds.split(",").forEach((item) => {
          if (item == this.userInfo.userId) {
            show = true;
          }
        });
      }
      return show;
    },
    /**
     * 保存
     */
    save() {
      this.formValue.id = this.projectId;
      Api.updateProjectApproval(this.formValue).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.$message.success("项目已提交");
          this.isEdit = false;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 流程流程流转下一步
     */
    next() {
      this.$emit("process-to-next", null);
    },
  },
};
</script>
<style lang="scss" scoped>
.std-info {
  padding: 0px;
  margin-top: 25px;
  margin-bottom: 48px;
  height: calc(100% - 120px);
  .std-info-title {
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
::v-deep .std-info-form {
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