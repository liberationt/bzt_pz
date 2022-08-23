<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 功能操作行 -->
      <div class="operation-line">
        <div
          class="submit-btn"
          @click="createTask"
          v-hasPermi="['externalConsultation:create']"
        >
          <i class="el-icon-plus" />
          创建任务
        </div>
      </div>

      <!-- 任务列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '200px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkFile="checkFile"
      >
        <!-- @checkTaskDetail="checkTaskDetail" -->
        <template slot="checkTaskDetail" slot-scope="{ scope }">
          <span
            class="link-text"
            @click="checkTaskDetail(scope)"
            v-if="scope == null"
          >
            查看详情
          </span>
          <span v-else class="yellow-link-txt" @click="checkTaskDetail(scope)">
            编辑
          </span>
          <span class="green-link-text" @click="checkTaskDetail(scope)" v-if="scope.taskStatus!=3">
            结束任务
          </span>
        </template>
        <template slot="remove" slot-scope="{ scope }">
          <span
            class="red-link-text"
            @click="removeTask(scope)"
            v-hasPermi="['project:remove']"
            v-if="scope.applyUser == userInfo.userId"
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
    </div>

    <!-- 创建任务 -->
    <CreateTask
      :visiable="cerateTaskVisiable"
      v-if="cerateTaskVisiable == true"
      @save="updateTask"
    />

    <!-- 查看附件 -->
    <CheckFiles
      :visiable="checkFileVisiabel"
      v-if="checkFileVisiabel == true"
      :fileReq="fileReq"
      downLoadUrl="/scplat/attachmentFile/downloadByTypeAndId"
      @close="closeCheckFiles"
    />
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import CreateTask from "./components/createTask.vue";
import { CheckFiles } from "@components/bussinessCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { BztSearch, BztTable, BztPageContrl, CreateTask, CheckFiles },
  name: "enterprise-std",
  dicts: ["task_status", "external_consultation_node", "technical_committees"],
  data() {
    return {
      isTabLoading: false,
      cerateTaskVisiable: false,
      searchInfo: {},
      tabClums: [
        {
          title: "任务名称",
          key: "taskName",
          width: "230",
        },
        {
          title: "归口单位",
          key: "ownerCompanyId",
          width: "450",
          filter: {
            type: "filter",
            action: (data) => {
              return this.selectDictLabel(
                this.dict.type.technical_committees,
                data
              );
            },
          },
        },
        {
          title: "创建日期",
          key: "createTimeVo",
          width: "180",
        },
        {
          title: "标准数量",
          key: "standardCount",
          width: "180",
        },
        {
          title: "项目节点",
          key: "taskState",
          width: "210",
          filter: {
            type: "filter",
            action: (data) => {
              return this.selectDictLabel(
                this.dict.type.external_consultation_node,
                data
              );
            },
          },
        },
        {
          title: "相关附件",
          key: "fileList",
          width: "180",
          filter: {
            type: "action",
            actionName: "checkFile",
            action: () => {
              return "下载附件";
            },
          },
        },
        {
          title: "状态",
          key: "taskStatus",
          width: "120",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              return this.setTaskStatusStyle(this.dict.type.task_status, data);
            },
          },
        },
      ],
      listReq: {
        taskName: "",
        ownerCompanyName: "",
        taskStatus: null,
        pageNum: 1,
        pageSize: 10,
        // isAsc: "desc",
        // orderByColumn: "put_forward_time",
      },
      tabAction: [
        {
          label: "操作入口",
          type: "slot",
          btnName: "checkTaskDetail",
        },
        { label: "删除", type: "slot", btnName: "remove" },
      ],
      list: [{ fileList: "" }],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      checkFileVisiabel: false,
      fileReq: {
        businessObjType: null,
        businessObjId: null,
        taskName: "",
      },
    };
  },
  created() {
    this.cerateTaskVisiable = false;
    this.checkFileVisiabel = false;
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
            label: "任务名称",
            key: "taskName",
            type: 1,
          },
          {
            label: "归口单位",
            key: "ownerCompanyName",
            type: 2,
            options: this.dict.type.technical_committees,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "项目状态",
            key: "taskStatus",
            type: 2,
            options: this.dict.type.task_status,
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
    getList() {
      Api.adviceCollectingTaskList(this.listReq).then((res) => {
        const { code, rows, total, msg } = res;
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
     *
     */
    checkTaskDetail(data) {
      // ${data.id}
      this.$router.push({
        path: `/work/externalConsultation/standard/${data.dispatchUser}/${data.id}`,
      });
    },
    /**
     * 查看附件
     */
    checkFile(e) {
      this.fileReq.taskName = `外部征求意见_${e.taskName}`;
      this.fileReq["businessObjType"] = 10;
      this.fileReq.businessObjId = e.id;
      this.checkFileVisiabel = true;
    },
    /**
     * 关闭查看附件弹框
     */
    closeCheckFiles() {
      this.fileReq = {
        businessObjType: null,
        businessObjId: null,
        taskName: "",
      };
      this.checkFileVisiabel = false;
    },
    /**
     * 创建任务
     */
    createTask() {
      this.cerateTaskVisiable = true;
    },
    /**
     * 更新保存任务
     */
    updateTask() {
      this.cerateTaskVisiable = false;
      this.pageChange(1);
    },
    /**
     * 删除任务
     * @param {*} e 要删除的任务信息
     */
    removeTask(e) {
      this.$confirm(`确定删除任务：《${e.taskName}》吗？`, "任务", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeAdviceCollectingTask(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除任务：${e.taskName}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
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