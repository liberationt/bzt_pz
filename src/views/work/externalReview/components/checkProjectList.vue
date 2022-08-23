<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="true"
  >
    <template slot="body">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 内容区 -->
      <div class="std-list-content">
        <!-- 结果列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: [],
          }"
          height="500"
          :clearSelection="false"
          :hasIndex="true"
          :checkeBox="true"
          :pageInfo="page"
          :isLoading="isTabLoading"
          @select-change="selecData"
        >
        </BztTable>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import {
  BztDialog,
  BztTable,
  BztPageContrl,
  BztSearch,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: {
    BztDialog,
    BztTable,
    BztPageContrl,
    BztSearch,
  },
  name: "check-project-list",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    proList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "选择复审标准",
        width: "1366px",
        footer: true,
        submintText: "确认",
      },
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "210",
        },
        {
          title: "标准名称",
          key: "stdName",
        },
        {
          title: "发布日期",
          key: "publishdate",
          width: "210",
        },
        {
          title: "实施日期",
          key: "dodate",
          width: "210",
        },
      ],

      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      listReq: {
        startTime: null,
        endTime: null,
        stdName: "",
        stdNo: "",
        stdStageNotIn: 90,
        isOut:1
      },
      searchInfo: {
        labelList: [
          {
            label: "实施时间",
            key: "dateTime",
            type: 3,
            formatStr: "yyyy-MM-dd",
            formatValStr: "yyyy-MM-dd",
            dateType: "datetimeRange",
          },
          { label: "标准名称", key: "stdName", type: 1 },
          { label: "标准编号", key: "stdNo", type: 1 },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      isTabLoading: false,
      projects: [],
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
    /**
     * 获取结果列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getStdList(this.listReq).then((res) => {
        const { code, rows, msg } = res;
        this.isTabLoading = false;
        if (code === 200) {
          this.list = [];
          rows.forEach((row) => {
            let has = false;
            this.proList.forEach((pro) => {
              if (row.id == pro.id) {
                has = true;
              }
            });
            if (has == false) {
              this.list.push(row);
            }
          });
          // this.list = rows;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      Object.keys(e).map((key) => {
        if (key == "dateTime") {
          if (e[key] != null) {
            this.listReq.startTime = e[key][0];
            this.listReq.endTime = e[key][1];
          } else {
            this.listReq.startTime = null;
            this.listReq.endTime = null;
          }
        } else {
          this.listReq[key] = e[key];
        }
      });
      this.getList();
    },
    /**
     * 选择列表数据
     * @params {*} e 选中的数据列表
     */
    selecData(e) {
      this.projects = e;
    },
    /**
     * 关闭弹框
     */
    closeDialog(e) {
      if (e == true) {
        if (this.projects.length < 0) {
          this.$$message.warning("还未选择标准，请先选择标准");
          return;
        }
        this.$emit("save", this.projects);
      } else {
        this.$emit("save", null);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .std-list-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>