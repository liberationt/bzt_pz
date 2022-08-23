<template>
  <div class="user">
    <div class="date-time">{{ dateTime }}</div>
    <Notice :isHome="true" v-if="userInfo != undefined && name != undefined" />
    <div class="user-info">
      <div
        v-if="userInfo == undefined || name == undefined"
        class="link-text"
        @click="toLogin"
      >
        登录
      </div>
      <div v-else class="link-text" @click="loginOut">
        {{ userInfo.nickName || userInfo.userName }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Notice from "./notice.vue";
import { getAllUser } from "@/api/system/user";
import { getAllDept } from "@/api/system/dept";
export default {
  components: { Notice },
  name: "user",
  computed: {
    ...mapGetters(["userInfo", "name"]),
  },
  data() {
    return {
      dateTime: "",
    };
  },
  created() {
    const date = new Date();
    this.dateTime = this.parseTime(date.valueOf(), "{y}年{m}月{d}日  星期{a}");
    if (this.userInfo != undefined && this.name != undefined) {
      this.getUserList();
      this.getDeptList();
    }
  },
  methods: {
    /**
     * 登录
     */
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    /**
     * 进入工作台
     */
    toIndex() {
      const url = this.$router.resolve({
        path: "/index",
      });
      window.open(url.href, "_blank");
    },
    /**
     * 退出登录
     */
    async loginOut() {
      this.$confirm("确定退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = this.getConfigKey("oss.logOut.url");
          });
        })
        .catch(() => {});
    },
    getUserList() {
      getAllUser().then((response) => {
        let userList = response.rows;
        this.$cache.session.setJSON("sourceUserList", userList);
      });
    },
    getDeptList() {
      getAllDept().then((response) => {
        let deptList = response.rows;
        this.$cache.session.setJSON("sourceDeptList", deptList);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.user {
  color: #333333;
  font-size: 15px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
  .date-time {
    margin-right: 50px;
  }
  .user-info {
    .login {
    }
  }
}
::v-deep .right-menu-item {
  color: #333333;
  margin-right: 30px;
}
</style>