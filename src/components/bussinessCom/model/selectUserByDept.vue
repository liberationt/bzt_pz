<template>
  <div class="select-user-by-dept">
    <div class="content" v-if="onlyUser == true">
      <ul class="el-transfer-panel__list" style="text-align: left">
        <div>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全部人员</el-checkbox
          >
        </div>

        <el-checkbox-group v-model="users" @change="userChange">
          <template v-for="user in userList">
            <el-checkbox
              class="custom-tree-node dept-user"
              :key="user.userId"
              :label="user.userId"
              :disabled="disableUsers.indexOf(user.userId.toString()) != -1"
              >{{ user.nickName }}({{ user.userName }})
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </ul>
    </div>

    <!-- 根据部门查询  -->
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
            show-checkbox
            default-expand-all
            node-key="id"
            ref="deptsTree"
            highlight-current
            @check-change="deptTreeChange"
          >
          </el-tree>
          <!-- <el-tree
            :data="deptList"
            :filter-node-method="filterNode"
            ref="tree"
            empty-text="暂无数据"
            default-expand-all
            :check-strictly="true"
            @click="deptsChange(node, node['click'])"
            show-checkbox
            node-key="id"
          >-->
          <!-- <span
              class="custom-tree-node"
              slot-scope="{ node }"
              @click="deptsChange(node, node['click'])"
            > -->
          <!-- @click="deptChange(node)" -->
          <!--  -->
          <!-- <el-checkbox :value="checkDepts.indexOf(node.data.id) != -1"
                >{{ node.label }}
              </el-checkbox>
            </span> -->
          <!-- </el-tree> -->
        </ul>
      </div>
      <el-transfer
        v-if="checkOneUser == false"
        style="text-align: left; display: inline-block"
        v-model="users"
        filterable
        :titles="['全选', '全不选']"
        :props="{
          key: 'userId',
          label: 'nickName',
        }"
        @change="handleChange"
        @left-check-change="checkUser"
        @right-check-change="unCheckUser"
        :data="userList"
      >
        <!--         :format="{
          noChecked: ' ',
          hasChecked: ' ',
        }" -->
        <!-- :button-texts="['加入左侧', '加入右侧']" -->
        <span slot-scope="{ option }">
          {{ option.nickName }}({{ option.userName }})</span
        >
      </el-transfer>
      <!-- 单选人员 -->
      <ul class="company-list" v-else style="text-align: left; width: 380px">
        <span>选择用户</span>
        <div class="el-transfer-panel__filter">
          <el-input
            v-model="userName"
            placeholder="用户名"
            prefix-icon="el-icon-search"
          />
        </div>
        <el-radio-group v-model="checkedUser" @change="checkOnlyUser">
          <template v-for="user in userList">
            <el-radio
              class="custom-tree-node dept-user"
              :key="user.userId"
              :label="user.userId"
              >{{ user.nickName }}({{ user.userName }})
            </el-radio>
          </template>
        </el-radio-group>
      </ul>
    </div>
    <!-- 选择部门下所有某角色的人员 -->
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
          <!-- <el-tree
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
          </el-tree> -->
          <el-tree
            :data="deptList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="deptsTree"
            highlight-current
            :default-checked-keys="checkDepts"
            @check-change="deptTreeChange"
          >
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
    disableDepts: {
      type: Array,
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
    checkOneUser: {
      type: Boolean,
      default: false,
    },
    getUserInfo: {
      type: Boolean,
      default: false,
    },
    isDefaultValue:{
      type: Boolean,
      default: false,
    },
    defaultCheckedValue:{
      type:Array,
      default:()=>{
        return []
      }
    }
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
      checkAll: false,
      isIndeterminate: false,
      checkedUser: null,
      userName: "",
    };
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    userName(val) {
      this.getUserByDeptsAndRoleKeys(this.deptIds);
    },
    value(val) {
     if(this.hasDeptId === false){
        this.users =
        val != ""
          ? val.split(",").map((id) => {
              return Number(id);
            })
          : [];
     }else{
       this.users = 
        val != ""
          ? JSON.parse(val).map((user) => {
              return Number(user.userId);
            })
          : [];
     }
    },
    disableDepts(val) {
      if (val.length > 0) {
        this.checkDepts = val;
        this.getDeptList();
      }
    },
  },
  mounted() {
   if(this.hasDeptId === false){
        this.users =
        this.value != ""
          ? this.value .split(",").map((id) => {
              return Number(id);
            })
          : [];
     }else{
       this.users =
        this.value  != ""
          ? JSON.parse(this.value ).map((user) => {
              return Number(user.userId);
            })
          : [];
     }
    if (this.checkOneUser == true) {
      this.checkedUser = Number(this.users);
    }
    if (this.disableDepts&&this.disableDepts.length > 0) {
      this.checkDepts = this.disableDepts;
    }
    if (this.onlyUser == true) {
      this.getUserListByDept(this.deptIds);
    } else if (this.showDepart == true) {
      this.getDeptList();
    } else {
      this.getUserListByDept(this.deptIds);
    }
    this.getUserListByDept(this.deptIds)
  },
  methods: {
    getUsersByDept(id) {
      const req = {
        deptIds: id,
        roleKeys: this.roleKeys,
        userName: this.userName,
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
          this.users.forEach((userId) => {
            this.userList.map((user) => {
              if (user.userId == userId) {
                user["chosse"] = true;
              }
            });
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
          this.setDept(this.deptList);
          if (this.checkDepAllUser == false) {
            this.getUserListByDept(null);
          }
          //处理回显默认值 根据部门id
          if(this.defaultCheckedValue&&this.defaultCheckedValue.length){
            this.$nextTick(()=>{
                this.$refs.deptsTree.setCheckedKeys(this.defaultCheckedValue)
            })
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    setDept(list) {
      list.forEach((dept) => {
        dept["disabled"] = false;
        if (this.disableDepts&&this.disableDepts.indexOf(dept.id) != -1) {
          dept["disabled"] = true;
        }
        if (dept.children && dept.children.length > 0) {
          this.setDept(dept.children);
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
    deptTreeChange(e) {
      this.checkDepts = this.$refs.deptsTree.getCheckedKeys();
      if (this.checkDepts.length > 0) {
        // 把部门id回传 为后续回显
        this.getUserByDeptsAndRoleKeys(this.checkDepts.join(","),this.checkDepts);
        // this.getUserByDeptsAndRoleKeys(this.checkDepts.join(","));
      } else {
        this.checkUserList = [];
        this.userList = [];
        if (this.checkDepAllUser == true) {
          this.$emit("user-change", []);
        }
      }
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
      }
    },
    /**
     * 选择用户
     */
    userChange(e) {
      if (this.hasDeptId === false) {
        this.$emit(
          "user-change",
          e.filter((id) => {
            return Number(id);
          })
        );
      } else {
        let userArr = [];
        this.$cache.session.getJSON("sourceUserList").forEach((user) => {
          e.forEach((userId) => {
            if (userId == user.userId) {
              userArr.push({ depId: user.deptId, userId: userId });
              // userArr.push(userId);
            }
          });
        });
        this.$emit("user-change", userArr);
      }
        this.isIndeterminate = e.length > 0 && e.length < this.userList.length;
    },
    /**
     * 选择用户
     */
    checkUser(e) {
      if (this.checkOneUser == false) {
        e.forEach((item) => {
          if (this.users.indexOf(item) == -1) {
            this.users.push(item);
          }
        });
      } else {
        users = e;
      }
      this.userChange(this.users);
    },
    /**
     * 取消用户
     */
    unCheckUser(e) {
      e.forEach((item) => {
        this.users.splice(this.users.indexOf(item), 1);
      });
      this.userChange(this.users);
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
            this.userList.map((user) => {
              user["choose"] = false;
              return user;
            });
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
    getUserByDeptsAndRoleKeys(id,checkDepts=null) {
      const req = {
        deptIds: id,
        roleKeys: this.roleKeys,
        userName: this.userName,
      };
      listUserByDeptsAndRoleKeys(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if (this.checkDepAllUser == false) {
            this.userList = data;
          } else {
            this.checkUserList = data;
          }
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
          //田建民  区分之前的  保留已选择的部门id 
          if(checkDepts){
            this.$emit("user-change", userArr,checkDepts);
          }else{
            this.$emit("user-change", userArr);
          }
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
    /**
     * 单选人员
     */
    checkOnlyUser(e) {
      this.checkedUser = e;
      let checkUser = {};
      this.userList.forEach((item) => {
        if (item.userId == e) {
          checkUser = item;
        }
      });
      if (this.getUserInfo == true) {
        this.$emit("user-change", checkUser);
      } else if (this.hasDeptId === true) {
        const selUser = { depId: checkUser.deptId, userId: e };
        this.$emit("user-change", selUser);
      } else {
        this.$emit("user-change", e);
      }
    },
    handleCheckAllChange(val) {
      let ids = [];
      if (val == true) {
        if(this.hasDeptId === false){
           ids = this.userList.map((item) => {
            if(this.disableUsers!=''&&this.disableUsers.split(",").indexOf((item.userId))!=-1) return
            return item.userId;
          });
        }else{
          ids = this.userList.map((item) => {
            if(this.disableUsers!=''&&this.disableUsers.split(",").indexOf(String(item.userId))!=-1) return
            return { depId: item.deptId, userId:item.userId }
          });
        }
      }
      ids = ids.filter((item)=>item!=undefined)
      this.users = ids
      this.$emit("user-change", ids);
      this.isIndeterminate = false;
    },
    /**
     * 获取部门
     * @param {*} deptId 要查询的部门ID
     */
    getDeptName(deptId) {
      const sourceDeptList = this.$cache.session.getJSON("sourceDeptList");

      if (deptId == null) return "—";
      const dept = _.find(sourceDeptList, { deptId: deptId });
      return dept ? dept.deptName : "-";
    },
  },
};
</script>
<style lang="scss" scoped>
.select-user-by-dept {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .company-list {
    width: 200px;
    height: 400px;
    margin-right: 20px;
    overflow: auto;
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
  ::v-deep .el-transfer__buttons > .el-button {
    display: none !important;
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