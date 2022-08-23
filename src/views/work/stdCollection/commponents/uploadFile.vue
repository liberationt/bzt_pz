<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="fileForm"
        :rules="rules"
        ref="fileForm"
        label-suffix=":"
        class="fileForm"
      >
        <el-form-item label="">
          <BztUploadFile
            :value="fileList"
            :limit="1"
            :fileSize="100"
            type="drop"
            @upload-change="fileChange"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
const fileForm = {
  name: "",
  parentTypeId: "",
  repositoryUrl: "",
};

export default {
  components: { BztDialog, BztUploadFile },
  name: "upload-file",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    parentTypeId: {
      type: String | Number,
      default: null,
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.visible = val;
        this.fileForm = this.deepClone(fileForm);
        this.fileForm.parentTypeId = this.parentTypeId;
      },
    },
  },
  data() {
    return {
      name: "upload-file",
      dialogInfo: {
        visible: false,
        title: "上传资料",
        width: "900px",
        footer: true,
        loadding: false,
      },
      fileList: [],
      fileForm: {
        id: null,
        fileList: [],
      },
      rules: {
        fileList: {
          required: true,
          message: "请上传资料",
          trigger: ["blur", "change"],
        },
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.fileForm = this.deepClone(fileForm);
    this.fileForm.parentTypeId = this.parentTypeId;
  },

  methods: {
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      if (e.lenght > 0) {
        this.fileForm.repositoryUrl = e[0].url;
        this.fileForm.name = e[0].name;
      } else {
        this.fileForm.repositoryUrl = "";
        this.fileForm.name = "";
      }
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        if (this.fileList.length == 0) {
          this.$message.warning("请上传资料");
          return;
        }
        this.fileForm.repositoryUrl = this.fileList[0].url;
        this.fileForm.name = this.fileList[0].name;
        this.dialogInfo.loadding = true;
        Api.addDoc(this.fileForm).then((res) => {
          this.dialogInfo.loadding = false;
          const { code, msg } = res;
          if (code === 200) {
            this.$message.success("资料已上传");
            this.dialogInfo.visible = false;
            this.$emit("save", null);
          } else {
            // this.$message.error(msg);
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