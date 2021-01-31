/**
 * 前端浏览器相关判断
 *
 * 由于需要在低版本浏览器中运行，因此不能使用ES6等新API
 *
 */

/*
Example User Agents
--------------------

Chrome:
    Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
    Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36

Firefox:
    Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0

IE9
    Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)
    Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.2; Zoom 3.6.0)

IE10
    Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.2; Zoom 3.6.0)

IE11:
    Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
    Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.2; Zoom 3.6.0; rv:11.0) like Gecko

Edge:
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134

Safari
    Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15

Android Chrome:
    Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19

iOS Safari:
    Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3

*/

const userAgent = window.navigator.userAgent;

export function isChrome() {
    return userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edge') === -1;
}

export function isIos() {
    return /(iPad|iPhone|iPod)/g.test(userAgent);
}

export function isAndroid() {
    return userAgent.indexOf('Android') !== -1;
}

export function isMobile() {
    return isIos() || isAndroid();
}

// 获取Chrome版本号字符串
export function getChromeVersionStr() {
    const matchArr = userAgent.match(/Chrome\s*?\/\s*?([\d\.]+)\s?/);
    if (matchArr && matchArr.length >= 2) {
        return matchArr[1];
    }
    return '';
}

// 获取版本号数字（主版本号）
export function getBrowserVersion(versionStr = '') {
    if (versionStr === '' || versionStr == null) {
        return -1;
    }

    return Number(versionStr.split('.')[0]);
}

// 获取Chrome的数字主版本号
export function getChromeVersion() {
    const ChromeVersionStr = getChromeVersionStr();
    return getBrowserVersion(ChromeVersionStr);
}

/**
 * 获取系统位数
 * @return 'x86' or 'x64'
 */
export function getOSBit() {
    const x = /x86_64|Win64|WOW64/.test(userAgent) || window.navigator.cpuClass === 'x64' ? 'x64' : 'x86';
    return x;
}

/**
 * 获取系统类型
 * @return 'Mac' or 'Win' or 'Linux'
 */
export function getOSType() {
    const os = window.navigator.platform.match(/(Win|Mac|Linux)/);
    const x = os && os[1];
    return x;
}
