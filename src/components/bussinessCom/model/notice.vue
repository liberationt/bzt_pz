<template>
  <div class="right-menu-item hover-effect">
    <router-link to="/maintenance/task">
      <el-badge :value="message" :max="99" :hidden="message <= 0" class="item">
        <i
          class="el-icon-bell"
          :style="isHome == true ? 'color:#333333' : ''"
        ></i>
      </el-badge>
    </router-link>
  </div>
</template>
<script>
import Api from "@/api/infoModule";
import TaskApi from "@/api/system/todoTask";
import { getToken } from "@/utils/auth";
import Bus from "@/utils/bus";
export default {
  name: "notice",
  props: {
    isHome: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      message: "",
      timer: null,
    };
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
  methods: {
    getMessageMount() {
      // Api.listCountMessage().then((res) => {
      //   // res.data.nonRead是后台传过来的未读消息数量
      //   this.message = res.data.nonRead;
      // });
      this.message = 0;
      TaskApi.getStateCountByType(0).then((res) => {
        res.data.forEach((item) => {
          if (item.state == 0) {
            this.message = item.count;
          }
        });
      });
      this.message = localStorage.getItem("speedInfo");
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>