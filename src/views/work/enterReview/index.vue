<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 功能操作行 -->
      <div class="operation-line">
        <!-- 复审任务 标准化业务人员 可创建 -->
        <div
          class="submit-btn"
          v-hasPermi="['enterReview:add']"
          @click="createTask"
        >
          <!-- 
          v-if="hasPermission('standardBusinessStaff')" -->
          <i class="el-icon-edit-outline" />
          发起复审任务
        </div>
      </div>

      <!-- 任务列表 -->
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
        @checkTaskDetail="checkTaskDetail"
      >
        <template slot="remove" slot-scope="{ scope }">
          <span
            class="link-text"
            @click="checkProject(scope)"
            v-if="scope.workItem != null && scope.projectState == 6101"
          >
            选择项目
          </span>
          <span
            class="red-link-text"
            @click="removeTask(scope)"
            v-if="
              userInfo.userId == scope.createBy && scope.projectState == 6101
            "
            v-hasPermi="['project:remove']"
          >
            删除
          </span>
        </template>
        <template slot="speed" slot-scope="{ scope }">
         <span class="red-link-text" @click="checkResult(true,scope)" v-if="getRoles()">
          进度
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
      v-if="cerateTaskVisiable == true"
      :visiable="cerateTaskVisiable"
      :taskDetail="[]"
      :disabled="disabled"
      @save="updateTask"
    />

    <!-- 查看各部门分管领导复审结果 -->
    <RwResultList
      v-if="rwResultVisible == true"
      :visiable="rwResultVisible"
      :taskId="taskId"
      :title="`查看各部门完成情况`"
      @close="checkResult(false)"
    />
    <!-- 新的表格 -->
    <newFormTable
      v-if="newFormTableVisible == true"
      :visiable="newFormTableVisible"
      :taskId="taskId"
      :title="`查看各部门完成情况`"
      @close="checkResult(false)"
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
import RwResultList from "./components/rwResultList.vue";
import newFormTable from "./components/newFormTable.vue";


import Api from "@api/process";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    CreateTask,
    RwResultList,
    newFormTable
  },
  name: "enter-review",
  dicts: ["task_status", "enter_review_nodes"],
  data() {
    return {
      newFormTableVisible:false,
      rwResultVisible:false,
      isTabLoading: false,
      cerateTaskVisiable: false,
      disabled:false,
      searchInfo: {
        labelList: [
          { label: "发起人", key: "projectName", type: 1 },
          {
            label: "发起时间",
            key: "dateTime",
            type: 3,
            formatStr: "yyyy-MM-dd",
            formatValStr: "yyyy-MM-dd",
            dateType: "dateRange",
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        // {
        //   title: "任务编号",
        //   key: "taskNo",
        //   width: "230",
        // },
        {
          title: "任务名称",
          key: "taskName",
          minWidth: "210",
          sortable: true,
        },
        {
          title: "标准数量",
          key: "standardCount",
          width: "80",
        },
        {
          title: "发起时间",
          key: "initiateTime",
          width: "160",
        },
        {
          title: "结束时间",
          key: "updateAt",
          width: "160",
        },
        {
          title: "发起人",
          key: "initiateUserId",
          width: "180",
          filter: {
            type: "user",
          },
        },

        {
          title: "项目节点",
          key: "taskState",
          width: "210",
          filter: {
            type: "filter",
            action: (data) => {
              return this.selectDictLabel(
                this.dict.type.enter_review_nodes,
                data
              );
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
      taskId:'',
      listReq: {
        startTime: null,
        endTime: null,
        projectName: null,
        pageNum: 1,
        pageSize: 10,
        projectType: 6,
        taskType: 6,
        // isAsc: "desc",
        // orderByColumn: "put_forward_time",
      },
      tabAction: [
        { label: "查看详情", action: "checkTaskDetail" },
        { label: "删除", type: "slot", btnName: "remove" },
        { label: "进度", type: "slot", btnName: "speed" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      checkFileVisiabel: false,
      checkPorjectVisiable: false,
      taskId: null,
    };
  },
  created() {
    this.cerateTaskVisiable = false;
    this.getList();
  },
  methods: {
    getRoles(roles){
      // return this.userInfo.roles.some((item)=>item.roleKey == "standardBusinessStaff")
      return this.userInfo.roles.some((item)=>item.roleKey == "stdLiaison")

    },
    checkResult(e,scope=null){
      if(e==true){
        // this.taskId = scope.id
        this.taskId = String(scope.childTaskId)
        this.rwResultVisible = true
      }else{
        this.rwResultVisible = false
      }
    } ,
    /**
     * 获取复审任务列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getRwTaskList(this.listReq).then((res) => {
        const { code, rows, total, msg } = res;
        this.isTabLoading = false;
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
     */
    searchList(e) {
      Object.keys(e).map((key) => {
        if (key == "dateTime") {
          console.log(e[key]);
          if (e[key] != null) {
            this.listReq.startTime = e[key][0];
            this.listReq.endTime = e[key][1];
          } else {
            this.listReq.startTime = null;
            this.listReq.endTime = null;
          }
        } else {
          this.listReq[key] = e[key];
        }
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
        path: `/work/enterReviewDetail/${data.id}`,
      });
    },
    /**
     * 创建任务
     */
    createTask() {
      this.disabled = false
      this.cerateTaskVisiable = true;
    },
    /**
     * 保存/取消创建任务
     */
    updateTask() {
      this.pageChange(1);
      this.cerateTaskVisiable = false;
    },
    /**
     * 选择项目
     * @param {*} data 要选择项目的任务Id
     */
    checkProject(data) {
      this.taskId = data.id;
      this.checkPorjectVisiable = true;
    },
    /**
     * 删除任务
     * @param {*} e 要删除的任务信息
     */
    removeTask(e) {
      this.$confirm(`确定删除复审任务：《${e.projectName}》吗？`, "复审任务", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeRwTask(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除任务：${e.projectName}`);
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