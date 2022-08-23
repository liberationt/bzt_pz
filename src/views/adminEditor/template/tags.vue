<template>
    <div class="tmpl-tags-container">
        <div class="tabs">
            <sam-tabs :data="templateTabs" :tabIndex="activeTab" @update="updateTab" />
        </div>
        <div class="main">
            <div class="forms">
                {{activeTab}}--{{tmplKind}}
                <h3>插入/编辑标签</h3>
                <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
                    <el-form-item label="标签名" prop="tag">
                        <el-input v-model="ruleForm.tag" clearable @change="changeNode" />
                    </el-form-item>
                    <el-form-item label="录入方式" prop="type">
                        <el-select v-model="ruleForm.type" style="width: 100%;" @change="changeNode">
                            <el-option v-for="(item, idx) in tagType" :Key="idx" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签描述" prop="name">
                        <el-input v-model="ruleForm.name" clearable  @change="changeNode" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="success" @click="saveTemplate(false)" icon="iconfont icon-document">保存模板内容</el-button>
                    </el-form-item>
                </el-form>
                <!-- <h3>保存模板内容(配置完成后更新下模板内容)</h3>
                <div style="padding:15px 20px;">
                    <el-button size="small" type="success" @click="saveTemplate(false)" icon="iconfont icon-document">保存模板内容</el-button>
                </div> -->
            </div>
            <div class="content">
                <page-component ref="tempCmp" v-if="tempData" :data="tempData" :kind="tmplKind" :name="activeTab" @change="changeTag" />
            </div>
        </div>
    </div>
</template>

