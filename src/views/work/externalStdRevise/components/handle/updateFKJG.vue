<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="logFileForm"
        :rules="rules"
        ref="logFileForm"
        label-suffix=":"
        class="logFileForm"
      >
        <el-form-item label="外部审核结果" prop="reviewState">
          <el-radio-group v-model="logFileForm.reviewState">
            <el-radio :label="1"> 通过，无需修改 </el-radio>
            <el-radio :label="2"> 不通过，需要修改 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label=""
          prop="fileList"
          v-if="logFileForm.reviewState != 1"
        >
          <BztUploadFile
            :value="fileList"
            :limit="10"
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

export default {
  components: { BztDialog, BztUploadFile },
  name: "updateFKJG",
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
        title: "上传审查会会议纪要",
        width: "900px",
        footer: true,
        loadding: false,
      },
      fileList: [],
      logFileForm: {
        id: null,
        reviewState: null,
        fileList: [],
      },
      rules: {
        fileList: {
          required: true,
          message: "请上传会议纪要文件",
          trigger: ["blur", "change"],
        },
        reviewState: {
          required: true,
          message: "请选择外部审核结果",
          trigger: ["blur", "change"],
        },
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title = "更新外部审核结果";
    this.dialogInfo.loadding = false;
  },

  methods: {
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.logFileForm.fileList =
        this.fileList.length == 0
          ? ""
          : this.fileList.map((item) => {
              return { name: item.name, url: item.url };
            });
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.logFileForm.id = this.businessObjId;
        this.$refs.logFileForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);

            Api.deliverOutsideFeedbackToDoc(this.logFileForm).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("更新外部审核结果");
              } else {
                this.$message.error(msg);
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