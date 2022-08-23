<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="stdReleaseForm"
        :rules="rules"
        ref="stdReleaseForm"
        label-suffix=":"
        label-width="180px"
        class="stdReleaseForm"
        
      >
        <el-form-item :label="`是否${title}`" prop="reviewState">
          <el-radio v-model="stdReleaseForm.reviewState" :label="1">组织</el-radio>
          <el-radio v-model="stdReleaseForm.reviewState" :label="2">不组织</el-radio>
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
import { updateByBusiness } from "@/api/editor.js";

const stdReleaseForm = {
  businessId: "",
  reviewState:''
};

export default {
  components: { BztDialog },
  name: "compilation",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    title:{
        type:String,
        default:''
    }
  },
  watch: {
    visiable: {
      handler(val) {
        // this.dialogInfo.title = "标准归档";
        // this.dialogInfo.visible = val;
        // this.stdReleaseForm = this.deepClone(stdReleaseForm);
        // this.stdReleaseForm.id = this.businessObjId;
        // this.stdReleaseForm.stdName = this.businessObjName;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准归档",
        width: "900px",
        footer: true,
        loadding: false,
        // submintText: "标准归档",
      },
      date: [],
      stdReleaseForm: {
        reviewState:''
      },
      rules: {
        reviewState: { required: true, message: "是否组织编制组会议", trigger: "blur" },
      },
      fileList: [],
    };
  },
  created() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title
  },

  methods: {
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.$refs.stdReleaseForm.validate((valid) => {
          if (valid) {
            this.stdReleaseForm.id = this.businessObjId
            this.dialogInfo.loadding = true;
            this.$set(this.dialogInfo, "loadding", true);
            Api.organizationalMeeting(this.stdReleaseForm).then((res) => {
              this.dialogInfo.loadding = false;
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("组织编制组会议");
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);
                this.$emit("save", null);
                } else {
                    this.$message.error(msg);
                }
            });
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