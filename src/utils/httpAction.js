import request from "./request.js";
import qs from 'qs'

/**
 * 动态生成方法, 导出接口函数
 * @param {object} actions
 * @desc 直接import userApi from "@api/userApi.js";
 * @desc userApi.getUserInfo().then().catach() 调用
 * @author wry 2021.12.04
 */

export function toActions(actions) {
    let exportFuncs = {};
    for (let key in actions) {
        let action = actions[key];
        const info = action.split(" ");
        if (info.length == 2) {
            let method = info[0],
                url = info[1];
            exportFuncs[key] = (params) => {
                if (method === 'GETS' || method === 'gets') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}/${params}`,
                            method: 'GET',
                        });
                        resolve(response)
                    })
                } else if (method === 'GET' || method === 'get') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: method,
                            params
                        });
                        resolve(response)
                    })
                } else if (method === 'post' || method === 'POST') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: method,
                            data: params
                        });
                        resolve(response)
                    })
                } else if (method === 'posts' || method === 'POSTS') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: 'POST',
                            params: params
                        });
                        resolve(response)
                    })
                } else if (method === 'postu' || method === 'POSTU') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}/${params}`,
                            method: 'POST'
                        });
                        resolve(response)
                    })
                } else if (method === 'postb' || method === 'POSTB') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}`,
                            method: 'POST',
                            data: qs.stringify(params)
                        });
                        resolve(response)
                    })
                } else if (method === 'postp' || method === 'POSTP') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}`,
                            method: 'POSTP',
                            data: params
                        });
                        resolve(response)
                    })
                } else if (method === 'put' || method === 'PUT') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: method,
                            data: params
                        });
                        resolve(response)
                    })
                } else if (method === 'putu' || method === 'PUTU') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: 'PUT',
                            params: params
                        });
                        resolve(response)
                    })
                } else if (method === 'puts' || method === 'PUTS') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}/${params}`,
                            method: 'PUT',
                        });
                        resolve(response)
                    })
                } else if (method === 'delete' || method === 'DELETE') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: url,
                            method: method,
                            data: params
                        });
                        resolve(response)
                    })
                } else if (method === 'deletes' || method === 'DELETES') {
                    return new Promise((resolve, reject) => {
                        let response = request({
                            url: `${url}/${params}`,
                            method: 'DELETE',
                        });
                        resolve(response)
                    })
                }
            };
        }
    }
    return exportFuncs;
}