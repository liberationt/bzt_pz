<template>
  <div style="text-align: center">
    <div class="contor">
      <el-button
        plain
        hairline
        color="#c9431f"
        type="primary"
        size="mini"
        style="cursor: pointer"
        @click="prev"
        :disabled="page_num == 1"
        >上一页
        </el-button>
      <span> {{ page_num }} / {{ page_count }} </span>
      <el-button
        plain
        hairline
        color="#c9431f"
        type="primary"
        size="mini"
        style="cursor: pointer"
        @click="next"
        :disabled="page_num == page_count"
        >下一页
        </el-button>
      <el-button
        plain
        hairline
        color="#c9431f"
        type="primary"
        size="mini"
        style="cursor: pointer"
        :disabled="maxscale == scale"
        @click="addscale"
        >放大</el-button>
      <el-button
        plain
        hairline
        color="#c9431f"
        type="primary"
        size="mini"
        style="cursor: pointer"
        :disabled="minscale == scale"
        @click="minus"
        >缩小</el-button>
    </div>
    <canvas id="pdfCanvas"></canvas>
  </div>
</template>
<script>
import PDFJS from "pdfjs-dist/build/pdf.js";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js";

PDFJS.GlobalWorkerOptions.workerSrc = pdfWorker;
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    ctx() {
      const id = document.getElementById("pdfCanvas");
      return id.getContext("2d");
    },
  },
  data() {
    return {
      url: "",
      width: "100vw",
      height: "auto",
      pdfDoc: null,
      watermark: "",
      pageNum: 1, //
      pageRendering: false,
      pageNumPending: null,
      scale: 1.4, // 放大倍数
      page_num: 1, // 当前页数
      page_count: 1, // 总页数
      maxscale: 2.5, // 最大放大倍数
      minscale: 0.8, // 最小放大倍数
    };
  },
  mounted() {
    this.watermark = this.userInfo.userName;
    this.url = this.$route.query.url;
    this.initPdf(this.page_num);
  },
  methods: {
    initPdf(num) {
      let _this = this;
      PDFJS.getDocument(_this.url).promise.then((pdf) => {
        // 文档对象
        _this.pdfDoc = pdf;
        // 总页数
        _this.page_count = pdf.numPages;
        // 渲染页面
        _this.renderPage(num);
      });
    },
    getRatio(ctx) {
      let dpr = window.devicePixelRatio || 1;
      let bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;

      return dpr / bsr;
    },
    renderPage(num) {
      const vm = this;
      this.pdfDoc.getPage(num).then((page) => {
        let canvas = document.querySelector("#pdfCanvas");
        let ctx = canvas.getContext("2d");
        // 获取页面比率
        let ratio = vm.getRatio(ctx);

        // 根据页面宽度和视口宽度的比率就是内容区的放大比率
        // let dialogWidth =
        //   this.$refs["pdfDialog"].$el.querySelector(".el-dialog").clientWidth -
        //   40;
        // let pageWidth = page.view[2] * ratio;
        // let scale = dialogWidth / pageWidth;

        let viewport = page.getViewport({ scale: vm.scale });

        // 记录内容区宽高，后期添加水印时需要
        vm.width = viewport.width * ratio;
        vm.height = viewport.height * ratio;

        canvas.width = vm.width;
        canvas.height = vm.height;

        // 缩放比率
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        page
          .render({
            canvasContext: ctx,
            viewport,
          })
          .promise.then(() => {
            // 渲染水印
            vm.renderWatermark();
            vm.pageRendering = false;
            if (vm.pageNumPending !== null) {
              // New page rendering is pending
              vm.renderPage(vm.pageNumPending);
              vm.pageNumPending = null;
            }
          });
      });
    },
    initWatermark() {
      let canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;

      let ctx = canvas.getContext("2d");
      ctx.rotate((-18 * Math.PI) / 180);
      ctx.font = "30px Vedana";
      ctx.fillStyle = "rgba(200, 200, 200, .3)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.watermark, 100, 100);

      return canvas;
    },
    renderWatermark() {
      let canvas = document.querySelector("#pdfCanvas");
      let ctx = canvas.getContext("2d");

      // 平铺水印
      let pattern = ctx.createPattern(this.initWatermark(), "repeat");
      ctx.rect(0, 0, this.width, this.height);
      ctx.fillStyle = pattern;
      ctx.fill();
    },
    addscale() {
      // 放大
      if (this.scale >= this.maxscale) {
        return;
      }
      this.scale += 0.5;
      this.queueRenderPage(this.page_num);
    },
    minus() {
      // 缩小
      if (this.scale <= this.minscale) {
        return;
      }
      this.scale -= 0.5;
      this.queueRenderPage(this.page_num);
    },
    prev() {
      // 上一页
      let vm = this;
      if (vm.page_num <= 1) {
        return;
      }
      vm.page_num--;
      vm.queueRenderPage(vm.page_num);
    },
    next() {
      // 下一页
      let vm = this;
      if (vm.page_num >= vm.page_count) {
        return;
      }
      vm.page_num++;
      vm.queueRenderPage(vm.page_num);
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.page_numPending = num;
      } else {
        this.renderPage(num);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.contor {
  margin: 10px auto;
  position: fixed;
  width: 100%;
  min-width: 1366px;
}
#pdfCanvas {
  padding-top: 33px;
}
</style>