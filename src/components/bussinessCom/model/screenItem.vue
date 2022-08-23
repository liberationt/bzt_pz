<template>
  <div class="screen-item">
    <div class="classify">
      <div
        :class="selItem == null ? 'classify-li classify-li-sel' : 'classify-li'"
        @click="changeItem(null)"
      >
        全部
      </div>
      <template v-for="(item, index) in list">
        <div
          :class="
            selItem != null &&
            selItem[fieldReName.value] == item[fieldReName.value]
              ? 'classify-li classify-li-sel'
              : 'classify-li'
          "
          :key="index"
          @click="changeItem(item)"
        >
          {{ item[fieldReName.label] }}
        </div>
      </template>
    </div>
    <template v-if="children.length > 0">
      <screenItem
        :list="children"
        :fieldReName="fieldReName"
        @on-change="onChange"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: "screenItem",
  props: {
    list: {
      type: Array,
      default: [],
    },
    fieldReName: {
      type: Object,
      default: {
        label: "label",
        value: "value",
        children: "children",
      },
    },
  },
  data() {
    return {
      selItem: null,
      children: [],
    };
  },
  methods: {
    /**
     * 选择列筛选项
     * @param {*} data 所选的选择项
     */
    changeItem(data) {
      this.children = [];
      if (data != null) {
        if (
          data[this.fieldReName.children] &&
          data[this.fieldReName.children].length > 0
        ) {
          this.children = data[this.fieldReName.children];
        }
        this.selItem = data;
      } else {
        this.selItem = null;
      }
      this.$emit("on-change", data);
    },
    /**
     * 递归调用自己 接受子集的参数
     *
     */
    onChange(e) {
      if (e != null) {
        this.$emit("on-change", e);
      } else {
        this.$emit("on-change", this.selItem);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.screen-item {
  float: right;
  overflow: hidden;
  .classify {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px 0;
    .classify-li {
      margin: 0 10px;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
      &:hover {
        color: #4596ff;
      }
    }
    .classify-li-sel {
      color: #ffffff;
      background: #4596ff;
      &:hover {
        color: #ffffff;
        background: #4596ff;
      }
    }
  }
}
</style>