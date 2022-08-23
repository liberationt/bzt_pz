<template>
  <div class="system-bind-list">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
    >
      <el-form-item v-if="currNode && currNode.nodeName" label="当前节点">
        <el-tag type="info">
          {{ currNode.nodeName }}
        </el-tag>
      </el-form-item>
      <el-form-item label="关键字" prop="searchValue">
        <el-input
          placeholder="请输入关键字搜索标准"
          v-model="queryParams.searchValue"
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
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <el-col :span="1.5" v-if="isEdit" v-hasPermi="['stdSystem:bind']">
        <el-button
          v-if="currNode.nodeName != null"
          :disabled="currNode.disabled == true"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="openSelectStd"
          >添加标准</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getBindList"
      ></right-toolbar>
    </el-row>
    <el-table
      size="mini"
      ref="multipleTable"
      :data="bindStdList"
      tooltip-effect="dark"
      v-loading="bindStdLoading || editNodeSwitch"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isEdit"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        label="节点名称"
        prop="stdSystemNumber"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="标准编号"
        prop="stdNo"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="标准名称"
        prop="stdName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="发布时间" prop="stdPublishDate" width="100" />
      <el-table-column label="实施时间" prop="stdPerformDate" width="100" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="viewDoc(scope.row)"
            >详情信息</el-button
          >
          <el-button
            v-if="isEdit"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="removeBindData(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :small="true"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getBindList"
    />

    <!-- <div class="view-container" :class="{ show: viewLine }">
      <div>
        <div class="v-title">
          <span>题录信息</span>
          <el-button
            type="text"
            icon="el-icon-close"
            @click.stop.prevent="viewLine = false"
            >关闭</el-button
          >
        </div>
        <div class="content">
          <view-standardinfo
            :data="currItem"
            :type="viewType"
            @close="viewLine = false"
          />
        </div>
      </div>
    </div> -->

    <el-drawer
      title="选择标准"
      :visible.sync="selectStd.visible"
      direction="rtl"
      size="800px"
    >
      <div class="bind-std-list">
        <el-form class="bind-std-form" :inline="true" @submit.native.prevent>
          <el-form-item label="关键字" prop="searchValue">
            <el-input
              style="width: 250px"
              placeholder="请输入关键字"
              clearable
              size="small"
              v-model="selectStd.queryParams.searchValue"
              @keyup.enter.native="getTopicalList"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getTopicalList"
              size="mini"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div>
          <el-table
            size="mini"
            ref="selectStdTable"
            v-loading="selectStd.searchLoading"
            :data="selectStd.topicalList"
            stripe
            @row-click="clickSelectStdRow"
            :row-key="(row) => row.stdId"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :reserve-selection="true"
            />
            <el-table-column
              label="标准编号"
              align="left"
              prop="stdNo"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="标准名称"
              align="left"
              prop="stdName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="发布日期"
              align="center"
              prop="stdPublishDate"
              width="120"
            />
            <el-table-column
              label="实施日期"
              align="center"
              prop="stdDoDate"
              width="120"
            />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="80"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="viewDoc(scope.row)"
                  >详情信息</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :small="true"
            v-show="selectStd.total > 0"
            :total="selectStd.total"
            :page.sync="selectStd.queryParams.pageNo"
            :limit.sync="selectStd.queryParams.pageSize"
            @pagination="getTopicalList"
          />
        </div>
      </div>
      <div class="bind-std-footer">
        <el-button @click="handleBindRefresh" icon="el-icon-refresh"
          >重 置</el-button
        >
        <el-button
          type="primary"
          :disabled="selectStd.selectedData.length == 0"
          icon="el-icon-finished"
          @click="openCheckBindStd"
          >标 准 分 发</el-button
        >
      </div>
    </el-drawer>

    <el-dialog
      class="teach-dialog"
      title="确认标准分发信息"
      :visible.sync="selectStd.checkVisiable"
      width="800px"
      append-to-body
    >
      <p>
        <label>分发体系：</label>
        <el-tag type="info">
          {{ currNode.nodeName }}
        </el-tag>
      </p>
      <p>
        <label>分发标准列表：</label>
      </p>
      <el-table
        size="mini"
        :data="selectStd.selectedData"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="标准编号"
          align="left"
          prop="stdNo"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="标准名称"
          align="left"
          prop="stdName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="发布日期"
          align="center"
          prop="stdPublishDate"
          width="120"
        />
        <el-table-column
          label="实施日期"
          align="center"
          prop="stdDoDate"
          width="120"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="viewDoc(scope.row)"
              >详情信息</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="removeSelectStd(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="handleBindStd"
          :disabled="selectStd.selectedData.length == 0"
          icon="el-icon-finished"
          >确定</el-button
        >
        <el-button
          size="small"
          @click="selectStd.checkVisiable = !selectStd.checkVisiable"
          icon="el-icon-close"
          >取消</el-button
        >
      </div>
    </el-dialog>

    <!--详情  -->
    <StdDetail
      v-if="stdVisiable == true"
      :visiable="stdVisiable"
      :title="stdTitle"
      :standarDetail="standarDetail"
      @close="closeDetail"
    />
  </div>
