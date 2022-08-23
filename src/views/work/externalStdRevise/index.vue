<template>
  <div class="enterprise-std app-container">
    <!-- 列表 -->
    <template v-if="pageType == 0">
      <!-- 头部选项Radio -->
      <BztRadioCard
        :data="{
          list: dict.type.outer_revision_process_phase,
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
          @search="searchList"
          :formVal="listReq"
        />

        <!-- 功能操作行 -->
        <div style="display:flex;">
          <HandleCom
            :projectPhase="listReq.projectPhase"
            :type="listReq.projectState"
            :projects="projects"
            :ownerDeptId="$route.query.ownDeptId"
            @apply="applyPro"
            @export="exportFile"
            @success="refresh"
            @exportPlanFile="exportPlanFile"
            @exportApplicationForm="exportApplicationForm"
          />
          <div class="green-btn" style="margin-bottom:10px" v-if="listReq.projectPhase == '20'&&listReq.ownerDeptId&&listReq.projectState==1201" @click="handleAllMakeTime">
            批量制定编制进度
          </div>
          <div class="green-btn" v-if="listReq.projectPhase == '10'&&listReq.ownerDeptId&&listReq.projectState=='904'" @click="handleAllDeliverNotice">
            批量发布通知
          </div>
        </div>
        <!-- 流程列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: tabAction,
            actionWidth: getActionWidth(),
          }"
          :hasIndex="true"
          :checkeBox="listReq.projectPhase == '10'||listReq.projectPhase == '20'"
          :pageInfo="page"
          :isLoading="isTabLoading"
          @recallPro="recallPro"
          @select-change="selecData"
          @checkProjectName="checkProjectName"
        >
          <template
            slot="stdEdit"
            slot-scope="{ scope }"
            v-if="
              listReq.projectPhase == '10' &&
              scope.projectState == 901 &&
              scope.applyUser == userInfo.userId
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

          <!-- <template
            slot="ffPro"
            slot-scope="{ scope}"
            v-if="
              listReq.projectPhase == '20' &&
              scope.foundationProjectId != null &&
              scope.projectState == 1202
            "
            v-hasPermi="['externalStdRevise:sendProject']"
          >
            <span class="green-link-text" @click="ffPro(scope)">
              分发项目
            </span>
          </template> -->
          <!-- workItemId -->
          
          <!-- 原有 -->
          <!-- <template
            slot="ffPro"
            slot-scope="{ scope }"
            v-if="scope.workItemId != null && scope.projectState == 1202"
          >
            <span class="green-link-text" @click="mainEditor(scope)">
              选择第一起草人
            </span>
          </template> -->
          <template
            v-if="scope.workItemId && scope.projectState == 1201"
            slot="makeTime"
            slot-scope="{ scope }"
          >
            <span class="green-link-text" @click="makeTime(scope,1)" >
             制定编制进度
            </span>
          </template>
          <template
            slot="formation"
            slot-scope="{ scope }"
            v-if="scope.workItemId && scope.projectState == 1202"
          >
            <span class="green-link-text" @click="makeTime(scope,2)" >
             组建编制组
            </span>
          </template>
          
          <template slot="checkProDetail" slot-scope="{ scope }">
            <!-- @checkProcess="checkProcess" -->
            <!-- <span class="link-text" @click="checkProDetail(scope)">
              {{
                scope.workItemId != null && scope.projectState == 1204
                  ? "编写草案"
                  : scope.workItemId != null
                  ? "办理"
                  : "详情"
              }}
            </span> -->
          
            <span v-if="scope.projectPhase == 10&&scope.projectState==913&&scope.workItemId!=null"
              class="red-link-text"
              @click="toExamine(scope)"
            >
              审核
            </span>
            <span v-if="scope.projectPhase == 10&&scope.projectState==904&&scope.workItemId!=null"
              class="red-link-text"
              @click="deliverNotice(scope)"
            >
              发布通知
            </span>
            <span
              class="link-text"
              v-if="scope.projectPhase == 10"
              @click="checkProDetail(scope)"
            >
              详情
            </span>
           
            <template v-else-if="scope.workItemId != null && scope.projectState == 1203">
              <span class="red-link-text" @click="checkProDetail(scope)">
                编辑
              </span>
            </template>
            <!-- <template v-else-if="scope.projectState == 1213">
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
            </template> -->

            <span
              class="link-text"
              v-else-if="scope.workItemId == null"
              @click="checkProDetail(scope)"
            >
              详情
            </span>
            <span
              class="link-text"
              v-else-if="scope.workItemId != null && scope.projectState == 1201"
              @click="checkProDetail(scope)"
            >
              详情
            </span>
            <span v-else-if="scope.workItemId != null && scope.projectState == 1219" class="yellow-link-txt" @click="checkProDetail(scope)">
              审核
            </span>
            <!-- <span v-else-if="scope.workItemId != null && " class="yellow-link-txt" @click="checkProDetail(scope)">
              审核
            </span> -->
            <template v-else>
                  <!-- scope.projectState == 1202 || -->
              <span
                class="red-link-text"
                v-if="
                  scope.projectState == 1203 ||
                  scope.projectState == 1205 ||
                  scope.projectState == 1207 ||
                  scope.projectState == 1208 ||
                  scope.projectState == 1209 ||
                  scope.projectState == 1211 ||
                  scope.projectState == 1212 ||
                  scope.projectState == 1214 ||
                  scope.projectState == 1215 ||
                  scope.projectState == 1217 ||
                  scope.projectState == 1218 ||
                  scope.projectState == 1222 ||
                  scope.projectState == 1226
                "
                @click="checkProDetail(scope)"
              >
                编辑
              </span>
              <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1204 ||
                  scope.projectState == 1213 ||
                  scope.projectState == 1216 ||
                  scope.projectState == 1223 
                "
                @click="checkProDetail(scope)"
              >
                审核
              </span>
              <!-- <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1214 
                "
                @click="checkProDetail(scope)"
              >
                审定
              </span>
              <span
                class="red-link-text"
                v-else-if="
                  scope.projectState == 1215
                "
                @click="checkProDetail(scope)"
              >
                审批
              </span> -->
              <span
                class="red-link-text"
                v-else-if="scope.projectState == 1206"
                @click="checkProDetail(scope)"
              >
                征求意见
              </span>
              <span class="red-link-text" v-else-if="scope.projectState == 1210" @click="checkProDetail(scope)">
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
            v-if="scope.projectState != 901"
          >
            <!-- @checkProcess="checkProcess" -->
            <span class="link-text" @click="checkProcess(scope)">
              {{
                scope.workItemId != null &&
                (scope.projectState == 1203 || scope.projectState == 1204)
                  ? "操作入口"
                  : "流程查看"
              }}
            </span>
          </template>
          <template slot="remove" slot-scope="{ scope }">
            <span
              class="red-link-text"
              @click="removePro(scope)"
              v-if="
                scope.projectState == 901 &&
                scope.applyUser == userInfo.userId &&
                scope.projectStatus != 5
              "
              v-hasPermi="['project:remove']"
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
    </template>
    <!-- 添加外部立项 -->
    <template v-else-if="pageType == 1">
      <ApplyProject
        v-if="pageType == 1"
        :infoPublishId="infoPublishId"
        :projectId="projectId"
        @close="toList"
      />
    </template>
    <template v-else-if="pageType == 2">
      <ProjectDetail :projectId="projectId" @close="toList" />
    </template>

    <!-- 分发项目 -->
    <!-- <BztDialog :dialogInfo="receiverProjectDialog" @close="closeNotice">
      <template slot="body">
        <SelectUserByDept
          v-if="receiverForm != null"
          :value="
            receiverForm.interfacePersonIds
              ? receiverForm.interfacePersonIds
              : ''
          "
          :roleKeys="'standardBusinessStaff'"
          @user-change="userChange"
        />
      </template>
    </BztDialog> -->

    <!-- 选择第一起草人 -->
    <BztDialog :dialogInfo="checkMainEditor" @close="saveMainEditor">
      <template slot="body">
        <SelectUserByDept
          v-if="checkMainEditor.visible == true"
          :value="
            mainEditorForm.mainEditorId != null
              ? mainEditorForm.mainEditorId.toString()
              : ''
          "
          :checkOneUser="true"
          :getUserInfo="true"
          @user-change="mainEditorChange"
        />
      </template>
    </BztDialog>

    <!-- 导出汇总表 -->
    <!-- <BztDialog :dialogInfo="exportDialog" @close="closeExport">
      <template slot="body">
        <el-form label-suffix=":">
          <el-form-item label="归口单位" style="width: 100%">
            <el-select
              style="width: 80%"
              v-model="ownerDeptId"
              placeholder="请选择归口单位"
            >
              <template v-for="(item, index) in dict.type.technical_committees">
                <el-option
                  :key="`tec_${index}`"
                  :label="item.label"
                  :value="item.value"
                />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </BztDialog> -->

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

    <!-- 制定编制进度 -->
    <BztDialog
      :dialogInfo="makeTimeInfo"
      @close="closeMakeTime($event)"
      :appendTobody="true"
      v-if="makeTimeInfo.visible == true"
    >
      <template slot="body">
        <ProgressTime :optionsObject="optionsObject" @close="closeMakeTime" />
      </template>
    </BztDialog>
    
    <!-- 新增标准化业务人员审核 -->
    <BztDialog
      :dialogInfo="examineInfo"
      @close="closeExamine($event)"
      :appendTobody="true"
      v-if="examineInfo.visible == true"
    >
      <template slot="body">
       <el-form
        :model="examineForm"
        :rules="rules"
        label-suffix=":"
        label-width="130px"
        ref="examineForm"
        class="examineForm"
      >
        <el-form-item label="审核结论" prop="reviewState">
          <el-radio-group v-model="examineForm.reviewState">
            <el-radio :label="1"> 通过 </el-radio>
            <el-radio :label="3"> 终止 </el-radio>
          </el-radio-group>
        </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <!--发布工作通知 -->
    <PublicInfo
      v-if="deliverNoticeVisiable == true"
      :visiable="deliverNoticeVisiable"
      :showZCBtn="false"
      :businessObjId="businessObjId"
      :data="infoData"
      :infoTheme="5"
      ref="publicInfo"
      @save="saveInfo"
    />
  </div>
