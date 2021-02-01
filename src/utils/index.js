// /**
//  * utils
//  */

// import _ from 'lodash';
// import isPlainObject from 'lodash/isPlainObject';
// import currency from 'currency.js';

// import store from '@/vuex';

// const arrayLogicalAnd = (arr, arrCompare) => {
//     return arrCompare.every(item => {
//         return arr.includes(item);
//     });
// };

// const arrayLogicalOr = (arr, arrCompare) => {
//     return arrCompare.some(item => {
//         return arr.includes(item);
//     });
// };

export const authCheck = authToken => {
    // return true;
    // // 超级管理员返回所有权限
    // if (store.state.isSuperAdmin) {
    //     return true;
    // }

    // const auth = store.state.auth || [];
    // if (authToken === null || authToken === undefined || authToken === '') {
    //     // 无需权限
    //     return true;
    // } else if (Array.isArray(authToken)) {
    //     if (authToken.length === 0) {
    //         return true;
    //     }
    //     // 权限是数组，则只需要数组中包含一个权限即认为有权限
    //     return arrayLogicalOr(auth, authToken);
    // } else if (isPlainObject(authToken)) {
    //     const logical = authToken.logical || 'and';
    //     const authTokenVal = authToken.value || [];
    //     if (authTokenVal.length === 0) {
    //         return true;
    //     }
    //     if (logical === 'and') {
    //         // 数组中需包含全部权限
    //         return arrayLogicalAnd(auth, authTokenVal);
    //     }
    //     // 只需要数组中包含一个权限即认为有权限
    //     return arrayLogicalOr(auth, authTokenVal);
    // }

    // return auth.includes(authToken);
};

// export { currency };

export function fullscreen(ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    }
}

export function closeFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

export function fullscreenElement() {
    var fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

    return fullscreenEle;
}

export function strConcat(...keys) {
    return keys.reduce((prevVal, curVal) => {
        return prevVal + curVal;
    }, '');
}

export function log(...args) {
    return console.log(...args);
}

export function unset(obj, path) {
    if (_.unset(obj, path)) {
        return obj;
    }
    throw new Error('unset faild');
}

export function isEmptyValue(val) {
    if (val == null || val === '') {
        return true;
    }
    return false;
}

export function downloadFromResponse(response, filename) {
    const blobModel = new Blob([response.data]);
    if (!window.navigator.msSaveOrOpenBlob) {
        // 非IE浏览器
        const url = window.URL.createObjectURL(blobModel);
        const link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
        }, 0);
    } else {
        // IE 11
        window.navigator.msSaveOrOpenBlob(blobModel, filename);
    }
}
