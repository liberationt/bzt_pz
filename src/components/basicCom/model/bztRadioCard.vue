<template>
  <div class="bzt-radio-card">
    <template v-for="(item, index) in data.list">
      <div
        :class="
          item[data.fieldReName.value] == checkedId
            ? 'radio-active radio'
            : 'radio'
        "
        :key="`radio_${index}`"
        @click="changeRadioCard(item[data.fieldReName.value])"
        :title="item[data.fieldReName.label]"
      >
        {{ item[data.fieldReName.label] }}
      </div>
    </template>
  </div>
</template>
<script>
/**
 * data:{list:[],fieldReName:{'label':'label','value':'value'}}
 */
export default {
  name: "bzt-radio-card",
  props: ["data", "checkedId"],
  data() {
    return {
      activeId: null,
    };
  },
  watch: {
    data(val) {
      // this.activeId =
      //   val.list.length > 0 ? val.list[0][val.fieldReName.value] : null;
    },
  },
  created() {
    this.activeId =
      this.data.list.length > 0
        ? this.data.list[0][this.data.fieldReName.value]
        : null;
  },
  methods: {
    changeRadioCard(e) {
      // this.activeId = e;
      this.$emit("change", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.bzt-radio-card {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #efefef;
  overflow-wrap: 1;
  .radio {
    width: auto;
    height: 32px;
    line-height: 32px;
    padding: 0px 15px;
    margin: 0px 5px;
    border: 1px solid #dedede;
    font-size: 14px;
    border-bottom: 0px;
    cursor: pointer;
    border-radius: 6px 6px 0px 0px;
    background: #f1f1f1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:first-child {
      margin-left: 0px;
    }
    &:last-child {
      margin-right: 0px;
    }
  }
  .radio-active,
  .radio:hover {
    background: $bule;
    color: #ffffff;
    border-color: $bule;
  }
}
</style>