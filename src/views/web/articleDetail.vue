<template>
  <div class="article-detail">
    <!-- 页面顶部 -->
    <HomeHeader />

    <div class="web-content">
      <!-- 搜索区域 -->
      <HeaderSearch />

      <!-- 内容发布通知 -->
      <span class="link-text" @click="back()">
        <i class="el-icon-d-arrow-left" />返回
      </span>

      <div class="menu-list">
        <template v-for="(item, index) in articleTypeList">
          <span
            :key="index"
            :class="
              listReq.type == item.dictValue ? 'menu-li menu-li-sel' : 'menu-li'
            "
            @click="toDetail(item.dictValue)"
          >
            {{ item.dictLabel }}
          </span>
        </template>
      </div>

      <!-- 搜索 -->
      <BztSearch
        :searchData="searchInfo"
        :formVal="listReq"
        @search="searchList"
      />

      <!-- 标准购置列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '180px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkDetail="checkDetail"
      />

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </div>

    <!-- 页面底部 -->
    <Footer />
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import {
  Footer,
  HomeHeader,
  HeaderSearch,
} from "@components/bussinessCom/index";
import Api from "@api/web";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    Footer,
    HomeHeader,
    HeaderSearch,
  },
  name: "article-detail",
  data() {
    return {
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "标题",
          key: "title",
          minWidth: "230",
        },
        {
          title: "发布人",
          key: "publishUserInfo.userId",
          width: "210",
          filter: {
            type: "user",
          },
        },
        {
          title: "发布日期",
          key: "publishTime",
          width: "230",
        },
      ],
      listReq: {
        publishTimeRange: null,
        title: "",
        type: null,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [{ label: "查看详情", action: "checkDetail" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      articleTypeList: [],
    };
  },
  created() {
    this.listReq.type =
      this.$route.query.type != "null" && this.$route.query.type
        ? this.$route.query.type
        : null;
    this.listReq.title = this.$route.query.keyword ?? null;
    this.getArticleTypeList();
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
          { label: "标题", key: "title", type: 1 },
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
    getArticleTypeList() {
      Api.getArticleTypeList().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.articleTypeList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 切换阶段
     * @param {*} e 阶段标识
     */
    chengeTab(e) {},
    /**
     * 获取内容
     */
    getList() {
      Api.articleList(this.listReq).then((res) => {
        const { code, rows, msg, total } = res;
        if (code === 200) {
          this.list = rows;
          this.page.total = total;
          this.page.pageSize = this.listReq.pageSize;
          this.page.pageNo = this.listReq.pageNum;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */ searchList(e) {
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
     */
    checkDetail(e) {
      this.$router.push(`/checkArticleDetail/${e.id}`);
    },
    /**
     * 内容详情
     */
    toDetail(type) {
      if (getToken()) {
        this.listReq.type = type;
        this.getList();
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
    back() {
      history.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.article-detail {
  width: 100%;
  // height: 100%;
  // overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  min-width: 1366px;
  margin: auto;
  .menu-list {
    min-width: 1000px;
    width: 100%;
    margin-bottom: 15px;
    overflow: hidden;
    height: 38px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: -28px;
    .menu-li {
      font-size: 16px;
      line-height: 35px;
      float: left;
      margin-left: 25px;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:hover {
        color: $bule;
        border-bottom: 2px solid $bule;
      }
    }
    .menu-li-sel {
      color: $bule;
      border-bottom: 2px solid $bule;
    }
  }
  .article-detail-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
  .bzt-table {
    height: calc(100% - 320px);
    overflow: auto;
  }
}
</style>