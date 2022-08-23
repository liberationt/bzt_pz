<template>
  <div>
    <el-form
      :model="infoForm"
      :rules="rules"
      ref="infoForm"
      label-suffix=":"
      label-width="100px"
      class="infoForm"
      v-if="infoForm != null"
    >
      <el-form-item label="主题" prop="infoTheme">
        <el-select
          :value="infoForm.infoTheme"
          placeholder="请选择主题"
          disabled
        >
          <template v-for="(item, index) in dict.type.info_publish_theme">
            <el-option
              :key="`theme_${index}`"
              :label="item.label"
              :value="Number(item.value)"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="infoTitle">
        <el-input v-model="infoForm.infoTitle" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="infoForm.content" /> -->
        <TinymceEditor
          editorName="content"
          :cur-value="infoForm.content"
          v-model="infoForm.content"
          :height="'200px'"
        />
      </el-form-item>
      <el-form-item label="归口单位" prop="infoTitle">
        <!-- {{ infoForm.businessObjId }}
        <TecCommittees :value="infoForm.businessObjId" /> -->
        <el-input :value="getOwnerDept(infoForm.businessObjId)" disabled />
      </el-form-item>
      <el-form-item
        :label="
          infoForm.infoTheme == 1 ||
          infoForm.infoTheme == 3 ||
          infoForm.infoTheme == 4
            ? '立项起止时间'
            : infoForm.infoTheme == 2
            ? '标准编制立项起止时间'
            : infoForm.infoTheme == 5
            ? '制修订起止时间'
            : '起止时间'
        "
        disabled
      >
        <el-input :value="infoForm.date.join(' ~ ')" disabled />
      </el-form-item>
      <el-form-item label="附件" prop="filesPath">
        <BztUploadFile
          :value="fileList"
          :limit="10"
          :fileSize="100"
          @upload-change="fileChange"
        />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input type="textarea" v-model="infoForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <div class="cancelBtn" @click="closeDialog(false)">取消</div>
      <el-button
        class="submit-btn"
        @click="closeDialog(true)"
        :loading="isLoading"
      >
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/infoModule";
const infoForm = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  status: null,
  infoPublishId: null,
  date: [,],
  remark: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
};
const infoFormReq = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  status: null,
  infoPublishId: null,
  remark: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
};
export default {
  components: { BztDialog, BztUploadFile },
  name: "PublicInfoCom",
  dicts: ["info_publish_theme", "technical_committees"],
  props: {
    todoTask: {
      type: Object,
      default: {
        bussnessId: "",
      },
    },
  },
  computed: {
    pickerOptionsPlan() {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        if (this.infoForm.date != null && this.infoForm.date.length > 0) {
          return (
            new Date(this.infoForm.date[1]).getTime() > time.getTime() ||
            time.getTime() < Date.now() - 8.64e7
          );
        } else {
          return time.getTime() < Date.now() - 8.64e7;
        }
      };
      return disableTime;
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "信息发布",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "立即发布",
      },
      date: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      infoForm: null,
      rules: {
        content: { required: true, message: "请输入发布内容", trigger: "blur" },
        infoTheme: { required: true, message: "请选择主题", trigger: "blur" },
        infoTitle: { required: true, message: "请输入标题", trigger: "blur" },
        date: {
          required: true,
          message: "请选择起止时间",
          trigger: ["change", "blur"],
        },
        filesPath: { required: true, message: "请上传附件", trigger: "blur" },
      },
      fileList: [],
      isLoading: false,
    };
  },
  watch: {
    todoTask(val) {
      this.getTaskDetail();
    },
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    getOwnerDept(id) {
      let str = "";
      this.dict.type.technical_committees.forEach((item) => {
        if (item.value == id.split(",")[0]) {
          str = item.label;
        }
      });
      return str;
    },

    /**
     * 获取信息详情
     */
    getTaskDetail() {
      this.infoForm = this.deepClone(infoForm);
      this.infoForm.hook = this.todoTask.hook ?? "";
      // this.infoForm.infoPublishId = this.todoTask.businessObjId ?? "";
      if (this.todoTask.businessObjId) {
        Api.getInfoDetail(this.todoTask.businessObjId).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            this.infoForm.infoTheme = 4;
            this.infoForm.date = [data.startDate, data.endDate];
            this.infoForm.businessObjId = `${data.businessObjId},${data.infoPublishId}`;
            console.log(this.infoForm);
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      let files = [];
      this.fileList.forEach((item) => {
        const file = {
          fileName: item.name,
          filePath: item.url,
        };
        files.push(file);
      });
      this.infoForm.filesPath =
        files.length === 0 ? null : JSON.stringify(files);
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (this.infoForm.filesPath != null) {
        JSON.parse(this.infoForm.filesPath).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filesPath,
          };
          this.fileList.push(file);
        });
      }
    },
    /**
     * 起止时间校验
     */
    dateBlur() {
      if (this.date !== null && this.date.length > 0) {
        this.$refs.dateRange.clearValidate();
      }
    },
    /**
     * 关闭弹框 提交/暂存/取消
     */
    async closeDialog(e, flag) {
      if (e === true) {
        this.$refs.infoForm.validate(async (valid) => {
          if (valid) {
            this.isLoading = true;
            if (this.infoForm.date.length > 1) {
              this.infoForm.startDate = this.infoForm.date[0];
              this.infoForm.endDate = this.infoForm.date[1];
            } else {
              this.$message.warning("起止日期不能为空，请选择！");
            }
            let files = [];
            this.fileList.forEach((item) => {
              const file = {
                fileName: item.name,
                filePath: item.url,
              };
              files.push(file);
            });
            this.infoForm.filesPath =
              files.length === 0 ? null : JSON.stringify(files);

            let formData = _.cloneDeep(infoFormReq);
            Object.keys(formData).map((key) => {
              formData[key] = this.infoForm[key];
            });

            await Api.infoPublish(formData).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("信息已发布");
                this.$emit("success", null);
              } else {
                // this.$message.error(msg);for
              }
            });
            this.isLoading = false;
          } else {
            return false;
          }
        });
      } else {
        this.$emit("close", null);
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
.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
}
</style>