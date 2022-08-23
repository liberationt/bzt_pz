<template>
  <div class="search-bar">
    <div
      class="search-li"
      v-for="(item, index) in searchData.labelList"
      :key="`li+${index}`"
    >
      <label>{{ item.label }}：</label>
      <!-- 1, 文本输入框 -->
      <el-input
        v-if="item.type === 1"
        v-model="fromData[item.key]"
        size="small"
        :placeholder="`请输入${item.label}`"
        @keyup.enter.native="action('search', 1)"
      />

      <!-- 2，下拉列表选择 -->
      <template v-if="item.type === 2">
        <el-select
          v-model="fromData[item.key]"
          :placeholder="`请选择${item.label}`"
          clearable
          @change="selectChange($event, item.key, item.type)"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt[item.replaceField.value]"
            :label="opt[item.replaceField.label]"
            :value="opt[item.replaceField.value]"
            :multiple="item.multiple === true"
          />
        </el-select>
      </template>

      <!-- 3, 日期选择 -->
      <template v-if="item.type === 3">
        <el-date-picker
          v-if="item.dateType === 'dateRange'"
          v-model="fromData[item.key]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :format="item.formatStr"
          :value-format="item.formatValStr ? item.formatValStr : item.formatStr"
          @change="selectChange($event, item.key, item.type)"
        />
        <el-date-picker
          v-if="item.dateType === 'datetimeRange'"
          v-model="fromData[item.key]"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :format="item.formatStr"
          :value-format="item.formatValStr ? item.formatValStr : item.formatStr"
          @change="selectChange($event, item.key, item.type)"
        />
        <el-date-picker
          v-if="item.dateType === 'date'"
          v-model="fromData[item.key]"
          type="date"
          :format="item.formatStr"
          :value-format="item.formatValStr ? item.formatValStr : item.formatStr"
          placeholder="选择日期"
          @change="selectChange($event, item.key, item.type)"
        />
        <el-date-picker
          v-if="item.dateType === 'year'"
          v-model="fromData[item.key]"
          type="year"
          :format="item.formatStr"
          :value-format="item.formatValStr ? item.formatValStr : item.formatStr"
          placeholder="选择年"
          @change="selectChange($event, item.key, item.type)"
        />

      </template>

      <!-- 4，用户（操作人） -->
      <template v-if="item.type === 4">
        <el-select
          v-model="fromData[item.key]"
          :placeholder="`请选择${item.label}`"
          clearable
          @change="selectChange($event, item.key, item.type)"
        >
          <el-option
            v-for="opt in $cache.session.getJSON('sourceUserList')"
            :key="`user_${opt.userId}`"
            :label="opt.nickName"
            :value="opt.userId"
            :multiple="item.multiple === true"
          />
        </el-select>
      </template>

      <!-- 5，部门 -->
      <template v-if="item.type === 5">
        <treeselect
          v-model="fromData[item.key]"
          :options="
            handleTree(
              $cache.session.getJSON('sourceDeptList'),
              'deptId',
              'parentId',
              'children'
            )
          "
          :normalizer="
            (node) => {
              return {
                id: node.deptId,
                label: node.deptName,
                children: node.children,
              };
            }
          "
          :show-count="false"
          :placeholder="`请选择${item.label}`"
          @change="selectChange($event, item.key, item.type)"
        />
      </template>

      <!-- 6，单选按钮 -->
      <template v-if="item.type === 6">
        <el-radio-group
          v-model="fromData[item.key]"
          @change="selectChange($event, item.key, item.type)"
        >
          <el-radio
            v-for="opt in item.options"
            :key="opt[item.replaceField.value]"
            :label="opt[item.replaceField.value]"
            :multiple="item.multiple === true"
          >
            {{ opt[item.replaceField.label] }}
          </el-radio>
        </el-radio-group>
      </template>
    </div>
    <template v-for="(item, index) in searchData.btnList">
      <div
        v-if="item.type != 0"
        :class="
          item.className != undefined
            ? `${item.className} btn`
            : 'submitBtn btn'
        "
        :key="index"
        :icon="item.icon !== undefined ? item.icon : 'el-icon-search'"
        @click="action(item.action, item.type)"
      >
        <i :class="item.icon !== undefined ? item.icon : 'el-icon-search'" />
        {{ item.label }}
      </div>
      <div
        v-else
        class="submitBtnReset btn"
        :key="index"
        @click="action(item.action, item.type)"
      >
        <i :class="item.icon !== undefined ? item.icon : 'el-icon-refresh'" />
        {{ item.label }}
      </div>
    </template>
    <slot name="btn" :scope="fromData" />
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
/**
 * searchData 搜索列表传值
 * @key labelList 搜索狂列表 {label'', key:'',type:1}{label'', key:'',type:2,options:[]},replaceField:{value:value,label:label},multiple:false}
 * {label'', key:'',type:3,formatStr:"YYYY-mm-dd",dateType:'date'|'daterange'}
 * @label-list-type:1 输入框，2：下拉框, 3，日期选择 4, 选择用户（操作人）5，部门
 * @key btnList 搜索按钮列表 {label'', action:'' , type: 1} type:1 执行相应方法，0：重置
 *
 * formVal 搜索表单的Val值
 */
