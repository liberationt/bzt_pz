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
      <!-- v-if="
          applayProForm.projectState != 1202 &&
          applayProForm.projectState != 1203
        " -->
      <div
        class="view-doc"
        :style="docVisibleStyle"
      >
        <ViewDoc
          :style="docVisibleStyle"
          v-if="applayProForm.docId != null"
          ref="viewDoc"
          :docId="applayProForm.docId"
          :projectData="applayProForm"
        />
      </div>
      <ExProInfo
        v-if="tabId == 1"
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
      <ProcessFiles
        v-if="tabId == 3"
        :projectId="businessProId"
        :formValue="applayProForm"
      />
      <OpinionList v-if="tabId == 5" :projectData="applayProForm" />
      <OpinionFinishDetail v-if="tabId == 6" :projectData="applayProForm" />
    </div>

    <!-- <div class="operation-line footer" v-if="applayProForm.projectStatus == 5">
      <el-button
        type="button"
        class="red-btn"
        @click="checkRejectReason(true)"
        :loading="btnLoadding"
      >
        查看驳回终止理由
      </el-button>
    </div> -->
    <div class="operation-line footer">
      <!-- 起草阶段 -->
      <template>
        <!-- <template
          v-if="
            (applayProForm.hasAuth == true &&
              applayProForm.projectState == 1204) ||
            (showEdit() && applayProForm.mainEditorId == userInfo.userId)
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
            @click="editDG()"
            :loading="btnLoadding"
            v-else
          >
            编写大纲
          </el-button>
        </template> -->

        <!-- 原来显示 -->
        <!-- <template
          v-if="
            (applayProForm.hasAuth == true &&
              applayProForm.projectState == 1204) ||
            (showEdit() && applayProForm.mainEditorId == userInfo.userId)
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled"> 编写草案 </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else
            @click="editDraft()"
          >
            编写草案
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.notExpire != true &&
              applayProForm.projectState == 1204
            "
          >
            <el-button class="submit-btn is-disabled">协同编纂</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="applayProForm.projectState == 1204"
            @click="openCollaborativeEdit()"
            >协同编纂</el-button
          >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.mainEditorId == userInfo.userId &&
              applayProForm.projectState == 1204 &&
              applayProForm.notExpire != true
            "
          >
            <el-button class="submit-btn is-disabled">合并文档</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="
              applayProForm.mainEditorId == userInfo.userId &&
              applayProForm.projectState == 1204
            "
            @click="openMergeDoc()"
            >合并文档</el-button
          >
        </template> -->
        <template
          v-if="
            (applayProForm.hasAuth == true &&
              applayProForm.projectState == 1203) ||
            (showEdit() && applayProForm.mainEditorId == userInfo.userId)
          "
        >
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled"> 编写草案 </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else
            @click="editDraft()"
          >
            编写草案
          </el-button> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="
              applayProForm.projectState != 1203 &&
              applayProForm.notExpire != true
            "
          >
            <el-button class="submit-btn is-disabled">修改草案 </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="applayProForm.projectState != 1203"
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
              applayProForm.projectState == 1203 &&
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
              applayProForm.projectState == 1203
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
              applayProForm.projectState == 1203
            "
          >
            <el-button class="submit-btn is-disabled">协同编纂</el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else-if="applayProForm.projectState == 1203"
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
              applayProForm.projectState == 1203 &&
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
              applayProForm.projectState == 1203
            "
            @click="openMergeDoc()"
            >合并文档</el-button
          >
        </template>
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1203 &&
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
              提交大纲、草案
            </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else
            @click="saveFile('提交大纲、草案')"
          >
            <!-- 保存草案 -->
            提交大纲、草案
          </el-button>
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1204 &&
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
            @click="todoExamine(true, '审核大纲、草案',13)"
            :loading="btnLoadding"
          >
            <!-- 审核草案稿 -->
            <!-- 标准化审核 -->
            审核大纲、草案
          </el-button>
        </template>


        <!-- <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.mainEditorId == userInfo.userId &&
            applayProForm.projectState == 1204 &&
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
              保存草案稿
            </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            v-else
            @click="saveFile('草案稿')"
          >
            保存草案稿
          </el-button>
        </template> -->

        <!-- applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1205 &&
            applayProForm.projectPhase == 20 -->
        <template v-if="
            applayProForm.hasAuth == true &&
            applayProForm.projectState == 1205 &&
            applayProForm.projectPhase == 20
          ">
          <!-- <el-button
            class="submit-btn"
            v-if="
              applayProForm.hasAuth == true &&
              applayProForm.notExpire == true &&
              applayProForm.projectState == 1205
            "
            :loading="btnLoadding"
            @click="todoExamine(true, '审核草案稿')"
          >
            审核草案稿
          </el-button> -->
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
            >修改草案
          </el-button>
          <el-button
            class="submit-btn"
            v-if="
              applayProForm.hasAuth == true &&
              applayProForm.notExpire == true &&
              applayProForm.projectState == 1205 &&
              applayProForm.projectPhase == 20
            "
            :loading="btnLoadding"
            @click="uploadMaterial(true, '上传大纲、草案审查会相关材料',8,true,'')"
          >
            上传大纲、草案审查会相关材料
          </el-button>
        </template>
      </template>
      <!-- 标准征求意见阶段 -->
      <template v-if="applayProForm.projectPhase == 30">
        <!-- <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.mainEditorId == userInfo.userId &&
            applayProForm.projectState == 1207
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="当前时间未在操作时间范围内"
            placement="top-start"
            v-if="applayProForm.notExpire != true"
          >
            <el-button class="submit-btn is-disabled"> 结束征求意见 </el-button>
          </el-tooltip>
          <el-button
            class="submit-btn"
            @click="saveZQYJ()"
            v-else
            :loading="btnLoadding"
          >
            结束征求意见
          </el-button>
        </template> -->
        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1208
          "
          @click="editDG()"
          :loading="btnLoadding"
        >
          编写大纲
        </el-button>

        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1208
          "
          :loading="btnLoadding"
          @click="editDraft()"
        >
          编写草案
        </el-button> -->
        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1208
          "
          :loading="btnLoadding"
          @click="saveFile('送审稿')"
        >
          生成送审稿
        </el-button> -->
        <template v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1206
          ">
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
          >
            修改草案
          </el-button> 
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="saveFile('提交标准草案')"
          >
            提交标准草案
          </el-button> 
        </template>
        <!-- "组织编制组审查会 -->
        <template v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1207
          ">
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
          >
            修改草案
          </el-button> 
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="handleExamine(true,'组织编制组')"
          >
            组织编制组
          </el-button> 
        </template>
        <template v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1208
          ">
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
          >
            修改草案
          </el-button> 
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="uploadMaterial(true, '上传编制组会议相关材料',11,false)"
          >
            上传编制组会议相关材料
          </el-button> 
        </template>
        <template v-if="
            applayProForm.hasAuth == true &&
            applayProForm.applyUser == userInfo.userId &&
            applayProForm.projectState == 1209
          ">
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
          >
            修改草案
          </el-button> 
          <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="saveFile('提交标准草案')"
          >
            提交标准草案
          </el-button> 
        </template>
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1223
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
            @click="todoExamine(true, '审核大纲、草案',11)"
            :loading="btnLoadding"
          >
            审核大纲、草案
          </el-button>
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1210
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
            @click="handleExamine(true,'组织公司级审查会')"
            :loading="btnLoadding"
          >
            组织公司级审查会
          </el-button>
        </template>
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1211
          "
        >
          <!-- <el-button
            class="submit-btn"
            :loading="btnLoadding"
            @click="editDraft()"
            >修改草案
          </el-button> -->
          <el-button
            class="submit-btn"
            @click="uploadMaterial(true, '上传公司级审查会相关材料',11,false)"
            :loading="btnLoadding"
          >
            上传公司级审查会相关材料
          </el-button>
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1212
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
            @click="saveFile('生成征求意见稿')"
            :loading="btnLoadding"
          >
            生成征求意见稿
          </el-button>
        </template>
        
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1213
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
            @click="todoExamine(true, '标准化审核',11)"
            :loading="btnLoadding"
          >
            标准化审核
          </el-button>
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1214
          "
        >
          <el-button
            class="submit-btn"
             @click="uploadMaterial(true, '上传征求意见稿审查会相关材料',11,true,'征求意见稿')"
            :loading="btnLoadding"
          >
           上传征求意见稿审查会相关材料
          </el-button>
        </template>
        
        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1215
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
            @click="saveFile('提交征求意见稿')"
            :loading="btnLoadding"
          >
           提交征求意见稿
          </el-button>
        </template>

        <template
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1216
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
            @click="todoExamine(true, '标准化审核',12)"
            :loading="btnLoadding"
          >
           标准化审核
          </el-button>
        </template>
      </template>

      <template v-if="applayProForm.projectPhase == 40">
        <!-- <el-button
          class="submit-btn"
          @click="todoExamine(true, '审核送审稿')"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            (applayProForm.projectState == 1209 ||
              applayProForm.projectState == 1213)
          "
          :loading="btnLoadding"
        >
          审核送审稿
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1210
          "
          :loading="btnLoadding"
          @click="needToExamine(true)"
        >
          标准化主管审核
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1211
          "
          :loading="btnLoadding"
          @click="uploadLogFiles(true)"
        >
          上传审查会会议纪要
        </el-button> -->
        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1212 &&
            applayProForm.projectStatus != 5
          "
          @click="editDG()"
          :loading="btnLoadding"
        >
          编写大纲
        </el-button> -->

        <!-- <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1212 &&
            applayProForm.projectStatus != 5
          "
          :loading="btnLoadding"
          @click="editDraft()"
        >
          编写草案
        </el-button>
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1212
          "
          :loading="btnLoadding"
          :disabled="applayProForm.notExpire != true"
          @click="saveFile('报批稿')"
        >
          生成报批稿
        </el-button> -->
        <template 
           v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1217
          "
        >
          <el-button
            class="submit-btn"
             @click="uploadMaterial(true, '上传技术审查会相关材料',12,true,'技术')"
            :loading="btnLoadding"
          >
           上传技术审查会相关材料
          </el-button>
        </template>
        <template 
           v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1218
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
            @click="saveFile('生成报批稿')"
            :loading="btnLoadding"
          >
           生成报批稿
          </el-button>
        </template>
        <template 
           v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1219
          "
        > 
          <el-button
            class="submit-btn"
            @click="todoExamine(true, '标准化审核',12)"
            :loading="btnLoadding"
          >
           标准化审核
          </el-button>
        </template>
      </template>
      <!-- 标准审批阶段 -->
      <template v-if="applayProForm.projectPhase == 50">
        <el-button
          class="submit-btn"
          @click="updateFKJG(true)"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState == 1215
          "
          :loading="btnLoadding"
        >
          更新外部反馈结果
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
          :loading="btnLoadding"
          @click="todoDepExamine('分管领导审核', true)"
        >
          分管领导批准
        </el-button>
      </template>
      <!-- 标准发布阶段 -->
      <!-- <template v-if="applayProForm.projectPhase == 55">
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState != 1218
          "
          :loading="btnLoadding"
          @click="publishStd(true)"
        >
          标准归档
        </el-button>
      </template> -->
      <template v-if="applayProForm.projectPhase == 70">
        <el-button
          class="submit-btn"
          v-if="
            applayProForm.hasAuth == true &&
            applayProForm.notExpire == true &&
            applayProForm.projectState != 1218
          "
          :loading="btnLoadding"
          @click="publishStd(true)"
        >
          标准归档
        </el-button>
      </template>
      <el-button
        type="button"
        class="red-btn"
        @click="checkRejectReason(true)"
        :loading="btnLoadding"
        v-if="applayProForm.projectStatus == 5"
      >
        查看驳回终止理由
      </el-button>
    </div>

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

    <!-- 审核（起草阶段） -->
    <ToExamine
      :visiable="exaVisible"
      v-if="exaVisible"
      :title="exaTilte"
      :businessObjId="businessProId"
      :type="exaType"
      :version="version"
      :state="applayProForm.projectState"
      :docUrl="docUrl"
      @save="todoExamine(null, '')"
    />
    <!-- 组织编制组 -->
    <Compilation 
      :businessObjId="businessProId" 
      :visiable="compilationVisible"
      :title="compilationTitle"
      v-if="compilationVisible"
      @save="handleExamine(null,'')"
    />
    <!-- 第一起草人部门分管领导批准/公司分管领导批准 -->
    <ToDepExamine
      :visiable="exaDepVisible"
      :title="exaDeptTilte"
      :businessObjId="businessProId"
      @save="todoDepExamine(null)"
    />
    <!-- 标准化接口人上传会议纪要 -->
    <UploadFile
      :visiable="fileVisible"
      v-if="fileVisible"
      :version="version"
      :fileTitle="fileTitle"
      :businessObjId="businessProId"
      :isUpload="isUpload"
      :labelTitle="labelTitle"
      @save="uploadMaterial()"
    />


    <!-- 上传审查会会议纪要 -->
    <UploadLogFile
      :visiable="logFileVisible"
      :businessObjId="businessProId"
      @save="uploadLogFiles()"
    />

    <!-- 标准化主管审核 -->
    <NeedToExamine
      :visiable="needToExamineVisible"
      :businessObjId="businessProId"
      @save="needToExamine()"
    />

    <!-- 标准发布 -->
    <StdRelease
      :visiable="stdReleaseVisible"
      :businessObjId="applayProForm.id"
      :businessObjName="applayProForm.projectName"
      @save="publishStds"
    />
    <!-- 更新外部审核结果  -->
    <UpdateFKJG
      :visiable="updateFKJGVisiable"
      :businessObjId="businessProId"
      @save="updateFKJG(null)"
    />

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      :visiable="rejectReasonVisible"
      :processInfo="applayProForm"
      :title="`查看【${applayProForm.projectName}】驳回终止原因`"
      @close="checkRejectReason(false)"
    />
  </div>
