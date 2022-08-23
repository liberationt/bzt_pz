<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="true"
  >
    <template slot="body">
      <!-- 内容区 -->
      <div class="rw-result-list-content">
        <!-- 结果列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: [],
          }"
          height="500"
          :clearSelection="false"
          :hasIndex="false"
          :checkeBox="false"
          :pageInfo="page"
          :isLoading="isTabLoading"
        >
        </BztTable>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztTable } from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: {
    BztDialog,
    BztTable,
  },
  name: "rw-result-list",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: [Number,String],
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "各部门完成情况",
        width: "900px",
      },
      tabClums: [
        // {
        //   title: "项目名称",
        //   key: "pdcaStdlist.stdName",
        //   minWwidth: "160",
        // },
        // {
        //   title: "处理部门",
        //   key: "opinionDeptId",
        //   width: "210",
        //   filter: {
        //     type: "dept",
        //   },
        // },
        // {
        //   title: "处理人员",
        //   key: "opinionUserId",
        //   filter: {
        //     type: "user",
        //   },
        // },
        // {
        //   title: "处理状态",
        //   key: "conclusion",
        //   filter: {
        //     type: "filter",
        //     action: (data) => {
        //       return data != null ? "已处理" : "未处理";
        //     },
        //   },
        // },
        // {
        //   title: "处理时间",
        //   key: "opinionDate",
        // },

        {
          title: "处理人",
          key: "userId",
          minWwidth: "160",
          filter: {
            type: "filter",
            action: (data) => {
              console.log(data,"999")
              // return data != null ? "已处理" : "未处理";
              return this.getUserName(data)
            },
          },
        },
        {
          title: "完成状态",
          key: "status",
          minWwidth: "160",
          filter: {
            type: "filter",
            action: (data) => {
              return data == 1 ? "已完成" : "未完成";
            },
          },
        },
        {
          title: "节点名称",
          key: "name",
          minWwidth: "160",
          filter: {
            type: "filter",
            action: (data) => {
              return data!=null?data.split("|")[2]:"";
            },
          },
        },
        {
          title: "创建时间",
          key: "createAt",
          minWwidth: "160",
        },
        {
          title: "完成时间",
          key: "processTime",
          minWwidth: "160",
        },
      ],

      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isTabLoading: false,
    };
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if ((this.visiable = true)) {
      this.getList();
    }
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.visiable = val;

        if (val == true) {
          this.getList();
        }
      },
    },
  },
  methods: {
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 获取结果列表
     */
    getList() {
      this.isTabLoading = true;
      // Api.listByTaskId({ taskId: this.taskId }).then((res) => {
      //   const { code, data, msg } = res;
      //   this.isTabLoading = false;
      //   if (code === 200) {
      //     this.list = data==null?[]:data;
      //   } else {
      //   }
      // });
      Api.findProcess({ id: this.taskId,type:13 }).then((res) => {
        const { code, data, msg } = res;
        this.isTabLoading = false;
        if (code === 200) {
          this.list = data==null?[]:data;
        } else {
        }
      });
    },
    /**
     * 关闭弹框
     */
    closeDialog(e) {
      this.dialogInfo.visible = false;
      this.$emit("close", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .rw-result-list-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>