<template>
  <div>
    <editor :id="'tinymce' + editorName" v-model="value" :init="init"></editor>
  </div>
</template>

<script>
//引入基础文件：
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/plugins/image"; // 插入上传图片插件
// import "tinymce/plugins/link"; // 插入链接
import "tinymce/plugins/code"; // 插入代码
import "tinymce/plugins/preview"; // 插入预览
import "tinymce/plugins/table"; // 插入表格
import "tinymce/plugins/wordcount"; // 字数限制
import "tinymce/icons/default/icons";
import { fileUpload } from "@/api/fileUpload";
export default {
  name: "tinymce",
  components: {
    Editor,
  },
  props: {
    editorName: "",
    curValue: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "500px",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    maxNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      init: {
        language_url: "/tinymce/langs/zh_CN.js", // 语言包的路径
        language: "zh_CN", //语言
        skin_url: "/tinymce/skins/ui/oxide", // skin路径
        height: "260px", //编辑器高度
        branding: false, //是否禁用“Powered by TinyMCE”
        menubar: false, //顶部菜单栏显示
        elementpath: false, //禁用编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        plugins: ["image", "code", "preview", "table"],
        toolbar: [
          // "formatselect fontsizeselect fontselect | bold italic | undo | redo | alignleft aligncenter alignright alignjustify |bullist numlist outdent indent | lists image media table | removeformat link | code preview ",
          "formatselect fontsizeselect fontselect | bold italic | undo | redo | alignleft aligncenter alignright alignjustify |bullist numlist outdent indent | lists  media table | removeformat link | code preview ",
        ],
        font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        images_upload_handler: (blobInfo, success, failure) => {
          let formdata = new FormData();
          formdata.append("file", blobInfo.blob());
          //上传到服务器后要改地址
          //这个地址是我自己后台上传图片的地址，改成自己后台上传图片的地址
          fileUpload(formdata)
            .then((res) => {
              if (res.code == 200) {
                success(`${process.env.VUE_APP_BASE_URL}${res.data.url}`);
                console.log(res.data);
              } else {
                failure("error");
              }
            })
            .catch((res) => {
              failure("上传失败 " + res);
            });
        },
        init_instance_callback: (editor) => {
          // tinymce.get(`tinymce${this.editorName}`).getBody();
          editor.mode.set(this.readOnly ? "readonly" : "design");
        },
      },
      value: this.curValue,
    };
  },
  mounted() {
    tinymce.init({});
  },
  watch: {
    //动态传参
    curValue(newValue) {
      this.value = newValue;
    },
    //读取输入框内的数据
    value(newValue) {
      this.$emit("input", newValue);
    },
    // 只读模式
    readOnly(newVal) {
      console.log(this.readOnly);
    },
  },
  created() {
    this.init.height = this.height;
    setTimeout(() => {
      // tinymce
      //   .get(`tinymce${this.editorName}`)
      //   .getBody()
      //   .setAttribute("contenteditable", this.readOnly != true);
    }, 500);
  },
  methods: {
    // 获取文本
    getTextVal() {
      var activeEditor = tinymce.activeEditor;
      var editBody = activeEditor.getBody();
      activeEditor.selection.select(editBody);
      var text = activeEditor.selection.getContent({ format: "text" });
      return text;
    },
  },
};
</script>
<style scoped>
::v-deep .tox-icon svg {
  min-width: 20px;
  max-width: 24px;
}
</style>
