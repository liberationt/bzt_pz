<template>
  <div class="screen" v-if="screenList.length > 0">
    <template v-for="(item, index) in screenList">
      <div class="screen-li" :key="index">
        <img class="screen-icon" :src="item.icon" />
        <label class="screen-li-label">{{ item.title }}</label>
        <screenItem
          :list="item.list"
          :fieldReName="item.fieldReName"
          @on-change="onChange"
        />
      </div>
    </template>
  </div>
</template>
<script>
import screenItem from "./screenItem.vue";
/**
 * screenList 筛选列表
 *  Item { title: "", icon: ”, list: [], fieldReName：{label:'',value:'',children:''}}
 *  title 筛选标题，icon 图标， list 筛选列表 fieldReName 属性对应值
 */

export default {
  components: { screenItem },
  name: "screen",
  props: {
    screenList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    /**
     * 返回选中的列表值
     */
    onChange(e) {
      this.$emit("on-change", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.screen {
  width: 100%;
  background: #fdfdfd;
  color: #333333;
  font-size: 14px;
  line-height: 16px;
  padding: 5px 15px;
  overflow: hidden;
  border-radius: 4px;
  .screen-li {
    display: flex;
    flex-direction: row;
    .screen-li-label {
      font-size: 15px;
      margin-left: 8px;
      margin-right: 8px;
      color: #666666;
      margin-top: 12px;
    }
    .screen-icon {
      width: 15px;
      height: 15px;
      vertical-align: middle;
      margin-top: 13px;
    }
  }
}
</style>