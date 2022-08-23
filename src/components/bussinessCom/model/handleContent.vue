<template>
  <div class="content-detail app-container">
    <div class="content" v-if="contentForm != null">
      <el-form
        v-if="contentForm != null"
        :model="contentForm"
        :rules="rules"
        ref="contentForm"
        label-suffix=":"
        label-width="100px"
        class="contentForm"
      >
        <template v-if="contentForm.state != null">
          <el-form-item
            label="修改原因"
            class="reason"
            v-if="contentForm.state == 40"
          >
            <div class="reason-content">
              {{ contentForm.rejectReasons }}
            </div>
          </el-form-item>
        </template>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="contentForm.type"
            placeholder="请选择类型"
            :disabled="contentForm.id != null && contentForm.id != ''"
          >
            <template v-for="(item, index) in dict.type.article_type">
              <el-option
                :key="`article_type_${index}`"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="contentForm.title"
            :placeholder="
              contentForm.type == 40
                ? '输入标题（标准编号+制度名称）'
                : '请输入标题'
            "
          />
        </el-form-item>
        <el-form-item
          label="内容"
          v-if="
            contentForm.type == 10 ||
            contentForm.type == 90 ||
            contentForm.type == 100 ||
            contentForm.type == 20 ||
            contentForm.type == 30
          "
        >
          <!-- <editor v-model="contentForm.content" :height="160" /> -->
          <TinymceEditor
            editorName="contentFormContent"
            :curValue="contentForm.content"
            v-model="contentForm.content"
            :height="'210px'"
          />
        </el-form-item>

        <!-- 重点工作 -->
        <template v-if="contentForm.type == 20">
          <el-form-item
            label="牵头负责人"
            prop="field1"
            v-if="contentForm.type == 20"
          >
            <el-select
              v-model="contentForm.field1"
              placeholder="请选择牵头负责人"
            >
              <template
                v-for="(item, index) in $cache.session.getJSON(
                  'sourceUserList'
                )"
              >
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="String(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
        </template>

        <!-- 标准制度化 -->
        <template v-if="contentForm.type == 40">
          <el-form-item label="发布时间" prop="field1">
            <el-date-picker
              v-model="contentForm.field1"
              type="date"
              placeholder="请选择发布时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="实施时间" prop="field2">
            <el-date-picker
              v-model="contentForm.field2"
              type="date"
              placeholder="请选择实施时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>

        <!-- 培训资料 -->
        <template v-if="contentForm.type == 50">
          <el-form-item label="培训机构" prop="field2">
            <el-input
              v-model="contentForm.field2"
              placeholder=" 请输入培训机构"
            />
          </el-form-item>
          <el-form-item label="培训讲师" prop="field3">
            <el-input
              v-model="contentForm.field3"
              placeholder=" 请输入培训讲师"
            />
          </el-form-item>
          <el-form-item label="培训起始时间" prop="field1">
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              placeholder="请选择培训起始时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="dateChange()"
            />
          </el-form-item>
        </template>

        <!-- 常用模板 -->
        <template v-if="contentForm.type == 60">
          <el-form-item label="模板来源" prop="field2">
            <el-input
              v-model="contentForm.field2"
              placeholder=" 请输入模板来源"
            />
          </el-form-item>
          <el-form-item label="上传时间" prop="field3">
            <el-date-picker
              v-model="contentForm.field3"
              type="date"
              placeholder="请选择上传时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>

        <el-form-item label="附件">
          <BztUploadFile
            :value="fileList"
            :limit="10"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="contentForm.note" />
        </el-form-item>

        <!-- 标准制度化 -->
        <template v-if="contentForm.type == 40">
          <el-form-item label="上传时间" prop="field3">
            <el-date-picker
              v-model="contentForm.field3"
              type="date"
              placeholder="请选择上传时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>
        <!-- 部文管理 -->
        <template v-if="contentForm.type == 110">
          <el-form-item label="上传时间" prop="field3">
            <el-date-picker
              v-model="contentForm.field3"
              type="date"
              placeholder="请选择上传时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>
      </el-form>
      <el-form
        :model="artcleForm"
        :rules="rules"
        ref="artcleForm"
        label-suffix=":"
        label-width="130px"
        class="artcleForm"
      >
        <el-form-item label="审核结果" prop="reviewState">
          <el-radio-group v-model="artcleForm.state">
            <el-radio :label="30"> 通过 </el-radio>
            <el-radio :label="40"> 驳回 </el-radio>
            <el-radio :label="50"> 终止 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="原因"
          prop="rejectReasons"
          v-if="artcleForm.state != 30"
        >
          <el-input
            type="textarea"
            placeholder="请输入原因"
            v-model="artcleForm.rejectReasons"
          />
        </el-form-item>
      </el-form>
      <div class="operation-line footer" v-if="contentForm.state == 20">
        <div class="submit-btn" @click="closeDetail(true)">
          <i class="el-icon-edit-outline" />
          确定
        </div>
      </div>
    </div>

    <!--内容审核  -->
    <BztDialog :dialogInfo="dialogDetailInfo" @close="closeDetail">
      <template slot="body">
        <el-form
          :model="artcleForm"
          :rules="rules"
          ref="artcleForm"
          label-suffix=":"
          label-width="130px"
          class="artcleForm"
        >
          <el-form-item label="审核结果" prop="reviewState">
            <el-radio-group v-model="artcleForm.state">
              <el-radio :label="30"> 通过 </el-radio>
              <el-radio :label="40"> 驳回 </el-radio>
              <el-radio :label="50"> 终止 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="原因"
            prop="rejectReasons"
            v-if="artcleForm.state != 30"
          >
            <el-input
              type="textarea"
              placeholder="请输入原因"
              v-model="artcleForm.rejectReasons"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import { BztDialog, BztUploadFile } from "@components/basicCom/index";

