<template>
  <div class="app-container user-manager">
    <el-col :span="18" :xs="24" style="margin: auto; float: none">
      <el-card class="box-card">
        <div>
          <div class="text-center">
            <userAvatar :user="user" />
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">
              <svg-icon icon-class="user" />工号
              <div class="pull-right">{{ user.userName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="user" />用户名
              <div class="pull-right">{{ user.nickName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="phone" />手机号码
              <div class="pull-right">{{ user.phonenumber }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="email" />用户邮箱
              <div class="pull-right">{{ user.email }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="tree" />所属部门
              <div class="pull-right" v-if="user.dept">
                {{ user.dept.deptName }}
              </div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="peoples" />所属角色
              <div class="pull-right">{{ roleGroup }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="date" />创建日期
              <div class="pull-right">{{ user.createTime }}</div>
            </li>
          </ul>
        </div>
      </el-card>
      <div class="btns">
        <el-button class="submit-btn" @click="editUser(0)">编辑信息 </el-button>
        <el-button class="submit-btn" @click="editUser(1)">修改密码 </el-button>
      </div>
    </el-col>
    <!-- <el-col :span="10" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col> -->
    <BztDialog
      :dialogInfo="dialogEdit"
      @close="closeDetail"
      :appendTobody="false"
    >
      <template slot="body" v-if="dialogEdit.visible == true">
        <userInfo v-if="isEditPWD == false" :user="user" @close="closeDetail" />
        <resetPwd v-else :user="user" @close="closeDetail" />
      </template>
    </BztDialog>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";
import { BztDialog } from "@components/basicCom/index";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd, BztDialog },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      isEditPWD: false,
      dialogEdit: {
        visible: false,
        title: "编辑用户信息",
        width: "900px",
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
        this.roleGroup = response.roleGroup.replace(/,/g, "，");
        this.postGroup = response.postGroup;
      });
    },
    /**
     * 编辑用户信息/修改密码
     * @param {*} flag 0:编辑用户信息；1：修改密码
     */
    editUser(flag) {
      this.isEditPWD = flag == 1;
      this.dialogEdit.title = flag == 1 ? "修改密码" : "编辑用户信息";
      this.dialogEdit.visible = true;
    },
    closeDetail() {
      this.dialogEdit.visible = false;
      this.getUser();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-manager {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: auto;
  .list-group-item {
    line-height: 20px;
    .svg-icon {
      margin-right: 10px;
      font-size: 18px;
    }
  }
  .btns {
    margin-top: 25px;
    text-align: center;
  }
}
</style>
