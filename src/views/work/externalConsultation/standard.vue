<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch
        :searchData="searchInfo"
        @search="searchList"
        :formVal="listReq"
      />

      <!-- 功能操作行 -->
      <div class="operation-line">
        <!-- 标准化业务人员 -->
        <template
          v-hasPermi="['externalConsultation:addStd']"
          v-if="$route.params.dispatchUser == userInfo.userId && isOver == 0"
        >
          <div class="submit-btn" @click="editStd(null)">
            <i class="el-icon-plus" />
            添加标准
          </div>
          <div class="yellow-btn" @click="endStd()">
            <i class="el-icon-edit-outline" />
            全部标准添加已完成
          </div>
        </template>
        <!-- <div class="yellow-btn" @click="downLoadModule">
          <i class="el-icon-download" />
          下载征求意见汇总表模板
        </div> -->
      </div>

      <!-- 标准列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: userInfo.userId == 1 ? '280px' : '300px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkFile="checkFile"
        @checkNodes="checkNodes"
        @checkDetail="checkDetail"
      >
        <template slot="operition" slot-scope="{ scope }">
          <!-- v-if="scope.workItemId != null" -->
          <!-- <span class="green-link-text" @click="editStd(scope)">编辑</span> -->
          <span
            class="green-link-text"
            v-if="
              (scope.taskState == 32001 || scope.taskState == 32002) &&
              scope.workItemId != null
            "
            @click="assignTasks(scope)"
          >
            分配任务
          </span>
          <!-- <span
            class="green-link-text"
            v-if="
              (scope.taskState == 31001 || scope.taskState == 32003) &&
              scope.workItemId != null
            "
            @click="uplaodLogFiles(scope, 0)"
          >
            上传意见汇总表
          </span> -->
          <!-- <span
            class="yellow-link-txt"
            v-if="
              (scope.taskState == 31001 || scope.taskState == 32003) &&
              scope.workItemId != null
            "
            @click="downLoadModule"
          >
            下载征求意见汇总表模板
          </span> -->
          <span
            class="green-link-text"
            v-if="
              (scope.taskState == 31001 || scope.taskState == 32003) &&
              scope.workItemId != null
            "
            @click="solicit(true, scope)"
          >
            在线填写征求意见
          </span>
          <!-- <span
            class="link-text"
            v-if="
              scope.taskState == 32004 ||
              scope.taskState == 3108 ||
              scope.taskState == 3110 ||
              (scope.taskState == 32003 && isAssignProcess == true)
            "
            @click="checkResult(scope)"
          >
            查看结果
          </span> -->
          <span
            class="green-link-text"
            v-if="
              (scope.taskState == 32004 || scope.taskState == 3108) &&
              scope.workItemId != null
            "
            @click="uplaodLogFiles(scope, 1)"
          >
            提交征求意见汇总表
          </span>
          <template  v-if="
              (scope.taskState == 32004 || scope.taskState == 3111) &&
              scope.workItemId != null
            ">
            <span class="green-link-text" @click="uplaodLogFiles(scope, 2)">
              上传文件
            </span>
            <span class="green-link-text" @click="fileDownLoad(scope, 1)">
              下载文件
            </span>
            <span class="green-link-text" @click="endTask(scope, 1)">
              结束任务
            </span>
          </template>
          <!-- <span
            class="link-text"
            v-if="scope.taskState == 3108 && scope.workItemId != null"
            @click="endTask(scope)"
          >
            结束任务
          </span> -->
          <span
            class="red-link-text"
            @click="removeStd(scope)"
            v-hasPermi="['project:remove']"
            v-if="
              (scope.applyUser == userInfo.userId &&
                scope.childState == 31001) ||
              (scope.applyUser == userInfo.userId && scope.childState == 32001)
            "
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

    <!-- 创建/编辑标准 -->
    <UpdateStd
      v-if="stdForm != null && cerateStdVisiable == true"
      :visiable="cerateStdVisiable"
      :formData="stdForm"
      :processAs="processAs"
      @save="editSaveStd"
    />

    <!-- 查看附件 -->
    <CheckFiles
      v-if="checkFileVisiabel == true"
      :visiable="checkFileVisiabel"
      :fileReq="fileReq"
      downLoadUrl="/scplat/adviceCollectingTaskAssign/downloadById"
      @close="closeCheckFiles"
    />

    <!-- 查看节点 -->
    <NodeList
      :visiable="checkNodeInfoVisiable"
      :taskId="nodeTaskId"
      :state="taskState"
      v-if="checkNodeInfoVisiable == true"
      @close="closeCheckNodes"
    />

    <!-- 分配任务 -->
    <!-- <AssignTask
      :visiable="assignTasksVisiable"
      v-if="assignTasksVisiable == true"
      @save="assignTasksSave"
      :businessObjId="stdForm.id"
      :extendAttachments="stdForm.fileList"
      :processAs="processAs"
      :endTime="stdForm.scheduledEndTime"
      :startTime="stdForm.scheduledStartTime"
      :childAdviceTaskId="stdForm.childAdviceTaskId"
      :adviceTaskId="stdForm.adviceTaskId"
      :parentProcessorId="stdForm.parentProcessorId"
      :parentId="stdForm.parentId"
      :workItemId="stdForm.workItemId"
      :title="uploadFileTitle"
    /> -->
    <AssignTask
      :visiable="assignTasksVisiable"
      v-if="assignTasksVisiable == true"
      :formData="stdForm"
      :processAs="processAs"
      @save="assignTasksSave"
    />
    <SolicitOpinions 
      :visiable="solicitVisiable"
      v-if="solicitVisiable == true"
      :businessObjId="stdForm.id"
      :extendAttachments="stdForm.fileList"
      :processAs="processAs"
      :endTime="stdForm.scheduledEndTime"
      :startTime="stdForm.scheduledStartTime"
      :childAdviceTaskId="stdForm.childAdviceTaskId"
      :adviceTaskId="stdForm.adviceTaskId"
      :parentProcessorId="stdForm.parentProcessorId"
      :parentId="stdForm.parentId"
      :workItemId="stdForm.workItemId"
      :row="row"
      @save="solicit"
    />
    <!-- 上传意见汇总表 -->
    <UploadLogFiles
      v-if="uploadFileVisible == true"
      :visiable="uploadFileVisible"
      @save="saveUplaodFiles"
      :businessObjId="stdForm.id"
      :extendAttachments="stdForm.fileList"
      :processAs="processAs"
      :endTime="stdForm.scheduledEndTime"
      :startTime="stdForm.scheduledStartTime"
      :childAdviceTaskId="stdForm.childAdviceTaskId"
      :adviceTaskId="stdForm.adviceTaskId"
      :parentProcessorId="stdForm.parentProcessorId"
      :parentId="stdForm.parentId"
      :workItemId="stdForm.workItemId"
      :title="uploadFileTitle"
      :taskState="stdForm.taskState"
    />

    <!-- 查看结果 -->
    <StdList
      v-if="checkResultVisiable == true"
      :visiable="checkResultVisiable"
      :formData="stdForm"
      @save="closeCheckResult"
    />
    <lookResault
     v-if="resultVisiable == true"
    :visiable="resultVisiable"
    :taskId="adviceTaskId"
    :row="row"
    @save="closeResult"
    />
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import UpdateStd from "./components/updateStd.vue";
// import { CheckFiles } from "@components/bussinessCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";
import AssignTask from "./components/assignTask.vue";
import UploadLogFiles from "./components/uploadLogFiles.vue";
import StdList from "./components/stdList.vue";
import NodeList from "./components/nodeList.vue";
import SolicitOpinions from "./components/solicitOpinions.vue";
import lookResault from "./components/lookResault.vue";
import CheckFiles from "./components/checkFiles.vue";



