/**
 * 左侧导航菜单
 */

export default [
    {
        name: '小云朵',
        sex: 1,
        age: 15,
        出生地: '李家村',

    },
    {
        name: '我的书架',
        path: '/book',
        icon: 'fa fa-file-text-o',
        routerName: 'book',
        // auth: 'order-manage:view',
        // children: [
        //     {
        //         name: '创建大纲',
        //         path: '/book/outline',
        //         icon: 'fa fa-file-text-o',
        //         routerName: 'outline',
        //         // auth: 'order-manage:view',
        //     },
        // ]
    },
    {
        name: '创建大纲',
        path: '/book/outline',
        icon: 'fa fa-file-text-o',
        routerName: 'outline',
        // auth: 'order-manage:view',
    },
    {
        name: '用餐情况',
        path: '/mealData/index',
        icon: 'el-icon-tableware',
        routerName: 'MealData',
        auth: 'MealData:view',
    },
    // {
    //     name: '温度查询',
    //     path: '/queryTemperature/index',
    //     icon: 'el-icon-watch',
    //     routerName: 'Temperature',
    //     auth: 'Temperature:view',
    // },
    // {
    //     name: '钓鱼比赛温度查询',
    //     path: '/play/temperature',
    //     icon: 'el-icon-watch',
    //     routerName: 'temperatureP',
    //     auth: 'temperatureP:view',
    // },
    // {
    //     name: '比赛记录',
    //     path: 'play/raceHistory',
    //     icon: 'el-icon-watch',
    //     routerName: 'RaceHistory',
    //     auth: 'RaceHistory:view',
    // },
    // {
    //     name: '参赛列表',
    //     path: '/play/memberList',
    //     icon: 'el-icon-watch',
    //     routerName: 'MemberList',
    //     auth: 'MemberList:view',
    // },
    // {
    //     name: '参赛轨迹',
    //     path: '/play/playLocation',
    //     icon: 'el-icon-watch',
    //     routerName: 'PlayLocation',
    //     auth: 'PlayLocation:view',
    // },
    {
        name: '室内定位',

        path: '/Zrender/index',
        icon: 'fa fa-map-marker fa-fw',
        routerName: 'Zrender',
        auth: 'Zrender:view',
    },
    {
        name: '设备管理',
        path: '/for-outer/device',
        icon: 'fa fa-hdd-o',
        routerName: 'ForOuterDevice',
        auth: 'for-outer-device:view',
    },
    {
        name: '报表',
        path: '/for-outer/report',
        icon: 'fa fa-table',
        routerName: 'ForOuterReport',
        auth: 'for-outer-report:view',
    },
    {
        name: '设置',
        icon: 'fa fa-cogs',
        auth: ['org:view', 'role:view', 'dict:view', 'process-setting:view'],
        children: [

            {
                name: '组织机构管理',
                path: '/for-outer/org',
                icon: 'fa fa-users',
                routerName: 'ForOuterOrg',
                auth: 'for-outer-org:view',
            },
            {
                name: '用户管理',
                path: '/for-outer/user',
                icon: 'fa fa-user',
                routerName: 'ForOuterUser',
                auth: 'for-outer-user:view',
            },
            {
                name: '学生管理',
                path: '/studentManage',
                icon: 'fa fa-user',
                routerName: 'studentManage',
                auth: 'student-management:view',
            },
            {
                name: '角色管理',
                path: '/for-outer/role',
                icon: 'fa fa-user-circle-o',
                routerName: 'ForOuterRole',
                auth: 'for-outer-role:view',
            },
            {
                name: '字典管理',
                path: '/for-outer/dict',
                icon: 'fa fa-book',
                routerName: 'ForOuterDict',
                auth: 'for-outer-dict:view',
            },
            {
                name: '学校时段管理',
                path: '/for-outer/slot',
                icon: 'fa fa-calendar',
                routerName: 'ForOuterSlot',
                auth: 'for-outer-slot:view',
            },
        ],
    },
];
