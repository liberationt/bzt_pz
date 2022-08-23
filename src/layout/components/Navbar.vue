<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <BreadCrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!topNav"
    />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <!-- <div class="right-menu-item hover-effect">
        <router-link to="/messageManage">
          <el-badge
            :value="message"
            :max="99"
            :hidden="message <= 0"
            class="item"
          >
            <i class="el-icon-bell"></i>
          </el-badge>
        </router-link>
      </div> -->
      <Notice />
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <i
            v-if="avatar == null"
            class="el-icon-s-custom icon-avatar"
            style="color: #ffffff; font-size: 25px"
          />
          <img :src="avatar" class="user-avatar" v-else />
          <span class="user-name">{{
            userInfo.nickName &&
            userInfo.nickName != null &&
            userInfo.nickName != ""
              ? userInfo.nickName
              : userInfo.userName
          }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal/profile">
            <el-dropdown-item>我的资料</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BreadCrumb, Notice } from "@/components/bussinessCom/index.js";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";
import Api from "@/api/infoModule";
import { getToken } from "@/utils/auth";
import Bus from "@/utils/bus";
// import Notice from '../../components/bussinessCom/index';
export default {
  data() {
    return {
      message: "",
      timer: null,
    };
  },
  components: {
    BreadCrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    Notice,
  },
  mounted() {
    if (getToken()) {
      this.getMessageMount();
      Bus.$on("notice", () => {
        // 输出兄弟组件传递的内容
        this.getMessageMount();
      });
      this.timer = setInterval(() => {
        setTimeout(() => {
          this.getMessageMount();
        }, 0);
      }, 300000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "userInfo"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    getMessageMount() {
      Api.listCountMessage().then((res) => {
        // res.data.nonRead是后台传过来的未读消息数量
        this.message = res.data.nonRead;
      });
      this.message = localStorage.getItem("speedInfo");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            // location.href = "/";
            location.href = this.getConfigKey("oss.logOut.url");
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background: $bule;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    color: #ffffff !important;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .item {
        line-height: normal;
        .el-icon-bell {
          font-size: 20px;
          color: white;
        }
        ::v-deep .el-badge__content {
          border: 1px solid transparent;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        color: #ffffff;
        i {
          font-size: 25px;
          vertical-align: middle;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          border-radius: 50%;
          vertical-align: middle;
          margin-left: 15px;
        }
        .user-name {
          font-size: 15px;
          line-height: 30px;
          margin-left: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          // top: 25px;
          line-height: 50px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
