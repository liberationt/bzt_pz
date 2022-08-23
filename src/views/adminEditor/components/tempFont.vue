<template>
    <div class="temp-font-container">
        <!-- <div class="main">
            <el-form size="small" :model="ruleForm" ref="ruleForm" label-position="top">
                <el-form-item label="层次/要素及表述" prop="label">
                    <el-input v-model="ruleForm.label"></el-input>
                </el-form-item>
                <el-form-item label="占行数" prop="rows">
                    <el-input-number v-model="ruleForm.rows" :min="0" :max="100"  />
                </el-form-item>
                <el-form-item label="位置" prop="position">
                    <el-input v-model="ruleForm.position"></el-input>
                </el-form-item>
                <el-form-item label="文字内容" prop="text">
                    <el-input v-model="ruleForm.text"></el-input>
                </el-form-item>
                <el-form-item label="字体" prop="fontFamily">
                    <el-select v-model="ruleForm.fontFamily" clearable>
                        <el-option v-for="(item, idx) in fontTypes" :key="idx" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="字号" prop="fontSize">
                    <el-select v-model="ruleForm.fontSize" clearable>
                        <el-option v-for="(item, idx) in fontSize" :key="idx" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addNew">新增设置</el-button>
                    <el-button type="success" @click="saveSetting">保存设置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="tables">
            <el-table size="mini" :data="tableData" :span-method="objectSpanMethod" border style="width: 100%" >
                <el-table-column prop="label" label="层次/要素及表述" width="200" align="center" />
                <el-table-column prop="position" label="位置" />
                <el-table-column prop="text" label="文字内容" />
                <el-table-column label="字体" width="180">
                    <template slot-scope="scope">
                        <el-select size="mini" v-model="scope.row.fontFamily">
                            <el-option v-for="(item, idx) in fontTypes" :key="idx" :label="item.label" :value="item.value" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="字号" width="180">
                    <template slot-scope="scope">
                        <el-select size="mini" v-model="scope.row.fontSize" clearable>
                            <el-option v-for="(item, idx) in fontSize" :key="idx" :label="item.label" :value="item.value" />
                        </el-select>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" icon="el-icon-edit" @click="editItem(scope)">编辑</el-button>
                        <el-button size="small" type="text" icon="el-icon-delete" @click="removeItem(scope)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="btns">
                <el-button type="success" @click="saveSetting">保存设置</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import { fontConfig } from '@/config/editorCfg';
    export default {
        name: 'temp-font',
        props: {
            data: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        watch: {
            data: {
                handler(list) {
                    if(!_.isEmpty(list)) {
                        this.tableData = _.cloneDeep(list);
                        console.log('handler', list)
                    }
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            return {
                tableData: [...fontConfig],
                ruleForm: {
                    label: '',
                    rows: 0,
                    position: '',
                    text: '',
                    fontSize: '',
                    fontFamily: ''
                },
                fontTypes: [
                    {label:'黑体', value:'simHei'},
                    {label:'宋体', value:'simSun'},
                    {label:'英文字体', value:'times new roman'},
                    {label:'专用字体（图形）', value:''},
                ],
                fontSize: [
                    {label:'初号', value:'42pt'},
                    {label:'初号', value:'42pt'},
                    {label:'小初号', value:'36pt'},
                    {label:'一号', value:'28pt'},
                    {label:'二号', value:'21pt'},
                    {label:'小二号', value:'18pt'},
                    {label:'三号', value:'15.75pt'},
                    {label:'四号', value:'14pt'},
                    {label:'小四号', value:'12pt'},
                    {label:'五号', value:'10.5pt'},
                    {label:'小五号', value:'9pt'},
                    {label:'六号', value:'7.875pt'}
                ]
            }
        },
        methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (row.rows) {
                        return {
                            rowspan: row.rows,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                    /* if (rowIndex % 2 === 0) {
                        return {
                            rowspan: row.rows,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    } */
                }
            },
            editItem(scope=null) {
                console.log('editItem=>', scope)
                this.ruleForm = _.cloneDeep(scope.row);
            },
            removeItem() {

            },
            addNew() {
                this.tableData.push(this.ruleForm);
            },
            saveSetting() {
                this.$emit('change', { tmplType:2001, tmplName:'font', content:JSON.stringify(this.tableData)});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .temp-font-container{
        height: 100%;
        display:flex;
        padding: 15px;
        overflow: hidden;
        .tables{
            flex:1;
            overflow: auto;
            // border: 1px solid #DDD;
            .btns{
                padding:15px 0;
            }
        }
        .main{
            flex: 0 0 500px;
            padding: 0 15px;
        }
    }
</style>
