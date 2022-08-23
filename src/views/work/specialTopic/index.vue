<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 流程列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '140px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkProcess="checkProcess"
      />

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
export default {
  components: { BztSearch, BztTable, BztPageContrl },
  name: "enterprise-std",
  data() {
    return {
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "项目申请人",
          key: "stdNo",
          width: "230",
        },
        {
          title: "申请单位",
          key: "stdName",
          width: "450",
          sortable: true,
        },
        {
          title: "申请时间",
          key: "stdNameReplacedBy",
          width: "180",
        },
        {
          title: "项目节点",
          key: "stdPublishDate",
          width: "180",
          sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              return "";
            },
          },
        },
        {
          title: "项目状态",
          key: "stdStatus",
          width: "120",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              // this.dict.type.standard_status.forEach((item) => {
              //   if (item.value == data) {
              //     str = item.label;
              //   }
              // });
              return str;
            },
          },
        },
      ],
      listReq: {},
      tabAction: [
        { label: "查看流程", action: "checkProcess" },
        { label: "删除", action: "", color: "red" },
      ],
      list: [{}],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
    };
  },
  created() {
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
          { label: "申请人", key: "stdName", type: 1 },
          {
            label: "申请时间",
            key: "stdNo",
            type: 3,
            formatStr: "YYYY-MM-dd",
            dateType: "dateRange",
          },
          { label: "申请单位", key: "stdNo", type: 1 },
          {
            label: "项目节点",
            key: "status",
            type: 2,
            options: [],
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "项目状态",
            key: "status",
            type: 2,
            options: [],
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      };
    },
    /**
     * 切换阶段
     * @param {*} e 阶段标识
     */
    chengeTab(e) {},
    /**
     * 获取标准列表
     */
    getList() {},
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
     * 查看流程
     */
    checkProcess(data) {
      // ${data.id}
      // this.$router.push({ path: `/viewProcess/1` });
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .enterprise-std-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>