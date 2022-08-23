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
        label-width="150px"
        class="stdReleaseForm"
        v-if="stdReleaseForm != null"
      >
        <el-form-item label="标准名称">
          <div class="pro-name">
            {{ businessObjName }}
          </div>
        </el-form-item>
        <el-form-item label="技术标准编号" prop="stdNo">
          <el-input
            placeholder="请输入技术标准编号"
            v-model="stdReleaseForm.stdNo"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishdate">
          <el-date-picker
            v-model="stdReleaseForm.publishdate"
            type="date"
            placeholder="选择发布日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="实施日期" prop="dodate">
          <el-date-picker
            v-model="stdReleaseForm.dodate"
            type="date"
            placeholder="选择实施日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { updateByBusiness } from "@/api/editor.js";

const stdReleaseForm = {
  businessId: "",
  stdNo: "",
  stdName: null,
  publishdate: null,
  dodate: "",
};

export default {
  components: { BztDialog, BztUploadFile },
  name: "stdRelease",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    businessObjName: {
      type: String,
      default: "",
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "标准归档";
        this.dialogInfo.visible = val;
        this.stdReleaseForm = this.deepClone(stdReleaseForm);
        this.stdReleaseForm.businessId = this.businessObjId;
        this.stdReleaseForm.stdName = this.businessObjName;
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      dialogInfo: {
        visible: false,
        title: "标准归档",
        width: "900px",
        footer: true,
        loadding: false,
        // submintText: "标准归档",
      },
      date: [],
      stdReleaseForm: null,
      rules: {
        stdNo: { required: true, message: "技术标准编号", trigger: "blur" },
        publishdate: {
          required: true,
          message: "请选择发布日期",
          trigger: "change",
        },
        dodate: {
          required: true,
          message: "请选择实施日期",
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
        this.stdReleaseForm.businessId = this.businessObjId;
        this.dialogInfo.loadding = false;
        
        // this.stdReleaseForm.stdNo = this.stdReleaseForm.stdNos;
        this.$refs.stdReleaseForm.validate((valid) => {
          if (valid) {
            if(new Date(this.stdReleaseForm.publishdate)>new Date(this.stdReleaseForm.dodate)){
              return this.$message({
                message: '实施日期错误',
                type: 'warning'
              });
            }
            this.dialogInfo.loadding = true;
            this.$emit("save", this.stdReleaseForm);
            // this.dialogInfo.loadding = true;
            // this.$set(this.dialogInfo, "loadding", true);
            // const getConfigByKeyReq = {
            //   businessCategory: 5,
            //   businessId: this.businessObjId,
            //   stdName: this.businessObjName,
            //   stdNo: this.stdReleaseForm.stdNo,
            //   effectiveDate: this.stdReleaseForm.publishdate,
            //   releaseDate: this.stdReleaseForm.dodate,
            //   standardEdition: "",
            // };
            // updateByBusiness(getConfigByKeyReq).then((res) => {
            //   this.dialogInfo.loadding = false;
            //   const { code, msg } = res;
            //   if (code != 200) {
            //     console.log(msg);
            //   } else {
            //     Api.stdPublish(this.stdReleaseForm).then((res1) => {
            //       const { code, msg } = res1;
            //       if (code === 200) {
            //         this.$message.success("标准已发布");
            //         this.dialogInfo.visible = false;
            //         this.$set(this.dialogInfo, "loadding", false);
            //         this.$emit("save", null);
            //       } else {
            //         // this.$message.error(msg);
            //       }
            //     });
            //   }
            // });
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