<template>
  <BztDialog :dialogInfo="dialogInfo" @close="closeDialog" :appendTobody="true">
    <template slot="body">
      <div class="select-user-by-dept">
        <div
          class="company-list"
          v-if="dataSource.taskType != 1 && dataSource.taskType != 2"
        >
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
                @click="deptChange(node)"
                slot-scope="{ node }"
              >
                <!-- -->
                <el-checkbox
                  :value="checkDept === node.id"
                  :disabled="
                    deptIds.length > 0 && deptIds.indexOf(node.data.id) == -1
                  "
                >
                  {{ node.label }}
                </el-checkbox>
              </span>
            </el-tree>
          </ul>
        </div>
        <!-- 人员列表  -->
        <div
          class="company-list"
          :style="`width: 300px; overflow-x: hidden;margin:${
            dataSource.taskType != 1 && dataSource.taskType != 2 ? '' : 'auto'
          }`"
        >
          <span>选择用户</span>
          <div class="el-transfer-panel__filter">
            <el-input
              v-model="userName"
              placeholder="请输入用户姓名"
              prefix-icon="el-icon-search"
            />
          </div>

          <ul
            class="el-transfer-panel__list"
            v-if="deptList.length > 0"
            style="width: 300px; overflow-x: hidden"
          >
            <el-radio-group v-model="userId">
              <template v-for="option in userList">
                <el-radio
                  class="user"
                  :key="`user_${option.userId}`"
                  :label="option.userId"
                  :title="`${option.nickName}(${option.userName})`"
                  :disabled="disableUsers.indexOf(option.userId) > -1"
                >
                  {{ option.nickName }}({{ option.userName }})
                </el-radio>
              </template>
            </el-radio-group>
          </ul>
        </div>
        <!-- <el-transfer
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
            {{ option.nickName }}({{ option.userName }})
          </span>
        </el-transfer> -->
      </div>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import { treeselect as deptTreeselect } from "@api/system/dept";
import { listUser, listUserByRoleKey } from "@api/system/user";
import Api from "@api/process";

export default {
  components: { BztDialog, BztUploadFile },
  name: "transfer-to-other",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "转办选人",
        width: "600px",
        footer: true,
        loadding: false,
      },
      deptName: "",
      users: [],
      disableUsers: [],
      deptList: [],
      userList: [],
      checkDept: null,
      userName: "",
      userId: null,
      roleIds: [],
      deptIds: [],
    };
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.getUserOfNode();
  },
  methods: {
    /**
     * 初始化人员
     */
    initSelectUser(val = null) {
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
      if (this.dataSource.taskType == 1 || this.dataSource.taskType == 2) {
        this.getUserListByDept(200);
      } else {
        this.getUserListByDept(null);
      }

      deptTreeselect().then((res) => {
        this.deptList = [];
        const { code, msg, data } = res;
        if (code === 200) {
          this.deptList = data;
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
      if (this.deptIds.length == 0 || this.deptIds.indexOf(node.data.id) > -1) {
        this.checkDept = node.id;
        this.getUserListByDept(node.data.id);
      }
    },
    /**
     * 根据部门获取人员（用户）
     */
    getUserListByDept(id) {
      if (this.roleIds.length == 0) {
        const req = {
          deptId: id,
        };
        listUser(req).then((res) => {
          const { code, msg, rows } = res;
          if (code === 200) {
            this.userList = rows;
            if (this.disableUsers != "" && this.disableUsers != null) {
              this.disableUsers.forEach((id) => {
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
          roleKeys: this.roleIds.join(","),
        };
        listUserByRoleKey(req).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.userList = data;
          } else {
            // this.$message.error(msg);s
          }
        });
      }
    },
    getUserOfNode() {
      Api.getUserOfNode({ hook: this.dataSource.hook }).then((res) => {
        if (res.code == 200) {
          this.disableUsers = res.data.userList;
          if (res.data.rolesList != null) {
            this.roleIds = res.data.rolesList.map((item) => {
              return item.roleId;
            });
            this.deptIds = [];
            res.data.rolesList.forEach((item) => {
              if (item.deptId != null) {
                this.deptIds.push(item.deptId);
              }
            });
          }
          this.getDeptList(null);
        }
      });
    },
    /**
     * 筛选人员
     */
    handleChange(e) {
      let userArr = [];
      this.$cache.session.getJSON("sourceUserList").forEach((user) => {
        e.forEach((userId) => {
          if (userId == user.userId) {
            userArr.push({ depId: user.deptId, userId: userId });
          }
        });
      });
      this.$emit("user-change", userArr);
    },
    closeDialog(e) {
      if (e == true) {
        if (this.userId == null) {
          this.$message.warning("请选择要转办的用户");
          return;
        }
        console.log(this.dataSource);
        const req = {
          taskId: this.dataSource.taskId,
          userId: this.userId,
        };
        this.$set(this.dialogInfo, "loadding", true);
        Api.taskTransfer(req).then((res) => {
          this.$set(this.dialogInfo, "loadding", false);
          const { code, mag } = res;
          if (code == 200) {
            this.$message.success("操作成功");
            this.$emit("close", true);
          }
        });
      } else {
        this.$emit("close", false);
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
  ::v-deep.el-input__icon {
    line-height: 32px;
  }
  ::v-deep .el-input__inner {
    line-height: 32px;
  }
  ::v-deep.el-transfer-panel__body {
    height: 346px;
  }
  ::v-deep .user {
    width: 260px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
</style>