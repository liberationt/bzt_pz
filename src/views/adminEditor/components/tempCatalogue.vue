<template>
    <div class="catalogue-container">
        <h3>
            <el-checkbox :indeterminate="isIndeterminateDefault" v-model="checkAllDefault" @change="handleCheckAllDefault">全选</el-checkbox>
            <span style="margin-left: 15px;">默认的目次内容</span>
        </h3>
        <el-checkbox-group v-model="checkedDefault" @change="handleCheckedDefault">
            <el-checkbox v-for="(item,idx) in defaultCatalogues.filter(o=>{return !o.other;})" :label="item.value" :key="idx">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <h3>
            <el-checkbox :indeterminate="isIndeterminateOther" v-model="checkAllOther" @change="handleCheckAllOther">全选</el-checkbox>
            <span style="margin-left: 15px;">可选的目次内容</span>
        </h3>
        <el-checkbox-group v-model="checkedOther" @change="handleCheckedOther">
            <el-checkbox v-for="(item,idx) in defaultCatalogues.filter(o=>{return o.other;})" :label="item.value" :key="idx">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <div class="btns">
            <el-button size="small" type="success" icon="iconfont icon-cunchu" @click="saveCatalogue">保存设置</el-button>
        </div>
    </div>
</template>

<script>
    import { defaultCatalogues } from '@/config/editorCfg';
    export default {
        name: 'catalogue-config',
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
                defaultCatalogues,
                isIndeterminateOther: true,
                checkAllOther: false,
                checkedOther: [],
            }
        },
        methods: {
            handleCheckAllDefault(val) {
                var arr = [];
                this.defaultCatalogues.forEach(item=> {
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
                var defaultCatalogues = this.defaultCatalogues.filter(item=> { return !item.other; });
                this.checkAllDefault = checkedCount === defaultCatalogues.length;
                this.isIndeterminateDefault = checkedCount > 0 && checkedCount < defaultCatalogues.length;
            },
            // 全选
            handleCheckAllOther(val) {
                var arr = [];
                this.defaultCatalogues.forEach(item=> {
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
                var defaultCatalogues = this.defaultCatalogues.filter(item=> { return item.other; });
                this.checkAllOther = checkedCount === defaultCatalogues.length;
                this.isIndeterminateOther = checkedCount > 0 && checkedCount < defaultCatalogues.length;
            },

            // 保存目次配置
            saveCatalogue() {
                // var arr = this.checkedDefault.concat(this.checkedOther);
                var content = {
                    checkedDefault: this.checkedDefault,
                    checkedOther: this.checkedOther
                }
                this.$emit('change', { tmplType:2002, tmplName:'catalogue', content:JSON.stringify(content) } );
                // this.$emit('save', { tmplType:this.type, tmplName:'目次模板配置', content:JSON.stringify(content)})
            },

            async listCatalogue() {

            }
        },
        created() {

        }
    }
</script>

<style lang="scss" scoped>
    .catalogue-container{
        height: 100%;
        padding:15px;
        >h3{
            border-bottom: 1px solid #DDD;
            line-height: 30px;
        }
        ::v-deep .el-checkbox-group{
            padding: 15px 0;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(8, 12.5%);
            .el-checkbox{
                margin:10px 15px 5px 0;
            }
        }
    }
</style>
