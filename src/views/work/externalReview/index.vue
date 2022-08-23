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
          @click="createTask(null)"
          v-hasPermi="['extrernalReview:add']"
        >
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
          actionWidth: noPermi(['project:remove']) == true ? '160px' : '180px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkFile="checkFile"
        @checkTaskDetail="checkTaskDetail"
      >
        <!-- <template slot="remove" slot-scope="{ scope }">
          <template v-if="scope.workItem != null && scope.taskState == 7101">
            <span class="yellow-link-txt" @click="createTask(scope)">
              修改
            </span>
          </template>
          <span
            class="link-text"
            @click="auditPro(true, scope)"
            v-if="scope.workItem != null && scope.taskState == 7102"
          >
            标准化业务主管审核
          </span>
          <span
            class="link-text"
            @click="auditPro(true, scope)"
            v-if="scope.workItem != null && scope.taskState == 7103||scope.taskState == 7100"
          >
            部门分管领导审核
          </span>
          <span
            class="link-text"
            @click="distributePro(true, scope)"
            v-if="scope.workItem != null && scope.taskState == 7104"
          >
            分配处理人
          </span>
          <span
            class="link-text"
            @click="uploadResult(true, scope)"
            v-if="scope.workItem != null && scope.childTaskState == 15001"
          >
            复审结论
          </span>
          <span class="red-link-text" @click="cheeckReson(true, scope)" v-if="scope.taskStatus==5">
              驳回理由
          </span>
          <span
            class="link-text"
            @click="auditPro(true, scope)"
            v-if="scope.workItem != null && scope.childTaskState == 15002"
          >
            部门复审结论
          </span>
          <template v-if="scope.workItem != null && scope.taskState == 7107">
            <span class="link-text" @click="exportFile(2, scope)">
              导出复审结论汇总表
            </span>
            <span class="link-text" @click="uploadResultPro(true, scope)">
              标准化汇总
            </span>
          </template>
          <span
            class="red-link-text"
            @click="removeTask(scope)"
            v-hasPermi="['project:remove']"
          >
            删除
          </span>
        </template> -->
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
      :taskInfo="taskInfo"
      :taskDetail="list"
      :disabled="disabled"
      @save="updateTask"
    />

    <!-- 标准化业务主管审核 / 科技管理部部门分管领导审核 -->
    <AduitPro
      v-if="aduitProVisible == true"
      :visiable="aduitProVisible"
      :taskInfo="taskInfo"
      @save="auditPro"
    />

    <!-- 分发复审任务 -->
    <DistributePro
      v-if="distributeProVisible == true"
      :visiable="distributeProVisible"
      :taskInfo="taskInfo"
      @save="distributePro"
    />

    <!-- 上传复审结论 -->
    <UploadResult
      v-if="uploadResultProVisible == true"
      :visiable="uploadResultProVisible"
      :taskInfo="taskInfo"
      @save="uploadResultPro"
    />

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      v-if="rejectReasonVisible == true"
      :visiable="rejectReasonVisible"
      :processInfo="taskInfo"
      :projectType="7"
      :title="`查看【${taskInfo.taskName}】驳回终止原因`"
      @close="cheeckReson(false)"
    />

    <!-- 查看各部门分管领导复审结果 -->
    <RwResultList
      v-if="rwResultVisible == true"
      :visiable="rwResultVisible"
      :taskId="taskInfo.id"
      :title="`查看【${taskInfo.taskName}】各部门完成情况`"
      @close="checkResult(false)"
    />

    <!-- 查看附件 -->
    <CheckFiles
      v-if="checkFileVisiabel == true"
      :visiable="checkFileVisiabel"
      :fileReq="fileReq"
      downLoadUrl="/scplat/attachmentFile/downloadByTypeAndId"
      @close="closeCheckFiles"
    />

    <FormTable 
      v-if="formTableVisible==true"
      :visiable="formTableVisible"
      :taskInfo="taskInfo"
      :type="type"
      @save="uploadResult"
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
import {
  ProcessRejectReason,
  CheckFiles,
} from "@components/bussinessCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";
import AduitPro from "./components/aduitPro.vue";
import DistributePro from "./components/distributePro.vue";
import UploadResult from "./components/uploadResult.vue";
import RwResultList from "./components/rwResultList.vue";
import FormTable from "./components/formTable.vue";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    CreateTask,
    AduitPro,
    DistributePro,
    UploadResult,
    RwResultList,
    ProcessRejectReason,
    CheckFiles,
    FormTable
  },
  name: "external-review",
  dicts: ["task_status", "external_review_nodes", "technical_committees"],
  data() {
    return {
      disabled:false,
      isTabLoading: false,
      cerateTaskVisiable: false,
      searchInfo: {
        labelList: [
          {
            label: "归口单位",
            key: "ownerCompanyId",
            type: 1,
            // options: this.dict.type.technical_committees,
          },
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
          title: "相关附件",
          key: "fileList",
          width: "120",
          filter: {
            type: "action",
            actionName: "checkFile",
            action: () => {
              return "查看附件";
            },
          },
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
                this.dict.type.external_review_nodes,
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
      listReq: {
        startTime: null,
        endTime: null,
        projectName: null,
        pageNum: 1,
        pageSize: 10,
        projectType: 7,
        taskType: 7,
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
      taskInfo: null,
      aduitProVisible: false,
      distributeProVisible: false,
      uploadResultProVisible: false,
      rejectReasonVisible: false,
      rwResultVisible: false,
      checkFileVisiabel: false,
      fileReq: {
        businessObjType: null,
        businessObjId: null,
        taskName: "",
      },
      formTableVisible:false,
      type:1
    };
  },
  created() {
    this.cerateTaskVisiable = false;
    this.searchInfo.labelList = [
      {
        label: "归口单位",
        key: "ownerCompanyId",
        type: 2,
        options: this.dict.type.technical_committees,
        replaceField: { value: "value", label: "label" },
        multiple: false,
      },
      {
        label: "发起时间",
        key: "dateTime",
        type: 3,
        formatStr: "yyyy-MM-dd",
        formatValStr: "yyyy-MM-dd",
        dateType: "dateRange",
      },
    ];
    this.getList();
  },
  methods: {
    getRoles(roles){
      // return this.userInfo.roles.some((item)=>item.roleKey == "standardBusinessStaff")
      return this.userInfo.roles.some((item)=>item.roleKey == "stdLiaison")
    },
    //复审结论
    uploadResult(e,data=null){
      if(e){
        this.type=1
        this.setTaskInfo(data);
        this.formTableVisible = true
      }else{
        this.formTableVisible = false
        this.getList();
      }
    },
    /**
     * 查看详情
     *
     */
    checkTaskDetail(data) {
      // ${data.id}
      sessionStorage.setItem('scopeRow',JSON.stringify(data))
      this.$router.push({
        path: `/work/externalReviewDetail/${data.id}`,
      });
    },
    /**
     * 获取复审任务列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getRwTaskListOut(this.listReq).then((res) => {
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
     * 创建任务
     */
    createTask(data, e) {
      this.taskInfo = null;
      if (data != null) {
        this.disabled = true
        // this.setTaskInfo(data);
        this.getRwProjectList(data)
      }else{
        this.disabled = false
        this.cerateTaskVisiable = true;
      }
    },

    getRwProjectList(data) {
      this.taskInfo = null;
      this.isTabLoading = true;
      Api.getStdListByDetail({
        rwTaskId: data.id,
      }).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data;
          if (this.list.length > 0) {
            this.taskInfo = this.list[0].tRwTask;
            this.taskInfo["workItem"] = this.list[0].workItem;
            this.taskInfo["childTaskId"] = this.list[0].childTaskId
              ? this.list[0].childTaskId
              : null;
            this.taskInfo["firstAuditUser"] = Number(this.list[0].tRwTask.firstAuditUser)
            this.taskInfo["secondAuditUser"] = Number(this.list[0].tRwTask.secondAuditUser)
            this.taskInfo["startTime"] = this.list[0].tRwTask.startTime
            this.taskInfo["endTime"] = this.list[0].tRwTask.endTime
            this.taskInfo["lastFirstAuditUser"] = this.list[0].tRwTask.lastFirstAuditUser?Number(this.list[0].tRwTask.lastFirstAuditUser):''
            this.taskInfo["lastSecondAuditUser"] = this.list[0].tRwTask.lastSecondAuditUser?Number(this.list[0].tRwTask.lastSecondAuditUser):''
            this.cerateTaskVisiable = true;
          }
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
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
      this.$confirm(`确定删除复审任务：《${e.taskName}》吗？`, "复审任务", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeRwTask(e.id).then((res) => {
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
    setTaskInfo(data) {
      this.taskInfo = data;
      this.taskInfo["workItem"] = data.workItem;
      this.taskInfo["childTaskId"] = data.childTaskId ? data.childTaskId : null;
    },
    /**
     * 标准化业务主管审核 / 科技管理部部门分管领导审核
     */
    auditPro(e, data = null) {
      if (e == true) {
        this.aduitProVisible = true;
        this.setTaskInfo(data);
      } else {
        this.aduitProVisible = false;
        if (e == false) {
          this.pageChange(1);
        }
      }
    },
    /**
     *分发复审任务
     */
    distributePro(e, data = null) {
      if (e == true) {
        this.setTaskInfo(data);
        this.distributeProVisible = true;
      } else {
        this.distributeProVisible = false;
        if (e == false) {
          this.pageChange(1);
        }
      }
    },
    /**
     * 导出汇总表
     */
    exportFile(type,data=null) {
      let fileName = "导出";
      switch (type) {
        case 1:
          fileName = fileName + "复审标准汇总表";
          break;
        case 2:
          fileName = fileName + "复审结论汇总表";
          break;
        case 3:
          fileName = fileName + "复审结论汇总表";
          break;
        case 0:
          fileName = fileName + "复审结论汇总表";
          break;
      }

      this.$confirm(`确定导出《${fileName}》？`, `${fileName}`, {
        confirmButtonText: "确定导出",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          if (type == 0 || type == 3) {
            this.getFile(type);
          } else {
            const req = {
              taskId: data.id,
              type: type,
            };
            this.downloadByPost(
              "/scplat/RwTaskStandardDetail/exportExcelTemplate",
              req,
              `${fileName}`
            );
          }
        })
        .catch(() => {});
    },
    /**
     * 获取复审结论汇总表
     */
    getFile(type) {
      let req = {
        taskId: this.taskInfo.id,
        processAs: 6,
      };
      if (type == 3) {
        req = {
          processorTaskId: this.taskInfo.childTaskId,
          processAs: 2,
        };
      }
      Api.rwProcessorTaskAssignList(req).then((res) => {
        const { code, rows, msg } = res;
        if (code == 200) {
          console.log(rows);
          debugger;
          if (rows.length > 0) {
            const files = JSON.parse(rows[0].currentAttachments);
            files.forEach((file) => {
              if (file.type == 1) {
                this.downLoadByURL(file.url, "《企业标准复审结论汇总表》.xlsx");
              }
            });
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 网员上传会议纪要
     */
    uploadResultPro(e, data = null) {
      if (e == true) {
        this.setTaskInfo(data);
        this.uploadResultProVisible = true;
      } else {
        this.uploadResultProVisible = false;
        if (e == false) {
          this.pageChange(1);
        }
      }
    },
    /**
     * 查看复审结果
     */
    checkResult(e, data = null) {
      console.log(this.rwResultVisible);
      if (e == true) {
        this.setTaskInfo(data);
        this.rwResultVisible = true;
      } else {
        this.rwResultVisible = false;
      }
    },
    /**
     * 查看附件
     */
    checkFile(e) {
      this.fileReq.taskName = `外部复审_${e.taskName}`;
      this.fileReq["businessObjType"] = 7;
      this.fileReq.businessObjId = e.id;
      this.checkFileVisiabel = true;
    },
    /**
     * 关闭查看附件弹框
     */
    closeCheckFiles() {
      this.fileReq = {
        businessObjType: 7,
        businessObjId: null,
        taskName: "",
      };
      this.checkFileVisiabel = false;
    },
    /**
     * 编辑修改复审任务
     */
    cheeckReson(e, data = null) {
      if (e == true) {
        this.setTaskInfo(data);
      }
      this.rejectReasonVisible = e;
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