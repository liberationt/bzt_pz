/**
 * 编辑器配置参数
 */

export const templateBaseTypes = [
    {label:'字号字体', value: 2001, act:'font'},
    {label:'目次选项', value: 2002, act:'catalogue'},
    {label:'要素的类别、构成', value: 2000, act:'outline'},
    {label:'页面设置', value: 2003, act:'page'},
    {label:'菜单栏', value: 2004, act:'menu'},
    {label:'工具条', value: 2005, act:'tool'},
];

export const templateContentTypes = [
    {label:'国标封面内容', value: 10, act:'cover'},
    {label:'国标前言内容', value: 11},
    {label:'国标引言内容', value: 12},
    {label:'国标范围内容', value: 13},
    {label:'国标规范性引用文件内容', value: 14},
    {label:'国标术语与定义内容', value: 15},
    {label:'行标封面内容', value: 20},
];

export const fontConfig = [
    {
        "rows":6,
        "label": "封面",
        "type": "cover",
        "position":"左上第一、二行",
        "text":"ICS 号、 CCS号",
        "keys":["ics","ccs"],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "label": "封面",
        "type": "cover",
        "position":"左上第三行",
        "text":"备案号",
        "keys":["record"],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "label": "封面",
        "type": "cover",
        "position":"右上第一行",
        "text":"文件代号",
        "keys":["record"],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "label": "封面",
        "type": "cover",
        "position":"右上第三行",
        "text":"文件编号",
        "keys":["number"],
        "fontSize":"14pt",
        "fontFamily":"simHei"
    },
    {
        "label": "封面",
        "type": "cover",
        "position":"右上第二行",
        "text":"代替文件编号",
        "keys":["instead"],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "label": "封面",
        "type": "cover",
        "position":"第一行",
        "text":"中华人民共和国国家标准（具体名称按类别区分）",
        "keys":["dd"],
        "fontSize":"",
        "fontFamily":""
    },
    {
        "rows":2,
        "label": "目次",
        "type": "catalogue",
        "position":"第一行",
        "text":"目次（标题）",
        "keys":["header-title"],
        "fontSize":'15.75pt',
        "fontFamily":"simHei"
    },
    {
        "label": "目次",
        "type": "catalogue",
        "position":"其他各行",
        "text":"目次内容",
        "keys":["catalogue-list","fld-char"],
        "fontSize":"10.5pt",
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "前言",
        "type":1,
        "position":"第一行",
        "text":"前言（标题）",
        "keys":["header-title"],
        "fontSize":'15.75pt',
        "fontFamily":"simHei"
    },
    {
        "label": "前言",
        "type":1,
        "position":"其他各行",
        "text":"前言内容",
        "keys":[""],
        "fontSize":"10.5pt",
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "引言",
        "type":1,
        "position":"第一行",
        "text":"引言（标题）",
        "keys":["header-title"],
        "fontSize":'15.75pt',
        "fontFamily":"simHei"
    },
    {
        "label": "引言",
        "type":2,
        "position":"其他各行",
        "text":"引言内容",
        "keys":[""],
        "fontSize":"10.5pt",
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "正文首页",
        "type":3,
        "position":"第一行",
        "text":"文件名称（标题）",
        "keys":["header-title"],
        "fontSize":'15.75pt',
        "fontFamily":"simHei"
    },
    {
        "label": "正文首页",
        "type":3,
        "position":"文件名称之下",
        "text":"重要提示及其内容",
        "keys":[""],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "rows":3,
        "label": "术语条目",
        "type":4,
        "position":"第一行",
        "text":"条目编号",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "术语条目",
        "type":4,
        "position":"第二行",
        "text":"术语、英文对应词",
        "keys":[""],
        "fontSize":"10.5pt",
        "fontFamily":"simHei"
    },
    {
        "label": "术语条目",
        "type":4,
        "position":"其他各行",
        "text":"条目内容",
        "keys":[""],
        "fontSize":"10.5pt",
        "fontFamily":"simSun"
    },

    {
        "rows":4,
        "label": "附录",
        "type":5,
        "position":"第一行",
        "text":"附录编号",
        "keys":["header-title"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },

    {
        "label": "附录",
        "type":5,
        "position":"第二行",
        "text":"(规范性)、(资料性)",
        "keys":["header-title"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "附录",
        "type":5,
        "position":"第三行",
        "text":"附录标题",
        "keys":["header-title"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "附录",
        "type":5,
        "position":"其他各行",
        "text":"附录内容",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "参考文献",
        "type":6,
        "position":"第一行",
        "text":"参考文献",
        "keys":["header-title"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "参考文献",
        "type":6,
        "position":"其他各行",
        "text":"参考文献内容",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "索引",
        "type":7,
        "position":"第一行",
        "text":"索引",
        "keys":["header-title"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "索引",
        "type":7,
        "position":"其他各行",
        "text":"索引内容",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "rows":2,
        "label": "层次",
        "type":8,
        "position":"各页",
        "text":"章、条编号及其标题",
        "keys":["header-title","ol-list","appendix-lisy"],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "层次",
        "type":9,
        "position":"其他各行",
        "text":"各页",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "rows":1,
        "label": "来源",
        "type":10,
        "position":"各页",
        "text":"标明来源的'来源'",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "rows":6,
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"图编号、图题 表编号、表题",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"分图编号、分图题",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },
    {
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"续图、续表的'(续)'' (第#页/共提页) .,'",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
    {
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"图、表右上方'关于单位的陈述'",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },
    {
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"图中的数字和文字",
        "keys":[""],
        "fontSize":'7.875pt',
        "fontFamily":"simSun"
    },
    {
        "label": "图、表",
        "type":11,
        "position":"各页",
        "text":"表中的数字和文字",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },

    {
        "rows":2,
        "label": "示例",
        "type":12,
        "position":"各页",
        "text":"标明示例的'示例:''示例x:'",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simHei"
    },
    {
        "label": "示例",
        "type":12,
        "position":"各页",
        "text":"示例内容",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },
    {
        "rows":3,
        "label": "注、脚注",
        "type":13,
        "position":"各页",
        "text":"标明注的'注:''注x:'",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simHei"
    },
    {
        "label": "注、脚注",
        "type":13,
        "position":"各页",
        "text":"注的内容",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },
    {
        "label": "注、脚注",
        "type":13,
        "position":"各页",
        "text":"脚注编号，脚注、图脚注、表脚注的内容",
        "keys":[""],
        "fontSize":'9pt',
        "fontFamily":"simSun"
    },
    {
        "rows":1,
        "label": "封底",
        "type":14,
        "position":"右上角",
        "text":"文件编号",
        "keys":[""],
        "fontSize":'14pt',
        "fontFamily":"simHei"
    },
    {
        "rows":2,
        "label": "单双数页",
        "type":15,
        "position":"书眉右、左侧",
        "text":"文件编号",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simHei"
    },
    {
        "label": "单双数页",
        "type":15,
        "position":"版心右、左下角",
        "text":"页码",
        "keys":[""],
        "fontSize":'10.5pt',
        "fontFamily":"simSun"
    },
]

export const defaultCatalogues = [
    { label:'前言',value:'type1', type:'default' ,checked:true },
    { label:'引言',value:'type2', type:'default' ,checked:true },
    { label:'章标题',value:'type3', type:'default' ,checked:true },
    { label:'附录',value:'type4', type:'default' ,checked:true },
    { label:'参考文献',value:'type5', type:'default' ,checked:true },
    { label:'索引',value:'type6', type:'default' ,checked:true },
    { label:'一级条标题',value:'leve11', other:true ,checked:true },
    { label:'二级条标题',value:'leve12', other:true },
    { label:'三级条标题',value:'leve13', other:true },
    { label:'四级条标题',value:'leve14', other:true },
    { label:'五级条标题',value:'leve15', other:true },
    { label:'附录章标题',value:'appendix0', other:true ,checked:true },
    { label:'附录一级条标题',value:'appendix1', other:true },
    { label:'附录二级条标题',value:'appendix2', other:true },
    { label:'附录三级条标题',value:'appendix3', other:true },
    { label:'附录四级条标题',value:'appendix4', other:true },
    { label:'附录五级条标题',value:'appendix5', other:true },
    { label:'图标题',value:'imgTitle', other:true },
    { label:'表标题',value:'tableTitle', other:true },
];
