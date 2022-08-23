<template>
  <div class="enterprise-std app-container">
    <!-- 列表 -->
    <template v-if="pageType == 0">
      <!-- 头部选项Radio -->
      <BztRadioCard
        :data="{
          list: dict.type.inter_revision_process_phase,
          fieldReName: { label: 'label', value: 'value' },
        }"
        @change="chengeTab"
        :checkedId="listReq.projectPhase"
      />

      <!-- 内容区 -->
      <div class="enterprise-std-content">
        <!-- 搜索 -->
        <BztSearch
          :searchData="searchInfo"
          :formVal="listReq"
          @search="searchList"
        />

        <!-- 功能操作行 -->
        <HandleCom
          :projectPhase="listReq.projectPhase"
          :type="listReq.projectState"
          :projects="projects"
          :reqInfoPublishId="listReq.infoPublishId"
          @apply="applyPro"
          @export="exportFile"
          @success="refresh"
          @exportPlanFile="exportPlanFile"
          @exportApplicationForm="exportApplicationForm"
        />

        <!-- 流程列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: tabAction,
            actionWidth: getActionWidth(),
          }"
          :hasIndex="true"
          :checkeBox="listReq.projectPhase == '10'"
          :pageInfo="page"
          :isLoading="isTabLoading"
          @checkProcess="checkProcess"
          @checkProDetail="checkProDetail"
          @recallPro="recallPro"
          @select-change="selecData"
          @checkProjectName="checkProjectName"
        >
          <template
            slot="stdEdit"
            slot-scope="{ scope }"
            v-if="
              (listReq.projectPhase == '10' || listReq.projectPhase == '0') &&
              scope.projectState == 1001 &&
              scope.applyUser == userInfo.userId &&
              scope.projectStatus != 7
            "
          >
            <span class="yellow-link-txt" @click="editStdPro(scope)">编辑</span>
          </template>
          <!-- <template
            slot="recall"
            slot-scope="{ scope}"
            v-if="scope.withDrawAuth == 1"
          >
            <span class="yellow-link-txt" @click="recallPro(scope)">
              撤回
            </span>
          </template> -->
          <template slot="checkProDetail" slot-scope="{ scope }">
            <!-- @checkProcess="checkProcess" -->
            <span
              class="link-text"
              v-if="scope.projectPhase == 10"
              @click="checkProDetail(scope)"
            >
              详情
              <!-- {{
                scope.projectState == 1102 && scope.workItemId != null
                  ? "编写草案"
                  : "详情"
              }} -->
            </span>
            <template v-else-if="scope.projectState == 1113">
              <span
                class="red-link-text"
                v-if="isSign(scope)"
                @click="checkProDetail(scope)"
              >
                会签
              </span>
              <span
                class="red-link-text"
                v-else-if="isCheckUser(scope)"
                @click="checkProDetail(scope)"
              >
                编辑
              </span>
              <span
                class="link-text"
                v-else
                @click="checkProDetail(scope)"
              >
                详情
              </span>
            </template>

            <span
              class="link-text"
              v-else-if="scope.workItemId == null"
              @click="checkProDetail(scope)"
            >
              详情
            </span>
            <span
              class="link-text"
              v-else-if="scope.workItemId != null && scope.projectState == 1101"
              @click="checkProDetail(scope)"
            >
              详情
            </span>
            <span v-else-if="scope.workItemId != null && scope.projectState == 1119" class="yellow-link-txt" @click="checkProDetail(scope)">
              审核
            </span>
            <template v-else>
              <span
                class="red-link-text"
                v-if="
                  scope.projectState == 1102 ||
                  scope.projectState == 1103 ||
                  scope.projectState == 1107 ||
                  scope.projectState == 1109 ||
                  scope.projectState == 1111 ||
                  scope.projectState == 1116
                "
                @click="checkProDetail(scope)"
              >
                编辑
              </span>
              <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1104 ||
                  scope.projectState == 1108 ||
                  scope.projectState == 1112 
                "
                @click="checkProDetail(scope)"
              >
                审核
              </span>
              <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1114 
                "
                @click="checkProDetail(scope)"
              >
                审定
              </span>
              <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1115
                "
                @click="checkProDetail(scope)"
              >
                审批
              </span>
              <span
                class="red-link-text"
                v-else-if="scope.projectState == 1106"
                @click="checkProDetail(scope)"
              >
                征求意见
              </span>
              <span class="red-link-text" v-else-if="scope.projectState == 1110" @click="checkProDetail(scope)">
                编辑
              </span>
              <span class="link-text" v-else @click="checkProDetail(scope)">
                详情
              </span>
            </template>
            <span
              class="yellow-link-txt"
              v-if="
                (scope.projectState == 1004 || scope.projectState == 1008) &&
                scope.workItemId != null
              "
              @click="aduitSchedulePlan(scope)"
            >
              审核
            </span>
          </template>
          <template
            slot="checkProcess"
            slot-scope="{ scope }"
            v-if="scope.projectState != 1001"
          >
            <!-- @checkProcess="checkProcess" -->
            <span
              v-if="scope.workItemId == null"
              class="link-text"
              @click="checkProcess(scope)"
            >
              进度
              <!-- {{
                scope.projectPhase == "20" || scope.projectPhase == "30"
                  ? "操作入口"
                  : "流程查看"
              }} -->
            </span>
            <template v-else>
              <span
                class="red-link-text"
                @click="checkProcess(scope)"
                v-if="
                  (scope.projectState == 1101 || scope.projectState == 1105) &&
                  scope.applyUser == userInfo.userId
                "
                >详情及设置
              </span>
              <span
                class="yellow-link-txt"
                @click="checkProcess(scope)"
                v-else-if="
                  (scope.projectState == 1102 || scope.projectState == 1106) &&
                  scope.applyUser == userInfo.userId
                "
                >详情及设置
              </span>
              <span
                class="yellow-link-txt"
                @click="checkProcess(scope)"
                v-else-if="
                  scope.projectState == 1103 &&
                  scope.interfacePersonIds != null &&
                  scope.interfacePersonIds
                    .split(',')
                    .indexOf(userInfo.userId) != -1
                "
                >详情及设置
              </span>

              <span v-else class="link-text" @click="checkProcess(scope)">
                进度
                <!-- {{
                scope.projectPhase == "20" || scope.projectPhase == "30"
                  ? "操作入口"
                  : "流程查看"
              }} -->
              </span>
            </template>
          </template>
          <template slot="remove" slot-scope="{ scope }">
            <!-- <span
              class="yellow-link-text"
              @click="removePro(scope)"
              v-hasPermi="['task:transfer']"
              >转办
            </span> -->
            <span
              class="red-link-text"
              @click="removePro(scope)"
              v-hasPermi="['project:remove']"
              >删除
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
    </template>
    <template v-else-if="pageType == 1">
      <ApplyProject
        v-if="projectStatus != 7"
        :infoPublishId="infoPublishId"
        :projectId="projectId"
        @close="toList()"
      />
      <ApplySpecialProject
        v-else
        :infoPublishId="infoPublishId"
        :projectId="projectId"
        @close="toList()"
      />
    </template>
    <template v-else-if="pageType == 2">
      <ProjectDetail :projectId="projectId" @close="toList()" />
    </template>

    <!-- 查看项目名称修改历史 -->
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-descriptions
          :title="null"
          :column="1"
          labelClassName="label"
          contentClassName="contents"
          :labelStyle="{ width: '100px' }"
        >
          <template v-for="(item, index) in projectName">
            <el-descriptions-item :key="`proName_${index}`" :label="item.title">
              {{ item.proName || "" }}
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </template>
    </BztDialog>

    <!-- 进度计划审核 -->
    <BztDialog
      :dialogInfo="dialogAudit"
      v-if="dialogAudit.visible == true"
      @close="comitAduit($event)"
    >
      <template slot="body">
        <SchedulePlan
          :isEdit="false"
          ref="schedulePlan"
          :projectId="`${applayProForm.id} `"
          :formValue="applayProForm"
          @process-to-next="toNext"
          @updateDetail="updatePlan"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import {
  BztRadioCard,
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import infoApi from "@api/infoModule";

import HandleCom from "./components/handleCom.vue";
import ApplyProject from "./components/applyProject.vue";
import ProjectDetail from "./components/projectDetail.vue";
import ApplySpecialProject from "./components/applySpecialProject.vue";
import { mapGetters } from "vuex";
import { BztDialog } from "@components/basicCom/index";
import { SchedulePlan } from "@components/bussinessCom/index";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztRadioCard,
    BztSearch,
    BztTable,
    BztPageContrl,
    HandleCom,
    ApplyProject,
    ProjectDetail,
    BztDialog,
    ApplySpecialProject,
    SchedulePlan,
  },
  name: "enterprise-std",
  dicts: [
    "inter_revision_process_phase",
    "en_application_pro_node",
    "revision_mode",
    "task_status",
  ],
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准发布",
        width: "600px",
      },
      dialogAudit: {
        visible: false,
        title: "进度计划审核",
        width: "1000px",
        footer: false,
      },
      pageType: 0, // 0:列表, 1:立项申请, 2:详情
      isTabLoading: false,
      projectName: [],
      searchInfo: {},
      tabClums: [
        {
          title: "标准名称",
          key: "projectName",
          minWidth: "420",
          filter: {
            type: "action",
            actionName: "checkProjectName",
            isHtml: true,
            action: (data, row) => {
              const hasChange = this.projectNameChange(row);
              return hasChange == false
                ? `<span>${data}</span>`
                : `<span><i class="el-icon-time yellow-link-txt" style="margin-right:9px"></i>${data}</span>`;
            },
          },
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "160",
          filter: {
            type: "user",
          },
        },
        {
          title: "申请单位",
          key: "applyCompanyId",
          width: "160",
          filter: {
            type: "dept",
          },
        },
        {
          title: "制定或修订",
          key: "scplatMode",
          width: "100",
          // sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.revision_mode.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "项目阶段",
          key: "projectPhase",
          width: "160",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.inter_revision_process_phase.forEach((item) => {
                if (Number(item.value) == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "项目节点",
          key: "projectState",
          width: "180",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.stateList.forEach((item) => {
                if (Number(item.code) == data) {
                  str = item.name;
                }
              });
              return str;
            },
          },
        },
        {
          title: "项目状态",
          key: "projectStatus",
          width: "150",
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
        projectPhase: "0",
        hasMyWork: 1,
        projectName: null,
        scplatMode: null,
        applyCompanyId: null,
        projectStatus: null,
        projectState: null,
        infoPublishId: null,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [
        { label: "编辑", type: "slot", btnName: "stdEdit" },
        { label: "详情", type: "slot", btnName: "checkProDetail" },
        { label: "撤回", type: "slot", btnName: "recall" },
        { label: "查看流程", type: "slot", btnName: "checkProcess" },
        { label: "删除", type: "slot", btnName: "remove" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      infoPublishId: "", // 已发布成功的信息Id
      projectId: "",
      projects: [], // 复选框已选中的项目
      nodes: [], //每个阶段的节点列表（除立项阶段）
      stateList: [],
      projectStatus: null,
      applayProForm: {},
      infoList: [],
    };
  },
  mounted() {
    const { projectPhase, projectState } = this.$route.params;
    if (projectPhase != undefined) {
      this.listReq.projectPhase = projectPhase;
    }
    if (projectState != undefined) {
      this.listReq.projectState =
        projectPhase == 10
          ? projectState == "null"
            ? ""
            : projectState
          : projectState == "null"
          ? null
          : Number(projectState);
    }

    this.initDictData();

    this.getList();
  },
  beforeCreate() {
    Api.getProNodesByPhase(-1).then((res) => {
      const { code, data, msg } = res;
      if (code == 200) {
        this.stateList = data;
      } else {
        // this.$message.error(msg);
      }
    });
  },
  methods: {
    /**
     * 初始搜索列表化字典数据
     */
    async initDictData() {
      if (
        this.listReq.projectPhase == "0" ||
        this.listReq.projectPhase == null
      ) {
        this.searchInfo = {
          labelList: [
            { label: "项目名称", key: "projectName", type: 1 },
            // { label: "项目编号", key: "stdNo", type: 1 },
            {
              label: "制定或修订",
              key: "scplatMode",
              type: 2,
              options: this.dict.type.revision_mode,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            { label: "申请单位", key: "applyCompanyId", type: 5 },

            {
              label: "项目状态",
              key: "projectStatus",
              type: 2,
              options: this.dict.type.task_status,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            {
              label: "项目筛选",
              key: "hasMyWork",
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
      } else if (this.listReq.projectPhase == "10") {
        /**
         * 获取立项通知列表
         */
        const req = {
          infoTheme: "1",
          status: "5",
          isPublish: 1,
        };
        await infoApi.infoPblicList(req).then((res) => {
          const { code, msg, rows, total } = res;
          if (code === 200) {
            this.infoList = rows;
          } else {
            // this.$message.error(msg);
          }
        });
        this.searchInfo = {
          labelList: [
            { label: "项目名称", key: "projectName", type: 1 },
            // { label: "项目编号", key: "stdNo", type: 1 },
            {
              label: "制定或修订",
              key: "scplatMode",
              type: 2,
              options: this.dict.type.revision_mode,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            { label: "申请单位", key: "applyCompanyId", type: 5 },

            {
              label: "项目状态",
              key: "projectStatus",
              type: 2,
              options: this.dict.type.task_status,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            {
              label: "项目节点",
              key: "projectState",
              type: 2,
              options: this.dict.type.en_application_pro_node,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            {
              // infoPublishId
              label: "立项通知",
              key: "infoPublishId",
              type: 2,
              options: this.infoList,
              replaceField: { value: "infoPublishId", label: "infoTitle" },
              multiple: false,
            },
            {
              label: "项目筛选",
              key: "hasMyWork",
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
      } else {
        this.getNodeByPhase();
      }
    },
    /**
     * 操作列宽
     */
    getActionWidth() {
      let widthStr = "180px";
      if (this.userInfo.userId == 1) {
        if (this.listReq.projectPhase == "0") {
          widthStr = "220px";
        } else if (this.listReq.projectPhase == "10") {
          widthStr = "280px";
        } else {
          widthStr = "180px";
        }
      } else {
        if (
          this.listReq.projectPhase == "10" ||
          this.listReq.projectPhase == "0"
        ) {
          widthStr = "215px";
        }
      }
      return widthStr;
    },
    /**
     * 切换阶段
     * @param {*} e 阶段标识
     */
    chengeTab(e) {
      this.listReq = {
        projectPhase: "",
        hasMyWork: 1,
        projectName: null,
        scplatMode: null,
        applyCompanyId: null,
        projectStatus: null,
        projectState: null,
        pageNum: 1,
        pageSize: 10,
      };
      this.listReq.projectPhase = e;
      this.listReq.projectState = null;
      const { projectPhase, projectState } = this.$route.params;
      if (
        projectPhase != undefined &&
        this.listReq.projectPhase == projectPhase
      ) {
        if (this.$route.params.projectState != undefined) {
          this.listReq.projectState =
            projectPhase == 10
              ? projectState == "null"
                ? ""
                : projectState
              : projectState == "null"
              ? null
              : Number(projectState);
        }
      }
      this.initDictData();
      this.pageChange(1);
    },
    /**
     * 获取项目节点根据项目阶段
     */
    getNodeByPhase() {
      this.nodes = [];
      Api.getProNodesByPhase(this.listReq.projectPhase).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.nodes = data;
        } else {
          // this.$message.error(msg);
        }
        this.searchInfo = {
          labelList: [
            { label: "项目名称", key: "projectName", type: 1 },
            // { label: "项目编号", key: "stdNo", type: 1 },
            {
              label: "制定或修订",
              key: "scplatMode",
              type: 2,
              options: this.dict.type.revision_mode,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            { label: "申请单位", key: "applyCompanyId", type: 5 },

            {
              label: "项目状态",
              key: "projectStatus",
              type: 2,
              options: this.dict.type.task_status,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
            {
              label: "项目节点",
              key: "projectState",
              type: 2,
              options: this.nodes,
              replaceField: { value: "code", label: "name" },
              multiple: false,
            },
            {
              label: "项目筛选",
              key: "hasMyWork",
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
      });
    },
    /**
     * 获取项目任务列表
     */
    getList() {
      this.getActionWidth();
      if (this.listReq.projectPhase == "0") {
        const req = {
          projectName: this.listReq.projectName,
          projectStatus: this.listReq.projectStatus,
          scplatMode: this.listReq.scplatMode,
          applyCompanyId: this.listReq.applyCompanyId,
          pageNum: this.listReq.pageNum,
          pageSize: this.listReq.pageSize,
          projectTypes: "1,4",
          onlyTodo: this.listReq.hasMyWork,
          // isAsc: "desc",
          // orderByColumn: "tspa.createTime",
        };
        Api.getProjectApprovalListAll(req).then((res) => {
          const { code, msg, rows, total } = res;
          if (code === 200) {
            this.list = rows;
            this.page.total = total;
            this.page.pageNo = this.listReq.pageNum;
            this.page.pageSize = this.listReq.pageSize;
          } else {
            // this.$message.error(msg);
          }
        });
      } else if (this.listReq.projectPhase == "10") {
        const req = {
          projectName: this.listReq.projectName,
          projectState: this.listReq.projectState,
          projectStatus: this.listReq.projectStatus,
          projectType: 1,
          applyCompanyId: this.listReq.applyCompanyId,
          scplatMode: this.listReq.scplatMode,
          pageNum: this.listReq.pageNum,
          pageSize: this.listReq.pageSize,
          notFinished: 1,
          infoPublishId: this.listReq.infoPublishId,
          isAsc: "desc",
          orderByColumn: "createTime",
          onlyTodo: this.listReq.hasMyWork,
        };
        Api.getProjectApprovalList(req).then((res) => {
          const { code, msg, rows, total } = res;
          if (code === 200) {
            this.list = rows;
            this.page.total = total;
            this.page.pageNo = this.listReq.pageNum;
            this.page.pageSize = this.listReq.pageSize;
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        this.listReq.projectType = 4;
        Api.enReviseList(this.listReq).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.list = data.list;
            this.page.total = data.total;
            this.page.pageNo = this.listReq.pageNum;
            this.page.pageSize = this.listReq.pageSize;
          } else {
            // this.$message.error(msg);
          }
        });
      }
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
    refresh(e) {
      // if (e == true) {
      //   // this.listReq = {
      //   //   projectPhase: "",
      //   //   hasMyWork: 1,
      //   //   projectName: null,
      //   //   scplatMode: null,
      //   //   applyCompanyId: null,
      //   //   projectStatus: null,
      //   //   projectState: null,
      //   //   pageNum: 1,
      //   //   pageSize: 10,
      //   // };
      //   // const { projectPhase } = this.$route.params;
      //   // if (projectPhase != undefined) {
      //   //   this.listReq.projectPhase = projectPhase;
      //   // }
      //   // this.projects = [];
      // }
      this.pageChange(1);
    },
    /**
     * 复选框操作
     * @param {*} e 选中的行
     */
    selecData(e) {
      this.projects = e;
    },
    /**
     * 查看流程
     */
    checkProcess(data) {
      // ${data.id}
      this.$router.push({
        // path: `/viewProcess/${this.listReq.projectPhase == 10 ? 1 : 4}/${
        //   data.id
        // }`,
        path: `/viewProcess/${data.projectPhase == 10 ? 1 : 4}/${data.id}/${
          data.projectPhase
        }/${data.applyUser}`,
      });
    },
    /**
     *进度计划审核
     * @param {*} pro 要审核的流程的详细信息
     */
    aduitSchedulePlan(pro) {
      Api.getProjectApprovalDetail(pro.id).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.applayProForm = data;
          this.applayProForm["isChange"] = !this.applayProForm["isChange"];
          this.dialogAudit.visible = true;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    comitAduit(e) {
      this.dialogAudit.visible = false;
    },
    /**
     * (标准立项-填报项目进度)流程流转下一步
     */
    toNext() {
      Api.reportProjectProgress(this.applayProForm.id).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.pageChange(1);
          this.$message.success("操作成功");
          this.dialogAudit.visible = false;
        } else {
          // this.$message.error(msg);/
        }
      });
    },
    /**
     * 编辑保存项目进度计划
     */
    updatePlan(data) {
      const req = {
        id:
          data.projectPhase == "10" ||
          data.projectPhase == "" ||
          data.projectPhase == null
            ? this.applayProForm.id
            : data.foundationProjectId,
        scpStdComment: data.scpStdComment,
        stdForApprovalDeadline: data.stdForApprovalDeadline,
        stdForReviewDeadline: data.stdForReviewDeadline,
        stdMultiAggreementDeadline: data.stdMultiAggreementDeadline,
        stdDraftDeadline: datadata.stdDraftDeadline,
      };
      Api.updateProjectApproval(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 判断是否有会签权限
     * @param {*} data 要查看的流程的详细信息
     * @retrun
     */
    isCheckUser(data) {
      let has = false;
      if (!data.countersign || !data.countersignSort) {
        return false;
      }
      if (data.countersign != null && data.countersignSort != null) {
        let arr = data.countersign == null ? [] : data.countersign.split(",");
        if (
          arr.length + 1 == data.countersignSort &&
          data.applyUser == this.userInfo.userId
        ) {
          has = true;
        }
      }
      return has;
    },
    /**
     * 判断是否有会签权限
     * @param {*} data 要查看的流程的详细信息
     * @retrun
     */
    isSign(data) {
      let has = false;
      if (!data.countersign || !data.countersignSort) {
        return false;
      }
      if (data.countersign != null && data.countersignSort != null) {
        let arr =
          data.countersign == null
            ? []
            : data.countersign.split(",").map((el) => {
                return Number(el);
              });
        if (arr.length > 0 && arr.indexOf(this.userInfo.userId) != -1) {
          if (arr.indexOf(this.userInfo.userId) + 1 == data.countersignSort) {
            has = true;
          }
        }
      }
      return has;
    },
    /**
     * 查看详情
     * @param {*} data 要查看的流程的详细信息
     */
    checkProDetail(data) {
      // this.pageType = 2;
      // this.projectId = data.id;
      this.$router.push({
        path: `/work/enterpriseStdRevise/viewProject/${data.id}/${data.projectPhase}`,
      });
    },
    /**
     * 撤回
     * @param {*} data 要撤回的流程的详细信息
     */
    recallPro(e) {
      if (e.projectPhase == 10) {
        // 立项阶段撤回
        this.$confirm(`确定撤回项目：《${e.projectName}》吗？`, "标准立项", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            Api.withDrawById(e.id).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success(`项目：《${e.projectName}》已撤回`);
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {});
      } else {
        // 制修订撤回
        this.$confirm(`确定撤回项目：《${e.projectName}》吗？`, "标准制修订", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            Api.withdrawWF({ id: e.id }).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success(`项目：《${e.projectName}》已撤回`);
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
     * 删除
     * @param {*} data 要删除的流程的详细信息
     */
    removePro(e) {
      this.$confirm(`确定删除项目：《${e.projectName}》吗？`, "标准立项", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          if (e.projectPhase == 10) {
            Api.removeProjectApproval(e.id).then((res) => {
              const { data, code, msg } = res;
              if (code === 200) {
                this.$message.success(`已删除任务：${e.projectName}`);
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          } else {
            Api.delProject(e.id).then((res) => {
              const { data, code, msg } = res;
              if (code === 200) {
                this.$message.success(`已删除任务：${e.projectName}`);
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          }
        })
        .catch(() => {});
    },
    /**
     * 立项申请
     * @param {*} e 已发布的信息Id
     */
    applyPro(e) {
      if (e != null) {
        this.pageType = 1;
        this.infoPublishId = e;
        this.projectId = null;
      } else {
        this.pageType = 1;
        this.projectStatus = 7;
        this.infoPublishId = null;
        this.projectId = null;
      }
    },
    /**
     * 编辑立项
     */
    editStdPro(e) {
      this.pageType = 1;
      this.infoPublishId = e.infoPublishId;
      this.projectStatus = e.projectStatus;
      this.projectId = e.id;
    },
    /**
     * 导出立项申请汇总表
     * @param {*} e 1:模板，0：实际数据表
     */
    exportFile(e) {
      this.$confirm(
        `确定导出《${new Date().getFullYear()}年度企业技术标准立项申请汇总表》？`,
        "导出部门标准立项汇总表",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            isTemplate: e,
            projectState: this.listReq.projectState,
            projectType: 1,
          };
          this.downloadByPost(
            "/scplat/projectApproval/exportSummaryFile",
            req,
            `${new Date().getFullYear()}年度企业技术标准立项申请汇总表.xls`
          );
        })
        .catch(() => {});
    },
    /**
     * 导出企业标准制修订计划表
     * @param {*}
     */
    exportPlanFile(e) {
      this.$confirm(
        `确定导出《${new Date().getFullYear()}年度企业标准制修订计划》？`,
        "标准立项",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            // isTemplate: e,
            // projectState: this.listReq.projectState,
            // projectType: 1,
          };
          this.downloadByPost(
            "/scplat/projectApproval/exportPlanSummaryFile/1",
            req,
            `${new Date().getFullYear()}年度企业标准制修订计划.xls`
          );
        })
        .catch(() => {});
    },
    /**
     * 企业技术标准计划项目申请汇总表
     */
    exportApplicationForm(e) {
      this.$confirm(
        `确定导出《${new Date().getFullYear()}企业技术标准计划项目申请汇总表》？`,
        "标准立项",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            // isTemplate: e,
            // projectState: this.listReq.projectState,
            // projectType: 1,
          };
          this.downloadByPost(
            "/scplat/projectApproval/exportApplicationForm",
            null,
            `${new Date().getFullYear()}企业技术标准计划项目申请汇总表.zip`
          );
        })
        .catch(() => {});
    },

    /**
     * 返回列表
     */
    toList() {
      this.pageType = 0;
      this.listReq.projectState = null;
      this.pageChange(1);
    },
    /**
     * 检查是否有变更过项目名称
     */
    projectNameChange(data) {
      let change = true;
      if (
        data.projectNameHistory == undefined ||
        data.projectNameHistory == null ||
        data.projectNameHistory == ""
      ) {
        data["proNames"] = [];
        change = false;
      } else {
        const proNameList = JSON.parse(data.projectNameHistory);
        let proNames = [];
        Object.keys(proNameList).map((key) => {
          let has = false;
          if (proNameList[key] == "") {
            has = true;
          } else {
            proNames.forEach((item) => {
              if (item.proName == proNameList[key]) {
                has = true;
              }
            });
          }
          if (has == false) {
            proNames.push({
              title: this.selectDictLabel(
                this.dict.type.inter_revision_process_phase,
                key
              ),
              proName: proNameList[key],
            });
          }
        });
        data["proNames"] = proNames;
        change = proNames.length > 1;
      }
      return change;
    },
    /**
     * 查看项目名称更改历史
     * @param {*} data 要查看的项目的信息
     */
    checkProjectName(data) {
      if (data.proNames.length > 1) {
        this.projectName = data.proNames;
        this.dialogInfo.title = "历史项目名称";
        this.dialogInfo.visible = true;
      }
    },
    closeDialog() {
      this.dialogInfo.visible = false;
      this.projectName = [];
      this.dialogInfo.title = "";
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