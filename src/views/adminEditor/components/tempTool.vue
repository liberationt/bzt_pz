<template>
    <div class="temp-tool-container">
        <h3>
            <el-checkbox :indeterminate="isIndeterminateDefault" v-model="checkAllDefault" @change="handleCheckAllDefault">全选</el-checkbox>
            <span style="margin-left: 15px;">默认的目次内容</span>
        </h3>
        <el-checkbox-group v-model="checkedDefault" @change="handleCheckedDefault">
            <el-checkbox v-for="(item,idx) in toolBars.toolbar1" :label="item.value" :key="idx">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <h3>
            <el-checkbox :indeterminate="isIndeterminateOther" v-model="checkAllOther" @change="handleCheckAllOther">全选</el-checkbox>
            <span style="margin-left: 15px;">可选的目次内容</span>
        </h3>
        <el-checkbox-group v-model="checkedOther" @change="handleCheckedOther">
            <el-checkbox v-for="(item,idx) in toolBars.toolbar2" :label="item.value" :key="idx">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <div class="btns">
            <el-button size="small" type="success" icon="iconfont icon-cunchu" @click="saveTools">保存设置</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'temp-tools',
        props: {
            type:Number,
            data: {
                type: Object,
                default: null
            }
        },
        watch: {
            data: {
                handler(obj) {
                    if(!_.isEmpty(obj)) {
                        this.checkedDefault = obj.checkedDefault || [];
                        this.checkedOther = obj.checkedOther || [];
                    }
                },
                deep: true,
                immediate: true
            }

        },
        data() {
            return {
                isIndeterminateDefault: true,
                checkAllDefault: false,
                checkedDefault: [],
                isIndeterminateOther: true,
                checkAllOther: false,
                checkedOther: [],

                toolBars: {
                    toolbar1: [
                        { label:'撤销', value:'undo' },
                        { label:'重做', value:'redo' },
                        { label:'关闭', value:'close-btn' },
                        { label:'保存', value:'save-btn' },
                        { label:'列项', value:'queue' },
                        { label:'层级项', value:'levels' },
                        { label:'插入水平分割线', value:'hr' },
                        { label:'插入段落', value:'paragraph-btn' },
                        { label:'插入标题', value:'title-block' },
                        { label:'格式', value:'formatting' },
                        { label:'对齐', value:'alignment' },
                        { label:'字符缩进', value:'indent2em' },
                        { label:'行距', value:'lineheight' },
                        { label:'插入图片', value:'image' },
                        { label:'特殊字符', value:'charmap' },
                        { label:'插入表格', value:'table' },
                        { label:'页面布局', value:'pageLayout' },
                        { label:'排版', value:'page-type' },
                    ],
                    toolbar2: [
                        { label:'-注-', value:'zhu-btn' },
                        { label:'示例', value:'example-btn' },
                        { label:'题条', value:'articleTitle' },
                        { label:'图标题', value:'imgtitle-btn' },
                        { label:'脚注', value:'footer-btn' },
                        { label:'公式', value:'math' },
                        { label:'图形', value:'graphy' },
                        { label:'引用', value:'quote-btn' },
                        { label:'术语', value:'term' },
                        { label:'指标', value:'quota' },
                        { label:'批注', value:'comment' },
                        { label:'目次选项', value:'catalogue' },
                        { label:'导出文档', value:'exportFile' },
                        { label:'合并文档', value:'mergePage' }
                    ]
                }
            }
        },
        methods: {
            handleCheckAllDefault(val) {
                var arr = [];
                this.toolBars.toolbar1.forEach(item=> {
                    if (!item.other) {
                        arr.push(item.value);
                    }
                });
                this.checkedDefault = val ? arr : [];
                this.isIndeterminateDefault = false;
            },

            // 勾选
            handleCheckedDefault(value=[]) {
                var checkedCount = value.length;
                this.checkAllDefault = checkedCount === this.toolBars.toolbar1.length;
                this.isIndeterminateDefault = checkedCount > 0 && checkedCount < this.toolBars.toolbar1.length;
            },
            // 全选
            handleCheckAllOther(val) {
                var arr = [];
                this.toolBars.toolbar2.forEach(item=> {
                    if (item.other) {
                        arr.push(item.value);
                    }
                });

                this.checkedOther = val ? arr : [];
                this.isIndeterminateOther = false;
            },
            // 勾选
            handleCheckedOther(value=[]) {
                var checkedCount = value.length;
                this.checkAllOther = checkedCount === this.toolBars.toolbar2.length;
                this.isIndeterminateOther = checkedCount > 0 && checkedCount < this.toolBars.toolbar2.length;
            },

            // 保存目次配置
            saveTools() {
                // var arr = this.checkedDefault.concat(this.checkedOther);
                var content = {
                    checkedDefault: this.checkedDefault,
                    checkedOther: this.checkedOther
                }
                this.$emit('change', content);
            },

            async listCatalogue() {

            }
        },
        created() {

        }
    }
</script>

<style lang="scss" scoped>
    .temp-tool-container{
        height: 100%;
        padding:15px;
        >h3{
            border-bottom: 1px solid #DDD;
            line-height: 30px;
        }
        ::v-deep .el-checkbox-group{
            padding: 15px 0;
            margin-bottom: 30px;
        }
    }
</style>
