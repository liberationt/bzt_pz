<template>
  <div class="notice-distribution">
    <SelectUserByDept
      v-if="infoDetail != null && witchDist == 1"
      :value="receiver.length > 0 ? receiver.join(',') : ''"
      :roleKeys="
        infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4
          ? 'stdLiaison'
          : ''
      "
      :disableUsers="infoDetail.receiver"
      :disableDepts="
        infoDetail.receiverDept != null ? infoDetail.receiverDept : []
      "
      @user-change="userChange"
      :checkDepAllUser="infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4"
    />
    <SelectUserByDept
      v-if="infoDetail != null && witchDist == 2"
      :value="secondReceiver.length > 0 ? secondReceiver.join(',') : ''"
      :deptIds="userInfo.deptId.toString()"
      :onlyUser="true"
      :roleKeys="''"
      :disableUsers="
        infoDetail.secondReceiver == null ? '' : infoDetail.secondReceiver
      "
      @user-change="userChange2"
    />
    <div class="footer">
      <div class="cancelBtn" @click="closeNotice(false)">取消</div>
      <el-button
        class="submit-btn"
        @click="closeNotice(true)"
        :loading="isLoading"
      >
      确定
        <!-- {{this.isBtnText?this.isBtnText:'确定'}} -->
      </el-button>
    </div>
  </div>
</template>
<script>
import SelectUserByDept from "./selectUserByDept.vue";
import Api from "@api/infoModule";
import { mapGetters } from "vuex";

export default {
  name: "notice-distribution",
  components: { SelectUserByDept },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    todoTask: {
      type: Object,
      default: {
        bussnessId: "",
        hook: "",
      },
    },
    visiable: {
      type: Boolean,
      default: false,
    },
    witchDist: {
      type: Number,
      default: null,
    },
    isBtnText:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
      infoDetail: { receiver: null, secondReceiver: null },
      isLoading: false,
      receiver: [],
      secondReceiver: [],
    };
  },
  watch: {
    todoTask: {
      deep: true,
      handler(val, oldVal) {
        this.isLoading = false;
        this.getTaskDetail();
      },
    },
  },
  mounted() {
    this.isLoading = false;
    this.getTaskDetail();
  },
  methods: {
    /**
     * 获取信息详情
     */
    getTaskDetail() {
      Api.getInfoDetail(this.todoTask.businessObjId).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.infoDetail = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 确认（取消）转发
     */
    closeNotice(e) {
      if (e == true) {
        if (this.witchDist == 1 && this.receiver.length > 0) {
          let arr = [];
          if (
            this.infoDetail.receiver != null &&
            this.infoDetail.receiver != ""
          ) {
            arr = this.infoDetail.receiver.split(",");
          }
          this.receiver.forEach((item) => {
            if (arr.indexOf(item.toString()) == -1 && arr.indexOf(item) == -1) {
              arr.push(item);
            }
          });
          this.infoDetail.receiver = arr.join(",");
          this.$emit("close",this.infoDetail,[])
        } else if (this.witchDist == 2 && this.secondReceiver.length > 0) {
          let arr = [];
          if (
            this.infoDetail.secondReceiver != null &&
            this.infoDetail.secondReceiver != ""
          ) {
            arr = this.infoDetail.secondReceiver.split(",");
          }
          this.secondReceiver.forEach((item) => {
            if (arr.indexOf(item.toString()) == -1 && arr.indexOf(item) == -1) {
              arr.push(item);
            }
          });
          this.infoDetail.secondReceiver = arr.join(",");
          this.$emit("close",this.infoDetail,this.secondReceiver)
        } else {
          this.$message.warning("请选择要转分发的人员");
          return;
        }
        return
        // this.isLoading = true;
        // Api.updatePublish(this.infoDetail).then((res) => {
        //   const { code, data, msg } = res;
        //   if (code === 200) {
        //     this.$message.success("通知分发成功");
        //     this.isLoading = false;
        //     this.$emit("success", null);
        //   } else {
        //     // this.$message.error(msg);
        //   }
        // });
      } else {
        this.$emit("close", null);
      }
    },
    /**
     * 信息分发选择人员
     */
    userChange(e) {
      this.receiver = e;
    },
    /**
     * 二次分发
     */
    userChange2(e) {
      this.secondReceiver = e;
      // if (
      //   this.infoDetail["secondReceiver"] &&
      //   this.infoDetail["secondReceiver"] != null &&
      //   this.infoDetail["secondReceiver"] != ""
      // ) {
      //   arr = this.infoDetail["secondReceiver"].split(",");
      //   debugger;
      // }
      // e.forEach((item) => {
      //   debugger;
      //   if (arr.indexOf(item.toString()) == -1 || arr.indexOf(item) == -1) {
      //     arr.push(item);
      //   }
      // });
      // this.infoDetail["secondReceiver"] = arr.join(",");
    },
  },
};
</script>
<style lang="scss" scoped>
.notice-distribution {
  width: 100%;
  height: 100%;
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
::v-deep .dialog-footer {
  padding: 0;
}
</style>