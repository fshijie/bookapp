/**
 * 运行时配置文件
 */

// 生产api地址
const apiBaseUrlProd = 'https://cop.megasuntech.com/api/';

// 开发api地址
// const apiBaseUrlDev = 'http://192.168.5.92:8765/api/';
const apiBaseUrlDev = 'http://localhost:8081';

// 生产流程模型编辑地址
const modelerBaseUrlProd = 'https://cop.megasuntech.com/';

// 开发流程模型编辑地址
const modelerBaseUrlDev = 'https://cop.megasuntech.com/';

export default {
    apiBaseUrl: process.env.NODE_ENV === 'production' ? apiBaseUrlProd : apiBaseUrlDev,
    modelerBaseUrl: process.env.NODE_ENV === 'production' ? modelerBaseUrlProd : modelerBaseUrlDev,
    staticBaseUrl: process.env.NODE_ENV === 'production' ? '/static/' : '/static/'
};