</template>

<script>
// import viewStandardinfo from "@/components/scplat/viewStandardinfo";
import StdDetail from "@/components/bussinessCom/model/stdDetail";
import Api from "@api/infoModule";
import {
  listSystemBind,
  batchAddSystemBind,
  deleteSystemBind,
} from "@/api/standard/systemBind";
export default {
  name: "SystemBindList",
  components: {
    // viewStandardinfo
    StdDetail,
  },
  props: {
    currNode: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
    nodeIds: Array,
    stdSystemData: Object,
    editNodeSwitch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stdVisiable: false,
      stdTitle: "",
      standarDetail: null,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined,
      },
      bindStdLoading: false,
      bindStdList: [],
      delBindList: [],
      /** 标准信息弹窗参数 */
      viewLine: false,
      viewInfo: false,
      currItem: null,
      /** 选择标准 */
      selectStd: {
        visible: false,
        searchLoading: false,
        queryParams: {
          searchValueForNameOrNo: null,
          pageNo: 1,
          pageSize: 10,
        },
        total: 0,
        topicalList: [],
        // 选中数据
        selectedData: [],
        checkVisiable: false,
      },
    };
  },
  watch: {
    currNode: {
      handler(currNode) {
        if (!this.editNodeSwitch) this.getBindList();
      },
      immediate: true,
      deep: true,
    },
    stdSystemData: {
      handler(stdSystemData) {
        if (!this.editNodeSwitch) this.getBindList();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getBindList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getBindList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查看信息
    viewDoc(row) {
      // this.getTopicalInfo(row.stdId);
      Api.getTopicalListByStdId(row.stdId).then((res) => {
        this.currItem = res.data;
        this.standarDetail = this.currItem[0];
        this.stdTitle = `标准 [ ${this.standarDetail.stdName} ] 详情`;
        console.info("currItem=>", this.currItem);
        this.stdVisiable = true;
      });
    },
    /**
     * 关闭详情弹框
     */
    closeDetail() {
      this.stdVisiable = false;
      this.stdTitle = "";
      this.standarDetail = null;
    },
    // 删除绑定标准
    removeBindData(row) {
      let sel = this;
      this.$confirm(
        "确定删除" + row.stdNo + " 《" + row.stdName + "》吗？",
        "确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          deleteSystemBind(row.systemBindId).then((res) => {
            sel.$modal.msgSuccess("删除成功！");
            sel.getBindList();
          });
        })
        .catch(function () {});
    },
    getTopicalInfo(stdId) {
      Api.getTopicalListByStdId(stdId).then((res) => {
        this.currItem = res.data;
        console.info("currItem=>", this.currItem);
      });
    },
    // 获取绑定标准信息
    getBindList() {
      if (!this.currNode.stdSystemId && !this.stdSystemData) {
        return;
      }
      this.getSystemBindList();
    },
    // 获取体系绑定标准
    getSystemBindList() {
      const condition = _.cloneDeep(this.queryParams);
      condition.systemId = this.currNode.systemId
        ? this.currNode.systemId
        : this.stdSystemData.systemId;
      condition.nodeIds = this.nodeIds || [];
      this.bindStdLoading = true;
      listSystemBind(condition).then((response) => {
        this.bindStdList = response.rows.map((item) => {
          return {
            // status: item.status || item.bindTopic != null ?  item.bindTopic.status : '',
            systemBindId: item.systemBindId,
            stdId: item.stdId || item.bindTopic.stdId,
            stdNo: item.stdNo,
            stdName: item.stdName || item.bindTopic.stdName,
            stdPublishDate: item.bindTopic ? item.bindTopic.stdPublishDate : "",
            stdPerformDate: item.bindTopic ? item.bindTopic.stdPerformDate : "",
            stdExpiredDate: item.bindTopic ? item.bindTopic.stdExpiredDate : "",
            stdSystemNumber: item.stdSystemNumber,
            // 添加到 dataList
            bindTopic: item.bindTopic ? item.bindTopic : "",
          };
        });
        this.total = response.total;
        this.bindStdLoading = false;
      });
    },
    /*-------------------------------选择添加标准------------------------------*/
    // 打开选择标准弹窗
    openSelectStd() {
      this.selectStd.visible = true;
      if (this.$refs.selectStdTable != undefined)
        this.$refs.selectStdTable.clearSelection();
      this.selectStd.selectedData = [];
      this.getTopicalList();
    },
    // 获取标准题录
    getTopicalList() {
      this.selectStd.searchLoading = true;
      Api.getTopicalDetail(this.selectStd.queryParams).then((response) => {
        this.selectStd.topicalList = response.data.rows;
        this.selectStd.total = response.data.total;
        this.selectStd.searchLoading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectStd.selectedData = selection;
    },
    // 点击某一行
    clickSelectStdRow(row) {
      this.$refs.selectStdTable.toggleRowSelection(row);
    },
    // 打开确认选择标准弹窗
    openCheckBindStd() {
      console.info(
        "this.selectStd.selectedData==>",
        this.selectStd.selectedData
      );
      this.selectStd.checkVisiable = true;
    },
    // 重置选中标准
    handleBindRefresh() {
      this.$refs.selectStdTable.clearSelection();
      this.selectStd.selectedData = [];
    },
    // 删除选中标准
    removeSelectStd(row) {
      let index = this.selectStd.selectedData.findIndex((item) => {
        if (item.stdId == row.stdId) {
          return true;
        }
      });
      this.selectStd.selectedData.splice(index, 1);
      this.$refs.selectStdTable.toggleRowSelection(row, false);
    },
    // 分发选择标准
    handleBindStd() {
      // 体系绑定
      let insertList = this.selectStd.selectedData.map((item) => {
        return {
          systemId: this.currNode.systemId,
          systemNodeId: this.currNode.systemNodeId,
          stdId: item.stdId,
          stdNo: item.stdNo,
          stdName: item.stdName,
          stdKind: item.stdType,
          bindType: 1,
        };
      });
      let insertData = {
        insertList: insertList,
        systemNodeId: this.currNode.systemNodeId,
      };

      let stdIds = insertList.map((item) => item.stdId);
      let param = {
        stdIds: stdIds,
        systemNodeId: this.currNode.systemNodeId,
      };
      listSystemBind(param).then((listR) => {
        if (listR.total > 0) {
          this.$message.warning("存在已分发的标准，请删除后继续操作");
          return;
        }
        batchAddSystemBind(insertData).then((res) => {
          if (this.$refs.selectStdTable != undefined)
            this.$refs.selectStdTable.clearSelection();
          this.selectStd.selectedData = [];
          this.selectStd.checkVisiable = false;
          this.selectStd.visible = false;
          this.$message.success("绑定标准成功");
          this.getBindList();
          this.$emit("change");
        });
      });
    },
  },
  created() {
    this.getBindList();
  },
};
</script>

<style scoped lang="scss">
// @import '@/components/scplat/view-container.scss';
.system-bind-list {
  ::v-deep .bind-std-list {
    padding: 0 20px 20px 20px;
    height: calc(100% - 70px);
    overflow: auto;
    .bind-std-form {
      padding: 10px 0;
      .el-form-item {
        margin: 0 10px 0 0;
      }
    }
  }
  .bind-std-footer {
    display: flex;
    padding: 20px;
  }
  .bind-std-footer button {
    flex: 1;
  }
}
</style>