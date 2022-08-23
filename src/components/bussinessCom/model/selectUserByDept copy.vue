<template>
  <div class="select-user-by-dept">
    <div class="content" v-if="onlyUser == true">
      <ul class="el-transfer-panel__list">
        <el-checkbox-group v-model="users" @change="userChange">
          <template v-for="user in userList">
            <el-checkbox
              class="custom-tree-node dept-user"
              :key="user.userId"
              :label="user.userId"
              >{{ user.nickName }}({{ user.userName }})</el-checkbox
            >
          </template>
        </el-checkbox-group>
      </ul>
    </div>
    <div class="content" v-else-if="checkDepAllUser == false">
      <div class="company-list" v-if="showDepart == true">
        <span>选择公司（部门）</span>
        <div class="el-transfer-panel__filter">
          <el-input
            v-model="deptName"
            placeholder="请输入公司(部门)名称"
            prefix-icon="el-icon-search"
          />
        </div>

        <ul class="el-transfer-panel__list" v-if="deptList.length > 0">
          <el-tree
            :data="deptList"
            :filter-node-method="filterNode"
            ref="tree"
            empty-text="暂无数据"
            default-expand-all
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node }"
              @click="deptChange(node)"
            >
              <el-checkbox :value="checkDept === node.id"
                >{{ node.label }}
              </el-checkbox>
            </span>
          </el-tree>
        </ul>
      </div>
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="users"
        filterable
        :titles="['可选人员', '已选人员']"
        :button-texts="['加入左侧', '加入右侧']"
        :props="{
          key: 'userId',
          label: 'nickName',
        }"
        :format="{
          noChecked: ' ',
          hasChecked: ' ',
        }"
        @change="handleChange"
        :data="userList"
      >
        <span slot-scope="{ option }">
          {{ option.nickName }}({{ option.userName }})</span
        >
      </el-transfer>
    </div>
    <div class="content" v-else>
      <div class="company-list onyl-dept">
        <span>选择公司（部门）</span>
        <div class="el-transfer-panel__filter">
          <el-input
            v-model="deptName"
            placeholder="请输入公司(部门)名称"
            prefix-icon="el-icon-search"
          />
        </div>

        <ul class="el-transfer-panel__list" v-if="deptList.length > 0">
          <el-tree
            :data="deptList"
            :filter-node-method="filterNode"
            ref="tree"
            empty-text="暂无数据"
            default-expand-all
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node }"
              @click="deptsChange(node, node['click'])"
            >
              <el-checkbox :value="checkDepts.indexOf(node.data.id) != -1">
                {{ node.label }}
              </el-checkbox>
            </span>
          </el-tree>
        </ul>
      </div>
      <div class="company-list onyl-dept">
        <span>已选用户</span>

        <ul class="el-transfer-panel__list" v-if="deptList.length > 0">
          <template v-for="user in checkUserList">
            <div class="custom-tree-node dept-user" :key="user.userId">
              {{ user.nickName }}（{{ user.userName }}）
            </div>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import { treeselect as deptTreeselect } from "@api/system/dept";
