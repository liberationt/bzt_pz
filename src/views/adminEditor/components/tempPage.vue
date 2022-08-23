<template>
    <div class="temp-page-container">
        <div class="main">
            <h3>页面排版</h3>
            <div class="forms">
                <el-form size="small" :model="ruleForm" ref="ruleForm1" inline label-position="top">
                    <el-form-item label="排版方式" prop="top">
                        <el-select v-model="ruleForm.layout">
                            <el-option value="singleSided" label="单面排版"></el-option>
                            <el-option value="doubleSided" label="双面排版"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <h3>页面边距(单位：MM)</h3>
            <div class="forms">
                <el-form size="small" :model="ruleForm" ref="ruleForm2" inline label-position="top">
                    <el-form-item label="上边距" prop="top">
                        <el-input-number v-model="ruleForm.padding.top" controls-position="right" :min="0" :max="100"  />
                    </el-form-item>
                    <el-form-item label="右边距" prop="right">
                        <el-input-number v-model="ruleForm.padding.right" controls-position="right" :min="0" :max="100"  />
                    </el-form-item>
                    <el-form-item label="排序" prop="bottom">
                        <el-input-number v-model="ruleForm.padding.bottom" controls-position="right" :min="0" :max="100"  />
                    </el-form-item>
                    <el-form-item label="排序" prop="left">
                        <el-input-number v-model="ruleForm.padding.left" controls-position="right" :min="0" :max="100"  />
                    </el-form-item>
                </el-form>
            </div>

        </div>

        <div class="btns">
            <el-button type="success" @click="saveSetting">保存设置</el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'temp-page',
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
                        this.ruleForm = _.cloneDeep(obj)
                    }
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            return {
                ruleForm: {
                    padding:{
                        top: 25,
                        right: 25,
                        bottom: 20,
                        left: 20,
                    }
                }
            }
        },
        methods: {
            saveSetting() {
                this.$emit('change', { tmplType:2003, tmplName:'page', content:JSON.stringify(this.ruleForm) } );
            }
        }
    }
</script>

<style lang="scss" scoped>
    .temp-page-container{
        height: 100%;
        padding: 15px;
        .main{
            .forms{
                margin-bottom: 20px;
            }
        }

    }
</style>