<script>
    import samTabs from '@/components/samTabs';
    import { kindsType, stdKinds, tagType } from '@/config/editorOptions';
    // import * as tempComponent from './components.js';
    import { pageComponent } from './components.js';
    import { listContentTemplate, addContentTemplate, editContentTemplate, listTempTags, addTempTags, editTempTags } from '@/api/stdEditor/editor';
    export default {
        name: 'admin-template-tags',
        components: {
            samTabs, pageComponent
        },
        computed: {
            comp() {
                return tempComponent[this.activeTab]; //this.tmplKind
            },
            tempData() {
                var data = _.find(this.listTemplate, { tmplName:this.activeTab, tmplType: this.tmplType });
                if (!data) {
                    let stdKindData = _.find(stdKinds, { type: this.tmplType });
                    let htmlContent = stdKindData[this.activeTab] || '';
                    data = {
                        tmplId: this.$editorUtils.guid(),
                        content: htmlContent
                    }
                }
                return data;
            },
            tmplType() {
                return this.kindsType[this.tmplKind];
            }
        },
        data() {
            return {
                kindsType,
                tmplKind: '',
                listTemplate: [],
                tagLists: [],
                activeTab: 'cover',
                currPageId: '',
                templateTabs:[
                    {label:"封面", act:'cover'},
                    {label:"前言", act:'preface'},
                    {label:"引言", act:'intro'},
                    {label:"范围", act:'range'},
                    {label:"规范性引用文件", act:'normative'},
                    {label:"术语和定义", act:'term'},
                    {label:"技术要求(一版章节)", act:'chapter'},
                    {label:"参考文献", act:'literature'},
                    {label:"索引", act:'index'},
                ],
                tagType,
                ruleForm: {
                    name: '',
                    tag: '',
                    type: 1
                },
                rules: {
                    name: [{required: true, message: '请输入标签名', trigger: 'blur'}],
                    tag: [{required: true, message: '请输入标签名', trigger: 'blur'}],
                    type: [{required: true, message: '请选择录入方式', trigger: 'change'}]
                },
                currNode: null,
            }
        },
        methods:{
            updateTab (tab={}) {
                this.activeTab = tab.act;
                this.$storage.session.set('tmpl-activeTab', tab.act);
            },
            /**
             * @description 表单内容改变
             */
            changeNode() {
                var currNode = this.$refs.tempCmp.currNode;
                if (currNode && this.$editorUtils.hasClass(currNode, 'tag')) {
                    for(let k in this.ruleForm) {
                        currNode.dataset[k] = this.ruleForm[k];
                        /* if (k === 'name') {
                            currNode.innerText = this.ruleForm[k];
                        } */
                    }
                }
            },
            clearForm() {
                this.$refs['ruleForm'].clearValidate();
                this.ruleForm = {
                    name: '',
                    tag: '',
                    type: 1
                };
            },
            /**
             * @description 切换标签节点
             * @param {Object}  node
             */
            changeTag(node=null) {
                this.clearForm();
                this.currNode = null;
                // 构造FORM数据
                if (this.$editorUtils.hasClass(node, 'tag')) { //node.nodeName === 'SPAN' &&
                    this.currNode  = node;
                    // 节点数据处理
                    for(let k in node.dataset) {
                        var val = node.dataset[k];
                        if (k === 'type') {
                            val = parseInt(val);
                        }
                        this.ruleForm[k] = val;
                    }
                    // 若标签已有数据
                    let tagData = _.find(this.tagLists, { tmplTagId:node.dataset.id });
                    if (tagData) {
                        this.ruleForm.type = tagData.contentType;
                    }
                }
            },

            checkFormSubmit() {
                return new Promise((resolve, reject) => {
                    this.$refs['ruleForm'].validate((valid) => {
                        resolve(valid);
                    })
                })
            },

            /**
             * @description 保存模板内容
             */
            async saveTemplate(flag=false) {
                var htmlContent = [];
                var blockContent = await this.$refs.tempCmp.getBlockContent(this.tempData.tmplId);
                // 分解页面块内容
                var section = document.createElement('div');
                section.innerHTML = blockContent;
                section.childNodes.forEach(block => {
                    htmlContent.push(block.innerHTML);
                });
                section.remove();

                var condition = {
                    tmplId: this.tempData.tmplId,
                    tmplName: this.activeTab,
                    tmplType: this.tmplType,
                    content: htmlContent.join("")
                }
                if (this.tempData && this.tempData.id) {
                    condition.id = this.tempData.id;
                }
                console.log('saveTemplate=>', condition)

                var res;
                if (condition.id) {
                    res = await editContentTemplate(condition);
                } else {
                    res = await addContentTemplate(condition);
                }
                if(res.code === 200) {
                    if (!flag) {
                        this.$message.success('已保存模板');
                    }
                    this.listContentTemplate();
                }
            },
            /**
             * @description 模板内容列表
             */
            async listContentTemplate() {
                var res = await listContentTemplate({});
                if (res.code === 200) {
                    this.listTemplate = res.rows.map(item => {
                        item = this.$editorUtils.clearDataByField(item, ['createTime','createUser','delFlag','deleteTime','deleteUser','isAsc','orderByColumn','pageNum','pageSize','params','searchValue','searchValueArray','updateTime','updateUser']);
                        return item;
                    })
                    console.log('listContentTemplate=>', this.listTemplate);
                }
            },
            /**
             * @description 模板内容标签列表
             */
            async listTagData() {
                var res = await listTempTags({});
                if (res.code === 200) {
                    this.tagLists = res.rows.map(item => {
                        item = this.$editorUtils.clearDataByField(item, ['createTime','createUser','delFlag','deleteTime','deleteUser','isAsc','orderByColumn','pageNum','pageSize','params','searchValue','searchValueArray','updateTime','updateUser']);
                        return item;
                    })
                    console.log('this.tagLists=>', this.tagLists);
                }
            },
        },
        created() {
            if (this.$storage.session.get('tmpl-activeTab')) {
                this.activeTab = this.$storage.session.get('tmpl-activeTab');
            }

            // this.tmplKind = this.$route.meta.type || 'gb';
            this.tmplKind = 'qb';
            this.listContentTemplate();
            this.listTagData();
        }
    }
</script>

<style lang="scss" scoped>
    .tmpl-tags-container{
        height: calc(100vh - 84px);
        .tabs{
            padding-top:10px;
        }
        .main{
            height: calc(100% - 36px);
            display: flex;
            .forms {
                flex: 0 0 300px;
                padding:15px;
                >h3{
                    line-height: 30px;
                    border-bottom: 1px solid #DDD;
                }
                ::v-deep .el-form{
                    padding: 15px 20px;
                }
            }
            .content{
                flex:1;
                overflow: auto;
                border-left: 1px solid #DDD;
            }
        }
    }
</style>
