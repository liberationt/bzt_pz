<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="false"
    >
      <template slot="body" v-if="contentForm != null">
        <div class="content" v-if="contentForm != null">
          <el-form
            :model="contentForm"
            ref="contentForm"
            label-suffix=":"
            label-width="100px"
            class="contentForm"
          >
            <el-form-item label="类型">
              {{ selectDictLabel(dict.type.article_type, contentForm.type) }}
            </el-form-item>
            <el-form-item label="标题">
              {{ contentForm.title }}
            </el-form-item>
            <el-form-item
              label="内容"
              v-if="
                contentForm.type == 10 ||
                contentForm.type == 20 ||
                contentForm.type == 30
              "
            >
              <span v-html="contentForm.content"></span>
            </el-form-item>

            <!-- 重点工作 -->
            <template v-if="contentForm.type == 20">
              <el-form-item label="牵头负责人" v-if="contentForm.type == 20">
                {{ getUser(contentForm.field1) }}
              </el-form-item>
            </template>

            <!-- 标准制度化 -->
            <template v-if="contentForm.type == 40">
              <el-form-item label="发布时间">
                {{ contentForm.field1 }}
              </el-form-item>
              <el-form-item label="实施时间">
                {{ contentForm.field2 }}
              </el-form-item>
            </template>

            <!-- 培训资料 -->
            <template v-if="contentForm.type == 50">
              <el-form-item label="培训机构">
                {{ contentForm.field2 }}
              </el-form-item>
              <el-form-item label="培训讲师">
                {{ contentForm.field3 }}
              </el-form-item>
              <el-form-item label="培训时间">
                {{ contentForm.field1 }}
              </el-form-item>
            </template>

            <!-- 常用模板 -->
            <template v-if="contentForm.type == 60">
              <el-form-item label="模板来源">
                {{ contentForm.field2 }}
              </el-form-item>
              <el-form-item label="上传时间" prop="field3">
                {{ contentForm.field3 }}
              </el-form-item>
            </template>

            <el-form-item label="附件" class="file-form">
              <div>
                <div
                  class="file"
                  v-for="(file, index) in files"
                  :key="`file_${index}`"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="file.name"
                    placement="top"
                  >
                    <span @click="downloadFile(file)">
                      <i class="el-icon-document" />
                      {{
                        file.name.length > 15
                          ? `${file.name.substring(13)}...`
                          : file.name
                      }}</span
                    >
                  </el-tooltip>
                  <span>{{ contentForm.updateTime }}</span>
                  <span class="red-link-text" @click="removeFile(index, files)">
                    删除
                  </span>
                </div>
              </div>
              <BztUploadFile
                :value="fileList"
                :limit="10"
                :fileSize="100"
                @upload-change="fileChange"
                class="files"
              />
            </el-form-item>
            <el-form-item label="备注">
              {{ contentForm.note }}
            </el-form-item>

            <!-- 标准制度化 -->
            <template v-if="contentForm.type == 40">
              <el-form-item label="上传时间">
                {{ contentForm.field3 }}
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/infoModule";
const contentForm = {
  id: "",
  type: "",
  title: null,
  content: null,
  note: "",
  attachFiles: [],
  state: "",
  field1: null,
  field2: null,
  field3: "",
};
const contentFormReq = {
  id: "",
  type: "",
  title: null,
  content: null,
  note: "",
  attachFiles: "",
  state: "",
  field1: null,
  field2: null,
  field3: "",
};
export default {
  components: { BztDialog, BztUploadFile },
  name: "content-publish",
  dicts: ["article_type", "article_status"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    formData: {
      type: Object,
      default: {
        id: "",
        type: "",
        title: null,
        content: null,
        note: "",
        attachFiles: null,
        state: "",
        field1: null,
        field2: null,
        field3: "",
      },
    },
    showZCBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "内容更新",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "提交审核",
      },
      changeUserDialog: {
        visible: false,
        title: "选择处理人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      contentForm: null,
      rules: {
        content: { required: true, message: "请输入发布内容", trigger: "blur" },
        type: { required: true, message: "请选择类型", trigger: "blur" },
        title: { required: true, message: "请输入标题", trigger: "blur" },
      },
      fileList: [],
      files: [],
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = val;
      if (val == true) {
        this.dialogInfo.visible = this.visiable;
        this.dialogInfo.loadding = false;
        if (this.formData == null) {
          this.contentForm = this.deepClone(contentForm);
        } else {
          this.contentForm = { ...this.formData };
          // this.contentForm = this.deepClone(this.formData);
          this.filterFiles();
        }
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.fileList = [];
    if (this.formData == null) {
      this.contentForm = this.deepClone(contentForm);
    } else {
      // this.contentForm = this.deepClone(this.formData);
      this.contentForm = { ...this.formData };
    }
  },
  methods: {
    /**
     * 上传附件
     */
    fileChange(e) {
      console.log(this.files);
      this.fileList = e;
      this.contentForm.attachFiles =
        this.fileList.length > 0 ? JSON.stringify(this.fileList) : null;
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.files = [];
      this.fileList = [];
      if (
        this.contentForm.attachFiles != null &&
        this.contentForm.attachFiles != ""
      ) {
        JSON.parse(this.contentForm.attachFiles).forEach((item) => {
          this.files.push(item);
        });
      }
    },
    /**
     * 下载附件
     * @param {*} file 要下载的附件信息
     */
    downloadFile(file) {
      this.downLoadByURL(file.url, file.name);
    },
    removeFile(i) {
      this.files.splice(i, 1);
    },
    /**
     * 关闭弹框 提交/暂存/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.dialogInfo.loadding = false;
        if (this.fileList.length == 0) {
          this.$message.warning("请上传附件");
          return;
        } else {
          this.fileList.forEach((file) => {
            this.files.push(file);
          });
        }
        console.log(this.files);
        this.contentForm.attachFiles =
          this.files.length > 0 ? JSON.stringify(this.files) : null;
        this.contentForm.state = flag == 10 ? 10 : 20;
        this.$refs.contentForm.validate((valid) => {
          if (valid) {
            let formData = this.deepClone(contentFormReq);
            Object.keys(formData).map((key) => {
              formData[key] = this.contentForm[key];
            });

            this.dialogInfo.loadding = true;
            Api.updateContent(formData).then((res) => {
              this.dialogInfo.loadding = false;
              const { code, msg } = res;
              if (code == 200) {
                this.$message.success("内容发布已更新");
                this.dialogInfo.visible = false;
                this.$emit("save", true);
              } else {
                this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", false);
      }
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 选择处理人
     */
    changeMainEditor() {
      console.log(1);
      this.changeUserDialog.visible = true;
    },
    /**
     * 选择归口单位
     */
    changeTecCom(e) {
      this.contentForm.businessObjId = e;
      console.log(e, this.contentForm.businessObjId);
    },
    /**
     * 确认选择主要起草人
     */
    closeChangeUser(e) {
      this.changeUserDialog.visible = false;
    },
    /**
     * 主要起草人选择
     */
    userChange(e) {
      this.contentForm.receiver = e.join(",");
    },
    /**
     * 获取可选人员
     */
    getCheckUserList() {
      this.userList = this.$cache.session.getJSON("sourceUserList");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .contentForm {
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
      display: flex;
      flex-direction: row;
      // justify-content: space-between;
      .el-date-editor,
      .el-select {
        width: 100%;
      }
      .files {
        float: right;
        margin-left: 30px;
      }
      .file {
        line-height: 35px;
        color: $link-text-color;
        display: flex;
        width: 380px;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        i {
          margin-right: 8px;
        }
        &:hover {
          color: $link-text-hover-color;
        }
      }
    }
  }
}
</style>