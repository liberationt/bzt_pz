<template>
  <div class="process-temp app-container">
    <div v-show="isFlowEditor == false">
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
          @click="toEditor"
          v-hasPermi="['process-temp:add']"
        >
          <i class="el-icon-plus" />
          新建流程模板
        </div>
      </div>

      <!-- 流程模板列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '330px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkDetail="checkDetail"
      >
        <!-- @toEditor="toEditor"
        @testTemp="testTemp" -->
        <template
          slot="action"
          scope="{scope}"
          v-hasPermi="['process-temp:edit']"
        >
          <span class="yellow-link-txt" @click="updateDetail(scope)">
            编辑数据结构
          </span>
          <span class="yellow-link-txt" @click="toEditor(scope)">
            可视化编辑
          </span>
          <span class="yellow-link-txt" @click="testTemp(scope)">
            检测模板
          </span>
        </template>
        <!-- v-hasPermis="['process-temp:add']" -->
      </BztTable>

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </div>
    <!-- 模板详情 -->
    <ProcessTempDetail
      v-if="detailVisiable == true"
      :visiable="detailVisiable"
      :detail="tempDetail"
      :title="`查看流程模板【${tempDetail.name}】`"
      @close="closeDetail"
    />

    <!-- 编辑流程模板 -->
    <UpdateProcessTempDetail
      v-if="updateDetailVisiable == true"
      :visiable="updateDetailVisiable"
      :detail="tempDetail"
      :title="`更新流程模板【${tempDetail.name}】`"
      @close="closeUpdateDetail"
    />

    <!-- 可视化 -->
    <template v-if="isFlowEditor == true">
      <WorkflowEditor
        :flowId="flowId"
        :flowCode="flowCode"
        @close="closeEditor"
      />
    </template>
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
import ProcessTempDetail from "./components/processTempDetail.vue";
import UpdateProcessTempDetail from "./components/updateProcessTempDetail.vue";
import { WorkflowEditor } from "@components/bussinessCom/index";
export default {
  name: "process-temp",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    ProcessTempDetail,
    UpdateProcessTempDetail,
    WorkflowEditor,
  },
  dicts: ["flow_code"],
  data() {
    return {
      searchInfo: {
        labelList: [
          { label: "流程模板名称", key: "name", type: 1 },
          { label: "流程模板编号", key: "code", type: 1 },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "流程模板编号",
          key: "code",
          width: "160",
        },
        {
          title: "流程模板名称",
          key: "name",
          minWidth: "180",
        },
        {
          title: "类别",
          key: "type",
          width: "180",
          filter: {
            type: "filter",
            action: (data) => {
              return data == 0 ? "主流程" : "子流程";
            },
          },
        },
        // {
        //   title: "模板数据结构",
        //   key: "content",
        //   width: "210",
        // },
        // {
        //   title: "模板JSON文件路径",
        //   key: "propPath",
        //   width: "230",
        // },
        {
          title: "模板描述",
          key: "tempDesc",
          width: "260",
        },
        {
          title: "版本号",
          key: "version",
          width: "160",
        },
        {
          title: "状态",
          key: "state",
          width: "100",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              return data == 0
                ? `<span class="grey-tag">禁用</span>`
                : `<span class="ing-tag">可用</span>`;
            },
          },
        },
      ],
      listReq: {
        pageNo: 1,
        pageSize: 10,
      },
      tabAction: [
        // { label: "编辑数据结构", action: "update", color: "#F59A23" },
        // { label: "可视化编辑", action: "toEditor", color: "#F59A23" },
        // { label: "检测模板", action: "testTemp", color: "#F59A23" },
        { label: "操作", type: "slot", btnName: "action" },
        { label: "详情", action: "checkDetail" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isTabLoading: false,
      detailVisiable: false,
      tempDetail: null,
      updateDetailVisiable: false,
      flowId: null,
      isFlowEditor: false,
      flowCode: [],
    };
  },
  createds() {
    this.searchList(this.listReq);
  },
  methods: {
    /**
     * 获取流程模板列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getWFTemplateList(this.listReq).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.list = data.list ?? [];
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
      this.flowCode = this.dict.type.flow_code;
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
     * 流程模板详情
     */
    checkDetail(data) {
      this.detailVisiable = true;
      this.tempDetail = data;
    },
    closeDetail(e) {
      this.detailVisiable = false;
      this.tempDetail = null;
      if (e == true) {
        this.pageChange(1);
      }
    },
    /**
     * 编辑流程模板
     */
    updateDetail(data) {
      this.updateDetailVisiable = true;
      this.tempDetail = data;
    },
    closeUpdateDetail(e) {
      this.updateDetailVisiable = false;
      this.tempDetail = null;
      if (e == true) {
        this.pageChange(1);
      }
    },
    /**
     * 可视化编辑
     */
    toEditor(e = null) {
      // this.$router.push({
      //   // path: `/viewProcess/${this.listReq.projectPhase == 10 ? 1 : 4}/${
      //   //   data.id
      //   // }`,
      //   path: `/workflow/editor/${data.id}`,
      // });
      this.flowId = null;
      if (e != null) {
        this.flowId = e.id;
      }
      this.isFlowEditor = true;
    },
    /**
     * 关闭可视化编辑
     */
    closeEditor(e) {
      debugger;
      if (e == true) {
        this.pageChange(1);
      }
      this.isFlowEditor = false;
      this.flowId = null;
    },
    /**
     * 检测模板合法性
     */
    testTemp(e) {
      const req = { tempId: e.id };
      Api.getWFTemplate(req).then((res) => {
        const { code, data } = res;
        if (code == 200) {
          Api.checkJsonContent(data.content).then((result) => {
            const { code, data } = result;
            if (code == 200) {
              let str = "";
              data.forEach((item) => {
                if (item.code == 200) {
                  str += `<div style="width:95%;overflow: hidden;margin-bottom:10px">${
                    item.data.result
                  }；  ${item.data.suggestion ?? ""}</div>`;
                } else {
                  str += `<div style="color:red;width:95%;overflow: hidden;margin-bottom:10px">错误信息-${item.msg} 
                  }</div>`;
                }
              });
              this.$alert(str, "检测结果", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.process-temp {
  position: relative;
  height: 100%;
}
</style>