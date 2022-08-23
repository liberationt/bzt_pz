<template>
  <div
    class="chart"
    ref="myChart"
    :style="{ width: '100%', height: '100%' }"
  ></div>
</template>
<script>
import resize from "./../js/resize";
export default {
  name: "chart",
  mixins: [resize],
  props: ["option"],
  watch: {
    option: {
      handler: (val) => {
        // this.drawChart(val);
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChart(this.option);
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    /**
     * 图表渲染
     * @param {*} option 图表参数
     */
    drawChart(option) {
      if (option !== null && option != {}) {
        this.chart = this.$echarts.init(this.$refs.myChart);
        this.chart.setOption(option);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
}
</style>