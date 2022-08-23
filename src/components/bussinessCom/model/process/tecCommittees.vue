<template>
  <div class="tec-committees">
    <el-select
      :value="value?Number(value):''"
      placeholder="请选择归口单位"
      @change="change"
      :disabled="disabled == true"
    >
      <el-option
        v-for="item in list"
        :key="item.dictValue"
        :label="item.dictLabel"
        :value="Number(item.dictValue)"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import Api from "@api/process";
export default {
  name: "tecCommittees",
  props: ["value", "disabled"],
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    console.log(111,this.value,"9999")
    this.getList();
  },
  methods: {
    /**
     * 获取归口单位列表
     */
    getList() {
      Api.getGKDWList().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 选择归口单位
     */
    change(e) {
      this.$emit("change", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.tec-committees {
  width: 100%;
}
</style>