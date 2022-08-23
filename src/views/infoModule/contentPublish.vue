<template>
  <div class="delivery-info app-container">
    <!-- 搜索 -->
    <BztSearch
      :searchData="searchInfo"
      :formVal="listReq"
      @search="searchList"
    />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div
        class="submit-btn"
        @click="updateContent(null)"
        v-hasPermi="['contentPublish:update']"
      >
        <i class="el-icon-edit-outline" />
        新增内容发布
      </div>
      <div
        class="error-btn"
        @click="removeInfo(null)"
        v-hasPermi="['contentPublish:remove']"
      >
        <i class="el-icon-delete" />
        批量删除
      </div>
    </div>

    <!-- 信息列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '150px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      :checkeBox="true"
      @checkDetail="checkDetail"
      @select-change="selectData"
    >
      <template slot="update" slot-scope="{ scope }">
        <span
          class="yellow-link-txt"
          @click="updateContent(scope)"
          v-if="scope.state == 10"
          v-hasPermi="['contentPublish:update']"
        >
          编辑
        </span>
        <span
          class="yellow-link-txt"
          @click="update(scope)"
          v-if="
            scope.state != 40 &&
            scope.state != 50 &&
            (scope.type == 60 || scope.type == 70)
          "
          v-hasPermi="['contentPublish:update']"
        >
          更新
        </span>
        <span
          class="yellow-link-txt"
          @click="updateContent(scope)"
          v-if="scope.state == 40"
          v-hasPermi="['contentPublish:update']"
        >
          修改
        </span>
      </template>
      <template
        slot="resive"
        slot-scope="{ scope }"
        v-if="scope.state == 30 || scope.state == 35"
      >
        <span
          class="green-link-text"
          v-if="scope.state == 30"
          v-hasPermi="['contentPublish:changeStatus']"
          @click="updateState(scope)"
        >
          停用
        </span>
        <span
          class="green-link-text"
          v-if="scope.state == 35"
          v-hasPermi="['contentPublish:changeStatus']"
          @click="updateState(scope)"
        >
          启用
        </span>
      </template>
      <template slot="remove" slot-scope="{ scope }">
        <span
          class="red-link-text"
          @click="removeInfo(scope)"
          v-hasPermi="['contentPublish:remove']"
        >
          删除
        </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!--内容发布/编辑/修改  -->
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="saveContent"
      :appendTobody="false"
    >
      <template slot="body" v-if="dialogInfo.visible == true">
        <ContentPublish
          :todoTask="
            contentData == null ? null : { businessObjId: contentData.id }
          "
          @success="saveContent(true)"
          @close="saveContent(false)"
        />
      </template>
    </BztDialog>

    <!-- 内容更新 -->
    <ContentUpdate
      :visiable="updateVisible"
      :formData="contentData"
      @save="saveContent"
    />

    <!--  -->
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";

import { ContentPublish, ContentUpdate } from "@components/bussinessCom/index";

