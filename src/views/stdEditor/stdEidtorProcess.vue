<template>
  <div class="">
    <iframe
      ref="editorIframe"
      class="iframeClass"
      :src="`${url}stdEditor/outline`"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: "stdEidtorProcess",
  data() {
    return { url: process.env.VUE_APP_EDITOR_URL, docId: "", id: null };
  },
  created() {
    // // 监听子页面想父页面的传参
    // window.addEventListener("editorMsg", function (event) {
    //   //此处执行事件
    //   console.log("监听到子页面的传参");
    //   console.log(event.data);
    // });

    this.docId = this.$route.params.docId;
    this.id = this.$route.params.id;
    this.$nextTick(() => {});
    setTimeout(() => {
      this.initEditorView();
    }, 500);
  },
  afterMounted() {
    setTimeout(() => {
      this.initEditorView();
    }, 500);
  },
  methods: {
    /**
     * 获取编写草案/标准
     */
    initEditorView() {
      this.$refs.editorIframe.contentWindow.postMessage(
        {
          name: "editorMsg",
          act: "stdEditOutline",
          data: { docId: this.docId },
        },
        "*"
      );
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
  height: calc(100vh - 60px);
}
</style>