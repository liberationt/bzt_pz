<template>
  <div class="service-info app-container">
    <!-- 搜索 -->
    <BztSearch :searchData="searchInfo" @search="searchList" />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div class="submit-btn" @click="updateMenu()">
        <i class="el-icon-edit-outline" v-hasPermi="['service:setMenu']" />
        设置快捷菜单
      </div>
    </div>

    <!-- 服务入口列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: hasPermission('service:remove') ? tabAction : [],
        actionWidth: '120px',
      }"
      :hasIndex="true"
      :pageInfo="{ pageNo: 1, pageSize: 10 }"
      :isLoading="isTabLoading"
    >
      <template slot="remove" slot-scope="{ scope }">
        <span
          class="red-link-text"
          @click="removeMenu(scope)"
          v-hasPermi="['service:remove']"
        >
          删除
        </span>
      </template>
    </BztTable>

    <!-- 设置快捷菜单  -->
    <BztDialog
      :dialogInfo="dialogMenu"
      @close="closeDetail"
      :appendTobody="false"
    >
      <template slot="body" v-if="dialogMenu.visible == true">
        <el-tree
          ref="menulist"
          :data="menuList"
          node-key="menuId"
          :default-checked-keys="menuIds"
          default-expand-all
          show-checkbox
          draggable
          :props="{
            label: 'menuName',
            isLeaf: true,
          }"
          :allow-drop="allowDrop"
          class="menu-list"
          check-on-click-node
          @check="checkMenu"
        />
      </template>
    </BztDialog>

    <!-- 调整菜单位置 -->
    <BztDialog
      :dialogInfo="dialogMenuIndex"
      @close="saveIndexDetail"
      :appendTobody="false"
    >
      <template slot="body" v-if="dialogMenuIndex.visible == true">
        <el-tree
          :data="checkList"
          node-key="menuId"
          draggable
          :props="{
            label: 'menuName',
            isLeaf: true,
          }"
          :allow-drop="allowDrop"
          check-on-click-node
          @check="checkMenu"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import { BztSearch, BztTable, BztDialog } from "@components/basicCom/index";
import {
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
} from "@/api/system/menu";

export default {
  name: "service-info",
  components: {
    BztSearch,
    BztTable,
    BztDialog,
  },
  dicts: ["info_publish_theme", "info_publish_status"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      dialogMenu: {
        visible: false,
        title: "设置快捷菜单",
        width: "900px",
        footer: true,
        loadding: false,
      },
      dialogMenuIndex: {
        visible: false,
        title: "调整快捷菜单顺序",
        width: "900px",
        footer: true,
        loadding: false,
      },
      isTabLoading: false,
      searchInfo: {
        labelList: [
          {
            label: "关键字查询",
            key: "content",
            type: 1,
          },
        ],
        btnList: [
          { label: "查询", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "菜单名称",
          key: "menuName",
          minWidth: "420",
        },
        // {
        //   title: "排序",
        //   key: "orderNum",
        //   minWidth: "420",
        //   filter: {
        //     type: "html",
        //   },
        // },
        {
          title: "路由地址",
          key: "path",
          width: "210",
        },
      ],
      tabAction: [
        {
          label: "删除",
          type: "slot",
          btnName: "remove",
          color: "rgba(214, 71, 48)",
        },
      ],
      list: [],
      menuIds: [],
      menuList: [],
      checkList: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * 判断日期式
     * @param {string} data 要判断的日期字符串
     */
    getDate(data) {
      let str = "";
      if (data === null || data === undefined) {
        str = "";
      } else if (
        data.indexOf("1900-01-01") === -1 &&
        data.indexOf("1970-01-01") === -1 &&
        data.indexOf("9990-01-01") === -1
      ) {
        str = data;
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
    /**
     * 获取信息列表
     */
    getList() {
      this.isTabLoading = true;
      this.list = [];
      this.menuIds = [];
      Api.getServiceList().then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.list = data;
          this.menuIds = [];
          this.list.forEach((item) => {
            this.menuIds.push(item.menuId);
          });
          this.isTabLoading = false;
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
        this.listReq[key] = e[key];
      });
      this.getList();
    },
    /**
     * 获取菜单
     */
    getMenuList() {
      Api.getMenuList({ userId: 1 }).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.menuList = [];
          this.filterMenu(data, "");
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 菜单过滤
     * @param {*} menus 菜单列表
     * @param {*} pathStr 父级路由记录
     */
    filterMenu(menus, pathStr) {
      menus.forEach((item) => {
        if (item.component != null && item.children.length == 0) {
          // list
          item["path"] = `${pathStr}/${item.path}`;
          if (item.visible == 0 && item.status == 0) {
            this.menuList.push(item);
          }
        } else if (item.visible == 0 && item.status == 0) {
          let path = `${pathStr}/${item.path}`;
          if (item.children.length > 0) {
            this.filterMenu(item.children, path);
          }
        }
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== "inner";
    },
    /**
     * 打开新增编辑弹窗
     * @param {*} data 为null时为发布信息，否则为编辑
     */
    updateMenu() {
      this.getMenuList();
      this.dialogMenu.visible = true;
    },
    /**
     * 选择服务入口快捷菜单
     */
    checkMenu(checkedNodes, checkedKeys) {
      if (checkedKeys.checkedNodes.length < 12) {
        this.menuIds = checkedKeys.checkedKeys;
      } else {
        this.$message.warning("服务入口菜单数最大值为：11");
      }
      this.$refs.menulist.setCheckedKeys(this.menuIds);
    },
    /**
     * 关闭详情弹框
     */
    closeDetail(e) {
      if (e == true) {
        this.checkList = [];
        this.$refs.menulist.getCheckedNodes().forEach((item, index) => {
          const newItem = {
            path: item.path,
            orderNum: index + 1,
            menuName: item.menuName,
            menuId: item.menuId,
          };
          this.checkList.push(newItem);
        });
        this.dialogMenuIndex.visible = true;
      } else {
        this.dialogMenu.visible = false;
      }
    },
    saveIndexDetail() {
      this.dialogMenuIndex.loadding = true;
      Api.saveService(this.checkList).then((res) => {
        const { code, msg } = res;
        this.dialogMenu.loadding = false;
        if (code == 200) {
          this.$message.success("服务入口（快捷菜单）列表已更新");
          this.getList();
          this.dialogMenu.visible = false;
          this.dialogMenuIndex.visible = false;
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 删除信息
     * @param {*} e 要删除的信息的详情
     */
    removeMenu(e) {
      this.$confirm(
        `确定删除快捷菜单吗？删除后数据将不可再恢复，请谨慎操作！`,
        "快捷菜单",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          Api.removeMenu(e.id).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除快捷菜单`);
              this.getList();
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.service-info {
  width: 100%;
  height: 100%;
}

::v-deep .el-descriptions {
  font-size: 14px !important;
  width: 80%;
  margin: auto;
  .el-descriptions-row {
    .el-descriptions-item__cell {
      line-height: 35px;
      font-size: 15px;
    }
  }
}
::v-deep .menu-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .el-tree-node {
    width: 48%;
    &:nth-child(2n) {
      justify-self: end;
    }
  }
}
</style>