export default {
  components: { Treeselect },
  name: "bzt-search",
  props: ["searchData", "formVal"],
  dicts: [],
  // props: {
  //   searchData: {
  //     type: Object,
  //     default: {
  //       labelList: [],
  //       btnList: [],
  //     },
  //   },
  // },
  data() {
    return {
      fromData: [],
    };
  },
  watch: {
    searchData: {
      handler(val) {
        if (this.formVal != undefined) {
          this.searchData.labelList.forEach((item) => {
            // this.fromData[item.key] = "" || null;
            this.$set(this.fromData, item.key, this.formVal[item.key] ?? null);
          });
        }
      },
    },
    fromData() {
      this.$emit("search", this.fromData);
    },
  },
  mounted() {
    if (
      this.formVal != undefined &&
      this.searchData != undefined &&
      this.searchData.labelList != undefined
    ) {
      this.searchData.labelList.forEach((item) => {
        // this.fromData[item.key] = "" || null;
        this.$set(this.fromData, item.key, this.formVal[item.key] ?? null);
      });
    }
  },
  methods: {
    /**
     * 搜索方法事件触发
     * @param actionName 按钮出发的方法名action
     * @param type 是否是清空重置 0：重置
     */
    action(actionName, type) {
      if (type === 0) {
        Object.keys(this.fromData).map((key) => {
          this.fromData[key] = "" || null;
        });
      }
      this.$emit(actionName, this.fromData);
    },
    selectChange(e, key, type) {
      this.$nextTick(() => {
        this.fromData[key] = e;
        this.action("search", this.fromData);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.search-bar {
  // height: 45px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  .search-li {
    width: auto;
    font-size: 14px;
    margin: 8px;
    margin-right: 25px !important;
    margin-bottom: 15px;
    line-height: 32px;
    label {
      margin-right: 5px;
      font-weight: 400 !important;
    }
    ::v-deep .el-input,
    .el-date-picker,
    .el-select,
    .vue-treeselect,
    .el-input__inner {
      width: 230px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      .vue-treeselect__control,
      input,
      .el-input {
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
::v-deep .vue-treeselect {
  float: right;
  .vue-treeselect__control {
    height: 32px;
  }
}
::v-deep .el-date-editor {
  width: 280px;
}
// 提交按钮
.submitBtn {
  color: #ffffff;

  background-color: $submit-btn-color;
  border: 1px solid #3d84ee;

  &:hover {
    background-color: $submit-btn-hover-color;
  }
}
.submitBtnReset {
  font-size: 14px;
  color: #666666;
  background-color: #efefef;
  border: 1px solid #dddddd;

  &:hover {
    box-shadow: #999999 4px 0px 12px -5px;
  }
}
.btn {
  border-radius: 4px;
  padding: 0 15px;
  line-height: 30px;
  height: 32px;
  cursor: pointer;
  margin: 0px 10px;
  font-size: 14px;
  margin-bottom: 8px;
  position: relative;
}

// 取消按钮
.cancelBtn {
  color: #999999;
  background-color: #ffffff;
  border: 1px solid #efefef;

  &:hover {
    box-shadow: #999999 4px 0px 12px -5px;
  }
}
::v-deep .el-range-separator,
::v-deep .el-range__icon,
::v-deep .el-range__close-icon {
  line-height: 25px !important;
}
</style>