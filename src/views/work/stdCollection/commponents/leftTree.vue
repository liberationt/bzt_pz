<template>
  <div class="left-tree">
    <div class="title" v-hasPermi="['stdCollection:updateLeftTree']">
      标准资料管理
      <i class="add-type el-icon-plus" @click="addType(null, 0)" />
    </div>
    <!-- 分类列表 -->
    <div class="category-list">
      <el-tree
        class="category-tree"
        :data="list"
        node-key="id"
        default-expand-all
        :props="{
          label: 'name',
          children: 'children',
          id: 'id',
        }"
        :expand-on-click-node="false"
        @node-click="nodeClick"
      >
        <span
          :class="
            node.data.id != activeId
              ? 'custom-tree-node'
              : 'custom-tree-node custom-tree-node-sel'
          "
          slot-scope="{ node, data }"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="node.label"
            placement="top-start"
          >
            <span>
              {{
                node.label.length > 9
                  ? `${node.label.substring(0, 8)}...`
                  : node.label
              }}
            </span>
          </el-tooltip>
          <span
            v-hasPermi="['stdCollection:updateLeftTree']"
            class="action-list"
          >
            <i
              class="el-icon-plus link-text"
              @click="addType(null, node.data.id)"
            />
            <i
              class="el-icon-edit-outline link-text"
              @click="addType(node.data, node.data.id)"
            />
            <i
              class="el-icon-delete red-link-text"
              @click="remove(node.data)"
            />
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 添加/编辑分类 -->
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-form
          :model="typeForm"
          :rules="rules"
          ref="typeForm"
          label-suffix=":"
          label-width="100px"
          class="typeForm"
        >
          <el-form-item label="父级目录" prop="name">
            <div class="pro-name">
              <el-cascader
                v-model="typeForm.parentTypeId"
                :options="list"
                @change="handleChange"
                :props="{
                  label: 'name',
                  children: 'children',
                  value: 'id',
                  checkStrictly: true,
                }"
                clearable
              />
            </div>
          </el-form-item>
          <el-form-item label="类目名称" prop="name">
            <el-input placeholder="请输入类目名称" v-model="typeForm.name" />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/process.js";
import { mapGetters } from "vuex";
import { BztDialog } from "@components/basicCom/index";
const typeForm = {
  id: null,
  name: "",
  parentTypeId: 0,
};
export default {
  components: { BztDialog },
  name: "left-tree",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: ["list", "activeId"],
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "编辑修改分类",
        width: "600px",
        footer: true,
        loadding: false,
      },
      typeForm: this.deepClone(typeForm),
      rules: {
        name: { required: true, message: "类目标题不能为空", trigger: "blur" },
      },
    };
  },
  mounted() {},
  methods: {
    /**
     * 添加分类
     * @param {*} data 父级参数
     */
    addType(data, parentId) {
      this.dialogInfo.title = "新增目录";
      this.dialogInfo.loadding = false;
      this.typeForm = this.deepClone(typeForm);
      this.typeForm.parentTypeId = parentId;
      if (data != null) {
        this.typeForm.parentTypeId = data.parentTypeId;
        this.typeForm.name = data.name;
        this.typeForm.id = data.id;
        this.dialogInfo.title = "编辑目录";
      }
      this.dialogInfo.visible = true;
    },
    /**
     * 选择父级分类
     */
    handleChange(e) {},
    /**
     * 保存 分类
     */
    closeDialog(e) {
      if (e == true) {
        this.$refs.typeForm.validate((valid) => {
          if (valid) {
            this.dialogInfo.loadding = true;
            Api.addDocType(this.typeForm).then((res) => {
              this.dialogInfo.loadding = false;
              const { code, msg } = res;
              if (code == 200) {
                this.$message.success("目录已更新");
                this.dialogInfo.visible = false;
                this.$emit("update", null);
              } else {
                this.$message.error(msg);
              }
            });
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.$emit("update", null);
      }
    },
    /**
     * 移除分类
     * @param {*} e 要移除的目录的信息
     */
    remove(e) {
      this.$confirm(`确定删除目录：《${e.name}》吗？`, "目录", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.delDocType(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除目录：${e.name}`);
              this.$emit("update", null);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 选择分类
     */
    nodeClick(e) {
      console.log(e);
      this.$emit("nodeChange", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.left-tree {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 38px;
    line-height: 38px;
    background: $bule;
    color: #ffffff;
    padding: 0px 12px;
    vertical-align: middle;
    .add-type {
      float: right;
      background: #fefefe;
      border: 1px solid #fefefe;
      color: #333333;
      height: 20px;
      width: 20px;
      line-height: 18px;
      text-align: center;
      margin-top: 9px;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        border: 1px solid #eeeeee;
      }
    }
  }
  .category-list {
    width: 100%;
    border: 1px solid #efefef;
    ::v-deep .category-tree {
      width: 100%;
      font-size: 15px !important;
      .el-tree-node {
        .el-tree-node__content {
          height: 38px;
          line-height: 38px;
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }
      }
    }
    .custom-tree-node {
      width: 100%;
      line-height: 38px;
      .action-list {
        float: right;
        i {
          font-size: 18px;
        }
      }
    }
    .custom-tree-node-sel {
      color: $bule;
    }
  }
}
</style>