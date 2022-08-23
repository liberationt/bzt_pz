<template>
  <div class="app-container personal-task-container">
    <el-row :gutter="10">
      <el-col :span="3">
        <div class="sidebar-header">
          <div class="title" :title="activeTypeLabel">
            {{ activeTypeLabel }}
          </div>
        </div>
        <div class="sidebar-menu">
          <!-- 选择任务类型 -->
          <ul class="task-menu">
            <li
              class="menu-item"
              :class="{ active: dict.dictValue == queryParams.taskType }"
              v-for="dict in taskTypeOptions"
              :key="dict.dictValue"
              @click="changeType(dict)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="dict.dictLabel"
                placement="top"
              >
                <div class="menu-title">
                  <!-- <span
                    class="type-badge"
                    v-if="dict.count != null && dict.count > 0"
                    >{{ dict.count > 99 ? "99+" : dict.count }}</span
                  >
                  <span
                    class="type-badge"
                    style="background: transparent !important"
                    v-else
                  ></span> -->
                  <!-- <span>{{ dict.dictLabel }}</span> -->

                  <span>{{ dict.dictLabel }}</span>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="main-header clearfix">
          <div class="header-left">
            <el-form
              :model="queryParams"
              ref="queryForm"
              :inline="true"
              label-width="68px"
              @submit.native.prevent
            >
              <!-- 选择任务状态 -->
              <!-- <div class="header-btn-group">
                <span
                  v-for="item in stateOptions"
                  :key="item.value"
                  class="btn-link"
                  :class="{ 'btn-active': queryParams.state == item.value }"
                  @click="changeState(item)"
                >
                  <span class="text">{{ item.label }}</span>
                  <span class="state-badge">{{
                    item.count > 99 ? "99+" : item.count
                  }}</span>
                </span>
              </div> -->
              <el-form-item prop="searchValue">
                <el-input
                  v-model="queryParams.searchValue"
                  placeholder="请输入关键字"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  class="submit-btn"
                  style="height: 30px; line-height: 30px; margin-top: 2px"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  class="submitBtnReset"
                  style="height: 30px; line-height: 30px"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="header-right">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </div> -->
        </div>
        <!-- 任务列表 -->
        <div class="main-list">
          <el-table v-loading="loading" :data="taskList" stripe>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column
              label="任务名称"
              prop="taskTitle"
              min-width="300px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  :class="{ 'link-text': scope.row.state == 0 }"
                  v-html="parseKeyword(scope.row.taskTitle)"
                ></span>
                <!-- @click="handleTask(scope.row)" -->
              </template>
            </el-table-column>
            <el-table-column
              label="任务类型"
              prop="taskSubType"
              align="center"
              width="160px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.taskSubType }}
              </template>
            </el-table-column>
            <el-table-column
              label="发送人"
              prop="createUser"
              align="center"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-html="parseKeyword(parseUser(scope.row.createUser))"
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              label="处理人"
              prop="processUser"
              align="center"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-html="parseKeyword(parseUser(scope.row.processUser))"
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              label="任务产生时间"
              prop="createTime"
              align="center"
              width="150px"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="任务停留时间"
              align="center"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-html="durationFormat(scope.row)"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="处理阶段"
              prop="businessStage"
              align="center"
              width="150px"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="处理状态"
              prop="state"
              align="center"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-html="stateFormat(scope.row)"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              :width="'120px'"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- <el-button
                  size="small"
                  type="link"
                  icon="el-icon-caret-right"
                  :disabled="scope.row.state == 1"
                  @click="handleTask(scope.row)"
                  >去办理
                </el-button> -->
                <el-button
                  size="small"
                  icon="el-icon-caret-right"
                  v-if="
                    scope.row.state != 1 &&
                    scope.row.deptId == null &&
                    scope.row.roleId == null &&
                    scope.row.hook.length == 20 &&
                    scope.row.taskType != 4 &&
                    scope.row.taskType != 5
                  "
                  @click="transferTask(scope.row)"
                  >转办
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <!-- <el-dialog
      class="task-dialog"
      :visible.sync="currItem.visible"
      :title="currItem.data.taskTitle"
      append-to-body
      :close-on-click-modal="false"
    >
      <component
        :is="currItem.comp"
        :todoTask="currItem.data"
        @close="handleClose"
        @success="handleSuccess"
      />
    </el-dialog> -->

    <BztDialog
      :dialogInfo="{
        visible: currItem.visible,
        title: currItem.data.taskTitle,
        width: '900px',
      }"
      @close="currItem.visible = false"
    >
      <template slot="body">
        <component
          :is="currItem.comp"
          :todoTask="currItem.data"
          @close="handleClose"
          @success="handleSuccess"
        />
      </template>
    </BztDialog>

    <!-- 任务转办 -->
    <TransferToOther
      v-if="transferVisiable == true"
      :visiable="transferVisiable"
      :dataSource="currItem.data"
      @close="transferClose"
    />
  </div>
</template>

