/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    let search = params;
    search.params = typeof(search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof(propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
    var actions = [];
    Object.keys(datas).some((key) => {
        if (datas[key].value == ('' + value)) {
            actions.push(datas[key].label);
            return true;
        }
    })
    return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
    var actions = [];
    var currentSeparator = undefined === separator ? "," : separator;
    var temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        Object.keys(datas).some((key) => {
            if (datas[key].value == ('' + temp[val])) {
                actions.push(datas[key].label + currentSeparator);
            }
        })
    })
    return actions.join('').substring(0, actions.join('').length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments,
        flag = true,
        i = 1;
    str = str.replace(/%s/g, function() {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

// 数据合并
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p]);
            } else {
                source[p] = target[p];
            }
        } catch (e) {
            source[p] = target[p];
        }
    }
    return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
};

/**
 * 判断对象属性是否为空
 * @param {*} obj 
 * @returns 
 */
export function objectKeyIsEmpty(obj) {
    let empty = false;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null || obj[key] === '') {
                empty = true;
            } else {
                empty = false;
                break;
            }
        }
    }
    return empty;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof(value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && typeof(value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
};

// 验证是否为blob格式
export async function blobValidate(data) {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
};
/**
 * 身份证验证
 * @param {*} value 
 * @returns boolean
 */
export function checkCardNo(value) {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(value);
};

/**
 * 校验是否包含中文
 * @param {*} value 
 * @returns boolean
 */
export function haveCNChars(value) {
    return /[\u4e00-\u9fa5]/.test(value);
};

/**
 * 校验是否为邮箱
 * @param {*} value 
 * @returns boolean
 */
export function isEmail(value) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
};

/**
 * 对象深拷贝
 * @param {*} obj 
 * @param {*} hash 
 * @returns Obiect
 */
export function deepClone(obj, hash = new WeakMap()) {
    // 日期对象直接返回一个新的日期对象
    if (obj instanceof Date) {
        return new Date(obj);
    }
    //正则对象直接返回一个新的正则对象     
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    //如果循环引用,就用 weakMap 来解决
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    // 获取对象所有自身属性的描述
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    // 遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            cloneObj[key] = deepClone(obj[key], hash);
        } else {
            cloneObj[key] = obj[key];
        }
    }
    return cloneObj
};

/**
 * 滚动到页面顶部
 */
export function scrollToTop() {
    const height = document.documentElement.scrollTop || document.body.scrollTop;
    if (height > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, height - height / 8);
    }
};

/**
 * 滚动到页面底部
 */
export function scrollToBottom() {
    window.scrollTo(0, document.documentElement.clientHeight);
};

/**
 * 滚动到指定元素区域
 * @param {*} element 指定元素
 */
export function smoothScroll(element) {
    document.querySelector(element).scrollIntoView({
        behavior: 'smooth'
    });
};

/**
 * 获取可视窗口高度
 * @returns 
 */
export function getClientHeight() {
    let clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
};

/**
 * 获取可视窗口宽度
 * @returns 
 */
export function getPageViewWidth() {
    return (document.compatMode == "BackCompat" ? document.body : document.documentElement).clientWidth;
};

/**
 * 详情组件（参数）数据格式化
 * @param {*} detailForm 组件参数
 * @param {*} detail 详情数据
 */
export function filterDetailParam(detailProps, detail) {
    detailProps.forEach(item => {
        Object.keys(item.content).map(key => {
            item.content[key].value = detail[key] || '';
        })
    });

    return detailProps
};

/**
 * 设置任务状态显示样式
 * @param {*} data 状态值
 * @param {*} list 状态列表
 */
export function setTaskStatusStyle(list, data) {
    let str = "";
    list.forEach((item) => {
        if (Number(item.value) == Number(data)) {
            str = item.label;
        }
    });
    switch (Number(data)) {
        case 1:
            str = `<span class="warning-tag">${str}</span>`;
            break;
        case 2:
            str = `<span class="ing-tag">${str}</span>`;
            break;
        case 3:
            str = `<span class="success-tag">${str}</span>`;
            break;
        case 4:
            str = `<span class="error-tag">${str}</span>`;
            break;
        case 5:
            str = `<span class="warning-tag">${str}</span>`;
            break;
        case 6:
            str = `<span class="ing-tag" style="width:auto;display:inline-block">待选择接口对接人</span>`;
            break;
        case 7:
            str = `<span class="ing-tag" style="width:auto;display:inline-block">特殊立项审核中</span>`;
            break;
    }
    return str;
}

/**
 * 角色是否有操作权限
 * @param {*} roleKeys 权限字符
 */
export function hasPermission(roleKeys) {
    let roleArr = roleKeys == null || roleKeys == '' ? [] : roleKeys.split(',')
    let has = false;
    console.log(this.$store.getters.userInfo.roles)
    if (this.$store.getters.userInfo.roles != null) {
        this.$store.getters.userInfo.roles.forEach((item) => {
            roleArr.forEach(role => {
                if (item.roleKey == role) {
                    has = true;
                }
            })
        });
    }
    return has;
}

/**
 * 不包含权限
 * @param {Array<string>} permiList 权限字符列表
 */
export function noPermi(permiList) {
    let no = true
    if (this.$store.getters.permissions != null) {
        this.$store.getters.permissions.forEach((item) => {
            permiList.forEach(str => {
                if (item == str || item == "*:*:*") {
                    no = false;
                }
            })
        });
    }
    return no
}

/**
 * 获取路由参数
 * @param {*} name 参数名称
 * @returns 参数值
 */
export function getUrlKey(name) {

    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null

}