<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <el-form
        :model="taskForm"
        :rules="rules"
        ref="taskForm"
        label-suffix=":"
        label-width="160px"
        class="taskForm"
        v-if="taskForm != null"
      >
      <div style="display:flex;flex-wrap:wrap">
        <el-form-item
          label="任务名称"
          prop="projectName"
        >
          <el-input
            v-model="taskForm.projectName"
            placeholder="请输入任务名称"
            style="width: 340px;"
          />
        </el-form-item>

        <el-form-item
          label="复审时间"
          prop="dataTime"
        >
          <el-date-picker
            style="width:340px"
            v-model="taskForm.dataTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-divider>选择审核人</el-divider>      
        <el-form-item
            label="标准化业务主管"
            prop="firstAuditUser"
          >
          <el-select v-model="taskForm.firstAuditUser" filterable  clearable placeholder="请选择标准化业务主管" :disabled="disabled" style="width: 340px;" >
            <template v-for="(item, index) in directorList">
              <el-option
                :key="`user_${index}`"
                :label="`${item.nickName}(${item.userName})`"
                :value="Number(item.userId)"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="科技管理部部门领导"
          prop="secondAuditUser"
        >
          <el-select v-model="taskForm.secondAuditUser" filterable clearable placeholder="请选择科技管理部部门领导" :disabled="disabled" style="width: 340px;" >
            <template v-for="(item, index) in deptList">
              <el-option
                :key="`user_${index}`"
                :label="`${item.nickName}(${item.userName})`"
                :value="Number(item.userId)"
              />
            </template>
          </el-select>
        </el-form-item>
        </div>
        <div class="operation-line" style="position:absolute;top:50px;right:50px;">
          <div class="submit-btn" @click="addPros">
            <i class="el-icon-edit-outline" />
            添加复审标准
          </div>
        </div>
      </el-form>

      <div class="pro-list">
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: tabAction,
            actionWidth: '80px',
          }"
          height="500"
          :clearSelection="false"
          :hasIndex="true"
          :checkeBox="false"
          :pageInfo="page"
          :isLoading="isTabLoading"
          @remove="removePro"
        >
        </BztTable>
      </div>

      <!-- 选择项目 -->
      <CheckProjectList
        v-if="checkPorjectVisiable == true"
        :visiable="checkPorjectVisiable"
        :proList="list"
        @save="updateProject"
      />
    </template>
  </BztDialog>
