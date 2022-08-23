<template>
  <div class="project-detail">
    <!-- 头部选项Radio -->
    <BztRadioCard
      :data="{
        list: tabList,
        fieldReName: { label: 'label', value: 'value' },
      }"
      @change="chengeTab"
      :checkedId="tabId"
    />
    <div class="steps" v-if="applayProForm != null">
      <!-- <StdInfo
        v-if="tabId == 0"
        :isEdit="isEdit"
        ref="info"
        :key="stdInfoTimer"
        :formValue="applayProForm"
      /> -->
      <div class="view-doc" :style="docVisibleStyle">
        <ViewDoc
          :style="docVisibleStyle"
          v-if="applayProForm.docId != null"
          ref="viewDoc"
          :docId="applayProForm.docId"
          :projectData="applayProForm"
        />
      </div>

      <SpecialProInfo
        v-if="tabId == 1 && applayProForm.projectStatus == 7"
        :isEdit="isEdit"
        ref="info"
        :key="stdInfoTimer"
        :formValue="applayProForm"
      />
      <ProInfo
        v-if="tabId == 1 && applayProForm.projectStatus != 7"
        :isEdit="isEdit"
        ref="info"
        :formValue="applayProForm"
        @updateProName="updateName"
      />
      <Predesc
        v-if="tabId == 2"
        :isEdit="isEdit"
        ref="preDesc"
        :formValue="applayProForm"
        @updateDetail="updateDetail"
      />
      <SchedulePlan
        v-if="tabId == 3"
        :isEdit="isEdit"
        ref="schedulePlan"
        :projectId="businessProId"
        :formValue="applayProForm"
        @process-to-next="toNext"
        @updateDetail="updatePlan"
      />
      <ProcessFiles
        v-if="tabId == 4"
        :projectId="businessProId"
        :formValue="applayProForm"
      />
      <OpinionList v-if="tabId == 5" :projectData="applayProForm" />
      <OpinionFinishDetail v-if="tabId == 6" :projectData="applayProForm" />
      <ProcessSignInfo
        v-if="tabId == 7"
        :countersign="applayProForm.countersign"
        :countersignSort="applayProForm.countersignSort"
      />
    </div>

    <!-- <div
      class="operation-line footer"
      v-if="tabId != 0 && applayProForm.projectStatus == 5"
    >
      <el-button
        class="red-btn"
        @click="checkRejectReason()"
        :loading="btnLoadding"
        >查看驳回/终止理由</el-button
      >
    </div> -->
    <div class="operation-line footer">
      <!-- 起草阶段 -->
      <template>
        <!-- <template
          v-if="
            (applayProForm.hasAuth == true &&
              applayProForm.projectState == 1102) ||
            (showEdit() && applayProForm.hasAuth == true)
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled"> 编写大纲 </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDG()"
            v-else
          >
            编写大纲
          </el-button>
        </template> -->
        <template
          v-if="
            (applayProForm.hasAuth == true &&
              applayProForm.projectState == 1102) ||
            (showEdit() && applayProForm.hasAuth == true)
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.projectState != 1102 &&
              applayProForm.notExpire != true
            "
          >
            <el-button class="submit-btn is-disabled">修改草案</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="applayProForm.projectState != 1102"
            @click="editDraft()"
            >修改草案</el-button
          >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.applyUser == userInfo.userId &&
              applayProForm.projectState == 1102 &&
              applayProForm.notExpire != true
            "
          >
            <el-button class="submit-btn is-disabled">编辑大纲</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="
              applayProForm.applyUser == userInfo.userId &&
              applayProForm.projectState == 1102
            "
            @click="openEditOutline()"
            >编辑大纲</el-button
          >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.notExpire != true &&
              applayProForm.projectState == 1102
            "
          >
            <el-button class="submit-btn is-disabled">协同编纂</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="applayProForm.projectState == 1102"
            @click="openCollaborativeEdit()"
            >协同编纂</el-button
          >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.applyUser == userInfo.userId &&
              applayProForm.projectState == 1102 &&
              applayProForm.notExpire != true
            "
          >
            <el-button class="submit-btn is-disabled">合并文档</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="
              applayProForm.applyUser == userInfo.userId &&
              applayProForm.projectState == 1102
            "
            @click="openMergeDoc()"
            >合并文档</el-button
          >
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1102 &&
            applayProForm.projectPhase == 20
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled">
              <!-- 保存草案  -->
              生成征求意见稿
            </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else
            @click="saveFile('征求意见稿')"
          >
            <!-- 保存草案 -->
            生成征求意见稿
          </el-button>
        </template>
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1104 &&
            applayProForm.projectPhase == 20
          "
        >
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
            >修改草案
          </el-button>
          <el-button
            class="submit-btn"
            @click="todoExamine(true, '审核征求意见稿')"
            :loading="btnLoadding"
          >
            <!-- 审核草案稿 -->
            <!-- 标准化审核 -->
            审核征求意见稿
          </el-button>
        </template>
      </template>
      <!-- 标准征求意见阶段 -->
      <template v-if="applayProForm.projectPhase == 30">
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1106
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled">结束征求意见</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            @click="saveZQYJ(true)"
            :loading="btnLoadding"
            v-else
            >结束征求意见</el-button
          >
        </template>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1107 &&
            applayProForm.projectStatus != 5
          "
          :loading="btnLoadding"
          @click="editDraft(true)"
        >
          意见处理
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1107
          "
          :loading="btnLoadding"
          @click="saveFile('送审稿')"
        >
          <!-- 保存标准 -->
          生成送审稿
        </el-button>
      </template>
      <!-- 标准审查阶段 -->
      <template v-if="applayProForm.projectPhase == 40">
        <template  v-if="applayProForm.notExpire == true &&applayProForm.hasAuth == true &&applayProForm.projectState == 1108">
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
          >
          修改草案
        </el-button>
            <el-button
              class="submit-btn"
              @click="todoExamine(true, '审核送审稿')"
             
              :loading="btnLoadding"
            >
              审核送审稿
            </el-button>
        </template>
        <!-- <el-button
          class="submit-btn"
          @click="todoExamine(true, '审核送审稿')"
          v-if="
            applayProForm.notExpire == true &&
            applayProForm.hasAuth == true &&
            applayProForm.projectState == 1108
          "
          :loading="btnLoadding"
        >
          审核送审稿
        </el-button> -->
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1109
          "
          :loading="btnLoadding"
          @click="needToExamine(true)"
        >
          <!-- 标准化主管审核 -->
          第一起草人审核
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1110
          "
          :loading="btnLoadding"
          @click="uploadLogFiles(true)"
        >
          上传审查会会议纪要
        </el-button>
        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1111 &&
            applayProForm.projectStatus != 5
          "
          :loading="btnLoadding"
          @click="editDG()"
        >
          编写大纲
        </el-button> -->
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1111 &&
            applayProForm.projectStatus != 5 
          "
          :loading="btnLoadding"
          @click="editDraft()"
        >
          修改草案
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1111
          "
          :loading="btnLoadding"
          @click="saveFile('报批稿')"
        >
          <!-- 保存标准 -->
          生成报批稿
        </el-button>
        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true && applayProForm.projectState == 1111
          "
          :loading="btnLoadding"
          @click="saveFile(true)"
        >
          保存标准
        </el-button> -->
      </template>
      <!-- 标准审批阶段 -->
      <template v-if="applayProForm.projectPhase == 50">
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1112
          "
          :loading="btnLoadding"
          @click="editDraft()"
        >
          修改草案
        </el-button>
          <!-- @click="todoExamine(true, '审核报批稿', 1)" -->
        <el-button
          class="submit-btn"
          @click="todoExamine(true, '审核报批稿')"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1112
          "
          :loading="btnLoadding"
        >
          <!-- 标准化审核 -->
          审核报批稿
        </el-button>
        <!--  -->
        <!-- applayProForm.hasAuth == true &&
            applayProForm.notExpire == true && -->
        <template v-if="applayProForm.projectState == 1113">
          <el-button
            class="submit-btn"
            v-if="isSign(applayProForm)"
            @click="toSignAction(true)"
            :loading="btnLoadding"
          >
            
            标准会签
          </el-button>
          <el-button
            class="submit-btn"
            v-if="isCheckUser(applayProForm)"
            @click="choiceReviewedAction(true)"
            :loading="btnLoadding"
          >
            选择审定/批准人
          </el-button>
        </template>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1119
          "
          @click="todoExamine(true,'审核人审核',2)"
          :loading="btnLoadding"
        >
          审核人审核
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1114
          "
          @click="todoDepExamine('部门领导审定', true)"
          :loading="btnLoadding"
        >
          部门领导审定
        </el-button>
      </template>
      <!-- 标准批准阶段 -->
      <template v-if="applayProForm.projectPhase == 60">
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1115
          "
          @click="todoDepExamine('公司级领导批准', true)"
          :loading="btnLoadding"
        >
          公司级领导批准
        </el-button>
      </template>
      <!-- 标准发布阶段 -->
      <template v-if="applayProForm.projectPhase == 70&& applayProForm.hasAuth == true && applayProForm.notExpire == true && applayProForm.projectState != 1118">
        <el-button
          class="submit-btn"
          :loading="btnLoadding"
          @click="editDraft()"
          >修改草案
        </el-button>
        <el-button
          class="submit-btn"
          @click="publishStd(true)"
          :loading="btnLoadding"
        >
          <!-- @click="publishStd(true)" -->
          标准发布
        </el-button>
      </template>

      <!-- 特殊立项审核 -->
      <template
        v-if="
          applayProForm.projectPhase == 10 &&
          applayProForm.projectStatus == 7 &&
          hook != ''
        "
      >
        <el-button
          class="submit-btn"
          @click="aduitSpecialProject(true)"
          :loading="btnLoadding"
          >特殊立项审核</el-button
        >
      </template>
      <el-button
        v-if="applayProForm.projectStatus == 5"
        class="red-btn"
        @click="checkRejectReason()"
        >查看驳回/终止理由</el-button
      >
    </div>

    <!-- 审核（起草阶段） -->
    <ToExamine
      v-if="exaVisible == true"
      :visiable="exaVisible"
      :title="exaTilte"
      :businessObjId="businessProId"
      :type="exaType"
      :toSign="toSign"
      @save="todoExamine(null, '')"
    />

    <!-- 第一起草人部门分管领导批准/公司分管领导批准 -->
    <ToDepExamine
      :visiable="exaDepVisible"
      :title="exaDeptTilte"
      :businessObjId="businessProId"
      :isNewType="newType"
      @save="todoDepExamine(null)"
    />

    <!-- 上传审查会会议纪要 -->
    <UploadLogFile
      :visiable="logFileVisible"
      :businessObjId="businessProId"
      :title="title"
      @save="uploadLogFiles(false)"
    />

    <!-- 第一起草人(标准化主管)审核 -->
    <NeedToExamine 
      v-if="needToExamineVisible"
      :visiable="needToExamineVisible"
      :businessObjId="businessProId"
      @save="needToExamine(null)"
    />

    <!-- 标准发布 -->
    <StdRelease
      v-if="stdReleaseVisible == true"
      :visiable="stdReleaseVisible"
      :businessObjId="applayProForm.id"
      :businessObjName="applayProForm.projectName"
      @save="publishStds"
    />

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      :visiable="rejectReasonVisible"
      :processInfo="applayProForm"
      :title="`查看【${applayProForm.projectName}】驳回终止原因`"
      @close="checkRejectReason()"
    />

    <!-- 编辑草案/大纲 -->
    <!-- <EditorDialog
      :visiable="editorVisiable"
      :title="editorTiltle"
      :pathUrl="editorUrl"
      @close="updateDoc"
    /> -->

    <!-- 特殊流程审核 -->
    <AduitSpecialPro
      :visiable="aduitSpecialVisible"
      :hook="hook"
      :businessObjId="businessProId"
      @save="aduitSpecialProject(null)"
    />

    <!-- 编辑大纲 -->
    <SamEditorDialog
      v-if="editorVisiable"
      :visiable="editorVisiable"
      :title="editorTiltle"
      :data="docData"
      :projectData="applayProForm"
      @close="updateDoc"
    />

    <!-- 编辑大纲 -->
    <EditOutlineDialog
      v-if="editOutline.visible"
      :visiable="editOutline.visible"
      :title="editOutline.title"
      :docId="applayProForm.docId"
      :memberList="memberList"
      :mainEditorId="{
        userId: applayProForm.applyUser,
        userName: getUserName(`${applayProForm.applyUser} `),
      }"
      @close="closeEditOutline"
    />

    <!-- 多人协同 -->
    <CollaborativeEditDialog
      v-if="collaborativeEdit.visible"
      :visiable="collaborativeEdit.visible"
      :title="collaborativeEdit.title"
      :docId="applayProForm.docId"
      :memberList="collMemberList"
      @close="closeCollaborativeEdit"
    />

    <!-- 合并文档 -->
    <MergeDocDialog
      v-if="mergeDoc.visible"
      :visiable="mergeDoc.visible"
      :title="mergeDoc.title"
      :docId="applayProForm.docId"
      :memberList="collMemberList"
      @close="closeMergeDoc"
    />

    <!-- 选择审核人 -->
    <ChoiceReviewed
      v-if="choiceReviewedVisible == true"
      :visiable="choiceReviewedVisible"
      :businessObjId="applayProForm.id"
      :businessObjName="applayProForm.projectName"
      @save="choiceRevieweSave"
    />
  </div>
