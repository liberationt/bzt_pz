<template>
  <div class="std-collection app-container">
    <!-- 左侧目录树 -->
    <div class="category">
      <left-tree
        :list="cotegoryList"
        :activeId="listReq.parentTypeId"
        @update="getCategoryList()"
        @nodeChange="categoryChange"
      />
    </div>

    <!-- 右侧列表 -->
    <div class="list">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 功能操作行 -->
      <div class="operation-line">
        <!-- 资料化业务人员 可创建 -->
        <div class="submit-btn" @click="addFile()">
          <i class="el-icon-edit-outline" />
          上传资料
        </div>
      </div>

      <!-- 任务列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '140px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
      >
        <template slot="remove" slot-scope="{ scope }">
          <span class="link-text" @click="downloadFile(scope)"> 下载文件 </span>
          <span
            class="red-link-text"
            @click="removeFile(scope)"
            v-hasPermi="['project:remove']"
          >
            删除
          </span>
        </template>
      </BztTable>

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </div>

    <!-- 上传资料 -->
    <UploadFile
      v-if="uploadFileVisiable == true"
      :visiable="uploadFileVisiable"
      :parentTypeId="listReq.parentTypeId"
      @save="saveFile"
    />
  </div>
</template>
<script>
import leftTree from "./commponents/leftTree.vue";
import Api from "@api/process.js";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import UploadFile from "./commponents/uploadFile.vue";
export default {
  name: "std-collection",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { leftTree, BztSearch, BztTable, BztPageContrl, UploadFile },
  data() {
    return {
      cotegoryList: [],
      listReq: {
        parentTypeId: null,
        uploadTime: "",
        uploadUser: "",
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      searchInfo: {
        labelList: [
          { label: "资料名称", key: "name", type: 1 },
          {
            label: "上传日期",
            key: "dateTime",
            type: 3,
            formatStr: "yyyy-MM-dd",
            formatValStr: "yyyy-MM-dd",
            dateType: "datetimeRange",
          },
          { label: "上传人员", key: "uploadUser", type: 4 },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "资料名称",
          key: "name",
          width: "230",
        },
        {
          title: "上传日期",
          key: "uploadTime",
          minWidth: "350",
        },
        {
          title: "上传人",
          key: "uploadUserId",
          width: "180",
          filter: {
            type: "user",
          },
        },
      ],
      tabAction: [{ label: "删除", type: "slot", btnName: "remove" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isTabLoading: false,
      uploadFileVisiable: false,
    };
  },
  mounted() {
    // 加载分类列表
    this.getCategoryList();
    this.getList();
  },
  methods: {
    // 获取标准分类目录
    getCategoryList() {
      const req = {
        name: "",
        parentTypeId: 0,
      };
      Api.docTypeList(req).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.cotegoryList = data;
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 选择分类
     * @param {*} e 选择的分类目录信息
     */
    categoryChange(e) {
      this.listReq.parentTypeId = e.id;
      this.pageChange(1);
    },
    /**
     * 获取资料列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getDocList(this.listReq).then((res) => {
        const { code, data, msg } = res;
        this.isTabLoading = false;
        if (code === 200) {
          this.list = data.list;
          this.page.total = data.total;
          this.page.pageSize = this.listReq.pageSize;
          this.page.pageNo = this.listReq.pageNum;
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      Object.keys(e).map((key) => {
        this.listReq[key] = e[key];
      });
      this.pageChange(1);
    },
    /**
     * 翻页
     * @param {number} e 页码
     */
    pageChange(e) {
      this.listReq.pageNum = e;
      this.getList();
    },
    /**
     * 改变每页显示数量
     */
    sizeChange(e) {
      this.listReq.pageSize = e;
      this.pageChange(1);
    },
    /**
     * 上传资料
     */
    addFile() {
      if (
        this.listReq.parentTypeId == null ||
        this.listReq.parentTypeId == ""
      ) {
        this.$message.warning("请先选择目录");
      } else {
        this.uploadFileVisiable = true;
        console.log(this.uploadFileVisiable);
      }
    },
    /**
     * 保存资料
     */
    saveFile() {
      this.uploadFileVisiable = false;
      this.pageChange(1);
    },
    /**
     * 下载资料
     */
    downloadFile(data) {
      this.downLoadByURL(data.repositoryUrl, data.name);
    },
    /**
     * 移除资料
     * @param {*} 要移除的资料信息
     */
    removeFile(e) {
      this.$confirm(`确定删除资料：《${e.name}》吗？`, "资料", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.delDoc(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除资料：${e.name}`);
              this.pageChange(1);
            } else {
              this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.std-collection {
  // min-width: 1206px;
  // overflow: auto;
  .category {
    width: 280px;
    float: left;
  }
  .list {
    width: calc(100% - 300px);
    min-width: 500px;
    margin-left: 20px;
    float: left;
  }
}
</style>