<template>
  <div class="api-code app-container">
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
        @click="updateCode(null, 0)"
        v-hasPermi="['code-api:add']"
      >
        <i class="el-icon-plus" />
        添加CODE
      </div>
    </div>

    <!-- Code列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '120px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
    >
      <template slot="favorite" slot-scope="{ scope }">
        <span
          class="yellow-link-txt"
          v-hasPermi="['code-api:edit']"
          @click="updateCode(scope, 1)"
        >
          编辑
        </span>
        <span
          class="link-text"
          v-if="noPermi(['code-api:edit'])"
          @click="updateCode(scope, 2)"
        >
          详情
        </span>
        <span class="link-text" @click="runCode(scope)"> 试运行 </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 新增/编辑/查看Code -->
    <CodeEditor
      v-if="showCodeEditor != false"
      :visiable="showCodeEditor"
      :title="codeTitle"
      :codeDetail="codeDetail"
      :type="codeEditType"
      @close="closeEditor"
      @save="closeEditor"
    />

    <!-- 试运行 -->
    <RunApiCode
      v-if="runVisiable == true"
      :visiable="runVisiable"
      :codeId="codeDetail.codeId"
      :title="`运行API【${codeDetail.codeName}】`"
      @close="runVisiable = false"
    />
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";
import Api from "@api/processtemp";
import CodeEditor from "./components/codeEditor.vue";
import RunApiCode from "./components/runApiCode.vue";
export default {
  name: "api-code",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    CodeEditor,
    RunApiCode,
  },
  data() {
    return {
      searchInfo: {
        labelList: [{ label: "Code名称", key: "codeName", type: 1 }],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "Code名称",
          key: "codeName",
          minWidth: "180",
        },
        {
          title: "CodeID",
          key: "codeId",
          width: "180",
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: "210",
          filter: {
            type: "dateTime",
            formateStr: "{y}-{m}-{d} {h}:{i}:{s}",
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          width: "210",
          filter: {
            type: "dateTime",
            formateStr: "{y}-{m}-{d} {h}:{i}:{s}",
          },
        },
      ],
      listReq: {
        pageNo: 1,
        pageSize: 10,
      },
      tabAction: [{ label: "操作", type: "slot", btnName: "favorite" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isTabLoading: false,
      codeDetail: null,
      showCodeEditor: false,
      codeTitle: "",
      codeEditType: 0,
      runVisiable: false,
    };
  },
  created() {
    this.searchList(this.listReq);
  },
  methods: {
    /**
     * 获取Code列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getApiCodeList(this.listReq).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.list = data.list;
          this.page.total = data.total;
          this.page.pageNo = this.listReq.pageNo;
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
     * 新增/编辑 Code
     * @param data {Object} code的详细信息
     * @param type {Number} 操作类型 // 0:新增，1：编辑，2：查看详情
     */
    updateCode(data, type) {
      this.codeEditType = type;
      this.codeDetail = null;
      this.codeTitle = "添加Code";
      if (data != null) {
        this.codeDetail = data;
        this.codeTitle = `${type == 1 ? "编辑" : "查看"}：【${data.codeName}】`;
      }
      this.showCodeEditor = true;
    },
    /**
     *
     */
    closeEditor(e) {
      if (e == true) {
        this.pageChange(1);
      } else {
        this.showCodeEditor = false;
      }
    },
    /**
     * 试运行
     */
    runCode(e) {
      this.codeDetail = e;
      this.runVisiable = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.api-code {
}
</style>