<script>
import TaskApi from "@/api/system/todoTask";
import { BztDialog } from "@components/basicCom/index";
import { TransferToOther } from "@components/bussinessCom/index";
export default {
  components: { BztDialog, TransferToOther },
  name: "todoTask",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAdmin: 1,
        orderByColumn: "create_time",
        isAsc: "desc",
        searchValue: undefined,
        // 选中任务类型
        taskType: 0,
        // 选中任务状态
        state: 0,
      },
      searchKeyword: undefined,
      // 总条数
      total: 0,
      // 体系表格数据
      taskList: null,
      // 任务类型数据字典
      taskTypeOptions: [],
      // 任务状态选项
      stateOptions: [
        { label: "全部", value: -1, count: 0 },
        { label: "待处理", value: 0, count: 0 },
        { label: "已处理", value: 1, count: 0 },
      ],
      // 源用户列表
      sourceUserList: [],
      // 当前选中任务
      currItem: {
        data: {},
        visible: false,
        comp: null,
      },
      // 转办任务信息
      transferVisiable: false,
    };
  },
  computed: {
    // 显示任务类型标签
    activeTypeLabel() {
      if (this.queryParams.taskType == 0) {
        return "待办任务";
      }
      let typeData = _.find(this.taskTypeOptions, {
        dictValue: this.queryParams.taskType,
      });
      return typeData ? typeData.dictLabel : "-";
    },
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查询待办任务列表 */
    getList() {
      this.loading = true;
      TaskApi.listTodoTask(this.queryParams).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.searchKeyword = this.queryParams.searchValue;
        this.getStatisticsCount();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downloadByPost(
        "system/todoTask/export",
        {
          ...this.queryParams,
        },
        `待办任务_${new Date().getTime()}.xlsx`
      );
    },
    // 获取任务统计数量
    getStatisticsCount() {
      this.getTypeCount();
      this.getStateCount();
    },
    // 任务类型数量统计
    getTypeCount() {
      TaskApi.getTypeCount().then((res) => {
        let typeOptions = this.taskTypeOptions;
        typeOptions.forEach((item, index) => {
          let countData = _.find(res.data, {
            taskType: Number(item.dictValue),
          });
          item.count = countData ? countData.count : 0;
          this.$set(this.taskTypeOptions, index, item);
        });
      });
    },
    // 处理状态数量统计
    getStateCount() {
      TaskApi.getStateCountByType(this.queryParams.taskType).then((res) => {
        this.stateOptions.forEach((item) => {
          let countData = _.find(res.data, { state: item.value });
          item.count = countData ? countData.count : 0;
        });
        let allCount = 0;
        res.data.forEach((countData) => {
          allCount += countData.count;
        });
        this.stateOptions[0].count = allCount;
      });
    },
    // 切换任务类型
    changeType(item) {
      if (item.dictValue == this.queryParams.taskType) {
        this.queryParams.taskType = 0;
      } else {
        this.queryParams.taskType = item.dictValue;
      }
      this.handleQuery();
    },
    // 切换任务状态
    changeState(item) {
      this.queryParams.state = item.value;
      this.handleQuery();
    },
    // 用户名称转换
    parseUser(userId) {
      if (userId == 0) return "系统";
      const user = _.find(this.sourceUserList, { userId: userId });
      return user ? user.nickName : "-";
    },
    // 关键字转换
    parseKeyword(value) {
      if (!_.isEmpty(this.searchKeyword)) {
        value = value.replace(
          new RegExp(this.searchKeyword, "gm"),
          '<span style="color: #F56C6C;">' + this.searchKeyword + "</span>"
        );
      }
      return value;
    },
    stateFormat(item) {
      if (item.state == 0) {
        return '<span style="color: #F56C6C">待处理</span>';
      } else {
        return '<span style="color: #67C23A">已处理</span>';
      }
    },
    // 持续时长格式化
    durationFormat(item) {
      var duration = "";
      if (item.state == 0) {
        // 待办，计算开始时间到当前时间
        duration = this.DateDifference(item.createTime, new Date());
      } else if (item.state == 1) {
        // 已处理，计算开始时间到处理时间
        duration = this.DateDifference(item.createTime, item.processTime);
      }
      if (duration.indexOf("天") != -1) {
        return '<span style="color: #E6A23C">' + duration + "</span>";
      } else {
        return '<span style="color: #67C23A">' + duration + "</span>";
      }
    },
    // 计算两个时间的时间差
    DateDifference(faultDate, completeTime) {
      if (typeof faultDate == "string" && faultDate.constructor == String) {
        faultDate = faultDate.replace(new RegExp(/-/gm), "/");
      }
      if (
        typeof completeTime == "string" &&
        completeTime.constructor == String
      ) {
        completeTime = completeTime.replace(new RegExp(/-/gm), "/");
      }
      var stime = new Date(faultDate).getTime();
      var etime = new Date(completeTime).getTime();
      var usedTime = etime - stime; //两个时间戳相差的毫秒数
      var days = Math.floor(usedTime / (24 * 3600 * 1000));
      //计算出小时数
      var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      var time = "";
      if (days > 0) {
        time = days + "天";
      } else {
        if (hours == 0) {
          time = "<1小时";
        } else {
          time = hours + "小时";
        }
      }
      return time;
    },
    // 处理任务
    handleTask(item) {
      if (item.state == 0) {
        if (item.processType == 1) {
          // 弹窗处理
          this.currItem.data = item;
          this.currItem.comp = (resolve) =>
            require([`@/${item.processPath}.vue`], resolve);
          this.currItem.visible = true;
        } else if (item.processType == 2) {
          this.$router.push(item.processPath);
        }
      }
    },
    // 任务弹窗关闭
    handleClose() {
      this.currItem.visible = false;
    },
    // 任务弹窗处理完成关闭
    handleSuccess(msg) {
      this.$message.success(msg ? msg : "任务处理成功");
      this.currItem.visible = false;
      this.getList();
    },
    /**
     * 任务转办
     * @param data {Object} 要转办的任务的信息
     */
    transferTask(data) {
      this.transferVisiable = true;
      this.currItem.data = data;
    },
    /**
     * 关闭转办窗口
     * @param e {Boolean} true：转办成功；false：取消转办
     */
    transferClose() {
      this.transferVisiable = false;
      this.currItem.data = {};
      this.getList();
    },
  },
  created() {
    this.queryParams.taskType = this.$route.query.type ?? 0;
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.getDicts("todo_task_type").then((response) => {
      this.taskTypeOptions = response.data;
      this.getList();
    });
  },
};
</script>

