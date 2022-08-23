<template>
  <div class="system-info-container">
    <div class="left">
      <div class="content" :class="{'content-top':isShowForms}">
        <div v-if="isShowHeader" class="header">
          <slot name="header"></slot>
        </div>
        <el-scrollbar class="scrollbar ver">
          <el-tree class="system-tree" :data="treeData" :props="defaultProps" default-expand-all node-key="id"
            :draggable="isEdit && editNodeSwitch" :allow-drop="allowDrop" highlight-current :allow-drag="allowDrag"
            @node-click="nodeClick" :expand-on-click-node="false">
            <span class="custom-tree-node" :data-owner="data.owner" :data-color-index="data.editColor"
              slot-scope="{ node, data }" style="float: right;">
              <span v-if="isEdit == false || !editNodeSwitch || data.disabled == true"
                :class="{root: data.isRoot,active: currNode &&data.systemNodeId == currNode.systemNodeId}">
                {{ node.label }}
              </span>
              <el-input v-else v-model="data.nodeName" :readonly="!editNodeSwitch" placeholder="请输入内容" />
              <span>
                <el-button-group>
                  <el-button v-if="isEdit && editNodeSwitch && data.disabled != true" size="mini" icon="el-icon-plus"
                    title="添加节点" @click.stop.prevent="() => appendItem(data)" />
                  <el-button v-if="isEdit && !editNodeSwitch" size="mini" icon="el-icon-s-unfold" title="标准列表"
                    @click.stop.prevent="() => bindItem(data)" />
                  <el-button v-if="isEdit && editNodeSwitch && data.isRoot != 1 && data.disabled != true" size="mini"
                    icon="el-icon-delete" title="删除节点" @click.stop.prevent="() => removeItem(node, data)" />
                </el-button-group>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div v-if="isShowForms" class="forms">
        <slot name="forms"></slot>
      </div>
    </div>
    <div class="right">
      <div class="tool">
        <el-button-group v-if="!isFullscreen && currTab == 'charts'" class="btn-group">
          <el-tooltip class="item" effect="dark" content="生成图片" placement="top-end">
            <el-button class="btn" @click="saveImage()" style="z-index:10"><i class="el-icon-printer" /></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="全屏" placement="top-end">
            <el-button class="btn" @click="treeChartToggle()" style="z-index:10">
              <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-switch v-if="!isFullscreen && currTab == 'charts'" class="canvas-switch" v-model="canvasStyle"
          active-color="#dcdfe6" inactive-color="#ffcc00" active-text="黑白模式" inactive-text="彩色模式">
        </el-switch>
        <el-button v-if="!isFullscreen && currTab == 'bindList'" class="export-txt-btn" type="warning"
          icon="el-icon-download" size="mini" @click="handleBindExport">导出标准列表</el-button>
        <el-button v-if="!isFullscreen && currTab == 'dataStatistics'" class="export-txt-btn" type="warning"
          icon="el-icon-download" size="mini" @click="handleDataStatisticsExport">导出标准统计</el-button>
      </div>

      <el-tabs v-model="currTab" @tab-click="handleTabChange">
        <el-tab-pane label="体系框图" name="charts">
          <div class="treeChart" style="height:100%" :class="{'is-fullscreen':isFullscreen}">
            <el-button v-if="isFullscreen" class="not-full-btn" @click="treeChartToggle()" style="z-index:10">
              <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
            </el-button>
            <div>
              <tree-chart :data="treeChartData[0]" ref="treeChart" :canvasStyle="canvasStyle" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="标准列表" name="bindList">
          <div v-loading="editNodeSwitch" style="padding-bottom:20px;height:100%;"
            element-loading-text="编辑节点模式中无法管理标准，请退出节点编辑模式后继续操作" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <system-bind-list @change="handleBindChange" :editNodeSwitch="editNodeSwitch" :isEdit="isEdit"
              :currNode="currNode" :nodeIds="nodeIds" :stdSystemData="stdSystemData"></system-bind-list>
          </div>
        </el-tab-pane>
        <!-- 无体系编制说明的需求，暂不现实 -->
        <!-- <el-tab-pane label="编制说明" name="form">
          <system-edit-form ref="systemEditForm" v-if="stdSystemData != null && currTab == 'form'" :isEdit="isEdit"
            :stdSystemData="stdSystemData"></system-edit-form>
        </el-tab-pane> -->
        <el-tab-pane label="标准统计" name="dataStatistics">
          <el-table size="mini" :data="dataStatisticsData" border style="width: 100%">
            <el-table-column prop="nodeName" label="体系节点" />
            <el-table-column prop="stdKind1" label="国际标准" width="100" />
            <el-table-column prop="stdKind2" label="国家标准" width="100" />
            <el-table-column prop="stdKind3" label="行业标准" width="100" />
            <el-table-column prop="stdKind4" label="地方标准" width="100" />
            <el-table-column prop="stdKind5" label="团体标准" width="100" />
            <el-table-column prop="stdKind6" label="企业标准" width="100" />
            <el-table-column prop="n10" label="合计" width="100" :formatter="formatCalc" />
            <!-- <el-table-column prop="n11" label="占比" width="100" :formatter="formatRatio" /> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="图表统计" name="chartStatistics">
          <div class="charts" style="height:600px;">
            <BztChart v-if="!chartsLoading" :option="chartStatisticsData" />
            <!-- <div ref="chartStatistics" style="width: 100%;height:100%"></div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>

