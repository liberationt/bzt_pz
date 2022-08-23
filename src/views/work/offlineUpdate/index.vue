<template>
  <div class="standard-query app-container">
    <!-- 功能操作行 -->
    <div class="operation-line">
      <div
        class="submit-btn"
        @click="importFile('/scplat/stdlist/importXml', '更新题录')"
        v-hasPermi="['offlineUpdate:importXml']"
      >
        <i class="el-icon-upload2" />
        更新题录
      </div>

      <div
        class="submit-btn"
        @click="
          importFile('/scplat/stdlist/importXmlContent', '离线更新结构化')
        "
        v-hasPermi="['offlineUpdate:importXmlContent']"
      >
        <i class="el-icon-upload2" />
        离线更新结构化
      </div>
    </div>

    <!-- 标准列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: [],
        actionWidth: '110px',
      }"
      :hasIndex="false"
      :pageInfo="page"
      :isLoading="isTabLoading"
    >
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
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
          :actionUrl="actionUrl"
          type="drop-async"
          @upload-change="fileChange"
          ref="upload"
          :isFile="false"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import processApi from "@api/process";
import {
  BztTable,
  BztPageContrl,
  BztDialog,
  BztUploadFile,
} from "@components/basicCom/index";

export default {
  name: "standardQuery",
  components: {
    BztTable,
    BztPageContrl,
    BztDialog,
    BztUploadFile,
  },
  dicts: ["standard_type", "standard_status"],
  data() {
    return {
      isAll: false,
      stdVisiable: false,
      stdTitle: "",
      actionUrl: "",
      importForm: {
        visible: false,
        title: "上传题录",
        width: "600px",
        loadding: false,
        footer: true,
      },
      isTabLoading: false,
      tabClums: [
        {
          title: "ID",
          key: "id",
          width: "180",
        },
        {
          title: "MSG",
          key: "msg",
          minWidth: "280",
        },
      ],
      listReq: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
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
     * 获取标准列表
     */
    getList() {
      this.isTabLoading = true;
      processApi.offLineList(this.listReq).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.isTabLoading = false;
          this.list = rows;
          this.page.total = total;
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
     * 上传附件
     */
    fileChange(e) {
      if (e.code == 200) {
        this.$message.success(e.data.msg);
        this.importForm.visible = false;
        this.actionUrl = "";
        this.pageChange(1);
      } else {
        this.$message.warning(e.msg);
      }
    },
    importFile(url, title) {
      this.actionUrl = url;
      this.importForm.title = title;
      this.importForm.visible = true;
      this.files = [];
      this.filePath = "";
    },
    closeimportForm(e) {
      if (e == true) {
        this.$refs.upload.fileUpload();
      } else {
        this.importForm.visible = false;
        this.files = [];
        this.filePath = "";
        this.actionUrl = "";
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