export default {
  name: "handle-content",
  components: {
    BztDialog,
    BztUploadFile,
  },
  dicts: ["article_type", "article_status"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    todoTask: {
      type: Object,
      default: {
        businessObjId: "",
      },
    },
  },
  data() {
    return {
      id: null,
      dialogDetailInfo: {
        visible: false,
        title: "内容审核",
        width: "900px",
        loadding: false,
        footer: true,
      },
      contentForm: null,
      fileList: [],
      artcleForm: {
        id: null,
        state: 20,
        rejectReasons: "",
        type: "",
        title: null,
        content: null,
        note: "",
        attachFiles: "",
        field1: null,
        field2: null,
        field3: "",
      },
      rules: {
        state: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        rejectReasons: {
          required: true,
          message: "请输入驳回原因",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    this.id = this.todoTask.businessObjId;
    this.getDetail();
  },
  methods: {
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.contentForm.attachFiles =
        this.fileList.length > 0 ? JSON.stringify(this.fileList) : null;
    },
    /**
     * 获取内容详情
     */
    getDetail() {
      Api.getArticleDetail(this.id).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.contentForm = data;
          console.log(this.contentForm);
          this.filterFiles();
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (
        this.contentForm.attachFiles != null &&
        this.contentForm.attachFiles != ""
      ) {
        JSON.parse(this.contentForm.attachFiles).forEach((item) => {
          this.fileList.push(item);
        });
      }
    },
    /**
     *
     * 获取用户名
     */
    getUser(userId) {
      const sourceUserList = this.$cache.session.getJSON("sourceUserList");
      if (userId == 0) return "系统";
      const user = _.find(sourceUserList, { userId: Number(userId) });
      return user
        ? `${user.nickName}（${user.userName}）`
        : "-（${user.userName}）";
    },
    /**
     * 下载附件
     * @param {*} file 要下载的附件信息
     */
    downloadFile(file) {
      this.downLoadByURL(file.url, file.name);
    },
    /**
     * 内容审核
     */
    approveArticle() {
      this.artcleForm = {
        id: this.contentForm.id,
        state: null,
        rejectReasons: "",
      };
      this.dialogDetailInfo.visible = true;
      this.dialogDetailInfo.loadding = false;
    },
    /**
     * 提交/取消内容审核
     */
    closeDetail(e) {
      if (e == true) {
        Object.keys(this.artcleForm).map((key) => {
          if (key != "state" && key != "rejectReasons") {
            this.artcleForm[key] = this.contentForm[key];
          }
        });
        console.log(this.artcleForm);
        this.$refs.artcleForm.validate((valid) => {
          if (valid) {
            this.dialogDetailInfo.loadding = true;
            Api.updateArticleState(this.artcleForm).then((res) => {
              this.dialogDetailInfo.loadding = false;

              const { code, msg } = res;
              if (code === 200) {
                this.getDetail();
                this.dialogDetailInfo.visible = false;
                this.$message.success("内容审核已提交");
                this.$emit("success", null);
              } else {
                // this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.dialogDetailInfo.visible = false;
        this.dialogDetailInfo.loadding = false;
        this.$emit("close", null);
        this.artcleForm = {
          id: this.contentForm.id,
          state: null,
          rejectReasons: "",
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content-detail {
  width: 100%;
  height: 100%;
  .file {
    line-height: 35px;
    color: $link-text-color;
    cursor: pointer;
    i {
      margin-right: 8px;
    }
    &:hover {
      color: $link-text-hover-color;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>