import treeChart from "@/components/treeChart";
import {
  getNodeStdKindCount,
  getNodeStdCount,
} from "@/api/standard/systemBind";
import systemBindList from "./systemBindList";
import systemEditForm from "./systemEditForm";
import { BztChart } from "@components/basicCom/index";
// 全屏组件
import fullscreen from "vue-fullscreen";
import Vue from "vue";
Vue.use(fullscreen);
/**
 * 标准体系界面
 */
export default {
  name: "systemInfo",
  components: {
    treeChart,
    systemBindList,
    systemEditForm,
    BztChart
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    treeData: Array,
    stdSystemData: Object,
    editNodeSwitch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 全屏组件
      fullscreen: false,
      queryParams: {
        modelName: "",
        pageNum: 1,
        pageSize: 10,
        isAsc: "desc",
        orderByColumn: "createTime",
      },
      defaultProps: {
        children: "children",
        label: "nodeName",
      },
      // 当前tab页
      currTab: "charts",
      // 选中节点
      currNode: {},
      nodeIds: null,
      bindStdList: [],
      bindStdLoading: false,
      // 是否全屏
      isFullscreen: false,
      // 标准统计数据
      dataStatisticsData: [],
      // 图表统计数据
      chartStatisticsData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        colors: ["#DDDDDD"],
        grid: {
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                //x轴的文字改为竖版显示
                var str = value.split("");
                return str.join("\n");
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "合计",
            type: "bar",
            data: [],
          },
        ],
      },
      // 是否黑白模式
      canvasStyle: false,
      // 用户源数据
      sourceUserList: [],
      // 个人信息
      userInfo: false,
      // 图表加载
      chartsLoading: false
    };
  },
  computed: {
    treeChartData() {
      let key = "title";
      let arr = _.cloneDeep(this.treeData);
      function toParse(arr) {
        arr.forEach(function (item) {
          item[key] = item.nodeName;
          if (item.children && item.children.length > 0) {
            toParse(item.children);
          }
        });
        return arr;
      }
      return toParse(arr);
    },
    isShowForms() {
      return this.$slots.forms;
    },
    isShowHeader() {
      return this.$slots.header;
    },
  },
  methods: {
    // 添加节点
    appendItem(data) {
      console.info("data==>", data);
      const newChild = { nodeName: "", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    // 删除节点
    removeItem(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(
        (d) => d.systemNodeId === data.systemNodeId
      );
      console.info("remoteIndex==>", index);
      children.splice(index, 1);
    },
    /**
     * 拖拽排序
     * @param {Object} draggingNode
     * @param {Object} dropNode
     * @param {Object} type
     */
    allowDrop(draggingNode, dropNode, type) {
      // console.info("allowDrop=>",draggingNode, dropNode, type)
      if (dropNode.data.isRoot) {
        return false;
      } else {
        return true;
      }
    },
    // 定义可拖拽的节点
    allowDrag(draggingNode) {
      if (draggingNode.data.isRoot == 1) {
        return false;
      } else {
        return true;
      }
    },
    // 节点被点击
    nodeClick(data) {
      this.currNode = null;
      this.nodeIds = this.setNodeIds(data);
      this.currNode = data;
      console.info("currNode==>", this.currNode);
    },
    // 打开标准列表
    bindItem(data) {
      this.currNode = null;
      this.nodeIds = this.setNodeIds(data);
      this.currNode = data;
      this.currTab = "bindList";
    },
    // 取出节点与子节点的所有ID
    setNodeIds(data) {
      let ids = [];
      const listChildren = (lists) => {
        lists.forEach((item) => {
          ids.push(item.systemNodeId);
          if (item.children && item.children.length) {
            listChildren(item.children);
          }
        });
      };
      ids.push(data.systemNodeId);
      if (data.children && data.children.length) {
        listChildren(data.children);
      }
      return ids;
    },
    // 全屏框图
    treeChartToggle() {
      this.$fullscreen.toggle(this.$el.querySelector(".treeChart"), {
        wrap: false,
        callback: this.fullscreenChange,
      });
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
      this.isFullscreen = !this.isFullscreen;
    },
    // 格式化合计数值
    formatCalc(row) {
      return (
        row.stdKind1 +
        row.stdKind2 +
        row.stdKind3 +
        row.stdKind4 +
        row.stdKind5 +
        row.stdKind6
      );
    },
    // 处理绑定标准改变
    handleBindChange() {
      this.getKindData();
      this.$emit("change");
    },
    // 获取标准统计数据汇总
    getKindData() {
      let nodeIds = this.setNodeIds(this.treeData[0]);
      getNodeStdKindCount(nodeIds.join(",")).then((response) => {
        if (response.code === 200) {
          this.dataStatisticsData = response.data;
        }
        this.getChartsCount(nodeIds);
      });
    },
    // 获取图表统计数据
    getChartsCount(nodeIds) {
      this.chartsLoading = true;
      getNodeStdCount(nodeIds.join(",")).then((response) => {
        if (response.code === 200) {
          this.handleChartsData(response);
        }
      });
    },
    // 渲染图表数据
    handleChartsData(response) {
      let xAxis = [
        {
          type: "category",
          data: [],
          axisPointer: {
            type: "shadow",
          },
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              //x轴的文字改为竖版显示
              var str = value.split("");
              return str.join("\n");
            },
          },
        },
      ];
      let series = [
        {
          name: "合计",
          type: "bar",
          data: [],
        },
      ];
      this.chartStatisticsData.xAxis = response.data.forEach((item) => {
        series[0]["data"].push(item.count);
        xAxis[0]["data"].push(item.nodeName);
      });
      this.$set(this.chartStatisticsData, "xAxis", xAxis);
      this.$set(this.chartStatisticsData, "series", series);
      this.chartsLoading = false;
    },
    // 切换tab
    handleTabChange(tab, event) {
      if (tab.name == "dataStatistics" || tab.name == "chartStatistics") {
        this.getKindData();
      }
    },
    // 框图保存图片
    saveImage() {
      this.$refs["treeChart"].treeSaveImage(
        this.stdSystemData.systemName + " 体系框图_" + new Date().getTime()
      );
    },
    // 导出绑定标准列表
    handleBindExport() {
      let condition = {};
      condition.systemId = this.stdSystemData.systemId;
      condition.nodeIds = this.nodeIds || [];
      this.downloadByPost(
        "standard/systemBind/exportList",
        {
          ...condition,
        },
        this.stdSystemData.systemName + ` 绑定标准_${new Date().getTime()}.xlsx`
      );
    },
    // 导出标准统计表
    handleDataStatisticsExport() {
      let nodeIds = this.setNodeIds(this.treeData[0]);
      this.downloadByPost(
        "standard/systemBind/exportDataStatistics",
        {
          nodeIds,
        },
        this.stdSystemData.systemName + ` 标准统计_${new Date().getTime()}.xlsx`
      );
    },
    // 格式化用户信息
    parseUser(id) {
      let user = _.find(this.sourceUserList, { userId: id });
      return user ? user.nickName : "";
    },
  },
  created() {
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.userInfo = this.$store.state.user.userInfo;
  },
};
</script>

<style scoped lang="scss">
@import "./systemInfo";
</style>