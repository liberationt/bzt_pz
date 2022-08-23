<template>
    <div class="template-gb-cover-container">
        <sam-editor ref="samEditor" :data="editorSetting" @change="changeEvent" />
    </div>
</template>

<script>
    import { samEditor } from 'sam-editor';
    import 'sam-editor/dist/sam-editor.css';
    export default {
        name: 'admin-editor-template-gb',
        components: {
            samEditor
        },
        props: {
            data: {
                type:Object,
                default: () => {
                    return {};
                }
            }
        },
        watch: {
            data: {
                handler(obj) {
                    if(!_.isEmpty(obj)) {
                        console.log('handler',obj)
                    }
                },
                deep: true,
                immediate: true
            }
        },

        data() {
            var uuid = this.$editorUtils.guid();
            return {
                currNode: null,
                editorSetting: {
                    admin: true,
                    setTemplate: true,
                    hideMenu: true,                                 // 隐藏菜单
                    hideNav: true,
                    toolbar1:'undo redo | queue | formatting | indent2em lineheight',
                    contextmenu: 'remove-btn',
                    quickbars: ' ',
                    htmlContent: `<div class="page-container"><div class="info-block" data-id="${uuid}"></div></div>`,
                },
                pageContent: {
                    id: undefined,
                    key: '',
                    htmlContent: `<div class="page-container"><div class="info-block" data-id="${uuid}"><p></p></div></div>`,
                    tags: []
                }
            }
        },
        methods: {
            /**
             * @description 获取页面HTML内容
             */
            async getBlockContent() {
                return await this.$refs.samEditor.interFaceAction({ act:'getBlockContent', id:this.data.tmplId });
            },

            /**
             * @description 更新DOM节点标签数据
             * @param {Object} data
             */
            async updateTag(data={}) {
                return await this.$refs.samEditor.interFaceAction({ act:'updateTag', ...data });
            },
            
            /**
             * @description 插入标签HTML
             * @param {String} htmlContent
             */
            async insertContent(htmlContent='') {
                return await this.$refs.samEditor.interFaceAction({ act:'insertContent', htmlContent });
            },

            /**
             * @description 监听编辑器事件上报
             * @param {Object} data
             */
            changeEvent(data) {
                if(data.act === 'click') {
                    this.currNode = data.node;
                    console.log('this.currNode', this.currNode);
                    this.$emit('change', data.node)
                // 编辑器加载完成赋予数据
                } else if (data.act === 'loaded') {
                    if (this.data && this.data.content) {
                        let htmlContent = `<div class="page-container"><div class="info-block cover" contenteditable="false" data-id="${this.data.tmplId}">${this.data.content}</div></div>`;
                        this.$refs.samEditor.interFaceAction({ act:'resetContent', htmlContent });
                    }
                }
            },

            async getHtmlContent() {
                var htmlContent = await this.$refs.samEditor.interFaceAction({ act:'getTagContent', id:this.currPageId });
                var section = document.createElement('div');
                section.innerHTML = htmlContent.join("");
                var tags = [];
                section.querySelectorAll('.tag').forEach(node => {
                    let obj = {}, nodeData = node.dataset;
                    for(let k in nodeData) {
                        obj[k] = nodeData[k];
                    }
                    tags.push(obj);
                });
                return {
                    htmlContent,
                    tags
                };
            },
            async appendTag(tagData=null) {
                /* if (tagData) {
                    var data = { id:this.currNode.dataset.id, ...this.ruleForm };
                    return await this.$refs.samEditor.interFaceAction({ act:'updateTag', ...data });
                } else {
                    var uuid = this.$editorUtils.guid();
                    this.ruleForm.id = uuid;
                    return await this.$refs.samEditor.interFaceAction({ act:'insertContent', htmlContent:`<span class="tag other" data-tag="${this.ruleForm.tag}" data-name="${this.ruleForm.name}" data-type="${this.ruleForm.type}" data-id="${uuid}">{@${this.ruleForm.tag}}</span>` });
                } */
            },

            async insertTag() {
                /* var tagData = _.find(this.tagLists, { tmplTagId:this.currNode.dataset.id });
                var resappend = await this.appendTag(tagData);
                return;

                if (resappend) {
                    var condition = {
                        tmplId: this.tempData.tmplId,
                        tmplTagId: this.currNode.dataset.id,
                        tagType: 'cover',
                        tagName: this.ruleForm.tag,
                        tagContent: this.ruleForm.name,
                        contentType: this.ruleForm.type
                    }

                    if (tagData) {
                        condition.id = tagData.id;
                    }

                    console.log('condition=>', condition);

                    var res;
                    if (condition.id) {
                        res = await editTempTags(condition);
                    } else {
                        res = await addTempTags(condition);
                    }

                    if(res.code === 200) {
                        this.$message.success('已保存标签设置');
                        this.saveTemplate(true);
                        this.listTagData();
                    }
                } */
            },

        },

    }
</script>

<style lang="scss" scoped>
    .template-gb-cover-container{
        height: 100%;
        width: 100%;
    }
</style>
