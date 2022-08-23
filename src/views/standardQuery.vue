<template>
  <div class="standard-query app-container">
    <!-- 搜索 -->
    <BztSearch
      :searchData="searchInfo"
      :formVal="listReq"
      @search="searchList"
      @searchAll="searchAll"
    />

    <!-- 标准列表 -->
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
      @fileView="fileView"
      @sort-change="sortChange"
    >
      <template slot="favorite" slot-scope="{ scope }">
        <span
          v-if="favoriteBusinessIds.indexOf(scope.stdNo) == -1"
          class="yellow-link-txt"
          @click="favorite(scope, 0)"
        >
          收藏
        </span>
        <span v-else class="yellow-link-txt" @click="favorite(scope, 1)"
          >取消收藏
        </span>
        <!-- v-hasPermi="['standardQuery:purchase']"购买权限 -->
        <span
          class="green-link-text"
          v-if="purchaseIds.indexOf(scope.stdId) == -1"
          v-hasPermi="['standardQuery:purchase']"
          @click="purStd(scope)"
          >购买
        </span>
        <span
          v-if="scope.hasFile == 1"
          class="green-link-text"
          @click="fileDownLoad(scope)"
          >下载文件
        </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 全文检索  -->
    <BztDialog :dialogInfo="dialogInfo" @close="closeDialog">
      <template slot="body">
        <el-form label-width="100px">
          <el-form-item label="关键字查询">
            <el-input v-model="allReq.searchValue" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer" class="footer">
        <div class="submit-btn btn" @click="closeDialog(true)">搜索</div>
        <div class="submitBtnReset btn" @click="allReq.searchValue = ''">
          重置
        </div>
        <div class="cancelBtn btn" @click="closeDialog(false)">关闭</div>
      </template>
    </BztDialog>

    <!-- 购买  -->
    <BztDialog
      v-if="dialogPurchase.visible == true && purchaseStd != null"
      :dialogInfo="dialogPurchase"
      @close="closedialogPurchase"
    >
      <template slot="body">
        <el-form label-width="100px">
          <el-form-item label="标准名称">
            <!-- <el-input v-model="purchaseStd.stdName" /> -->
            {{ purchaseStd.stdName }}
          </el-form-item>
          <el-form-item label="购买理由">
            <el-input type="textarea" :rows="2" v-model="purchaseOpinion" />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <!--详情  -->
    <StdDetail
      v-if="stdVisiable == true"
      :visiable="stdVisiable"
      :title="stdTitle"
      :standarDetail="standarDetail"
      :type="1"
      :statusStr="statusStr"
      @close="closeDetail"
    />
  </div>
</template>
<script>
import Api from "@api/infoModule";
import processApi from "@api/process";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";
import { StdDetail } from "@components/bussinessCom/index";