</template>
<script>
import Api from "@api/process";
import { BztDialog, BztTable } from "@components/basicCom/index";
import CheckProjectList from "./checkProjectList.vue";
import { listUserByDeptsAndRoleKeys } from "@api/system/user";
const taskForm = {
  projectName: "",
  standardIdList: "",
  projectType: 6,
  rwTaskId: null,
  firstAuditUser:'',
  secondAuditUser:'',
  dataTime:"",
  startTime:"",
  endTime:'',
};
export default {
  name: "createTask",
  components: { BztDialog, BztTable, CheckProjectList },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    taskDetail: {
      type: Array,
      default: [],
    },
    disabled:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      pickerOptions:{
        disabledDate(time) {
           return time.getTime() < Date.now() - 8.64e7
          }
      },
      dataTime:[],
      dialogInfo: {
        visible: false,
        title: "发起复审任务",
        width: "1200px",
        footer: true,
        loadding: false,
        submintText: "提交",
      },
      taskForm: null,
      rules: {
        projectName: {
          required: true,
          message: "请输入复审任务名称",
          trigger: "blur",
        },
        dataTime:{
          required: true,
          message: "请选择复审时间",
          trigger: "blur",
        },  
        firstAuditUser:{
          required: true,
          message: "请选择标准化业务主管",
          trigger: "change",
        },
        secondAuditUser:{
          required: true,
          message: "请选择科技管理部部门领导",
          trigger: "change",
        }
      },
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "210",
        },
        {
          title: "标准名称",
          key: "stdName",
        },
        {
          title: "发布日期",
          key: "publishdate",
          width: "210",
        },
        {
          title: "实施日期",
          key: "dodate",
          width: "210",
        },
      ],
      tabAction: [
        { label: "删除", action: "remove", color: "rgba(214, 71, 48)" },
      ],
      directorList:[],
      deptList:[],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isTabLoading: false,
      checkPorjectVisiable: false,
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      if (this.visiable === true) {
        this.initPage();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.initPage();
    }
    this.getDeptList('standardBusinessSupervisor')
    this.getDeptList('principalLeader',200)
    console.log(this.taskInfo,777)
  },
  methods: {
    //获取人员
    getDeptList(roleKeys,deptIds=null){
      let data = {
        roleKeys
      }
      if(deptIds){
        data.deptIds = deptIds
      }
      listUserByDeptsAndRoleKeys(data).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if(deptIds){
            //部门主管
            this.deptList = data
          }else{
            //标准化业务主管:
            this.directorList = data
          }
        }
      });
    },
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      this.taskForm = this.deepClone(taskForm);
      this.list = [];
      if (this.taskInfo != null) {
        let startTime = this.taskInfo.startTime?this.taskInfo.startTime:''
        let endTime = this.taskInfo.endTime?this.taskInfo.endTime:''
        this.taskForm.rwTaskId = this.taskInfo.id;
        this.taskForm.projectType = this.taskInfo.taskType;
        this.taskForm.projectName = this.taskInfo.taskName;
        this.taskForm.firstAuditUser = this.taskInfo.firstAuditUser;
        this.taskForm.secondAuditUser = this.taskInfo.secondAuditUser;
        this.taskForm.dataTime = [startTime.slice(0,10),endTime.slice(0,10)]
        this.taskDetail.forEach((item) => {
          this.list.push(item.pdcaStdlist);
        });
      }
    },
    /**
     * 移除项目
     * @param {*} data 要移除的项目的信息
     */
    removePro(data) {
      this.isTabLoading = true;
      const arr = JSON.parse(JSON.stringify(this.list));
      this.list = [];
      arr.forEach((item) => {
        if (item.id != data.id) {
          this.list.push(item);
        }
      });
      this.isTabLoading = false;
    },
    /**
     * 打开添加标准弹框
     */
    addPros() {
      this.checkPorjectVisiable = true;
    },
    /**
     * 保存/取消选择项目
     */
    updateProject(e) {
      if (e != null) {
        e.forEach((item) => {
          this.list.push(item);
        });
      }
      this.checkPorjectVisiable = false;
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.taskForm.validate((valid) => {
          if (valid) {
            this.dialogInfo.loadding = true;
            this.$set(this.dialogInfo, "loadding", true);
            if (this.list.length == 0) {
              this.dialogInfo.loadding = false
              this.$message.warning("未添加复审标准，请添加复审标准");
              return;
            }
            this.taskForm.standardIdList = this.list.map((item) => {
              return item.id;
            });
            this.taskForm.startTime = this.taskForm.dataTime[0]
            this.taskForm.endTime = this.taskForm.dataTime[1]
            Api.addRwTask(this.taskForm).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("操作成功");
                this.dialogInfo.visible = false;
                this.$emit("save", false);
              } else {
                // this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);
              this.dialogInfo.loadding = false;
            });
          } else {
            return false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", null);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pro-list {
  // margin-top: 140px;
}
::v-deep .taskForm {
  width: 100%;
  overflow: hidden;
  .reason {
    line-height: 30px;
    margin-bottom: 15px;
    label {
      color: $red;
    }
    .reason-content {
      border-radius: 5px;
      background: $grey-light;
      line-height: 36px;
      color: $yellow;
      padding: 0px 15px;
      overflow: hidden;
    }
  }
  .el-form-item {
    margin-right: 15px;
    .el-form-item__label {
      font-weight: 400;
    }
    .el-form-item__content {
      .el-date-editor,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>