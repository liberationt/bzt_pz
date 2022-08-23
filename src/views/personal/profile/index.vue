<template>
  <div class="prosonal-profile-container">
    <div class="header-background"></div>
    <div class="user-info" v-if="userInfo">
      <div class="user-info-header">
        <div class="user-avatar">
          <img :src="getAvatar" class="img-circle" />
        </div>
        <div class="header-btn">
          <el-button
            v-if="isMe"
            size="small"
            icon="el-icon-edit-outline"
            round
            @click="editUserInfo()"
          >
            编辑信息
          </el-button>
        </div>
        <div class="header-info">
          <div class="header-user-name">
            <i class="el-icon-user" /> {{ displayName }}
          </div>
        </div>
        <div class="header-info-b">
          <ul>
            <li>
              <div>工号</div>
              <div>{{ userInfo.userName }}</div>
            </li>
            <li>
              <div>手机号</div>
              <div>{{ getUserPhone }}</div>
            </li>
            <li>
              <div>邮箱</div>
              <div>
                <span v-if="isEmpty(userInfo.email)" class="empty">暂无</span>
                <span>{{ userInfo.email }}</span>
              </div>
            </li>
            <li>
              <div>所属部门</div>
              <div>{{ userInfo.dept.deptName }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="user-relevant-body">
        <div class="user-relevant">
          <el-tabs v-model="activeName">
            <el-tab-pane label="账号信息" name="detail">
              <el-descriptions class="margin-top" :column="3" border>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user"></i>
                    工号
                  </template>
                  {{ userInfo.userName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user"></i>
                    用户名
                  </template>
                  {{ userInfo.nickName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-mobile-phone"></i>
                    手机号
                  </template>
                  {{ userInfo.phonenumber }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-receiving"></i>
                    邮箱
                  </template>
                  {{ userInfo.email }}
                </el-descriptions-item>
                <el-descriptions-item :span="2">
                  <template slot="label">
                    <i class="el-icon-office-building"></i>
                    所属部门
                  </template>
                  {{ userInfo.dept.deptName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user"></i>
                    性别
                  </template>
                  {{ getGender }}
                </el-descriptions-item>
                <!-- <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-date"></i>
                    注册时间
                  </template>
                  {{ parseDate(userInfo.createTime) }}
                </el-descriptions-item> -->
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-date"></i>
                    最后登录时间
                  </template>
                  {{ parseDate(userInfo.loginDate) }}
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 个人简介
 */
import { getUserProfile } from "@/api/system/user";
export default {
  name: "PersonalProfile",
  data() {
    return {
      // 我的信息
      myInfo: null,
      // 当前主页用户信息
      userInfo: null,
      // 我的相关内容
      activeName: "detail",
      // 文章列表
      bbsList: [],
      bbsLoading: false,
      searchValue: null,
      searchParams: {
        parentId: "0",
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      isFavorite: false,
      favoriteData: null,
      editVisible: false,
    };
  },
  computed: {
    // 是否为当前用户
    isMe() {
      console.info("myInfo=>", this.myInfo);
      if (this.userInfo && this.myInfo) {
        return this.userInfo.userId == this.myInfo.userId;
      } else {
        return false;
      }
    },
    // 显示手机号
    getUserPhone() {
      return this.userInfo.phonenumber;
    },
    // 显示头像
    getAvatar() {
      if (this.userInfo && this.userInfo.avatar && this.userInfo.avatar != "") {
        return process.env.VUE_APP_BASE_API + this.userInfo.avatar;
      } else {
        return require("@/assets/images/profile.jpg");
      }
    },
    // 显示性别
    getGender() {
      if (this.userInfo && this.userInfo.sex != null) {
        if (this.userInfo.sex == 0) {
          return "男";
        } else if (this.userInfo.sex == 1) {
          return "女";
        } else if (this.userInfo.sex == -1) {
          return "未知";
        }
      } else {
        return "";
      }
    },
    // 显示用户名
    displayName() {
      if (this.userInfo.nickName) {
        return this.userInfo.nickName;
      } else if (this.userInfo.userName) {
        return this.userInfo.userName;
      } else {
        return this.userInfo.phonenumber;
      }
    },
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      if (this.$route.params && this.$route.params.userId) {
        // 查询用户
      } else {
        // 获取当前用户
        this.userInfo = this.$store.state.user.userInfo;
      }
    },
    isEmpty(value) {
      return _.isEmpty(value);
    },
    parseDate(date) {
      if (date) {
        return this.parseTime(new Date(date), "{y}-{m}-{d}");
      }
      return "";
    },
    editUserInfo() {
      this.$router.push("/user/profile");
    },
  },
  created() {
    this.myInfo = this.$store.state.user.userInfo;
    this.getUserInfo();
  },
};
</script>

<style scoped lang="scss">
.prosonal-profile-container {
  min-height: calc(100vh - 84px);
  background: #f6f6f6;
  .header-background {
    background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
    height: 100px;
  }
  .user-info {
    position: relative;
    .user-info-header {
      position: relative;
      padding: 0 30px 30px;
      background: #fff;
      box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.08);
      .header-btn {
        text-align: right;
        padding-right: 10%;
        padding-top: 20px;
        margin-bottom: 50px;
        height: 52px;
      }
      .user-avatar {
        width: 120px;
        height: 120px;
        border: 4px solid #fff;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        transform: translateX(-50%);
        top: -30px;
        left: 50%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .img-circle {
          width: 100%;
          height: 100%;
        }
      }
      .header-info {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #303133;
        font-size: 22px;
        line-height: 30px;
      }
      .header-info-b {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        ul {
          list-style: none;
          display: flex;
          li {
            width: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            &:not(:last-child)::after {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              content: "";
              height: 24px;
              width: 1px;
              background: #e8e8ed;
            }
            div:nth-child(1) {
              font-size: 16px;
              color: #909399;
              margin-bottom: 15px;
            }
            div:nth-child(2) {
              color: #303133;
              font-size: 16px;
            }
            .empty {
              color: #c0c4cc;
            }
          }
        }
      }
    }
    .user-relevant-body {
      padding: 15px 10%;
      width: 100%;
      .user-relevant {
        position: relative;
        background: #fff;
        border: 1px solid #e2e2e2;
        box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.08);
        border-radius: 5px;
        padding: 20px;
        min-height: 400px;
        ::v-deep .el-table .el-table__header-wrapper th {
          word-break: break-word;
          background-color: #f8f8f9;
          color: #515a6e;
          height: 40px;
          font-size: 13px;
        }
        // ::v-deep .el-tabs__header{
        //   margin-bottom: 0;
        // }
        .link {
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        .table-page {
          margin-top: 20px;
        }
        .search-form {
          width: 300px;
          position: absolute;
          right: 20px;
          top: 15px;
        }
      }
    }
  }
}
</style>