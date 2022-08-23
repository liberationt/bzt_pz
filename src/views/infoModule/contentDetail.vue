<template>
  <div class="content-detail app-container">
    <!-- 功能操作行 -->
    <!-- <div
      class="operation-line"
      v-if="
        hasPermission('standardBusinessSupervisor') && contentForm.state == 20
      "
      style="justify-content: end"
    >
      <div class="submit-btn" @click="approveArticle">
        <i class="el-icon-edit-outline" />
        内容审核
      </div>
    </div> -->
    <div class="content" v-if="contentForm != null">
      <div class="content-title">{{ contentForm.title }}</div>
      <div class="content-desc">
        <span
          >类型：{{
            selectDictLabel(dict.type.article_type, contentForm.type)
          }}</span
        >
        <span>发布人：{{ contentForm.publishUserInfo.nickName }}</span>
        <span>发布时间：{{ contentForm.publishTime }}</span>
      </div>
      <div class="content-detail">
        <span v-html="contentForm.content"></span>
      </div>
      <!-- 重点工作 -->
      <template v-if="contentForm.type == 20">
        <div class="desc" v-if="contentForm.type == 20">
          牵头负责人：{{ getUser(contentForm.field1) }}
        </div>
      </template>

      <!-- 标准制度化 -->
      <template v-if="contentForm.type == 40">
        <div class="desc">发布时间：{{ contentForm.field1 }}</div>
        <div class="desc">实施时间：{{ contentForm.field2 }}</div>
      </template>

      <!-- 培训资料 -->
      <template v-if="contentForm.type == 50">
        <div class="desc">培训机构：{{ contentForm.field2 }}</div>
        <div class="desc">培训讲师：{{ contentForm.field3 }}</div>
        <div class="desc">培训时间：{{ contentForm.field1 }}</div>
      </template>

      <!-- 常用模板 -->
      <template v-if="contentForm.type == 60">
        <div class="desc">模板来源：{{ contentForm.field2 }}</div>
        <div class="desc">上传时间：{{ contentForm.field3 }}</div>
      </template>

      <div class="desc">
        附件：
        <div
          class="file"
          v-for="(file, index) in fileList"
          :key="`file_${index}`"
          @click="downloadFile(file)"
        >
          <i class="el-icon-document" />{{ file.name }}
        </div>
      </div>
      <div class="desc">备注：{{ contentForm.note }}</div>

      <!-- 标准制度化 -->
      <template v-if="contentForm.type == 40">
        <div class="desc">上传时间：{{ contentForm.field3 }}</div>
      </template>

      <!-- 部文管理 -->
      <template v-if="contentForm.type == 110">
        <div class="desc">上传时间：{{ contentForm.field3 }}</div>
      </template>
    </div>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import { BztDialog } from "@components/basicCom/index";

import {} from "@components/bussinessCom/index";
export default {
  name: "content-detail",
  components: {
    BztDialog,
  },
  dicts: ["article_type", "article_status"],
  computed: {
    ...mapGetters(["userInfo"]),
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
    this.id = this.$route.params.id;
    this.getDetail();
  },
  methods: {
    /**
     * 获取内容详情
     */
    getDetail() {
      Api.getArticleDetail(this.id).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.contentForm = data;
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
     * 获取用户名
     */
    getUser(userId) {
      const sourceUserList = this.$cache.session.getJSON("sourceUserList");
      if (userId == null) return "";
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
              } else {
                // this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.dialogDetailInfo.visible = false;
        this.dialogDetailInfo.loadding = false;
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
  width: 90%;
  height: 100%;
  margin: auto;
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
  .content-title {
    font-size: 15px;
    text-align: center;
    line-height: 40px;
    padding: 8px 15px;
  }
  .content-desc {
    width: 80%;
    margin: 10px auto;
    font-size: 12px;
    color: #555555;
    padding: 8px 15px;
    text-align: center;
    span {
      margin-left: 100px;
      &:first-child {
        margin: 0;
      }
    }
  }
  .desc {
    line-height: 35px;
    font-size: 14px;
    padding: 8px 15px;
  }
}
</style>