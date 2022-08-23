<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['technical:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="dictCode" />
      <el-table-column label="标签" align="center" prop="dictLabel">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{scope.row.dictLabel}}</span>
          <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{scope.row.dictLabel}}</el-tag>
        </template> -->
      </el-table-column>
      <el-table-column label="排序" align="center" prop="dictSort" />
      <el-table-column label="相关附件" align="center" prop="remark">
        <template slot-scope="{row}">
          <el-button
            v-if="row.extend!=''&&row.extend!=null"
            size="mini"
            type="text"
            @click="fileDownLoad(row.extend)"
          >{{handelFile(row.extend)}}</el-button>
          <span v-else>暂无附件</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['technical:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['technical:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="上传附件" prop="fileList" ref="fileList">
            <BztUploadFile
              :value="form.fileList"
              :limit="1"
              :fileSize="100"
              @upload-change="fileChange"
            />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData, getData, delData, addData, updateData } from "@/api/system/dict/data";
import { listType, getType } from "@/api/system/dict/type";
import { BztUploadFile } from "@components/basicCom/index";

export default {
  name: "Data",
  dicts: ['sys_normal_disable'],
  components: { BztUploadFile },
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
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据标签回显样式
      listClassOptions: [
        {
          value: "default",
          label: "默认"
        },
        {
          value: "primary",
          label: "主要"
        },
        {
          value: "success",
          label: "成功"
        },
        {
          value: "info",
          label: "信息"
        },
        {
          value: "warning",
          label: "警告"
        },
        {
          value: "danger",
          label: "危险"
        }
      ],
      fileList:[],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: 'technical_committees',
        status: undefined
      },
      // 表单参数
      form: {
        fileList:[]
      },
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ],
        fileList:{
            required: true,
            message: "请上传附件",
            trigger: ["change","blur"], 
        }
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handelFile(file){
        // console.log(JSON.parse(file)[0].name)
        if(file!="" && file !=null){
            return JSON.parse(file)[0].name
        }else{
            return "暂无附件"
        }
       
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictLabel: undefined,
        dictSort: 0,
        extend:[],
        fileList:[]
      };
      this.resetForm("form");
    },
    
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.dictType = this.queryParams.dictType;
    },
    /**
     * 上传附件
     */
    fileChange(e) {
         this.form.fileList = e
         this.form.extend = this.form.fileList.length == 0 ? "" : JSON.stringify(
            this.form.fileList.map((item) => {
            return { name: item.name, url: item.url };
          })
        );
        if (this.form.fileList != "") {
          this.$refs.fileList.clearValidate();
        }
    },
    // 下载附件
    fileDownLoad(file){
        if(file){
            let {name,url} = JSON.parse(file)[0]
            this.downLoadByURL(url,name);
        }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictCode = row.dictCode || this.ids
      getData(dictCode).then(response => {
        this.form = response.data;
        this.form.fileList = []
        this.open = true;
        this.title = "修改字典数据";
        if(response.data.extend){
            JSON.parse(response.data.extend).map((item)=>{
                this.form.fileList.push({
                    name:item.name,
                    url:item.url
                })
            })
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
        console.log(this.form,99)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            updateData(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$modal.confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项？').then(function() {
        return delData(dictCodes);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/dict/data/export', {
        ...this.queryParams
      }, `data_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>