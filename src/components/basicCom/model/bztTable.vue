<template>
  <div class="bzt-table">
    <!-- 表格列过滤器 -->
    <el-popover placement="bottom" width="160">
      <ul class="lists">
        <li
          v-for="(item, idx) in fieldList"
          :key="`li${idx}`"
          @click.stop.prevent="changeHide(item, idx)"
          style="cursor: pointer"
        >
          <div :style="{ color: item.isHidden ? '#CCC' : '#409EFF' }">
            <i
              class="iconfont"
              :class="{
                'icon--Checked': !item.isHidden,
                'icon-Other-17': item.isHidden,
              }"
              style="font-size: 1.5em"
            />
            <span> {{ item.title }}</span>
          </div>
        </li>
      </ul>
      <el-button
        v-if="showFilter === true"
        type="text"
        size="small"
        icon="el-icon-view"
        slot="reference"
        class="filter-btn"
      >
        筛选列项<i class="el-icon-arrow-down" />
      </el-button>
    </el-popover>

    <!-- 表格主题 -->
    <el-table
      ref="bzt-table"
      :data="cellData"
      :border="border"
      :style="`width:${tableData.width}`"
      :fit="tabFit != false"
      :row-key="rowKey"
      v-loading="isLoading"
      class="btz-tables"
      @row-click="rowClick"
      :height="height"
      max-height="680"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="checkeBox == true"
        :reserve-selection="true"
        type="selection"
        width="40"
      />
      <el-table-column
        v-if="hasIndex !== false"
        fixed
        label="序号"
        type="index"
        width="60"
        :index="indexMethod"
      />

      <template v-for="(item, index) in fieldList">
        <el-table-column
          v-if="item.isHidden === false"
          :key="index"
          :prop="item.key"
          :label="item.title"
          :width="item.width"
          :min-width="item.minWidth"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.showTips != false"
        >
          <template slot-scope="scope">
            <!-- 无过滤器设置，纯文本显示 -->
            <span v-if="item.filter === undefined || item.filter === null">
              {{
                getCellTxt(scope.row, item.key) == null
                  ? ""
                  : getCellTxt(scope.row, item.key)
              }}
            </span>
            <template v-else>
              <!-- 日期时间格式 -->
              <span v-if="item.filter.type === 'dateTime'">{{
                FormatDate(
                  getCellTxt(scope.row, item.key),
                  item.filter.formateStr
                )
              }}</span>

              <!-- html格式 -->
              <span
                v-if="item.filter.type === 'html'"
                v-html="getCellTxt(scope.row, item.key)"
              ></span>

              <!-- 开关格式设置 -->
              <template v-else-if="item.filter.type === 'switch'">
                <el-switch
                  v-if="item.filter.getModel"
                  :value="item.filter.getModel(getCellTxt(scope.row, item.key))"
                  @change="valueChange($event, scope.row, item.filter.action)"
                />
                <el-switch
                  v-else
                  :value="getCellTxt(scope.row, item.key) == 1"
                  @change="valueChange($event, scope.row, item.filter.action)"
                />
              </template>

              <!-- 单行文本输入列 -->
              <template v-else-if="item.filter.type === 'input'">
                <el-input
                  type="input"
                  v-model="scope.row[item.key]"
                  :placeholder="`请输入${item.title}`"
                  @change="valueChange($event, scope.row, item.filter.action)"
                />
                <!-- :value="getCellTxt(scope.row, item.key)" -->
                <!--  -->
              </template>

              <!-- 数字输入列 -->
              <template v-else-if="item.filter.type === 'number'">
                <el-input-number
                  v-model="scope.row[item.key]"
                  :min="!item.filter.min ? 0 : item.filter.min"
                  :max="!item.filter.max ? 10000 : item.filter.max"
                  @change="valueChange($event, scope.row, item.filter.action)"
                  class="td-number"
                />
              </template>

              <!-- 单选按钮radio -->
              <template v-else-if="item.filter.type === 'radio'">
                <el-radio-group
                  v-model="scope.row[item.key]"
                  @change="valueChange($event, scope.row, item.filter.action)"
                >
                  <el-radio
                    v-for="(option, index) in item.filter.options"
                    :key="`${item.key}_${index}`"
                    :label="option.value"
                  >
                    {{ option.name }}
                  </el-radio>
                </el-radio-group>
              </template>

              <!-- 复选框checkBox -->
              <template v-else-if="item.filter.type === 'checkBox'">
                <el-checkbox-group
                  v-model="scope.row[item.key]"
                  @change="valueChange($event, scope.row, item.filter.action)"
                >
                  <el-checkbox
                    v-for="(option, index) in item.filter.options"
                    :key="`${item.key}_${index}`"
                    :label="option.value"
                    >{{ option.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>

              <!-- action操作列设置 -->
              <template v-else-if="item.filter.type === 'action'">
                <el-button
                  v-if="item.filter.isHtml !== true"
                  :key="`tbn${index}`"
                  @click="action(item.filter.actionName, scope.row)"
                  type="text"
                  size="small"
                  :style="{ color: item.color, 'margin-right': '12px' }"
                >
                  {{
                    item.filter.action(
                      getCellTxt(scope.row, item.key),
                      scope.row
                    )
                  }}
                </el-button>
                <span
                  v-else
                  :key="`tbn${index}`"
                  @click="action(item.filter.actionName, scope.row)"
                  v-html="
                    item.filter.action(
                      getCellTxt(scope.row, item.key),
                      scope.row
                    )
                  "
                />
              </template>

              <!-- 过滤器方法 -->
              <template v-else-if="item.filter.type === 'filter'">
                <span v-if="item.filter.isFiles == true">
                  <!-- {{ item.filter.action(getCellTxt(scope.row, item.key)) }} -->
                  <div
                    v-for="(file, index) in item.filter.action(
                      getCellTxt(scope.row, item.key)
                    )"
                    :key="`file_${index}`"
                    class="link-text"
                    @click="downLoad(file)"
                  >
                    {{ file.name }}
                  </div>
                </span>
                <span
                  v-else-if="item.filter.isHtml == true"
                  v-html="item.filter.action(getCellTxt(scope.row, item.key))"
                >
                </span>
                <template v-else-if="item.filter.isHtml !== true">
                  <!-- data === 0 返回整行数据 -->
                  <template v-if="item.filter.data == 0">
                    {{ item.filter.action(scope.row) }}
                  </template>
                  <template v-else>
                    {{ item.filter.action(getCellTxt(scope.row, item.key)) }}
                  </template>
                </template>
              </template>

              <!-- User 用户（操作人，发布人） -->
              <template v-else-if="item.filter.type === 'user'">
                {{ getUser(getCellTxt(scope.row, item.key)) }}
              </template>

              <!-- dept 部门 -->
              <template v-else-if="item.filter.type === 'dept'">
                {{ getDept(getCellTxt(scope.row, item.key)) }}
              </template>
            </template>
          </template>
        </el-table-column>
      </template>
      <slot name="column" />
      <el-table-column
        v-if="tableData.action.length > 0"
        fixed="right"
        label="操作"
        min-width="120px"
        :width="tableData.actionWidth || null"
      >
        <template slot-scope="scope">
          <template v-for="(item, index) in tableData.action">
            <span v-if="item.type == 'slot'" :key="`tbn${index}`">
              <slot :name="item.btnName" :scope="scope.row" />
            </span>

            <el-button
              v-else
              :key="`tbn${index}`"
              @click="action(item.action, scope.row)"
              type="text"
              size="small"
              :style="{ color: item.color, 'margin-right': '12px' }"
            >
              {{ item.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/**
 * tableData 列表数据
 * @key column 列表的column的列表 { title: "", key: "", width: "", filter:null,color:''}
 * @key -filter 列的过滤器设置 {type：'date', formate:"YYYY-MM-DD HH:ss:mm" ,color:''}{type：'switch', action:'', getModel:()=>{return true||false}),color:'' }
 * {type：'action', action:()=>{return ''}, actionName：''，color:'' }{type：'filter', action:()=>{return ''}) ,color:''}{sortable:true(自动排序)，'custom'（后端调接口排序）}
 * @key data 列表数据
 * @key action 操作列 {label: '', action:'',type:slot,btnName:''}
 * hasIndex 是否显示序号列
 *
 * border 是否带有边框
 *
 * width 表格宽度
 *
 * pageInfo 页码信息
 *
 * isLoading 加载动画
 *
 * showFilter 列筛选器
 *
 * tabFit 列自动撑开
 */
export default {
  name: "bzt-table",
  props: {
    tableData: {
      type: Object,
      default: {
        column: [],
        data: [],
        action: [],
      },
    },
    border: {
      type: Boolean,
      default: true,
    },
    hasIndex: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showFilter: {
      type: Boolean,
      default: false,
    },
    tabFit: {
      type: Boolean,
      default: true,
    },
    checkeBox: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
      default: "id",
    },
    height: {
      type: String,
      default: null,
    },
    clearSelection: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fieldList: [],
      cellData: [],
    };
  },
  watch: {
    tableData: {
      handler(val, newOld) {
        this.fieldList = [];
        this.cellData = JSON.parse(JSON.stringify(this.tableData.data));
        val.column.forEach((item) => {
          item["isHidden"] = false;
          this.fieldList.push(item);
        });
        if (newOld.data != val.data && this.clearSelection == true) {
          this.$refs["bzt-table"].clearSelection();
        }
      },
    },
  },
  created() {
    this.fieldList = [];
    this.cellData = JSON.parse(JSON.stringify(this.tableData.data));
    this.tableData.column.forEach((item) => {
      item["isHidden"] = false;
      this.fieldList.push(item);
    });
  },
  methods: {
    setCellData() {
      this.cellData = JSON.parse(JSON.stringify(this.tableData.data));
      console.log(this.cellData);
    },
    /**
     * 根据列Key获取对应的value
     * @param {*} data 行数据
     * @param {*} key 单元格的key
     */
    getCellTxt(data, key) {
      let str = data;
      key.split(".").forEach((item) => {
        str = str[item];
      });
      return str;
    },
    /**
     * 操作列按钮触发事件
     * @param actionName 返回给父级的方法名
     * @param rowData 返回给父级的行数据
     */
    action(actionName, rowData) {
      this.$emit(actionName, rowData);
    },
    /**
     * 获取序号
     * @param index 行号
     */
    indexMethod(index = 0) {
      return index + 1 + (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize;
    },
    /**
     * 获取用户名
     */
    getUser(userId) {
      const sourceUserList = this.$cache.session.getJSON("sourceUserList");
      if (userId == 0) return "系统";
      const user = _.find(sourceUserList, { userId: Number(userId) });
      return user ? `${user.nickName}（${user.userName}）` : `-`;
    },
    /**
     * 获取部门名称
     */
    getDept(deptId) {
      const sourceDeptList = this.$cache.session.getJSON("sourceDeptList");

      if (deptId == null) return "—";
      const dept = _.find(sourceDeptList, { deptId: deptId });
      return dept ? dept.deptName : "-";
    },
    /**
     * 开关值改变
     */
    valueChange(e, row, action) {
      const req = {
        val: e,
        row: row,
      };
      console.log(action, e);
      this.$emit(action, req);
    },
    /**
     * 列筛选
     */
    changeHide(item, idx) {
      item.isHidden = !item.isHidden;
      this.$set(this.fieldList, idx, item);
    },
    /**
     * 行点击
     * @param {*} row 点击行的信息
     */
    rowClick(row, column, event) {
      this.$emit("row-click", row);
    },
    /**
     * 复选框选择
     */
    handleSelectionChange(e) {
      this.$emit("select-change", e);
    },
    /**
     * 复选框方法
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs["bzt-table"].toggleRowSelection(row);
        });
      } else {
        this.$refs["bzt-table"].clearSelection();
      }
    },
    /**
     * 下载附件
     * @param {*} file 要下载的附件信息
     */
    downLoad(file) {
      this.downLoadByURL(file.url, file.name);
    },
    /**
     * 格式化日期时间格式
     */
    FormatDate(date, formateStr) {
      let newDate = new Date(date);
      return this.parseTime(newDate);
    },
    /**
     * 列排序
     */
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
      const orders =
        order == "descending" ? "desc" : order == "ascending" ? "asc" : null;
      this.$emit("sort-change", { prop, order: orders });
    },
  },
};
</script>
<style lang="scss" scoped>
.bzt-table {
  height: 100%;
  position: relative;
  .filter-btn {
    float: right;
    font-size: 14px;
  }
}
.el-table {
  height: auto;
  font-size: 14px;
  th {
    font-size: 15px;
    .cell {
      line-height: 32px;
      .caret-wrapper {
        height: 25px;
        .ascending {
          top: 0;
        }
        .descending {
          bottom: 3px;
        }
      }
    }
  }
  .el-table__cell {
    padding: 5px;
    .td-number {
      width: 100% !important;
    }
  }
  .el-button--text {
    font-size: 13px;
  }
  .el-table__header-wrapper {
    height: 100%;
  }
  div {
    height: 100% !important;
  }
  .el-table__fixed {
    height: 100% !important;
     .el-table__fixed-body-wrapper {
      pointer-events: all;
    }
  }
}
</style>