</template>
<script>
import {
  BztRadioCard,
  EditorDialog,
  SamEditorDialog,
} from "@components/basicCom/index.js";
import EditOutlineDialog from "@components/bussinessCom/editor/editOutlineDialog";
import CollaborativeEditDialog from "@components/bussinessCom/editor/collaborativeEditDialog";
import MergeDocDialog from "@components/bussinessCom/editor/mergeDocDialog";
import { mapGetters } from "vuex";
import DataModel from "@utils/data-model";
import {
  ProInfo,
  Predesc,
  SchedulePlan,
  ProcessFiles,
  StdInfo,
  ProcessRejectReason,
  SpecialProInfo,
  OpinionList,
  OpinionFinishDetail,
  ProcessSignInfo,
} from "@components/bussinessCom/index";
import ToExamine from "./handle/toExamine.vue";
import ToDepExamine from "./handle/toDepExamine.vue";
import UploadLogFile from "./handle/uploadLogFile.vue";
import NeedToExamine from "./handle/needToExamine.vue";
import Api from "@api/process";
import StdRelease from "./handle/stdRelease.vue";
// import { updateByBusiness } from "@/api/editor.js";
import AduitSpecialPro from "./handle/aduitSpecialPro.vue";
import ViewDoc from "@/components/bussinessCom/editor/viewDoc";
import ChoiceReviewed from "./handle/choiceReviewed.vue";
const tabList = [
  {
    label: "项目信息",
    value: 1,
  },
  {
    label: "编制说明",
    value: 2,
  },
  {
    label: "标准编制进度计划",
    value: 3,
  },
  {
    label: "过程文档",
    value: 4,
  },
];