<style scoped lang="scss">
$primary-color: #409eff;
.personal-task-container {
  min-height: calc(100vh - 84px);
  background: #f6f6f6;
  .sidebar-header {
    border-left: 3px solid $primary-color;
    position: relative;
    height: 37px;
    padding-right: 20px;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 4px 2px 2px 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    &::after {
      position: absolute;
      top: -1px;
      right: -8px;
      display: block;
      width: 0;
      height: 0;
      content: " ";
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      border-width: 18px 0 18px 8px;
    }
    .title {
      padding: 0 5px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 700;
      line-height: 37px;
      color: $primary-color;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .sidebar-menu {
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .task-menu {
      position: relative;
      padding: 0;
      margin: 5px 0;
      background-color: #fff;
      box-sizing: border-box;
      .menu-item {
        position: relative;
        margin: 1px 0;
        width: calc(100% + 1px);
        line-height: 26px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
        white-space: nowrap;
        cursor: pointer;
        padding: 5px 15px;
        list-style: none;
        &:hover {
          background-color: #f6f6f6 !important;
          color: $primary-color;
        }
        &.active {
          background-color: #f6f6f6 !important;
          color: $primary-color;
          &::before {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            border-left: 3px solid $primary-color;
            content: "";
          }
        }
        .menu-title {
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .main-header {
    margin-bottom: 10px;
    .header-left {
      float: left !important;
      ::v-deep .el-form {
        height: 37px;
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .header-btn-group {
        display: inline-block;
        margin-right: 5px;
        .btn-link {
          font-weight: 400;
          text-shadow: none;
          cursor: pointer;
          background: 0;
          display: inline-block;
          padding: 6px;
          margin-bottom: 0;
          font-size: 13px;
          line-height: 18px;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border: 1px solid transparent;
        }
        .btn-link .text {
          position: relative;
        }
        .btn-link:hover {
          background: #e9e9e9;
          color: $primary-color;
          border-radius: 5px;
        }
        .btn-active {
          color: $primary-color;
          position: relative;
          top: -1px;
          display: inline-block;
          font-weight: 700;
        }
        .btn-active .text:after {
          position: absolute;
          bottom: -5px;
          display: block;
          width: 100%;
          content: " ";
          border-bottom: 2px solid $primary-color;
        }
      }
    }
    .header-right {
      float: right !important;
      display: flex;
      align-items: center;
      height: 37px;
    }
  }
  .main-list {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    ::v-deep .pagination-container {
      margin: 0;
      height: 50px;
    }
  }
  .state-badge {
    background-color: #ddd !important;
    height: 18px;
    line-height: 18px;
    position: relative;
    display: inline-block;
    padding: 0 6px;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
    color: #666 !important;
    margin-left: 5px;
  }
  .type-badge {
    background-color: $yellow !important;
    height: 18px;
    line-height: 18px;
    position: relative;
    display: inline-block;
    padding: 0 6px;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
    color: #fff !important;
    margin-right: 5px;
  }
}
.task-dialog {
  ::v-deep .el-dialog {
    transform: none;
    left: 0;
    position: relative;
    margin: 0 auto;
    .el-dialog__header {
      display: flex;
      background-color: #efefef;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      height: 40px;
      .el-dialog__title {
        font-size: 14px;
      }
      .el-dialog__headerbtn {
        position: static;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>