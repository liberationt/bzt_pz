<template>
  <div class="purchaseStd app-container">
    <!-- <div class="title" v-if="isApplay == true">标准采购记录列表</div> -->

    <!-- 搜索 -->
    <BztSearch
      :searchData="searchInfo"
      :formVal="listReq"
      @search="searchList"
    />

    <!-- 功能操作行 -->
    <div class="operation-line" v-if="isApplay == true">
      <div class="submit-btn" @click="apply()">
        <i class="el-icon-goods" />
        申请购置
      </div>
    </div>

    <!-- 订购列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: [],
      }"
      :hasIndex="!isApplay"
      :checkeBox="isApplay == true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      :clearSelection="false"
      @select-change="selectData"
    />

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 申请购置弹框 -->
    <BztDialog
      v-if="dialogPurchase.visible == true && projects.length > 0"
      :dialogInfo="dialogPurchase"
      @close="closedialogPurchase"
    >
      <template slot="body">
        <el-form label-width="130px" :inline="true">
          <el-form-item :label="`已选标准（${projects.length}）：`">
            <br />
            <template v-for="(item, index) in projects">
              <div :key="index">{{ item.stdName }}</div>
            </template>
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@/api/process.js";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";

const statusList = [
  { value: -1, label: "拒绝" },
  { value: 0, label: "申请" },
  { value: 1, label: "申请通过" },
  { value: 2, label: "采购中" },
  { value: 3, label: "采购完成" },
  { value: 4, label: "采购中止" },
];
export default {
  name: "purchaseStd",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      isApplay: false,
      isTabLoading: false,
      searchInfo: {
        labelList: [
          {
            label: "标准名称",
            key: "stdName",
            type: 1,
          },
          {
            label: "状态",
            key: "state",
            type: 2,
            options: statusList,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "210",
        },
        {
          title: "申请购置时间",
          key: "createTime",
          width: "180",
        },
        {
          title: "申请理由",
          key: "applyReason",
          width: "210",
        },
        {
          title: "申请人",
          key: "createUser",
          width: "180",
          filter: {
            type: "user",
          },
        },
        {
          title: "状态",
          key: "state",
          width: "180",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = "";
              statusList.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              switch (Number(data)) {
                case -1:
                  str = `<span class="error-tag">${str}</span>`;
                  break;
                case 0:
                  str = `<span class="ing-tag">${str}</span>`;
                  break;
                case 2:
                  str = `<span class="ing-tag">${str}</span>`;
                  break;
                case 3:
                case 1:
                  str = `<span class="success-tag">${str}</span>`;
                  break;
                case 4:
                  str = `<span class="error-tag">${str}</span>`;
                  break;
              }
              return str;
            },
          },
        },
      ],
      listReq: {
        createUser: "",
        state: null,
        stdName: "",
        isAsc: "desc",
        orderByColumn: "createTime",
        status: null,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      projects: [],
      dialogPurchase: {
        visible: false,
        title: "申请购置",
        width: "800px",
        loadding: false,
        footer: true,
      },
    };
  },
  created() {
    localStorage.setItem("purchaseStds", "");
    this.isApplay = this.$route.params.isApply == 1;
    this.listReq.state = !this.isApplay ? null : 1;
    this.getList();
  },
  methods: {
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
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
    /**
     * 获取订购列表
     */
    getList() {
      this.isTabLoading = true;
      this.listReq.createUser = !this.isApplay ? this.userInfo.userId : null;
      Api.stdPurchaseList(this.listReq).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.list = res.rows;
          this.page.total = res.total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
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
     * 复选框操作
     * @param {*} e 选中的行
     */
    selectData(e) {
      this.projects = e;
    },
    /**
     * 申请购置
     */
    apply() {
      if (this.projects.length == 0) {
        this.$message.warning("请选择标准");
        return;
      }
      let has = false;
      this.projects.forEach((item) => {
        if (item.state != 1) {
          has = true;
        }
      });
      if (has == true) {
        this.$message.warning("请选择状态为申请通过的标准");
        return;
      }
      this.dialogPurchase.visible = true;
    },
    /**
     * 提交申请购置
     */
    closedialogPurchase(e) {
      if (e == true) {
        localStorage.setItem("purchaseStds", JSON.stringify(this.projects));
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push(`/work/stdPurchaseUpdate`);
      } else {
        this.dialogPurchase.visible = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.purchaseStd {
  width: 100%;
  height: 100%;
  .title {
    font-size: 18px;
    line-height: 38px;
  }
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