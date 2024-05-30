import Taro from "@tarojs/taro";
import { serverImagesDir, serverIP, serverVoicesDir, apiPrefix } from "../config";

export function getAnimals(onSuccess: (res: Taro.request.SuccessCallbackResult<any>) => any) {
    Taro.request({
        url: apiPrefix + '/media/animals',
        method: 'GET',
        success: onSuccess
    })
}

export function getEncourages(onSuccess: (res: Taro.request.SuccessCallbackResult<any>) => any) {
    Taro.request({
        url: apiPrefix + '/media/encourages',
        method: 'GET',
        success: onSuccess
    })
}

export function getMode(onSuccess: (res: Taro.request.SuccessCallbackResult<any>) => any) {
    Taro.request({
        url: apiPrefix + '/media/mode',
        method: 'GET',
        success: onSuccess
    })
}

export function getMedia() {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: apiPrefix + '/media/media',
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: res => {
                reject(res);
            }
        })
    })
}

export function getAnime() {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: apiPrefix + '/media/anime',
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: res => {
                reject(res);
            }
        })
    })
}

export default {
    getAnimals,
    getEncourages,
    getMode,
    getMedia,
    getAnime
}