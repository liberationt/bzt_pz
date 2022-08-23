<template>
  <div class="">
    <iframe
      ref="fIframe"
      class="iframeClass"
      :src="`${process.env.VUE_EDITOR_URL}/stdEditor`"
      frameborder="0"
    ></iframe>
    <!-- <div class="btn" @click="fClick">父页面传参</div> -->
  </div>
</template>
<script>
export default {
  props: {
    docId: {
      type: String,
      default: "",
    },
  },
  data() {
    return { url: "" };
  },
  mounted() {
    this.url = this.comUrl;

    // 监听子页面想父页面的传参
    window.addEventListener("editorMsg", function (event) {
      //此处执行事件
      console.log("监听到子页面的传参");
      console.log(event.data);
    });
  },
  methods: {
    /**
     * 获取预览页面
     */
    initEditorView() {
      this.$refs.fIframe.contentWindow.postMessage({
        name: "editorMsg",
        data: { act: "previewDraft", data: { docId: this.docId } },
      });
    },
    // 父页面处发向子页面传参
    fClick() {
      let data = {
        type: 1,
        code: 200,
        data: {
          docId: "docId",
        },
      };
      this.$refs.fIframe.contentWindow.postMessage("stdEidt", data, "*");
    },
  },
};
</script>

<style >
.btn {
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border: 1px solid #ccc;
  border-radius: 12px;
  position: fixed;
  top: 0;
  left: 0;
}
.iframeClass {
  width: 100%;
  height: 100vh;
}
</style>