import {
  listUser,
  listUserByRoleKey,
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";

export default {
  components: { BztDialog, BztUploadFile },
  name: "select-user-by-dept",
  dicts: ["info_publish_theme"],
  props: {
    value: {
      type: String,
      default: null,
    },
    hasDeptId: {
      type: Boolean,
      default: false,
    },
    roleKeys: {
      type: String,
      default: "",
    },
    deptIds: {
      type: String,
      default: "",
    },
    disableUsers: {
      type: String,
      default: "",
    },
    showDepart: {
      type: Boolean,
      default: true,
    },
    checkDepAllUser: {
      type: Boolean,
      default: false,
    },
    onlyUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deptName: "",
      users: [],
      deptList: [],
      userList: [],
      checkDept: null,
      checkDepts: [],
      checkUserList: [],
    };
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    value(val) {
      this.initSelectUser(val);
    },
  },
  mounted() {
    if (this.onlyUser == true) {
      this.getUserListByDept(this.deptIds);
    } else if (this.showDepart == true) {
      this.getDeptList();
    } else {
      this.getUserListByDept(null);
    }
    this.initSelectUser(this.value);
  },
  methods: {
    getUsersByDept(id) {
      const req = {
        deptIds: id,
        roleKeys: this.roleKeys,
      };
      listUserByDeptsAndRoleKeys(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.checkUserList = data;
          let userArr = [];

          if (this.hasDeptId == false) {
            this.checkUserList.forEach((user) => {
              userArr.push(user.userId);
            });
          } else {
            this.checkUserList.forEach((user) => {
              userArr.push({ depId: user.deptId, userId: user.userId });
            });
          }
          this.$emit("user-change", userArr);
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 初始化人员
     */
    initSelectUser(val) {
      if (val == null || val == "") {
        this.users = [];
      } else {
        if (this.hasDeptId != true) {
          // 筛选人员Id
          this.users = val.split(",").map((item) => {
            return Number(item);
          });
        } else {
          // {depId：'',userId:''}
          this.users = JSON.parse(val).map((item) => {
            return Number(item.userId);
          });
        }
      }
    },
    /**
     * 获取部门列表
     */
    getDeptList() {
      deptTreeselect().then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.deptList = data;
          if (this.checkDepAllUser == false) {
            this.getUserListByDept(null);
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索部门
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     * 选择部门
     */
    deptChange(node) {
      this.checkDept = node.id;
      this.getUserListByDept(node.data.id);
    },
    /**
     * 选择部门（多选）
     */
    deptsChange(e) {
      e["click"] = e.click == true ? false : true;
      if (e.click == true) {
        if (this.checkDepts.indexOf(e.data.id) == -1) {
          this.checkDepts.push(e.data.id);
        } else {
          this.checkDepts.forEach((item, index) => {
            if (e.data.id == item) {
              this.checkDepts.splice(index, 1);
            }
          });
        }

        if (this.checkDepts.length > 0) {
          this.getUserByDeptsAndRoleKeys(this.checkDepts.join(","));
        } else {
          this.checkUserList = [];
        }
        this.$emit("user-change", e);
      }
    },
    /**
     * 选择用户
     */
    userChange(e) {
      if (this.hasDeptId === false) {
        this.$emit("user-change", e);
      } else {
        let userArr = [];
        this.$cache.session.getJSON("sourceUserList").forEach((user) => {
          e.forEach((userId) => {
            if (userId == user.userId) {
              userArr.push({ depId: user.deptId, userId: userId });
            }
          });
        });
        this.$emit("user-change", userArr);
      }
    },
    /**
     * 根据部门获取人员（用户）
     */
    getUserListByDept(id) {
      if (this.roleKeys == null || this.roleKeys == "") {
        const req = {
          deptId: id,
        };
        listUser(req).then((res) => {
          const { code, msg, rows } = res;
          if (code === 200) {
            this.userList = rows;
            if (this.disableUsers != "" && this.disableUsers != null) {
              this.disableUsers.split(",").forEach((id) => {
                this.userList.forEach((user) => {
                  if (user.userId == id) {
                    user["disabled"] = true;
                  }
                });
              });
            }
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        const req = {
          deptId: id,
          roleKeys: this.roleKeys,
        };
        listUserByRoleKey(req).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.userList = data;
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 根据部门获取人员（用户）
     */
    getUserByDeptsAndRoleKeys(id) {
      const req = {
        deptIds: id,
        roleKeys: this.roleKeys,
      };
      listUserByDeptsAndRoleKeys(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.checkUserList = data;
          let userArr = [];

          if (this.hasDeptId == false) {
            this.checkUserList.forEach((user) => {
              userArr.push(user.userId);
            });
          } else {
            this.checkUserList.forEach((user) => {
              userArr.push({ depId: user.deptId, userId: user.userId });
            });
          }
          this.$emit("user-change", userArr);
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 筛选人员
     */
    handleChange(e) {
      if (this.hasDeptId === false) {
        this.$emit("user-change", e);
      } else {
        let userArr = [];
        this.$cache.session.getJSON("sourceUserList").forEach((user) => {
          e.forEach((userId) => {
            if (userId == user.userId) {
              userArr.push({ depId: user.deptId, userId: userId });
            }
          });
        });
        this.$emit("user-change", userArr);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.select-user-by-dept {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .company-list {
    width: 200px;
    height: 400px;
    margin-right: 20px;
    float: left;
    border: 1px solid #ebeef5;
    & > span {
      text-align: center;
      display: block;
      height: 40px;
      line-height: 40px;
      background-color: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
    }
    ul {
      height: 294px;
      overflow: auto;
    }
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .transfer-panel__empty {
      height: 30px;
      color: #909399;
      padding: 6px;
      text-align: center;
      line-height: 30px;
    }
  }
  .content {
    width: 100%;
  }
  .onyl-dept {
    float: left;
    width: 40%;
    &:last-child {
      float: right;
    }
  }
  ::v-deep.el-input__icon {
    line-height: 32px;
  }
  ::v-deep .el-input__inner {
    line-height: 32px;
  }
  ::v-deep.el-transfer-panel__body {
    height: 346px;
  }
  ::v-deep.el-transfer-panel__list.is-filterable {
    height: 294px;
    width: 100%;
  }
  ::v-deep.el-checkbox-group,
  ::v-deep.el-radio-group {
    display: inline-block;
    font-size: 14px;
    flex-direction: column;
    padding: 0 10px;
    .el-checkbox__label {
      font-size: 14px;
      padding-left: 20px;
    }
    .el-transfer-panel__item {
      padding-left: 0;
    }
  }
  ::v-deep.el-transfer__buttons > .el-button {
    display: block;
    margin: 8px 0;
    width: 100px;
    padding: 8px 3px;
    text-align: center;
    &:last-child {
      margin-right: 0;
    }
  }
}
::v-deep.el-checkbox-group,
::v-deep.el-radio-group {
  align-items: start;
  padding: 0 30px;
}
::v-deep.el-checkbox__label {
  padding-left: 20px !important;
}
::v-deep .el-transfer-panel__filter {
  width: auto !important;
}
::v-deep .dept-user {
  width: 100%;
  padding: 5px 10px;
}
</style>