</template>
<script>
import {
  BztRadioCard,
  EditorDialog,
  SamEditorDialog,
} from "@components/basicCom/index.js";
import { mapGetters } from "vuex";
import DataModel from "@utils/data-model";
import { getConfigByKey } from "@/api/editor.js";
import {
  ExProInfo,
  Predesc,
  SchedulePlan,
  ProcessFiles,
  StdInfo,
  ProcessRejectReason,
  OpinionList,
  OpinionFinishDetail,
} from "@components/bussinessCom/index";
import ToExamine from "./handle/toExamine.vue";
import ToDepExamine from "./handle/toDepExamine.vue";
import UploadLogFile from "./handle/uploadLogFile.vue";
import UploadFile from "./handle/uploadFile.vue";
import NeedToExamine from "./handle/needToExamine.vue";
import Api from "@api/process";
import UpdateWBPSJG from "./handle/updateWBPSJG.vue";
import UpdateFKJG from "./handle/updateFKJG.vue";
import StdRelease from "./handle/stdRelease.vue";
import Compilation from "./handle/compilation.vue"

import { updateByBusiness } from "@/api/editor.js";
import ViewDoc from "@/components/bussinessCom/editor/viewDoc";
import EditOutlineDialog from "@components/bussinessCom/editor/editOutlineDialog";
import CollaborativeEditDialog from "@components/bussinessCom/editor/collaborativeEditDialog";
import MergeDocDialog from "@components/bussinessCom/editor/mergeDocDialog";
// import { version } from 'vue';
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    collMemberList() {
      let user = [
        _.find(this.$cache.session.getJSON("sourceUserList"), {
          userId: Number(this.userInfo.userId),
        }),
      ];
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
    ViewDoc,
    ExProInfo,
    BztRadioCard,
    Predesc,
    SchedulePlan,
    ProcessFiles,
    StdInfo,
    ToExamine,
    ToDepExamine,
    UploadLogFile,
    UploadFile,
    NeedToExamine,
    StdRelease,
    UpdateWBPSJG,
    UpdateFKJG,
    Compilation,
    ProcessRejectReason,
    EditorDialog,
    SamEditorDialog,
    OpinionList,
    OpinionFinishDetail,
    EditOutlineDialog,
    CollaborativeEditDialog,
    MergeDocDialog,
  },
  name: "external-project-detail",
  props: ["hasIds", "projectId","proInfo"],
  data() {
    return {
      businessProId: null,
      tabList: [
        {
          label: "项目信息",
          value: 1,
        },
        {
          label: "编制说明",
          value: 2,
        },
        {
          label: "过程文档",
          value: 3,
        },
      ],
      version:"",
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
      updateFKJGVisiable: false, // 更新外部反馈结果
      rejectReasonVisible: false, // 查看驳回原因
      fileVisible:false, //上传相关材料
      fileTitle:'',
      compilationVisible:false,
      compilationTitle:'',
      labelTitle:'',
      editorVisiable: false, // 编辑草案
      editorTiltle: "编辑大纲",
      editorUrl: "",
      btnLoadding: false, //按钮刷新
      stdInfoTimer: "",
      isUpload:true, //纯上传为false  组织会议为true
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
    };
  },
  mounted() {
    const { id, projectPhase } = this.$route.params;
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
    if (this.projectPhase == 10) {
      this.tabId = 1;
    } else {
      this.tabId = 0;
      const tabItem = {
        label: "标准内容",
        value: 0,
      };
      if (JSON.stringify(this.tabList).indexOf(JSON.stringify(tabItem)) == -1) {
        this.tabList.unshift(tabItem);
      }
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
    getProjectDetail() {
      let loadingInstance = this.Loading.service({ fullscreen: true });
      this.btnLoadding = false;
      if (this.projectPhase == "10") {
        this.tabId = 1;
        Api.getProjectApprovalDetail(this.businessProId).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.applayProForm = data;
            this.btnLoadding = false;
            this.applayProForm["isChange"] = !this.applayProForm["isChange"];
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
            console.log(this.applayProForm,"this.applayProFormthis.applayProForm")
            this.projectPhase = data.projectPhase;
            this.btnLoadding = false;
            this.applayProForm["isChange"] = !this.applayProForm["isChange"];
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
     * (标准立项-填报项目进度)流程流转下一步
     */
    toNext() {
      if (this.btnLoadding == false) {
        this.btnLoadding = true;
        Api.reportProjectProgress(this.businessProId).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.$message.success("流程已流转");
            this.getProjectDetail();
          } else {
            // this.$message.error(msg);
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
    },
    /**
     * 第一起草人提交大纲、草案
     */
    async saveFile(title) {
      if (this.btnLoadding == false) {
        this.btnLoadding = true;
        // const doc = await this.$refs.viewDoc.exportDoc();
        const req = {
          businessId: this.businessProId,
          // url: doc,
        };

        Api.uploadRelatedMaterials(req).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("已保存");
            this.btnLoadding = false;

            this.getProjectDetail();
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 审核 (起草阶段标准审核,标准审查阶段)
     */
    async todoExamine(flag, title,version=null) {
      if (flag == true) {
      // 977 978 新增 同内部有差异
        this.docUrl = ""
        const doc = await this.$refs.viewDoc.exportDoc();

        this.exaType = 0;
        this.exaTilte = title;
        this.docUrl = doc
        if(version){
          this.version = version
        }
        this.exaVisible = true;
      } else {
        this.exaVisible = false;
        this.getProjectDetail();
      }
    },
    // 组织编制组
    handleExamine(flag,title){
      if(flag==true){
        this.compilationVisible = true
        this.compilationTitle = title
      }else{
        this.compilationVisible = false;
        this.getProjectDetail();
      }
    },
    /**
     * 上传相关材料
     */
    uploadMaterial(flag,title=null,version=null,isFlag=null,labelTitle=null){
      if (flag == true) {
        this.fileVisible = true;
        this.fileTitle = title
        this.version = version
        this.labelTitle = labelTitle
        this.isUpload = isFlag
      } else {
        this.fileVisible = false;
        this.getProjectDetail();
      }
    },  
    /**
     * 会签 （标准审批阶段）
     */
    toSign(flag) {
      if (flag == true) {
        this.exaType = 1;
        this.exaTilte = "标准会签";
        this.exaVisible = true;
      } else {
        this.exaVisible = false;
        this.getProjectDetail();
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
        this.exaDepVisible = flase;
        this.getProjectDetail();
      }
    },
    /**
     * 上传审查会会议纪要
     */
    uploadLogFiles(flag) {
      if (flag == true) {
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
        this.needToExamineVisible = true;
      } else {
        this.needToExamineVisible = false;
        this.getProjectDetail();
      }
    },
    /**
     * 发布标准
     */
    publishStd(flag) {
      if (flag == true) {
        this.stdReleaseVisible = true;
      } else {
        this.stdReleaseVisible = false;

        this.getProjectDetail();
      }
    },
    //标准发布
    publishStds(d) {
      if (d != null) {
        // this.stdReleaseLoadding = true;
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
              // this.stdReleaseLoadding = false;
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
                this.getProjectDetail();
              } else {
                this.$message.error(msg);
              }
            });
          })
          .catch(() => {
            this.btnLoadding = false;
          });
      }
    },
    /**
     * 更新外部反馈结果
     */
    updateFKJG(flag) {
      if (flag == true) {
        this.updateFKJGVisiable = true;
      } else {
        this.updateFKJGVisiable = false;
        this.getProjectDetail();
      }
    },
    /**
     * 查看驳回终止
     */
    checkRejectReason(flag) {
      this.rejectReasonVisible = flag;
    },
    showEdit() {
      let show = false;
      let states = [1204, 1208, 1212];
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
          //     this.getProjectDetail();
          //   }
          // });
          this.getProjectDetail();
        } else {
          this.$message.error(msg);
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
          this.$message.error(msg);
        }
      });
    },
    /**
     * 编辑保存编制说明
     */
    updatePredesc(data) {
      data.id =
        data.projectPhase == "10" ||
        data.projectPhase == "" ||
        data.projectPhase == null
          ? this.projectId
          : data.foundationProjectId;
      Api.updateProjectApproval(data).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.$message.success("修改成功");
          this.getProjectDetail();
        } else {
          this.$message.error(msg);
        }
      });
    },
    getMemberList() {
      if (!_.isEmpty(this.applayProForm.participantEditorIds)) {
        console.log(22)
        let userIds = this.applayProForm.participantEditorIds.split(",");
        this.memberList = userIds.map((i) => {
          return _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: Number(i),
          });
        });
        console.log( this.memberList ,9999,userIds)
      } else {
        console.log(33)
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
  overflow: auto;
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
    z-index: 2;
    position: fixed;
    bottom: 0;
    // height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    box-shadow: $bule 1px 0px 15px -8px;
    .el-button {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}
</style>