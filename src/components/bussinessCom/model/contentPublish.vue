<template>
  <div>
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
              v-for="(item, index) in $cache.session.getJSON('sourceUserList')"
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
    <div class="footer">
      <div class="cancelBtn" @click="closeDialog(false, 0)">取消</div>
      <el-button
        class="yellow-btn el-button"
        :loading="isLoading"
        @click="closeDialog(true, 10)"
        v-if="contentForm.id == null || contentForm.id == ''"
      >
        暂存
      </el-button>
      <el-button
        class="submit-btn"
        @click="closeDialog(true, 0)"
        :loading="isLoading"
      >
        提交审核
      </el-button>
    </div>
  </div>
</template>
<script>
import { BztUploadFile } from "@components/basicCom/index";
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
  components: { BztUploadFile },
  name: "content-publish",
  dicts: ["article_type", "article_status"],
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
      date: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      dateTime: null,
      contentForm: {},
      rules: {
        content: { required: true, message: "请输入发布内容", trigger: "blur" },
        type: { required: true, message: "请选择类型", trigger: "blur" },
        title: { required: true, message: "请输入标题", trigger: "blur" },
      },
      fileList: [],
      isLoading: false,
    };
  },
  mounted() {
    this.contentForm = this.deepClone(contentForm);
    if (this.todoTask != null) {
      this.getDetail();
    }
  },
  methods: {
    /**
     * 获取内容详情
     */
    getDetail() {
      Api.getArticleDetail(this.todoTask.businessObjId).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          Object.keys(this.contentForm).map((key) => {
            if (data[key] != undefined) {
              this.contentForm[key] = data[key];
            }
          });
          this.dateTime = null;
          if (this.contentForm.type == 50) {
            if (
              this.contentForm.field1 != null &&
              this.contentForm.field1 != ""
            ) {
              this.dateTime = this.contentForm.field1.split(",");
            }
          }
          this.contentForm["rejectReasons"] = data["rejectReasons"];
          this.filterFiles();
        } else {
          this.$message.error(msg);
        }
      });
    },
    dateChange() {
      if (this.dateTime != null) {
        this.contentForm.field1 = this.dateTime.join(",");
      }
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.contentForm.attachFiles =
        this.fileList.length > 0 ? JSON.stringify(this.fileList) : null;
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
     * 关闭弹框 提交/暂存/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.contentForm.attachFiles =
          this.fileList.length > 0 ? JSON.stringify(this.fileList) : null;
        this.contentForm.state = flag == 10 ? 10 : 20;
        this.$refs.contentForm.validate((valid) => {
          if (valid) {
            let formData = this.deepClone(contentFormReq);
            Object.keys(formData).map((key) => {
              formData[key] = this.contentForm[key];
            });

            this.isLoading = true;
            Api.updateContent(formData).then((res) => {
              this.isLoading = false;
              const { code, msg } = res;
              if (code == 200) {
                this.$message.success("内容发布已更新");
                this.$emit("success", null);
              } else {
                this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.$emit("close", null);
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