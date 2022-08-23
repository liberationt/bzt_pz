<template>
    <div class="temp-menu-container">
        <div class="lists">
            <el-tree ref="menuTree"
              :data="data"
              show-checkbox
              default-expand-all
              check-on-click-node
              node-key="id"
              :default-checked-keys="checkeds"
              :props="defaultProps" />
        </div>
        <div class="mains">
            <el-button size="small" type="success" icon="iconfont icon-cunchu" @click="saveCatalogue">保存设置</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'temp-menu',
        data() {
            return {
                checkeds: [],
                data: [
                    {
                        id: 'file',
                        label: '文件',
                        children: [
                            {
                                id: 'newStandard',
                                label: '新建'
                            },
                            {
                                id: 'openFile',
                                label: '打开'
                            },
                            {
                                id: 'save-btn',
                                label: '保存'
                            },
                            {
                                id: 'restoredraft',
                                label: '草稿箱'
                            },
                            {
                                id: 'preview',
                                label: '预览'
                            },
                            {
                                id: 'close-btn',
                                label: '关闭'
                            }
                        ]
                    },
                    {
                        id: 'edit',
                        label: '编辑',
                        children: [
                            {
                                id: 'undo',
                                label: '撤销'
                            },
                            {
                                id: 'redo',
                                label: '恢复'
                            },
                            {
                                id: 'cut',
                                label: '剪切'
                            },
                            {
                                id: 'copy',
                                label: '复制'
                            },
                            {
                                id: 'paste',
                                label: '粘贴'
                            },
                            {
                                id: 'searchreplace',
                                label: '查找并替换'
                            }
                        ]
                    },
                    {
                        id: 'insert',
                        label: '插入',
                        children: [
                            {
                                id: 'image',
                                label: '图片'
                            },
                            {
                                id: 'inserttable',
                                label: '表格'
                            },
                            {
                                id: 'charmap',
                                label: '特殊字符'
                            },
                            {
                                id: 'hr',
                                label: '水平分割线'
                            }
                        ]
                    },
                    {
                        id: 'format',
                        label: '格式',
                        children: [
                            {
                                id: 'bold',
                                label: '粗体'
                            },
                            {
                                id: 'italic',
                                label: '斜体'
                            },
                            {
                                id: 'underline',
                                label: '下划线'
                            },
                            {
                                id: 'strikethrough',
                                label: '删除线'
                            },
                            {
                                id: 'superscript',
                                label: '上标'
                            },
                            {
                                id: 'subscript',
                                label: '下标'
                            },
                            {
                                id: 'fontformats',
                                label: '字体'
                            },
                            {
                                id: 'fontsizes',
                                label: '字号'
                            },
                            {
                                id: 'align',
                                label: '对齐'
                            },
                            {
                                id: 'lineheight',
                                label: '行距'
                            },
                            {
                                id: 'forecolor',
                                label: '文字颜色'
                            },
                            {
                                id: 'backcolor',
                                label: '背景色'
                            },
                            {
                                id: 'removeformat',
                                label: '清除格式'
                            }
                        ]
                    },
                    {
                        id: 'view',
                        label: '查看',
                        children: [
                            {
                                id: 'preview',
                                label: '预览'
                            },
                            {
                                id: 'fullscreen',
                                label: '全屏'
                            }
                        ]
                    },
                    {
                        id: 'help',
                        label: '帮助',
                        children: [
                            {
                                id: 'help',
                                label: '帮助说明'
                            },
                            {
                                id: 'bzt-ver',
                                label: '版本号'
                            }
                        ]
                    },
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods: {
            saveCatalogue() {
                var checkeds = this.$refs.menuTree.getCheckedKeys();
                console.log('checkeds=>', checkeds);
                this.$emit('change', checkeds);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .temp-menu-container{
        height: 100%;
        display: flex;
        .lists{
            padding:15px;
            flex: 0 0 400px;
            border-right: 1px solid #DDD;
            overflow: auto;
        }
        .mains{
            padding: 15px;
        }
    }
</style>
