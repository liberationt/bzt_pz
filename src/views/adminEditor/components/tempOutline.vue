<template>
    <div class="temp-outline-container">
        <!-- <div class="main">
            <el-form size="small" :model="ruleForm" ref="ruleForm" label-position="top">
                <el-form-item label="要素" prop="label">
                    <el-input v-model="ruleForm.label"></el-input>
                </el-form-item>
                <el-form-item label="类型编号" prop="type">
                    <el-input-number v-model="ruleForm.type" controls-position="right" :min="0" :max="100"  />
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number v-model="ruleForm.orderNum" controls-position="right" :min="0" :max="100"  />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addNew">新增设置</el-button>
                    <el-button type="success" @click="saveSetting">保存设置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="tables">
            <el-table size="mini" ref="elTable" :data="tableData" border>
                <!-- <el-table-column lanbel="选择" width="60" align="center" /> -->
                <el-table-column prop="muset" label="必选/必备" width="90" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" />
                    </template>
                </el-table-column>
                <el-table-column prop="label" label="要素(名称)" width="150">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.label"  />
                    </template>
                </el-table-column>
                <el-table-column prop="labelType" label="要素类别" width="120" />
                <el-table-column prop="labelDesc" label="要素的构成" width="150" />
                <el-table-column prop="formulation" label="要素所允许的表述形式" />
                <el-table-column prop="type" label="类型编码" width="80" align="center" />
                <!-- <el-table-column prop="orderNum" label="排序" width="180">
                    <template slot-scope="scope">
                        <el-input-number size="small" v-model="scope.row.orderNum" controls-position="right"  :min="0" :max="100"  />
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.addNew" size="small" type="text" icon="el-icon-delete" @click="removeItem(scope)">删除</el-button>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="btns" style="padding:15px 0;">
                <!-- <el-button size="small" type="primary" @click="addNew">新增设置</el-button> -->
                <el-button size="small" type="success" @click="saveSetting">保存设置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'temp-outline',
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
                    }
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            return {
                ruleForm: {
                    type: 6,
                    label: '',
                    muset:'可选',
                    labelType:'规范性或资料性',
                    labelDesc:'附加信息',
                    formulation:'条文、图、表、数学公式、示例、;主、脚注、引用、提示、指明附录',
                    orderNum:5,
                    addNew: true
                },
                tableData:[
                    { type:0, label:'封面', name:'cover', muset:'必备', labelType:'资料性', labelDesc:'附加信息', formulation:'标明文件信息', orderNum:0, checked:true },
                    { type:0, label:'目次', name:'catalogue', muset:'可选', labelType:'资料性', labelDesc:'附加信息', formulation:'列表(自动生成的内容)', orderNum:1, checked:true },
                    { type:1, label:'前言', name:'preface', muset:'必备', labelType:'资料性', labelDesc:'附加信息', formulation:'条文、注、脚注、指明附录', orderNum:1, checked:true },
                    { type:2, label:'引言', name:'intro', muset:'可选', labelType:'资料性', labelDesc:'附加信息', formulation:'条文、阁、表、数学公式、注、脚注、指明附录', orderNum:1, checked:true },
                    { type:3, label:'范围', name:'range', muset:'必备', labelType:'规范性', labelDesc:'条款、附加信息', formulation:'条文、表、注、脚注', orderNum:2, checked:true },
                    { type:4, label:'规范性引用文件', name:'quote', muset:'必备/可选', labelType:'资料性', labelDesc:'附加信息', formulation:'清单、注、脚注', orderNum:3, checked:true },
                    { type:5, label:'术语和定义', name:'term', muset:'必备/可选', labelType:'规范性', labelDesc:'条款、附加信息', formulation:'条文、图、数学公式、示例、注、引用、提示', orderNum:4, checked:true },
                    { type:6, label:'技术要素', name:'chapter', muset:'必备', labelType:'规范性', labelDesc:'条款、附加信息', formulation:'条文、图、表、数学公式、示例、;主、脚注、引用、提示、指明附录', orderNum:5, checked:true },
                    /* { type:6, label:'其他章节', labelType:'', labelDesc:'附加信息', formulation:'', orderNum:5, checked:true },
                    { type:8, label:'附录章节', labelType:'', labelDesc:'附加信息', formulation:'', orderNum:7 }, */
                    { type:11, label:'参考文献', name:'literature', muset:'可选', labelType:'规范性或资料性', labelDesc:'附加信息', formulation:'清单、脚注', orderNum:100 },
                    { type:12, label:'索引', name:'index', muset:'可选', labelType:'资料性', labelDesc:'附加信息', formulation:'列表(自动生成的内容)', orderNum:200 },
                ],

            }
        },
        methods: {
            addNew() {
                this.tableData.push(this.ruleForm);
            },
            editItem(scope) {
                this.ruleForm = _.cloneDeep(scope.row);
            },
            removeItem(scope) {
                this.tableData.splice(scope.$index, 1);
            },
            saveSetting() {
                this.$emit('change', { tmplType:2000, tmplName:'outline', content:JSON.stringify(this.tableData) }); //data:[...this.tableData]
            },
            /* selectionChange(items) {
                console.log('selectionChange=>', items);
                items.forEach(item => {
                    var index = _.findIndex()
                })
            }, */
            setCheckeds() {
                this.tableData.forEach(row => {
                    if (row.checked) {
                        this.$refs.elTable.toggleRowSelection(row);
                    }
                })
            }
        },
        mounted() {
            this.setCheckeds();
        }
    }
</script>

<style lang="scss" scoped>
    .temp-outline-container{
        height: 100%;
        padding: 15px;
        display: flex;
        .main{
            flex: 0 0 450px;
            padding: 0 20px;
        }
        .tables{
            flex: 1;
            // border: 1px solid #DDD;
        }
    }
</style>
