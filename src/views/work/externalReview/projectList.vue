<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 复审任务信息 -->
      <el-descriptions
        title="复审任务信息"
        v-if="taskInfo != null"
        style="margin-bottom: 15px"
      >
        <el-descriptions-item label="复审任务编号">
          {{ taskInfo.taskNo }}
        </el-descriptions-item>
        <el-descriptions-item label="复审任务名称">
          {{ taskInfo.taskName }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 功能操作行 -->
      <div class="operation-line" v-if="taskInfo != null">
        <!-- 驳回修改 -->
        <template
          v-if="
            ((taskInfo.specialRevise == 1 && taskInfo.taskState == 7101) ||
              taskInfo.taskState == 7101) &&
            taskInfo.workItem &&
            taskInfo.workItem != null
          "
        >
          <div class="submit-btn" @click="eidtTask(true)">修改项目</div>
        </template>

        <!-- 标准化业务主管审核 / 科技管理部部门分管领导审核 -->
        <template v-if="showBtn([7102, 7103]) == true">
          <div class="submit-btn" @click="auditPro(true)">审核项目</div>
        </template>

        <!-- 分发复审任务 -->
        <template v-if="showBtn([7104]) == true">
          <div class="submit-btn" @click="handlePersion(true)">
            审核分发复审任务
          </div>
        </template>

        <!-- 部门上传复审结果 -->
        <template v-if="showBtns([15001]) == true">
          <!-- <div class="submit-btn" @click="exportFile(1)">
            导出复审标准汇总表
          </div>
          <div class="green-btn" @click="uploadResultPro(true)">
            上传复审结论
          </div> -->
          <div class="green-btn" @click="uploadResult(true)">
            复审结论
          </div>
        </template>

        <!-- 部门分管领导审核 -->
        <template v-if="showBtns([15002]) == true">
          <!-- <div class="submit-btn" @click="exportFile(3)">
            导出复审结论汇总表
          </div>
          <div class="green-btn" @click="auditPro(true)">部门复审结论审核</div> -->
          <div class="green-btn" @click="auditPro(true)">部门复审结论审核</div>
        </template>
        
        <!-- 新增 -->
        <!-- 新增 -->
        <template v-if="showBtns([15003]) == true">
          <div class="green-btn" @click="handleFile(true,'上传会议纪要')">上传会议纪要</div>
        </template>

        <!-- 新增 -->
        <template v-if="showBtns([15006]) == true">
          <div class="green-btn" @click="handleFile(true,'上传会议纪要')">上传会议纪要</div>
        </template>

        <template v-if="showBtns([15007]) == true">
          <div class="green-btn" @click="handleFile(true,'部门领导审核')">部门领导审核</div>
        </template>

        <template v-if="showBtns([15005]) == true">
          <!-- 原始的 -->
          <!-- <div class="submit-btn" @click="exportFile(3)">
            导出复审结论汇总表
          </div>
          <div class="green-btn" @click="auditPro(true)">部门复审结论审核</div>
           -->
          <div class="green-btn" @click="distributePro(true)">网员分发</div>
        </template>

        <!-- 汇总各部门复审结论 -->
        <template v-if="showBtn([7107]) == true">
          <div class="submit-btn" @click="exportFile(2)">导出复审结论汇总表</div>
          <!-- <div class="green-btn" @click="uploadResultPro(true)">
            上传会议纪要
          </div> -->
          <div class="green-btn" @click="uploadResultPro(true)">
            标准化汇总
          </div>
        </template>

         

        <!-- 发布审核通知 -->
        <template v-if="showBtn([6108]) == true">
          <div class="submit-btn" @click="exportFile(0)">导出复结论汇总表</div>
          <div class="green-btn" @click="uploadResultPro(true)">
            起草复审结果通知
          </div>
        </template>

        <!-- 审核复审结果通知 -->
        <template v-if="showBtn([6109]) == true">
          <div class="submit-btn" @click="auditPro(true)">复审结果通知审核</div>
        </template>

        <!-- 查看驳回理由 -->
        <template
          v-if="
            (taskInfo.taskStatus == 5 || taskInfo.taskState == 6101||taskInfo.childTaskStatus==5) &&
            taskInfo.workItem &&
            taskInfo.workItem != null
          "
        >
          <div class="error-btn" @click="cheeckReson(true)">查看驳回理由</div>
        </template>
        <div class="yellow-btn" @click="checkSpeed(true)">
            查看处理人
        </div>
      </div>

      <!-- 标准列表 -->
      <!-- <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: [],
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
      /> -->
      <el-table
        class="btz-tables"
        :data="list"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="selected" width="55" v-if="showBtns([15005]) == true"> </el-table-column>
        <el-table-column fixed label="序号" type="index" width="60" />
        <el-table-column
          label="标准标号"
          min-width="120"
          prop="pdcaStdlist.stdNo"
        >
        </el-table-column>
        <el-table-column
          prop="pdcaStdlist.stdName"
          label="标准名称"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="pdcaStdlist.publishdate"
          label="发布日期"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="pdcaStdlist.dodate"
          label="实施日期"
          min-width="120"
        >
        </el-table-column>
      </el-table>
    </div>

    <!-- 标准化业务主管审核 / 科技管理部部门分管领导审核 -->
    <AduitPro
      v-if="aduitProVisible == true"
      :visiable="aduitProVisible"
      :taskInfo="taskInfo"
      @save="auditPro"
    />
    <!-- 标准化网员 -->
    <HandlePersion
      v-if="handlePersionVisible == true"
      :visiable="handlePersionVisible"
      :taskInfo="taskInfo"
      @save="handlePersion"
    />

    <!-- 分发复审任务 -->
    <DistributePro
      v-if="distributeProVisible == true"
      :visiable="distributeProVisible"
      :taskInfo="taskInfo"
      :selectDataList="selectDataList"
      @save="distributePro"
    />

    <!-- 上传复审结论 -->
    <UploadResult
      v-if="uploadResultProVisible == true"
      :visiable="uploadResultProVisible"
      :taskInfo="taskInfo"
      @save="uploadResultPro"
    />

    <!-- 编辑修改复审任务 -->
    <CreateTask
      v-if="cerateTaskVisiable == true"
      :visiable="cerateTaskVisiable"
      :taskInfo="taskInfo"
      :taskDetail="list"
      :disabled="true"
      @save="eidtTask"
    />

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      v-if="taskInfo != null"
      :visiable="rejectReasonVisible"
      :processInfo="taskInfo"
      :projectType="projectType"
      :projectId="projectId"
      :title="`查看【${taskInfo.taskName}】驳回终止原因`"
      @close="cheeckReson(false)"
    />
    <!-- 新增 -->
    <HandleFile
      v-if="handleFileVisible == true"
      :visiable="handleFileVisible"
      :taskInfo="taskInfo"
      :title="title"
      @save="handleFile"
    />
    <!-- 查看各部门分管领导复审结果 -->
    <RwResultList
      v-if="rwResultVisible == true"
      :visiable="rwResultVisible"
      :taskId="taskInfo.id"
      :title="`查看【${taskInfo.taskName}】各部门完成情况`"
      @close="checkResult(false)"
    />
    <!-- 查看处理人 -->
    <Speed
      v-if="speedVisible == true"
      :visiable="speedVisible"
      :taskId="taskInfo.id"
      :title="'查看处理人'"
      @close="checkSpeed(false)"
    />
    <FormTable
      v-if="formTableVisible == true"
      :visiable="formTableVisible"
      :taskInfo="taskInfo"
      :type="type"
      :taskState="taskInfo.taskState"
      @save="uploadResult"
    />
  </div>
</template>
<script>
import { BztTable } from "@components/basicCom/index.js";
import { ProcessRejectReason } from "@components/bussinessCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";
import AduitPro from "./components/aduitPro.vue";
import DistributePro from "./components/distributePro.vue";
import UploadResult from "./components/uploadResult.vue";
import CreateTask from "./components/createTask.vue";
import RwResultList from "./components/rwResultList.vue";
import HandlePersion from "./components/handlePersion.vue";
import FormTable from "./components/formTable.vue";
import HandleFile from "./components/handleFile.vue";
import Speed from "./components/speed.vue";


export default {
  components: {
    BztTable,
    AduitPro,
    DistributePro,
    UploadResult,
    ProcessRejectReason,
    CreateTask,
    RwResultList,
    HandlePersion,
    FormTable,
    HandleFile,
    Speed
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
      searchInfo: {},
      tabClums: [
        {
          title: "标准标号",
          key: "pdcaStdlist.stdNo",
          width: "280",
        },
        {
          title: "标准名称",
          key: "pdcaStdlist.stdName",
          minWidth: "380",
        },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      processAs: null,
      taskInfo: null,
      aduitProVisible: false,
      distributeProVisible: false,
      uploadResultProVisible: false,
      rejectReasonVisible: false,
      cerateTaskVisiable: false,
      rwResultVisible: false,
      speedVisible:false,
      handlePersionVisible: false,
      formTableVisible:false,
      handleFileVisible:false,
      type: 1,
      scopeRow:null,
      selectDataList:[],
      projectId:'',
      projectType:7
    };
  },
  mounted() {
    this.scopeRow = JSON.parse(sessionStorage.getItem('scopeRow')) 
    console.log(this.scopeRow)
    this.getList();
  },
  methods: {
    selected(row){
      if (row.isChoice == 1) {
        return false //可选择
      } else {
        return true; //不可选择
      }
    },
    handleSelectionChange(row){
      this.selectDataList = row
    }, 
    /**
     * 获取标准列表
     */
    getList() {
      this.taskInfo = null;
      this.isTabLoading = true;
      Api.getStdListByDetail({
        rwTaskId: this.$route.params.rwTaskId,
      }).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data;

          // if (this.list.length > 0) {
          //   this.taskInfo = this.list[0].tRwTask;
          //   this.taskInfo["workItem"] = this.list[0].workItem;
          //   this.taskInfo["childTaskId"] = this.list[0].childTaskId
          //     ? this.list[0].childTaskId
          //     : null;
          //   this.taskInfo["firstAuditUser"] = Number(this.list[0].tRwTask.firstAuditUser)
          //   this.taskInfo["secondAuditUser"] = Number(this.list[0].tRwTask.secondAuditUser)
          //   this.taskInfo["startTime"] = this.list[0].tRwTask.startTime
          //   this.taskInfo["endTime"] = this.list[0].tRwTask.endTime
          //   this.taskInfo["lastFirstAuditUser"] = this.list[0].tRwTask.lastFirstAuditUser?Number(this.list[0].tRwTask.lastFirstAuditUser):''
          //   this.taskInfo["lastSecondAuditUser"] = this.list[0].tRwTask.lastSecondAuditUser?Number(this.list[0].tRwTask.lastSecondAuditUser):''
          // }
          this.taskInfo = this.scopeRow;
          this.taskInfo["workItem"] = this.scopeRow.workItem;
          this.taskInfo["childTaskId"] = this.scopeRow.childTaskId
            ? this.scopeRow.childTaskId
            : null;
          this.taskInfo["firstAuditUser"] = Number(this.scopeRow.firstAuditUser)
          this.taskInfo["secondAuditUser"] = Number(this.scopeRow.secondAuditUser)
          this.taskInfo["startTime"] = this.scopeRow.startTime
          this.taskInfo["endTime"] = this.scopeRow.endTime
          this.taskInfo["lastFirstAuditUser"] = this.scopeRow.lastFirstAuditUser?Number(this.scopeRow.lastFirstAuditUser):''
          this.taskInfo["lastSecondAuditUser"] = this.scopeRow.lastSecondAuditUser?Number(this.scopeRow.lastSecondAuditUser):''
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    /**
     * 操作按钮渲染
     */
    showBtn(arr) {
      let show = false;
      if (this.taskInfo == null) return false;
      arr.forEach((item) => {
        if (
          this.taskInfo.taskState == item &&
          this.taskInfo.workItem &&
          this.taskInfo.workItem != null
        ) {
          show = true;
        }
      });
      return show;
    },
    showBtns(arr) {
      let show = false;
      if (this.taskInfo == null) return false;
      arr.forEach((item) => {
        if (
          this.taskInfo.childTaskState == item &&
          this.taskInfo.workItem &&
          this.taskInfo.workItem != null
        ) {
          show = true;
        }
      });
      return show;
    },
    /**
     * 编辑修改复审任务
     */
    eidtTask(e) {
      if (e == true) {
        this.cerateTaskVisiable = true;
      } else {
        this.cerateTaskVisiable = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    /**
     * 编辑修改复审任务
     */
    cheeckReson(e) {
      if(this.taskInfo.childTaskState ==15006){
        this.projectId = this.taskInfo.childTaskId
        this.projectType = 15
      }
      this.rejectReasonVisible = e;
    },

    /**
     * 标准化业务主管审核 / 科技管理部部门分管领导审核
     */
    auditPro(e) {
      if (e == true) {
        this.aduitProVisible = true;
      } else {
        this.aduitProVisible = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    /**
     *分发复审任务
     */
    distributePro(e) {
      if (e == true) {
        if(!this.selectDataList.length) return  this.$message.warning("请选择要分发的数据");
        this.distributeProVisible = true;
      } else {
        this.distributeProVisible = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    // 分发网员
    handlePersion(e) {
      if (e == true) {
        this.handlePersionVisible = true;
      } else {
        this.handlePersionVisible = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    /**
     * 导出汇总表
     */
    exportFile(type) {
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
              taskId: this.taskInfo.id,
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
      console.log(req);
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
    uploadResultPro(e) {
      if (e == true) {
        this.uploadResultProVisible = true;
      } else {
        this.uploadResultProVisible = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    handleFile(e,title=null){
      if (e == true) {
        this.title = title;
        this.handleFileVisible = true;
      } else {
        this.handleFileVisible = false;
        if (e != null) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    //复审结论
    uploadResult(e) {
      if (e) {
        this.type = 1;
        this.formTableVisible = true;
      } else {
        this.formTableVisible = false;
        if(e!=null){
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/work/externalReview");
        }
      }
    },
    /**
     * 查看复审结果
     */
    checkResult(e) {
      console.log(this.rwResultVisible);
      if (e == true) {
        this.rwResultVisible = true;
      } else {
        this.rwResultVisible = false;
      }
    },
    checkSpeed(e){
      if (e == true) {
        this.speedVisible = true;
      } else {
        this.speedVisible = false;
      }
    }
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