const stdForm = {
  userList: "",
  workItemId: "",
  wfInstanceId: "",
  wfActivityDefId: "",
  fromWfActivityDefId: "",
  wfActivityDefCode: "",
  wfDefCode: "",
  wfDefId: "",
  adviceTaskId: "",
  stdName: "",
  startTime: "",
  endTime: "",
  parentProcessorId: "",
  extendAttachments: "",
};
export default {
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    UpdateStd,
    CheckFiles,
    AssignTask,
    UploadLogFiles,
    StdList,
    NodeList,
    SolicitOpinions,
    lookResault
  },
  StdListme: "enterprise-std",
  dicts: ["task_status", "external_consultation_node"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      isTabLoading: false,
      cerateStdVisiable: false,
      solicitVisiable:false,
      searchInfo: {},
      row:{},
      tabClums: [
        {
          title: "标准名称",
          key: "stdName",
        },
        {
          title: "归口单位",
          key: "ownerCompanyName",
          width: "180",
        },
        {
          title: "项目节点",
          key: "taskState",
          width: "230",
          filter: {
            type: "action",
            actionName: "checkNodes",
            isHtml: true,
            action: (data) => {
              let str = "";
              this.dict.type.external_consultation_node.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });

              return data == 3103
                ? "<span class='link-text'>详情</span>"
                : `<span style="color:#33333 !important">${str}</span>`;
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
      ],
      listReq: {
        stdName: "",
        ownerCompanyName: "",
        taskState: "",
        adviceTaskId: "",
        pageNum: 1,
        pageSize: 10,
        onlyTodo: 0,
        // isAsc: "desc",
        // orderByColumn: "createTime",
      },
      tabAction: [
        { label: "操作", type: "slot", btnName: "operition" },
        { label: "详情", action: "checkDetail" },
      ],
      list: [{ fileList: "" }],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      checkFileVisiabel: false,
      fileReq: {
        id: null,
        taskName: "",
      },
      stdForm: {},
      taskInfo: {
        workItemId: null,
        wfInstanceId: null,
        wfActivityDefId: null,
        fromWfActivityDefId: null,
        wfActivityDefCode: null,
        wfDefCode: null,
        wfDefId: null,
        adviceTaskId: null,
      },
      checkFileList: [],
      assignTasksVisiable: false,
      uploadFileVisible: false,
      checkResultVisiable: false,
      resultVisiable:false,
      processAs: null,
      isAssignProcess: false,
      checkNodeInfoVisiable: false,
      nodeTaskId: null,
      uploadFileTitle: "上传意见汇总表",
      taskState: null,
      isOver: 0,
      adviceTaskId:''
    };
  },
  created() {
    const { adviceTaskId } = this.$route.params;
    this.cerateStdVisiable = false;
    this.checkFileVisiabel = false;
    this.listReq.adviceTaskId = adviceTaskId;
    this.initDictData();
    this.getList();
  },
  mounted() {
    Object.keys(this.taskInfo).map((key) => {
      this.taskInfo[key] = this.$route.params[key] ?? null;
    });
  },
  methods: {
    checkDetail(row){
      this.row = row
      this.adviceTaskId = row.adviceTaskId
      this.resultVisiable = true
    },
   
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          { label: "标准名称", key: "stdName", type: 1 },
          // { label: "归口单位", key: "ownerCompanyName", type: 1 },
          {
            label: "项目节点",
            key: "taskState",
            type: 2,
            options: this.dict.type.external_consultation_node,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "项目筛选",
            key: "onlyTodo",
            type: 6,
            options: [
              { label: "全部", value: 0 },
              { label: "与我相关", value: 1 },
            ],
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
     * 获取标准列表
     */
    getList() {
      Api.adviceCollectingTaskAssignList(this.listReq).then((res) => {
        const { code, rows, total, msg, data } = res;
        if (code === 200) {
          this.list = rows;
          this.isOver = data == 1 ? 1 : 0;
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
     * 查看附件
     */
    checkFile(e) {
      // Object.keys(this.fileReq).map((key) => {
      //   if (key === "taskName") {
      //     this.fileReq[key] = `外部征求意见_标准_${e.stdName}`;
      //   } else {
      //     this.fileReq[key] = e[key];
      //   }
      // });
      // this.fileReq = {
      //   taskId: e.assignId,
      //   taskName: `外部征求意见_标准_${e.stdName}`,
      // };
      // this.checkFileList = JSON.parse(e.fileList);
      // console.log(JSON.parse(e.fileList));
      this.fileReq = {
        adviceTaskId:e.adviceTaskId,
        processAs:6
      }
      this.checkFileVisiabel = true;
    },
    /**
     * 关闭查看附件弹框
     */
    closeCheckFiles(data) {
      this.checkFileVisiabel = false;
    },
    /**
     * 创建(编辑)标准
     */
    editStd(data) {
      this.stdForm = this.deepClone(stdForm);
      if (data != null) {
        // Object.keys(this.taskInfo).map((key) => {
        //   this.stdForm[key] = data[key];
        //   if (key == "currentAttachments") {
        //     this.stdForm[key] = data["fileList"];
        //   }
        // });
      } else {
        console.log(this.taskInfo);
        Object.keys(this.taskInfo).map((key) => {
          this.stdForm[key] = this.taskInfo[key] ?? null;
        });
        this.stdForm["parentProcessorId"] = this.userInfo.userId;
      }
      this.cerateStdVisiable = true;
    },
    /**
     * 标准添加完成
     */
    endStd() {
      // updateIsOverByTaskId
      this.$confirm(`确定全部标准已添加完成吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          console.log(this.listReq.adviceTaskId);
          Api.updateIsOverByTaskId({
            parentTaskId: this.listReq.adviceTaskId,
          }).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`操作成功`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 更新保存标准
     */
    editSaveStd() {
      this.cerateStdVisiable = false;
      this.stdForm = this.deepClone(stdForm);

      this.pageChange(1);
    },
    /**
     * 删除标准
     * @param {*} e 要删除的标准信息
     */
    removeStd(e) {
      this.$confirm(`确定删除项目：《${e.stdName}》吗？`, "项目", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeAdviceCollectingTask({ ids: e.stdId }).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除项目：${e.stdName}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 下载征求意见汇总表模板
     */
    downLoadModule() {
      const anchor = document.createElement("a");
      anchor.href = `${process.env.BASE_URL}static/技术标准征求意见表.docx`;
      anchor.setAttribute("download", "技术标准征求意见表.docx");
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
    /**
     * 分配任务
     */
    assignTasks(data) {
      this.stdForm = {
        userList: "",
        workItemId: data.workItemId,
        wfInstanceId: data.wfInstanceId,
        wfActivityDefId: data.wfActivityDefId,
        fromWfActivityDefId: data.fromWfActivityDefId,
        wfActivityDefCode: data.wfActivityDefCode,
        wfDefCode: data.wfDefCode,
        wfDefId: data.wfDefId,
        adviceTaskId: data.adviceTaskId,
        stdName: data.stdName,
        startTime: data.startTime,
        endTime: data.endTime,
        parentProcessorId: this.userInfo.userId,
        extendAttachments: data.fileList,
        childAdviceTaskId: data.childAdviceTaskId,
        id: data.id,
        startTime: data.scheduledStartTime,
        endTime: data.scheduledEndTime,
        taskState:data.taskState
      };
      this.processAs = this.getProcess(data.taskState);
      this.assignTasksVisiable = true;
    },
    getProcess(state) {
      let num = null;
      switch (state) {
        case 3102:
          num = 6;
          break;
        case 3108:
          num = 6;
          break;
        case 3111:
          num = 6;
          break;
        case 31001:
          num = 3;
          break;
        case 32001:
          num = 2;
          break;
        case 32004:
          num = 4;
          break;
        case 32002:
          num = 4;
          break;
        case 32003:
          num = 5;
          break;
      }
      return num;
    },
    /**
     * 保存/取消分配任务
     */
    assignTasksSave() {
      this.pageChange(1);
      this.assignTasksVisiable = false;
      this.stdForm = {
        userList: "",
        workItemId: null,
        wfInstanceId: null,
        wfActivityDefId: null,
        fromWfActivityDefId: null,
        wfActivityDefCode: null,
        wfDefCode: null,
        wfDefId: null,
        adviceTaskId: null,
        stdName: "",
        startTime: "",
        endTime: "",
        parentProcessorId: null,
        extendAttachments: null,
        childAdviceTaskId: null,
        id: null,
        fileList: [],
        startTime: null,
        endTime: null,
        taskState:null
      };
    },
    solicit(e,data=null){
      if(e){
        this.processAs = this.getProcess(data.taskState);
        this.stdForm = {
          userList: "",
          workItemId: data.workItemId,
          wfInstanceId: data.wfInstanceId,
          wfActivityDefId: data.wfActivityDefId,
          fromWfActivityDefId: data.fromWfActivityDefId,
          wfActivityDefCode: data.wfActivityDefCode,
          wfDefCode: data.wfDefCode,
          wfDefId: data.wfDefId,
          adviceTaskId: data.adviceTaskId,
          stdName: data.stdName,
          parentProcessorId: this.userInfo.userId,
          parentId: data.parentProcessorId,
          extendAttachments: data.fileList,
          childAdviceTaskId: data.childAdviceTaskId,
          id: data.id,
          fileList: data.fileList,
          scheduledStartTime: data.scheduledStartTime,
          scheduledEndTime: data.scheduledEndTime,
          taskState:data.taskState
        };
        this.row = data
        this.solicitVisiable = true
      }else{
        this.pageChange(1);
        this.solicitVisiable = false
      }
    },
    /**
     * 上传意见汇总表
     */
    uplaodLogFiles(data, flag = 0) {
      this.processAs = this.getProcess(data.taskState);
      this.stdForm = {
        userList: "",
        workItemId: data.workItemId,
        wfInstanceId: data.wfInstanceId,
        wfActivityDefId: data.wfActivityDefId,
        fromWfActivityDefId: data.fromWfActivityDefId,
        wfActivityDefCode: data.wfActivityDefCode,
        wfDefCode: data.wfDefCode,
        wfDefId: data.wfDefId,
        adviceTaskId: data.adviceTaskId,
        stdName: data.stdName,
        parentProcessorId: this.userInfo.userId,
        parentId: data.parentProcessorId,
        extendAttachments: data.fileList,
        childAdviceTaskId: data.childAdviceTaskId,
        id: data.id,
        fileList: data.fileList,
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        taskState:data.taskState
      };
      this.uploadFileTitle =
        flag == 0 ? "上传意见汇总表" : "提交征求意见汇总表";
      this.uploadFileVisible = true;
    },
    // 下载文件
    fileDownLoad(file){
      const req = {
        adviceTaskId:file.adviceTaskId,
        processAs:1
      }
      Api.queryFile(req).then((res) => {
        const { code, msg,rows} = res;
        if (code === 200) {
          if(rows&&rows.length&&rows[0].currentAttachments){
            const currentAttachments = JSON.parse(rows[0].currentAttachments)
            const fileName = currentAttachments[0].name
            const fileUrl = currentAttachments[0].url
            this.downLoadByURL(fileUrl, `${fileName}`)
          }else{
            this.$message.warning("暂无相关文件")
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 保存/取消上传意见汇总表
     */
    saveUplaodFiles() {
      this.stdForm = this.deepClone(stdForm);
      this.uploadFileVisible = false;
      this.pageChange(1);
    },
    /**
     * 查看结果
     */
    checkResult(data) {
      this.stdForm = data;
      // console.log(this.stdForm, data);
      this.checkResultVisiable = true;
    },
    /**
     * 关闭查看详情
     */
    closeCheckResult() {
      this.stdForm = this.deepClone(stdForm);
      this.checkResultVisiable = false;
      this.pageChange(1);
    },
    closeResult(){
      this.resultVisiable = false;
    },
    /**
     * 结束任务
     */
    endTask(data) {
      this.$confirm(`确定结束任务：《${data.stdName}》吗？`, "任务", {
        confirmButtonText: "确定结束",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          const req = {
            stdName: data.stdName,
            id: data.adviceTaskId,
            wfActivityDefCode: data.wfActivityDefCode,
            wfActivityDefId: data.wfActivityDefId,
            wfDefCode: data.wfDefCode,
            wfDefId: data.wfDefId,
            wfInstanceId: data.wfInstanceId,
            workItemId: data.workItemId,
          };
          Api.AdviceTaskEnd(req).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success(`已结束任务：${data.stdName}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 获取所有标准化负责人
     */
    selectAssignByProcessAs() {
      this.isAssignProcess = false;
      Api.selectAssignByProcessAs({ childAdviceTaskId: null }).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          data.forEach((id) => {
            if (id == this.userInfo.userId) {
              this.isAssignProcess = true;
            }
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 查看节点
     */
    checkNodes(e) {
      if (e.taskState == 3103) {
        this.nodeTaskId = e.adviceTaskId;
        this.checkNodeInfoVisiable = true;
      }
    },
    /**
     * 关闭查看节点信息弹框
     */
    closeCheckNodes() {
      this.nodeTaskId = null;
      this.checkNodeInfoVisiable = false;
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