export default {
  computed: {
    ...mapGetters(["userInfo"]),
    collMemberList() {
      let user = [
        _.find(this.$cache.session.getJSON("sourceUserList"), {
          userId: Number(this.userInfo.userId),
        }),
      ];
      //去重
      let flag = this.memberList.some(item=>item.userId == user[0].userId )
      if(flag==true){
        return this.memberList
      }else{
        return this.memberList.concat(user);
      }
      // 之前
      return this.memberList.concat(user);
    },
    docVisibleStyle() {
      if (this.tabId == 0) {
        return {};
      } else {
        return {
          visibility: "hidden",
          position: "absolute",
        };
      }
    },
  },
  components: {
    ProInfo,
    BztRadioCard,
    Predesc,
    SchedulePlan,
    ProcessFiles,
    StdInfo,
    ToExamine,
    ToDepExamine,
    UploadLogFile,
    NeedToExamine,
    StdRelease,
    ProcessRejectReason,
    EditorDialog,
    SpecialProInfo,
    AduitSpecialPro,
    ViewDoc,
    SamEditorDialog,
    OpinionList,
    OpinionFinishDetail,
    EditOutlineDialog,
    CollaborativeEditDialog,
    MergeDocDialog,
    ProcessSignInfo,
    ChoiceReviewed,
  },
  name: "project-detail",
  props: ["hasIds", "projectId", "proInfo"],
  data() {
    return {
      newType:false,
      toSign: false,
      businessProId: null,
      tabList: this.deepClone(tabList),
      tabId: 1,
      applayProForm: this.deepClone(DataModel.applyPorjectForm),
      isEdit: false,
      projectPhase: null,
      exaVisible: false, // 标准审核
      exaType: 0, // 0：审核，1：会签
      exaTilte: "",
      exaDeptTilte: "",
      toDepExamine: false, // 分管领导审批
      logFileVisible: false, // 上传审查会会议纪要
      exaDepVisible: false,
      needToExamineVisible: false, // 标准化主管审核
      stdReleaseVisible: false, // 标准发布
      stdReleaseLoadding: false,
      rejectReasonVisible: false, // 查看驳回原因
      choiceReviewedVisible: false, //选择审核人

      editorVisiable: false, // 编辑草案
      editorTiltle: "编辑大纲",
      editorUrl: "",
      btnLoadding: false,
      stdInfoTimer: "",
      hook: "",
      aduitSpecialVisible: false,
      // 编辑器参数
      docData: {
        docId: null,
        author: null,
        stdNo: null,
        stdName: null,
        opinionProcessed: false,
      },
      docUrl: "",
      editOutline: {
        visible: false,
        title: "编辑大纲",
      },
      collaborativeEdit: {
        visible: false,
        title: "多人协同编纂",
      },
      mergeDoc: {
        visible: false,
        title: "合并文档",
      },
      memberList: [],
      mainEditorId: null,
      title:''
    };
  },
  mounted() {
    const { id, projectPhase, hook } = this.$route.params;
    if (hook != undefined) {
      this.hook = hook;
    }
    if (id != undefined) {
      this.businessProId = id;
    } else {
      this.businessProId = this.projectId;
    }
    this.projectPhase = projectPhase;
    if (this.proInfo || this.proInfo != null) {
      this.businessProId = this.proInfo.id;
      this.projectPhase = this.proInfo.projectPhase;
    }
    this.getProjectDetail();

  },
  methods: {
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(user ? `${user.nickName}` : `-`);
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 编辑时获取项目详情
     */
    async getProjectDetail() {
      this.tabList = this.deepClone(tabList);
      if (this.projectPhase == 10) {
        this.tabId = 1;
      } else {
        this.tabId = 0;
        const tabItem = {
          label: "标准内容",
          value: 0,
        };
        if (
          JSON.stringify(this.tabList).indexOf(JSON.stringify(tabItem)) == -1
        ) {
          this.tabList.unshift(tabItem);
        }
      }
      let loadingInstance = this.Loading.service({ fullscreen: true });
      this.btnLoadding = false;
      if (this.projectPhase == "10") {
        Api.getProjectApprovalDetail(this.businessProId).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.applayProForm = data;
            this.applayProForm["isChange"] = !this.applayProForm["isChange"];
            this.btnLoadding = false;
          } else {
            // this.$message.error(msg);
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
      } else {
        Api.getScpProjectApprovalWithScplat(this.businessProId).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.applayProForm = data;
            this.projectPhase = data.projectPhase;
            console.log(this.applayProForm,999)
            this.applayProForm["isChange"] = !this.applayProForm["isChange"];
            if (this.applayProForm.projectState == 1106) {
              const tab1 = {
                label: "征求意见列表",
                value: 5,
              };
              const tab2 = {
                label: "征求意见情况",
                value: 6,
              };
              this.tabList.splice(1, 0, tab2);
              this.tabList.splice(1, 0, tab1);
            }
            if (
              this.applayProForm.projectState == 1113 &&
              this.userInfo.userId == this.applayProForm.applyUser
            ) {
              const tab1 = {
                label: "会签情况",
                value: 7,
              };
              this.tabList.splice(1, 0, tab1);
            }
            if(this.applayProForm.notExpire == true &&this.applayProForm.hasAuth == true &&this.applayProForm.projectState == 1108){
              const tab1 = {
                label: "征求意见列表",
                value: 5,
              };
              this.tabList.splice(1, 0, tab1);
            }
            this.btnLoadding = false;
          } else {
            // this.$message.error(msg);
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
      }
    },
    /**
     * 切换
     */
    chengeTab(e) {
      this.tabId = e;
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
     * (标准立项-填报项目进度)流程流转下一步
     */
    toNext() {
      if (this.btnLoadding == false) {
        this.btnLoadding = true;
        Api.reportProjectProgress(this.businessProId).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.$message.success("流程已流转");
            // this.$router.push("/work/enterpriseStdRevise/10/null");
            history.go("-1");
            this.getProjectDetail();
          } else {
            // this.$message.error(msg);/
          }
        });
      }
    },
    /**
     * 判断操作按钮权限
     */
    hasUserId(ids) {
      let has = false;
      if (ids != "" && ids != null) {
        ids.split(",").forEach((item) => {
          if (item == this.userInfo.userId) {
            has = true;
          }
        });
      }
      return has;
    },
    /**
     * 编写大纲  -- 打开编辑器
     */
    editDG() {
      this.editorTiltle = "编辑大纲";
      this.editorUrl = encodeURI(
        `${process.env.VUE_APP_EDITOR_URL}outline?t=${Date.now()}&setOwner=${
          this.applayProForm.applyUser == this.userInfo.userId
        }&hideTemplate=true&businessId=${
          this.applayProForm.id
        }&businessCategory=4&readOnly=false&coverVisible=true&stdNo=00&&stdName=00&userId=${
          this.userInfo.userId
        }&userName=${this.userInfo.nickName}`
      );
      this.editorVisiable = true;
    },
    /**
     * 编写草案  -- 打开编辑器
     */
    editDraft(opinionProcessed = false) {
      this.editorTiltle = "编辑草案";
      this.docData.stdNo = this.applayProForm.newStdNo
        ? this.applayProForm.newStdNo
        : "Q/PC XXXX-20XX";
      this.docData.stdName = this.applayProForm.projectName;
      this.docData.docId = this.applayProForm.docId;
      this.docData.author = this.userInfo.nickName;
      // 是否启用意见处理插槽
      this.docData.opinionProcessed = opinionProcessed;
      console.info("this.docData=>", this.docData);
      this.editorVisiable = true;
    },
    /**
     * 关闭编辑器
     */
    updateDoc(e) {
      this.getProjectDetail();
      this.stdInfoTimer = new Date().getTime();
      this.applayProForm["isChange"] = !this.applayProForm["isChange"];
      this.editorTiltle = "";
      this.editorUrl = "";
      this.editorVisiable = false;

      // 重新加载文档
      this.$refs.viewDoc.loadDocData();
    },
    /**
     * 第一起草人形成草案稿/送审稿/报批稿
     */
    async saveFile(title) {
      if (this.btnLoadding == false) {
        this.btnLoadding = true;
        // const getConfigByKeyReq = {
        //   businessCategory: 4,
        //   businessId: this.applayProForm.id,
        //   stdName: this.applayProForm.projectName,
        //   standardEdition: `${title}V${
        //     this.applayProForm.dataVersion
        //   }_${this.parseTime(new Date(), "{y}-{m}-{d}")}`,
        // };
        // updateByBusiness(getConfigByKeyReq).then((res) => {
        //   const { code, msg } = res;
        //   if (code != 200) {
        //     console.log(msg);
        //   } else {
        const doc = await this.$refs.viewDoc.exportDoc();
        const req = {
          businessId: Number(this.businessProId),
          url: doc,
        };
        Api.enFfinishedDraft(req).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("已保存");
            this.btnLoadding = false;

            this.getProjectDetail();
          } else {
            // this.$message.error(msg);
          }
        });
        //   }
        // });
      }
    },
    /**
     * 审核 (起草阶段标准审核,标准审查阶段)
     */
    todoExamine(flag, title, toSign = 0) {
      if (flag == true) {
        this.exaType = toSign==2?toSign:0;
        this.exaTilte = title;
        this.toSign = toSign == 1;
        this.exaVisible = true;
      } else {
        this.exaVisible = false;
        this.getProjectDetail();
        // this.$router.go(-1);
      }
    },
    /**
     * 会签 （标准审批阶段）
     */
    toSignAction(flag) {
      if (flag == true) {
        this.exaType = 1;
        this.exaTilte = "标准会签";
        this.exaVisible = true;
      } else {
        this.exaType = 1;
        this.exaVisible = false;

        this.getProjectDetail();
        // this.$router.go(-1);
      }
    },
    /**
     * 分管领导审批
     */
    todoDepExamine(title, flag) {
      this.exaDeptTilte = title ?? "";
      if (flag == true) {
        this.exaDepVisible = true;
      } else {
        this.exaDepVisible = false;
      }
      if (this.exaDepVisible == false) {
        this.getProjectDetail();
        // this.$router.go(-1);
      }
      
    },
    /**
     * 上传审查会会议纪要
     */
    uploadLogFiles(flag) {
      if (flag == true) {
        this.title = "上传审查会会议纪要"
        this.logFileVisible = true;
      } else {
        this.logFileVisible = false;
        this.getProjectDetail();
      }
    },
    /**
     * 标准化主管审核
     */
    needToExamine(flag) {
      if (flag == true) {
        this.needToExamineVisible = flag;
      }
      if (flag == null) {
        this.needToExamineVisible = false;
        this.getProjectDetail();
        // this.$router.go(-1);
      }
    },
    choiceReviewedAction() {
      this.choiceReviewedVisible = true;
    },
    /**
     * 选择审核人
     */
    choiceRevieweSave(e) {
      if (e == null) {
        this.getProjectDetail();
      }
      this.choiceReviewedVisible = false;
    },
    /**
     * 发布标准(弹框操作)
     */
    publishStd(flag) {
      if (flag == true) {
        this.stdReleaseVisible = true;
        this.stdReleaseLoadding = false;
      } else {
        this.stdReleaseVisible = false;
        this.getProjectDetail();
        // this.$router.go(-1);
      }
    },
    publishStds(d) {
      if (d != null) {
        this.stdReleaseLoadding = true;
        let req = JSON.parse(JSON.stringify(d));
        req["stdSign"] = d.stdNo.split(" ")[0];
        req["stdNo"] = d.stdNo.split(" ")[0];
        Api.updateStdCover(req).then(async (r) => {
          // 重新加载文档
          await this.$refs.viewDoc.loadDocData();
          d["fileUrl"] = await this.$refs.viewDoc.exportDoc();
          Api.stdPublish(d).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success("标准已发布");
              this.stdReleaseVisible = false;
              this.getProjectDetail();
              this.stdReleaseLoadding = false;
            }
          });
        });
      } else {
        this.stdReleaseVisible = false;
        this.getProjectDetail();
      }
    },
    /**
     * 提交征求意见
     */
    saveZQYJ() {
      if (this.btnLoadding == false) {
        this.btnLoadding = true;
        this.$confirm(
          `确定要结束吗？提交后其他人员将不能再填写征求意见，请谨慎操作！？`,
          "结束征求意见",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          }
        )
          .then(() => {
            const req = {
              id: this.businessProId,
              forAdvice: "",
            };
            Api.forAdvice(req).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("操作成功");
                this.getProjectDetail();
                // this.$router.go(-1);
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {
            this.btnLoadding = false;
          });
      }
    },
    /**
     * 查看驳回终止
     */
    checkRejectReason() {
      this.rejectReasonVisible = !this.rejectReasonVisible;
    },
    showEdit() {
      let show = false;
      let states = [1107, 1103, 1111];
      if (
        this.applayProForm.projectStatus == 5 &&
        states.indexOf(this.applayProForm.projectState) > -1
      ) {
        show = true;
      }
      return show;
    },
    /**
     * 编辑项目名称
     */
    updateName(data) {
      const req = {
        id: data.id,
        projectName: data.projectName,
      };
      Api.editProject(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          // const getConfigByKeyReq = {
          //   businessCategory: data.projectType,
          //   businessId: data.id,
          //   stdName: data.projectName,
          // };
          // updateByBusiness(getConfigByKeyReq).then((res) => {
          //   const { code, msg } = res;
          //   if (code != 200) {
          //     console.log(msg);
          //   } else {
          //     this.$message.success("修改成功");
          this.getProjectDetail();
          //   }
          // });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 编辑编制说明
     */
    updateDetail(data) {
      const req = {
        id:
          data.projectPhase == "10" ||
          data.projectPhase == "" ||
          data.projectPhase == null
            ? this.projectId
            : data.foundationProjectId,
        scpStdComment: data.scpStdComment,
      };
      Api.updateProjectApproval(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.$message.success("修改成功");
          this.getProjectDetail();
        } else {
          // this.$message.error(msg);
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
            ? this.projectId
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
          this.$message.success("修改成功");
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 特殊立项流程审核
     */
    aduitSpecialProject(flag) {
      if (flag == true) {
        this.aduitSpecialVisible = true;
      } else {
        this.aduitSpecialVisible = false;
      }
      if (this.aduitSpecialVisible == false) {
        this.getProjectDetail();
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push("/maintenance/task");
      }
    },
    getMemberList() {
      if (!_.isEmpty(this.applayProForm.participantEditorIds)) {
        // this.applayProForm.participantEditorIds +=
        //   "," + this.applayProForm.applyUser;
        let userIds = this.applayProForm.participantEditorIds.split(",");
        this.memberList = userIds.map((i) => {
          return _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: Number(i),
          });
        });
      } else {
        this.memberList = [
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          }),
        ];
      }
    },
    openEditOutline() {
      this.getMemberList();

      this.editOutline.visible = true;
    },
    /**
     * 关闭更新大纲/文档窗口
     */
    closeEditOutline(e) {
      this.editOutline.visible = false;
      this.getProjectDetail();
      // 重新加载文档
      this.$refs.viewDoc.loadDocData();
    },
    openCollaborativeEdit() {
      this.getMemberList();

      this.collaborativeEdit.visible = true;
    },
    /**
     * 关闭窗口
     */
    closeCollaborativeEdit(e) {
      this.collaborativeEdit.visible = false;
      this.getProjectDetail();
      // 重新加载文档
      this.$refs.viewDoc.loadDocData();
    },
    openMergeDoc() {
      this.getMemberList();

      this.mergeDoc.visible = true;
    },
    /**
     * 关闭窗口
     */
    closeMergeDoc(e) {
      this.mergeDoc.visible = false;
      this.getProjectDetail();
      // 重新加载文档
      this.$refs.viewDoc.loadDocData();
    },
  },
};
</script>
<style lang="scss" scoped>
.project-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  // overflow: auto;
  .bzt-radio-card {
    position: fixed;
    height: 60px;
    margin-top: -30px;
    padding-top: 27px;
    background: #ffffff;
    z-index: 1;
    box-shadow: $bule 1px 4px 10px -10px;
    z-index: 2;
  }
  .steps {
    padding-top: 10px;
    .view-doc {
      height: calc(100vh - 200px);
      margin-top: 20px;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    // height: 60px;
    width: calc(100vw - 230px);
    display: flex;
    flex-direction: row;
    justify-content: center !important;
    // position: absolute;
    align-items: center;
    background: #ffffff;
    box-shadow: $bule 1px 0px 15px -8px;
    z-index: 2;
    .el-button {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}
</style>
