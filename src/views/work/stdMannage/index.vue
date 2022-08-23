<template>
  <div class="standard-query app-container">
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
        @click="editStd(null)"
        v-hasPermi="['stdManage:add']"
      >
        <i class="el-icon-plus" />
        添加标准
      </div>
      <div
        class="submit-btn"
        @click="importFile()"
        v-hasPermi="['stdManage:import']"
      >
        <i class="el-icon-upload2" />
        批量导入标准
      </div>
    </div>

    <!-- 标准列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '110px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @fileView="fileView"
    >
      <template slot="favorite" slot-scope="{ scope }">
        <span
          class="yellow-link-txt"
          v-if="scope.stdId.indexOf('-') > -1"
          v-hasPermi="['stdManage:edit']"
          @click="editStd(scope)"
        >
          编辑
        </span>
        <span
          v-if="scope.hasFile == 1"
          class="green-link-text"
          @click="fileDownLoad(scope)"
        >
          下载
        </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 添加（编辑）标准  -->
    <UpdateStd
      v-if="updateStdVisiable == true"
      :visiable="updateStdVisiable"
      :stdInfo="standarForm"
      @save="updateStd"
    />

    <!-- 批量导入  -->
    <BztDialog
      v-if="importForm.visible == true"
      :dialogInfo="importForm"
      @close="closeimportForm"
    >
      <template slot="body">
        <BztUploadFile
          :value="files"
          :limit="1"
          :fileSize="100"
          type="drop"
          @upload-change="fileChange"
        />
        <el-link
          type="primary"
          :underline="false"
          @click="exportFile"
          style="
            float: right;
            margin-top: 0px;
            position: absolute;
            right: 25px;
            top: 285px;
          "
          >导出模板
        </el-link>
      </template>
    </BztDialog>
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
  BztUploadFile,
} from "@components/basicCom/index";

import UpdateStd from "./components/updateStd.vue";

export default {
  name: "standardQuery",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    UpdateStd,
    BztUploadFile,
  },
  dicts: ["standard_type", "standard_status"],
  data() {
    return {
      isAll: false,
      stdVisiable: false,
      stdTitle: "",
      dialogInfo: {
        visible: false,
        title: "添加标准",
        width: "800px",
        footer: true,
      },
      importForm: {
        visible: false,
        title: "导入标准",
        width: "600px",
        loadding: false,
        footer: true,
      },
      isTabLoading: false,
      searchInfo: {
        labelList: [
          { label: "标准名称", key: "stdName", type: 1 },
          { label: "标准编号", key: "stdNo", type: 1 },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
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
                str = `<span><img src="${img}" style="width:15px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
              } else if (
                row.stdFile.split(".")[1].indexOf("pdf") != -1 &&
                row.stdFile.split(".")[1].indexOf("pdf") != -1
              ) {
                const img = require(`@assets/images/pdf.png`);
                str = `<span><img src="${img}" style="width:15px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
              } else {
                const img = require(`@assets/images/file.png`);
                str = `<span><img src="${img}" style="width:15px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
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
          sortable: true,
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
          key: "stdStatus",
          width: "120",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.standard_status.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
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
      },
      tabAction: [{ label: "操作", type: "slot", btnName: "favorite" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      standarForm: null,
      updateStdVisiable: false,
      files: [],
    };
  },
  mounted() {
    this.pageChange(1);
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
      Api.getTopicalDetail(this.listReq).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.list = data.rows;
          console.log(this.list);
          this.page.total = data.total;
          this.page.pageNo = this.listReq.pageNo;
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
     * 改变每页显示数量
     */
    sizeChange(e) {
      this.listReq.pageSize = e;
      this.pageChange(1);
    },
    /**
     * 编辑标准
     * @param {object} e 要编辑的标准的信息
     */
    editStd(e) {
      this.updateStdVisiable = true;
      this.standarForm = null;
      if (e != null) {
        this.standarForm = e;
      }
    },

    /**
     * 保存/取消添加（编辑）标准
     * @param {*} e:true为检索，false：为取消
     */
    updateStd(e) {
      this.updateStdVisiable = false;
      this.pageChange(1);
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
     * 上传附件
     */
    fileChange(e) {
      this.files = e;
      if (this.files.length > 0) {
        this.filePath = this.files[0].url;
      } else {
        this.filePath = "";
      }
    },
    importFile() {
      this.importForm.visible = true;
      this.files = [];
      this.filePath = "";
    },
    closeimportForm(e) {
      if (e == true) {
        if (this.filePath == "") {
          this.$message.warning("请上传附件");
          return;
        }
        this.$set(this.importForm, "loadding", true);
        processApi.importTopics({ filePath: this.filePath }).then((res) => {
          if (res.code === 200) {
            this.$message.success("操作成功");
            this.importForm.visible = false;
            this.pageChange(1);
          }
          this.$set(this.importForm, "loadding", false);
        });
      } else {
        this.importForm.visible = false;
        this.files = [];
        this.filePath = "";
      }
    },
    exportFile() {
      const anchor = document.createElement("a");
      anchor.href = `${process.env.BASE_URL}static/exportTopics.xlsx`;
      anchor.setAttribute("download", "批量导入标注模板.xlsx");
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(() => {
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => {
          self.URL.revokeObjectURL(anchor.href);
        }, 250);
      }, 66);
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