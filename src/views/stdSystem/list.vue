<template>
  <div class="app-container system-list-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="体系名称" prop="systemName">
        <el-input
          v-model="queryParams.systemName"
          placeholder="请输入体系名称"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['stdSystem:add']"
          >添加体系</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['stdSystem:edit']"
        >修改信息</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['stdSystem:remove']"
          >批量删除</el-button
        >
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="systemList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="体系名称"
        align="center"
        prop="systemName"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="link-text" @click="toSystemEdit(scope.row)">{{
            scope.row.systemName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建用户" align="center" prop="createUser">
        <template slot-scope="scope">
          {{ parseUser(scope.row.createUser) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-operation"
            @click="toSystemEdit(scope.row)"
            >查看体系</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['stdSystem:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['stdSystem:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改体系对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      center
    >
      <div style="width: 400px; margin: 0 auto">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="体系名称" prop="systemName">
            <el-input
              v-model="form.systemName"
              placeholder="请输入体系名称"
              maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStdSystem,
  listStdSystem,
  addStdSystem,
  updateStdSystem,
  deleteStdSystem,
} from "@/api/standard/system";
export default {
  name: "StdSystemList",
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 体系表格数据
      systemList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "create_time",
        isAsc: "desc",
        publish: 2,
        systemName: undefined,
      },
      // 表单校验
      rules: {
        systemName: [
          { required: true, message: "体系名称不能为空", trigger: "blur" },
        ],
      },
      // 源用户列表
      sourceUserList: [],
    };
  },
  methods: {
    /** 查询体系列表 */
    getList() {
      this.loading = true;
      listStdSystem(this.queryParams).then((response) => {
        this.systemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.deptId;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        systemId: undefined,
        systemName: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.systemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加体系";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const systemId = row.systemId || this.ids;
      getStdSystem(systemId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改体系信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.systemId != undefined) {
            updateStdSystem(this.form).then((response) => {
              if (response.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addStdSystem(this.form).then((response) => {
              if (response.code === 200) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const systemIds = row.systemId || this.ids;
      let msg = row.systemId
        ? '确认要删除"' + row.systemName + '"吗？'
        : "确认要删除选中的体系吗？";
      msg += "删除后的数据不能恢复，请谨慎操作！";
      this.$confirm(msg, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStdSystem(systemIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    // 格式化用户
    parseUser(id) {
      let user = _.find(this.sourceUserList, { userId: id });
      return user ? user.nickName : "";
    },
    // 前往编辑体系
    toSystemEdit(row) {
      this.$router.push({ path: "/stdSystem/detail/index/" + row.systemId });
    },
  },
  created() {
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.getList();
  },
};
</script>