export default {
  name: "content-publish",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    ContentPublish,
    ContentUpdate,
  },
  dicts: ["article_type", "article_status"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      isAll: false,
      dialogInfo: {
        visible: false,
        width: "900px",
        title: "内容发布",
      },
      dialogDetailInfo: {
        visible: false,
        title: "详情",
        width: "900px",
        footer: false,
      },
      distriNoticeDialog: {
        visible: false,
        title: "分发通知",
        width: "900px",
        footer: false,
      },
      editVisible: false,
      updateVisible: false,
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "标题",
          key: "title",
          minWidth: "360px",
        },
        {
          title: "类型",
          key: "type",
          width: "180",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.article_type.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "发布人",
          key: "createUser",
          width: "180",
          filter: {
            type: "user",
          },
        },
        {
          title: "发布日期",
          key: "createTime",
          width: "220",
          filter: {
            type: "filter",

            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "状态",
          key: "state",
          width: "120",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = "";
              this.dict.type.article_status.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              switch (data) {
                case 50:
                case 35:
                  str = `<span class="error-tag">${str}</span>`;
                  break;
                case 40:
                case 10:
                  str = `<span class="warning-tag">${str}</span>`;
                  break;
                case 30:
                  str = `<span class="success-tag">${str}</span>`;
                  break;
                case 20:
                  str = `<span class="ing-tag">${str}</span>`;
                  break;
              }
              return str;
            },
          },
        },
      ],
      listReq: {
        type: "",
        state: "",
        publishName: null,
        publishTimeRange: [],
        pageNum: 1,
        pageSize: 10,
        isAsc: "desc",
        orderByColumn: "a.publish_time",
        publishName: "",
      },
      tabAction: [
        { label: "详情", action: "checkDetail" },
        { label: "修改", type: "slot", btnName: "update" },
        { label: "停用", type: "slot", btnName: "resive" },
        {
          label: "删除",
          type: "slot",
          btnName: "remove",
          color: "rgba(214, 71, 48)",
        },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      infoDetail: {},
      contentData: null,
      noticeVisiable: false,
      checkPros: [],
    };
  },
  mounted() {
    this.initDictData();
    this.getList();
  },
  methods: {
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          {
            label: "类型",
            key: "type",
            type: 2,
            options: this.dict.type.article_type,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "状态",
            key: "state",
            type: 2,
            options: this.dict.type.article_status,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "发布人",
            key: "publishName",
            type: 1,
          },
          {
            label: "发布日期",
            key: "publishTimeRange",
            type: 3,
            formatStr: "yyyy-MM-dd",
            formatValStr: "yyyy-MM-dd",
            dateType: "datetimeRange",
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      };
    },
    /**
     * 判断日期式
     * @param {string} data 要判断的日期字符串
     */
    getDate(data) {
      let str = "";
      if (data === null || data === undefined) {
        str = "";
      } else if (
        data.indexOf("1900-01-01") === -1 &&
        data.indexOf("1970-01-01") === -1 &&
        data.indexOf("9990-01-01") === -1
      ) {
        str = data;
      }
      return str;
    },
    /**
     * 获取信息列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getContentList(this.listReq).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.list = res.rows;
          this.page.total = res.total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      this.isAll = false;

      Object.keys(e).map((key) => {
        this.listReq[key] = e[key];
      });
      this.pageChange(1);
    },
    /**
     * 翻页
     * @param {number} e 页码
     */
    pageChange(e) {
      this.listReq.pageNum = e;
      this.getList();
    },
    /**
     * 改变每页显示数量
     */
    sizeChange(e) {
      this.listReq.pageSize = e;
      this.pageChange(1);
    },
    /**
     * 查看详情
     * @param {object} e 要查看的内容的信息
     */
    checkDetail(e) {
      this.$router.push(`/maintenance/contentPublish/detail/${e.id}`);
    },
    /**
     * 打开新增编辑弹窗
     * @param {*} data 为null时为发布信息，否则为编辑
     */
    updateContent(data = null) {
      this.contentData = data;
      this.dialogInfo.visible = true;
    },
    /**
     * 更新/编辑/修改内容 提交/取消/信息
     */
    saveContent(e) {
      this.dialogInfo.visible = false;
      this.updateVisible = false;
      if (e == true) {
        this.pageChange(1);
      }
    },
    /**
     * 打开更新内容发布弹窗
     * @param {*} data 为null时为发布信息，否则为编辑
     */
    update(data) {
      this.contentData = data;
      this.updateVisible = true;
    },
    /**
     * 删除内容
     * @param {*} e 要删除的内容的详情
     */
    removeInfo(e) {
      let ids = [];
      if (e != null) {
        this.checkPros = [e];
      }
      if (this.checkPros.length == 0) {
        this.$message.warning("请选择要删除的数据");
        return;
      } else {
        this.checkPros.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.$confirm(
        `确定要删除吗？删除后数据不可再恢复，请谨慎操作！`,
        "删除",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          Api.removeArticle(ids.join(",")).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 停用内容
     * @param {*} e 要删除的内容的详情
     */
    updateState(e) {
      this.$confirm(
        `确定${e.state == 35 ? "启用" : "停用"}内容：《${e.title}》吗？`,
        "信息",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          Api.updateActivateState({
            id: e.id,
            state: e.state == 35 ? 30 : 35,
          }).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(
                `已${e.state == 35 ? "启用" : "停用"}内容：${e.title}`
              );
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 复选框选中数据
     */
    selectData(e) {
      this.checkPros = e;
    },
  },
};
</script>
<style lang="scss" scoped>
.delivery-info {
  width: 100%;
  height: 100%;
}

::v-deep .el-descriptions {
  font-size: 14px !important;
  width: 80%;
  margin: auto;
  .el-descriptions-row {
    .el-descriptions-item__cell {
      line-height: 35px;
      font-size: 15px;
    }
  }
}
</style>