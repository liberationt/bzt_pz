/**
 * @description DMS数据接口
 * @author sam.shen 2022.3.28
 */

import request from '@/utils/request';
let protocal = '';

const commData = {
    "request_id": "123",
    "operation": "GET_DMS_STD_CATEGORY",
    "root_category_name":"中标分类",
    "root_oa_category_no":1,
    "requester": "EDITOR"
}

// 1.1 通用-查询DMS标准分类
/*
{
    "request_id": "123",                        请求id
    "operation":"GET_DMS_STD_CATEGORY",         操作名称
    "std_type":1100,                            标准类型 1100|国家标准 1200|行业标准 1400|企业标准 1500|团体标准 1300|其他标准 6|地方标准 2|国外标准
    "category_method": 1,                       分类法 1:CCS分类(中标分类) 2:行业分类 3:ICS分类 4:国外分类 5:专业分类 6:国内分类 7:UDC分类 8:地方分类 9:体系分类 10:强条分类 11:产品分类 12:产业分类
    "root_category_name":"中标分类",             根分类名称
    "root_oa_category_no":1,                    根分类编号
    "requester": "EDITOR",                      请求者 系统编码,填写:TOPICAL | EDITOR
    "request_time":"2022-03-12 10:00:00"
}
*/
export function baseData(data) {
    return new Promise((resolve, reject) => {
        var params = Object.assign(commData, data)
        if (data.only) {
            params = data;
            delete params.only;
        }
        let response = request({
            url: protocal + '/dms/base_data',
            method: 'post',
            data: params
        })
        resolve(response);
    })
}

export function getAllIndustryList(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: protocal + '/dms-support/getAllIndustryList',
            method: 'post',
            data
        })
        resolve(response);
    })
}
