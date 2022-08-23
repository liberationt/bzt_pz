<template>
  <el-dialog custom-class="dialog-component" :visible="visiable" center :close-on-press-escape="false"
    :close-on-click-modal="false" :append-to-body="true" :destroy-on-close="true" :fullscreen="true"
    @close="closeDialog">
    <template slot="title">
      <span class="title">{{ title }}</span>
    </template>
    <template>
      <div class="editor">
        <edit-doc v-if="visiable" :docId="data.docId" :readOnly="data.readOnly" :opinionProcessed="data.opinionProcessed" :projectData="projectData"></edit-doc>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import editDoc from "@/components/bussinessCom/editor/editDoc";
import { mapGetters } from "vuex";
export default {
  name: "sam-editor-dialog",
  components: {
    editDoc
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "编辑文档",
    },
    /*
    docData: {
        docId: null,
        author: null,
        stdNo: null,
        stdName: null,
        readOnly: null,
      },
     */
    data: {
      type: Object,
    },
    projectData: Object
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      showCloseDialog: true,
    };
  },
  methods: {
    closeDialog() {
      if (this.visiable == true) {
        if (this.data.readOnly){
          this.$emit("close");
        } else {
          this.$confirm(`请确认内容已保存？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          })
            .then(() => {
              this.$emit("close");
            })
            .catch((error) => {});
        }
      }
    },
  },
  created() {},
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
    .editor {
      height: 100%;
    }
    .btns {
      height: 45px;
      background-color: #f6f6f6;
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      + .editor {
        height: calc(100% - 45px);
      }
    }
  }
}
</style>