</template>
<script>
import {
  BztRadioCard,
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import HandleCom from "./components/handleCom.vue";
import ApplyProject from "./components/applyProject.vue";
import ProjectDetail from "./components/projectDetail.vue";
import { SelectUserByDept } from "@components/bussinessCom/index";
import ProgressTime from "./components/handle/progressTime"
import PublicInfo from "./components/handle/publicInfo.vue"


import { mapGetters } from "vuex";
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
    SelectUserByDept,
    BztDialog,
    ProgressTime,
    PublicInfo
  },
  name: "external-std",
  dicts: [
    "outer_revision_process_phase",
    "ex_application_pro_node",
    "revision_mode",
    "task_status",
    "technical_committees",
  ],
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "标准发布",
        width: "600px",
      },
      makeTimeInfo:{
        visible: false,
        title: "制定编制进度时间表",
        width: "700px",
        // footer: true,
        loadding: false,
        id:''
      },
      businessObjId:[],
      examineInfo:{
        visible: false,
        title: "标准化业务人员审核",
        width: "700px",
        footer: true,
        loadding: false,
        id:'',
      },
      examineForm:{
        reviewState:'',
        id:''
      },
      rules:{
        reviewState: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
      },
      optionsObject:{
        optionsType:1,  //1制定编制进度  2组建编制组
        labelWidth:"140px",
        id:''
      },
      deliverNoticeVisiable:false,
      infoData: {
        formData: null,
        type: null,
      },
      pageType: 0, // 0:列表, 1:立项申请, 2:详情
      isTabLoading: false,
      projectName: [],
      receiverProjectDialog: {
        visible: false,
        title: "选择标准化对接人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      checkMainEditor: {
        visible: false,
        title: "选择第一起草人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      mainEditorForm: {
        id: null,
        mainEditDeptId: null,
        mainEditorId: null,
        mainEditCompany: null,
      },
      exportDialog: {
        visible: false,
        title: "导出标准立项汇总表",
        width: "600px",
        footer: true,
        loadding: false,
      },
      pageType: 0, // 0:列表, 1:立项申请, 2:详情
      isTabLoading: false,
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
          title: "归口单位",
          key: "ownerDeptId",
          width: "140",
          filter: {
            type: "filter",
            data: 0,
            action: (data) => {
              let str = "-";
              this.dict.type.technical_committees.forEach((item) => {
                if (Number(item.value) == data.ownerDeptId) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "制定或修订",
          key: "scplatMode",
          width: "100",
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
          width: "120",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.outer_revision_process_phase.forEach((item) => {
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
          width: "160",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.stateList.forEach((item) => {
                if (Number(item.code) == data) {
                  str = item.name;
                }
              });
              if (data == 1202) {
                str = "待分配给标准化业务人员";
              }
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
        projectName: "",
        scplatMode: "",
        applyCompanyId: "",
        projectStatus: "",
        projectState: "",
        ownerDeptId: null,
        hasMyWork: 1,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [
        { label: "编辑", type: "slot", btnName: "stdEdit" },
        { label: "详情", type: "slot", btnName: "checkProDetail" },
        { label: "撤回", type: "slot", btnName: "recall" },
        { label: "制定编制进度", type: "slot", btnName: "makeTime" },
        { label: "组建编制组", type: "slot", btnName: "formation" },
        { label: "查看流程", type: "slot", btnName: "checkProcess" },
        { label: "分发项目", type: "slot", btnName: "ffPro" },
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
      receiverForm: {
        id: "",
        interfacePersonIds: "",
      },
      exportReq: {
        isTemplate: 0,
        projectState: null,
        projectType: 2,
        ownerDeptId: null,
      },
      stateList: [],
    };
  },
  mounted() {
    if (
      this.$route.query.hook &&
      this.$route.query.phase &&
      this.$route.query.ownDeptId
    ) {
      this.listReq.projectPhase = this.$route.query.phase;
      // this.ownerDeptId = this.$route.query.ownDeptId;
    }
    const { projectPhase, projectState } = this.$route.params;
    if (projectPhase != undefined) {
      this.listReq.projectPhase = projectPhase;
    }
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

    this.initDictData();
    this.getList();
  },
  beforeCreate() {
    Api.getOutProNodesByPhase(-1).then((res) => {
      const { code, data, msg } = res;
      if (code == 200) {
        this.stateList = data;
      } else {
        this.$$message.error(msg);
      }
    });
  },
  methods: {
    /**
     *制定编制进度 
     */
    makeTime(e,optionsType){
      this.optionsObject={
        optionsType,
        labelWidth:optionsType==1?'140px':"100px",
        id:e.id
      }
      this.makeTimeInfo.title=optionsType==1?"制定编制进度时间":"组建编制组"
      this.makeTimeInfo.visible = true
    },
    //批量
    handleAllMakeTime(){
      if(!this.projects.length) return this.$message.warning("请选择要处理的数据")
      let flag = this.projects.every((item)=>item.projectState==1201)
      if(!flag) return this.$message.warning("请选择编制进度数据")
      let ids = []
      this.projects.forEach((item)=>{
        ids.push(item.id)
      })
      this.optionsObject={
        optionsType:1,
        labelWidth:'140px',
        ids:ids,
        id:ids.length>1?"":ids[0]
      }
      this.makeTimeInfo.title="制定编制进度时间"
      this.makeTimeInfo.visible = true
    },
    //批量发布
    handleAllDeliverNotice(){
      if(!this.projects.length) return this.$message.warning("请选择要处理的数据")
      let flag = this.projects.every((item)=>item.projectState==904)
      if(!flag) return this.$message.warning("请选择发布通知数据")
      let ids = []
      this.projects.forEach((item)=>{
        ids.push(item.id)
      })
      
      this.businessObjId = ids
      this.deliverNoticeVisiable = true
    },
    /**
     * 关闭 
     */
    closeMakeTime(e,flag){
      this.makeTimeInfo.visible = false
      this.getList();
    },
    closeExamine(e){
      if(e===true){
        this.$refs.examineForm.validate((valid) => {
          if (valid) {
            // this.$set(this.dialogInfo, "loadding", true);
            this.examineInfo.loadding = true
            Api.setExternalReview(this.examineForm).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("审核已提交");
                this.examineInfo.visible = false
                this.getList();
              } 
              this.examineInfo.loadding = false;
            });
          }
        });
      }else{
         this.examineInfo.visible = false
          this.getList();
      }
    },
     /**
     * 保存(取消)信息
     */
    saveInfo(e) {
      this.deliverNoticeVisiable = false;
      if (e == true) {
        this.getList();
      }
    },
    toExamine(scope){
      this.examineForm.id= scope.id,
      this.examineInfo.visible = true
    },
    deliverNotice(scope){
      this.businessObjId = [scope.id]
      this.deliverNoticeVisiable = true
    },
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
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
            {
              label: "归口单位",
              key: "ownerDeptId",
              type: 2,
              options: this.dict.type.technical_committees,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },

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
            {
              label: "归口单位",
              key: "ownerDeptId",
              type: 2,
              options: this.dict.type.technical_committees,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },
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
              options: this.dict.type.ex_application_pro_node,
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
      } else {
        this.getNodeByPhase();
      }
    },
    /**
     * 切换阶段
     * @param {*} e 阶段标识
     */
    chengeTab(e) {
      console.log(e)
      this.listReq = {
        projectPhase: "0",
        projectName: "",
        scplatMode: "",
        applyCompanyId: "",
        projectStatus: "",
        projectState: "",
        ownerDeptId: null,
        hasMyWork: 1,
        pageNum: 1,
        pageSize: 10,
      };
      this.listReq.projectPhase = e;
      this.listReq.projectState = "";
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
      Api.getOutProNodesByPhase(this.listReq.projectPhase).then((res) => {
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
            {
              label: "归口单位",
              key: "ownerDeptId",
              type: 2,
              options: this.dict.type.technical_committees,
              replaceField: { value: "value", label: "label" },
              multiple: false,
            },

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
     * 操作列宽
     */
    getActionWidth() {
      let widthStr = "150px";
      if (this.userInfo.userId == 1) {
        if (this.listReq.projectPhase == "0") {
          widthStr = "180px";
        } else if (this.listReq.projectPhase == "10") {
          widthStr = "220px";
        } else {
          widthStr = "180px";
        }
      } else {
        if (this.listReq.projectPhase == "10") {
          widthStr = "200px";
        } else if (this.listReq.projectPhase == "20") {
          widthStr = this.listReq.projectState != 1202 ? "180px" : "260px";
        }
      }
      return widthStr;
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
          ownerDeptId: this.listReq.ownerDeptId,
          pageNum: this.listReq.pageNum,
          pageSize: this.listReq.pageSize,
          projectTypes: "2,5",
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
          projectType: 2,
          ownerDeptId: this.listReq.ownerDeptId,
          scplatMode: this.listReq.scplatMode,
          pageNum: this.listReq.pageNum,
          pageSize: this.listReq.pageSize,
          notFinished: 1,
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
        this.listReq.projectType = 5;
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
    refresh(e) {
      // if (e == true) {
      //   this.listReq = {
      //     projectPhase: "0",
      //     projectName: "",
      //     scplatMode: "",
      //     applyCompanyId: "",
      //     projectStatus: "",
      //     projectState: "",
      //     ownerDeptId: null,
      //     hasMyWork: 0,
      //     pageNum: 1,
      //     pageSize: 10,
      //   };
      //   const { projectPhase } = this.$route.params;
      //   if (projectPhase != undefined) {
      //     this.listReq.projectPhase = projectPhase;
      //   }
      // }
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
     * 复选框操作
     * @param {*} e 选中的行
     */
    selecData(e) {
      console.log(e);
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
        path: `/viewProcess/${data.projectPhase == 10 ? 2 : 5}/${data.id}/${
          data.projectPhase
        }/${data.mainEditorId}`,
      });
    },
    /**
     * 查看详情
     * @param {*} data 要查看的流程的详细信息
     */
    checkProDetail(data) {
      // this.pageType = 2;
      // this.projectId = data.id;
      this.$router.push({
        path: `/work/externalStdRevise/viewProject/${data.id}/${data.projectPhase}`,
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
      this.pageType = 1;
      this.infoPublishId = e;
      this.projectId = null;
    },
    /**
     * 编辑立项
     */
    editStdPro(e) {
      this.pageType = 1;
      this.infoPublishId = e.infoPublishId;
      this.projectId = e.id;
    },
    /**
     * 导出立项申请汇总表
     * @param {*} e 1:模板，0：实际数据表
     */
    exportFile(e) {
      // this.exportDialog.visible = true;
      // this.ownerDeptId = null;

      if (this.listReq.ownerDeptId == null || this.listReq.ownerDeptId == "") {
        this.$message.warning("请选择归口单位");
        return;
      } else if (this.list.length == 0) {
        this.$message.warning("该归口单位暂无数据");
        return;
      }
      this.$confirm(
        `确定导出${this.selectDictLabel(
          this.dict.type.technical_committees,
          this.listReq.ownerDeptId
        )}标准立项申请汇总吗？`,
        "导出标准立项申请汇总",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          this.exportReq.ownerDeptId = this.listReq.ownerDeptId;
          this.exportReq.projectState = this.listReq.projectState;
          this.exportReq.isTemplate = e;
          this.XHRDownloadFile(
            "post",
            "/scplat/projectApproval/exportSummaryFile",
            this.exportReq,
            null
          );
        })
        .catch(() => {});
    },
    closeExport(e) {
      if (e == true) {
        if (this.ownerDeptId == null) {
          this.$message.warning("请选择归口单位");
          return;
        }
        this.exportReq.ownerDeptId = this.ownerDeptId;
        this.exportReq.projectState = this.listReq.projectState;

        this.downloadByPost(
          "/scplat/projectApproval/exportSummaryFile",
          this.exportReq,
          `${new Date().getFullYear()}年度标准立项申请汇总表.xls`
        );
        this.exportDialog.visible = false;
        this.ownerDeptId = null;
      } else {
        this.exportDialog.visible = false;
        this.ownerDeptId = null;
      }
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
            "/scplat/projectApproval/exportPlanSummaryFile/2",
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
            req,
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
     * 分发项目
     */
    ffPro(data) {
      this.receiverProjectDialog.visible = true;
      this.receiverForm = {
        id: data.id,
        interfacePersonIds: "",
      };
    },
    /**
     * 确定/取消分发项目
     */
    closeNotice(e) {
      if (e == true) {
        if (
          this.receiverForm.interfacePersonIds == "" ||
          this.receiverForm.interfacePersonIds == null
        ) {
          this.$message.warning("请选择标准化对接人");
        } else {
          this.receiverProjectDialog.loadding = true;
          Api.distributeProject(this.receiverForm).then((res) => {
            const { code, msg } = res;
            this.receiverProjectDialog.loadding = false;
            if (code === 200) {
              this.receiverProjectDialog.visible = false;
              this.$message.success("项目已分发");
              this.listReq.projectState = null;
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        }
      } else {
        this.receiverProjectDialog.visible = false;
        this.receiverForm = {
          id: "",
          interfacePersonIds: "",
        };
      }
    },
    /**
     * 选择分发项目接收人
     */
    userChange(e) {
      this.receiverForm.interfacePersonIds = e.join(",");
    },
    /**
     * 分发至第一起草人
     */
    mainEditor(data) {
      this.mainEditorForm.id = data.id;
      this.checkMainEditor.visible = true;
    },
    /**
     * 选择第一起草人
     */
    mainEditorChange(e) {
      this.mainEditorForm.mainEditDeptId = null;
      this.mainEditorForm.mainEditorId = null;
      this.mainEditorForm.mainEditCompany = null;
      if (e != null) {
        this.mainEditorForm.mainEditDeptId = e.deptId;
        this.mainEditorForm.mainEditorId = e.userId;
        this.mainEditorForm.mainEditCompany = null;
      }
    },
    /**
     * 确定/取消设置第一起草人
     */
    saveMainEditor(e) {
      if (e == true) {
        if (this.mainEditorForm.mainEditorId == null) {
          this.$message.warning("请选择第一起草人");
          return;
        }
        Api.distributeMainEdit(this.mainEditorForm).then((res) => {
          const { code, msg } = res;
          this.receiverProjectDialog.loadding = false;
          if (code === 200) {
            this.$message.success("操作成功");
            this.pageChange(1);
            this.checkMainEditor.visible = false;
            this.mainEditorForm.id = {
              id: null,
              mainEditDeptId: null,
              mainEditorId: null,
              mainEditCompany: null,
            };
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        this.checkMainEditor.visible = false;
        this.mainEditorForm.id = {
          id: null,
          mainEditDeptId: null,
          mainEditorId: null,
          mainEditCompany: null,
        };
      }
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
                this.dict.type.outer_revision_process_phase,
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