export default {
  name: "standardQuery",
  components: { BztSearch, BztTable, BztPageContrl, BztDialog, StdDetail },
  dicts: ["standard_type", "standard_status"],
  props: {
    keyWord: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isAll: false,
      stdVisiable: false,
      stdTitle: "",
      dialogInfo: {
        visible: false,
        title: "全文检索",
        width: "800px",
        footer: false,
      },
      dialogPurchase: {
        visible: false,
        title: "购置申请",
        width: "900px",
        loadding: false,
        footer: true,
      },
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "180",
        },
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "280",
          filter: {
            type: "action",
            actionName: "fileView",
            isHtml: true,
            action: (data, row) => {
              let str = "";
              if (row.hasFile != 1 || row.sortField == null) {
                str = `<span>${data}</span>`;
              } else if (
                row.stdFile.split(".")[1].indexOf("docx") != -1 &&
                row.stdFile.split(".")[1].indexOf("doc") != -1
              ) {
                const img = require(`@assets/images/doc.png`);
                str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
              } else if (
                row.stdFile.split(".")[1].indexOf("docx") != -1 &&
                row.stdFile.split(".")[1].indexOf("doc") != -1
              ) {
                const img = require(`@assets/images/pdf.png`);
                str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
              } else {
                const img = require(`@assets/images/file.png`);
                str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
              }
              return str;
            },
          },
        },
        {
          title: "标准替代信息",
          key: "stdNameReplacedBy",
          width: "180",
        },
        {
          title: "发布时间",
          key: "stdPublishDate",
          width: "180",
          sortable: "custom",
          filter: {
            type: "filter",
            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "实施时间",
          key: "stdDoDate",
          sortable: "custom",
          width: "160",
          filter: {
            type: "filter",
            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "状态",
          key: "statusStr",
          width: "120",
          // filter: {
          //   type: "filter",
          //   action: (data) => {
          //     let str = "";
          //     this.dict.type.standard_status.forEach((item) => {
          //       if (item.value == data) {
          //         str = item.label;
          //       }
          //     });
          //     return str;
          //   },
          // },
        },
      ],
      listReq: {
        stdNo: "",
        stdName: "",
        status: null,
        stdType: null,
        pageNo: 1,
        pageSize: 10,
        searchValue: "",
        sortWay: null,
        sortField: null,
      },
      tabAction: [
        { label: "详情", action: "checkDetail" },
        { label: "收藏", type: "slot", btnName: "favorite" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      allReq: {
        searchValue: "",
        pageNo: 1,
        pageSize: 10,
      },
      standarDetail: {},
      favoriteBusinessIds: [],
      purchaseIds: [],
      purchaseStd: null,
      purchaseOpinion: "",
    };
  },
  wacth: {
    keyWord(val) {
      this.listReq.stdName = val;
    },
  },
  mounted() {
    this.listReq.stdName = this.keyWord;
  },
  created() {
    // this.listReq.searchValue = this.$route.query.keyWord ?? "";
    this.listReq.stdName = this.keyWord;
    this.isAll = false;
    this.initDictData();
    this.getUserFavoriteBusinessIds();
    this.getList();

    let num = 2.5;
    let str = "01:30";
    let h = Number(str);
  },
  methods: {
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          { label: "标准名称", key: "stdName", type: 1 },
          { label: "标准编号", key: "stdNo", type: 1 },
          {
            label: "标准类型",
            key: "stdType",
            type: 2,
            options: this.dict.type.standard_type,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "状态",
            key: "status",
            type: 2,
            options: this.dict.type.standard_status,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
          {
            label: "全文检索",
            action: "searchAll",
            type: 1,
            className: "yellow-btn",
          },
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
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
    /**
     * 获取当前用户已收藏的标准ID
     */
    getUserFavoriteBusinessIds() {
      Api.getUserFavoriteBusinessIds("1").then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.favoriteBusinessIds = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取当前用户购买中或者购买成功的标准IDS
     */
    getPurchaseByUserId() {
      processApi.getPurchaseByUserId().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.purchaseIds = data;
        }
      });
    },
    /**
     * 获取标准列表
     */
    getList() {
      this.isTabLoading = true;
      this.getPurchaseByUserId();
      if (this.isAll === false) {
        Api.getTopicalDetail(this.listReq).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.list = data.rows;
            this.page.total = data.total;
            this.page.pageNo = this.listReq.pageNo;
            this.page.pageSize = this.listReq.pageSize;
          } else {
            // this.$message.error(msg);
          }
          this.isTabLoading = false;
        });
        this.isTabLoading = false;
      } else {
        this.allReq.pageNo = this.listReq.pageNo;
        this.allReq.pageSize = this.listReq.pageSize;
        Api.searchFullText(this.allReq).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.list = data.rows;
            this.page.total = data.total;
            this.page.pageNo = this.allReq.pageNo;
            this.page.pageSize = this.allReq.pageSize;
          } else {
            // this.$message.error(msg);
          }
          this.isTabLoading = false;
        });
        this.isTabLoading = false;
      }
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
      this.listReq.pageNo = e;
      this.getList();
    },
    /**
     * 标准阅读记录
     * @param data {Object} 标准信息
     * @param type {number} 1详情 2pdf 3结构化
     */
    stdReadLog(data, type) {
      const req = {
        stdId: data.stdId,
        stdNo: data.stdNo,
        stdName: data.stdName,
        readType: type,
      };
      Api.stdReadLog(req).then((res) => {});
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
     * @param {object} e 要查看的标准的信息
     */
    checkDetail(e) {
      this.stdVisiable = true;
      this.standarDetail = e;
      this.statusStr = e.statusStr
      this.stdTitle = `标准 [ ${e.stdName} ] 详情`;
      this.stdReadLog(e, 1);
    },
    /**
     * 关闭详情弹框
     */
    closeDetail() {
      this.stdVisiable = false;
      this.stdTitle = "";
      this.standarDetail = null;
    },
    /**
     * 全文检索
     */
    searchAll() {
      this.dialogInfo.visible = true;
    },
    /**
     * 关闭全文检索弹框
     * @param {*} e:true为检索，false：为取消
     */
    closeDialog(e) {
      if (e === true) {
        this.isAll = true;
        this.getList(1);
        this.dialogInfo.visible = false;
      } else {
        this.allReq.searchValue = "";
        this.dialogInfo.visible = false;
      }
    },
    /**
     * 排序操作
     * @param prop {string} 字段名
     * @param order {string} 排序格式
     */
    sortChange({ prop, order }) {
      if (order != null) {
        this.listReq.sortField = prop;
        this.listReq.sortWay = order;
      } else {
        this.listReq.sortField = null;
        this.listReq.sortWay = null;
      }
      this.pageChange(1);
    },
    /**
     * 收藏
     * @param {object} e 要收藏的标准信息
     * @param {} flag 0:收藏，1：取消收藏
     */
    favorite(e, flag = 0) {
      if (flag === 0) {
        this.$confirm(`确定收藏：《${e.stdName}》吗？`, "收藏", {
          confirmButtonText: "确定收藏",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            const req = {
              userId: this.$store.state.userId,
              favoritesCatalogId: 0,
              businessId: e.stdNo,
              businessCategory: "1",
              searchValue: `${e.stdNo}/${e.stdName}`,
            };
            Api.addFavorites(req).then((res) => {
              const { data, code, msg } = res;
              if (code === 200) {
                this.$message.success("已加入收藏");
                this.getUserFavoriteBusinessIds();
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {});
      } else {
        this.$confirm(`确定取消收藏：《${e.stdName}》吗？`, "取消收藏", {
          confirmButtonText: "取消收藏",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            const req = {
              category: 1,
              businessIds: [e.stdNo],
            };
            Api.removeFavority(req).then((res) => {
              const { data, code, msg } = res;
              if (code === 200) {
                this.$message.success("已加入收藏");
                this.getUserFavoriteBusinessIds();
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {});
      }
    },
    /**
     * 下载文件
     * @param {*} 要下载的文件信息
     */
    fileDownLoad(data) {
      if (data.hasFile == 1) {
        const fileName = `${data.stdName}.${data.stdFile.split(".")[1]}`;
        this.downLoadByURL(data.stdFile, `${fileName}`);
      }
    },
    /**
     * PDF预览
     * @param {*} 要预览的PDF文件信息
     */
    fileView(data) {
      // `${process.env.VUE_APP_BASE_API}${data.stdFile}`
      // const url = `${process.env.VUE_APP_BASE_API}/profile/pdf/项目555.pdf`;
      // window.open(url);
      this.stdReadLog(e, 1);
      if (data.stdFile.split(".")[1] == "pdf") {
        const url = `${process.env.VUE_APP_BASE_API}${data.stdFile}`;
        const { href } = this.$router.resolve({
          path: "/pdfView",
          query: {
            url: url,
          },
        });
        window.open(href, "_blank");
      }
    },
    /**
     * 购买标准
     * @param data {*} 要购买的标准信息
     */
    purStd(data) {
      this.purchaseStd = JSON.parse(JSON.stringify(data));
      this.options = "";
      this.dialogPurchase.visible = true;
    },
    /**
     * 申请购买
     */
    async closedialogPurchase(e) {
      if (e == true) {
        const req = [{
          stdName: this.purchaseStd.stdName,
          stdNo: this.purchaseStd.stdNo,
          stdId: this.purchaseStd.stdId,
          applyReason: this.purchaseOpinion,
          type: 0,
        }];
        this.$set(this.dialogPurchase, "loadding", true);
        await processApi.applyStdPurchase(req).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("操作成功");
            this.getList();
            this.purchaseStd = null;
            this.purchaseOpinion = "";
            this.dialogPurchase.visible = false;
          }
        });
          this.$set(this.dialogPurchase, "loadding", false); 
      } else {
        this.purchaseStd = null;
        this.purchaseOpinion = "";
        this.dialogPurchase.visible = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.standard-query {
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
::v-deep .btn {
  position: relative;
}
</style>