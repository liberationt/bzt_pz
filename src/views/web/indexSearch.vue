<template>
  <div class="enterprise-std">
    <!-- 页面顶部 -->
    <HomeHeader />

    <div class="web-content">
      <!-- 搜索区域 -->
      <HeaderSearch />
      <span class="link-text" @click="back()">
        <i class="el-icon-d-arrow-left" />返回
      </span>

      <StandardQuery :keyWord="keyWord" />
    </div>

    <!-- 页面底部 -->
    <Footer />
  </div>
</template>
<script>
import {
  Footer,
  HomeHeader,
  HeaderSearch,
} from "@components/bussinessCom/index";
import Api from "@api/web";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import StandardQuery from "../standardQuery.vue";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    Footer,
    HomeHeader,
    HeaderSearch,
    StandardQuery,
  },
  name: "article-detail",
  data() {
    return {
      keyWord: "",
    };
  },
  created() {
    this.keyWord = this.$route.query.keyword ?? null;
  },
  methods: {
    back() {
      history.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
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
  .enterprise-std-content {
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