<template>
    <div class="nav-top">
        <div class="left">
            <div class="logo">
                <!-- <a href="http://www.csg.cn/" target="_blank"> -->
                <span>神创</span>
                <!-- <img src="@/assets/images/logo.jpg"> -->
                <!-- </a> -->
            </div>
            <i @click="handleOpenSidebar" class="fa fa-navicon menu-icon"></i>
        </div>
        <div class="main">
            <i
                :title="menuFold ? '展开菜单栏' : '收起菜单栏'"
                class="ut-cursor-pointer"
                :class="menuFold ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                @click="$emit('update:menuFold', !menuFold)"
            />
        </div>
        <div class="right">
            <i title="全屏切换" @click="fullscreen" class="el-icon-full-screen right__full-btn"></i>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <!-- <img class="avatar" src="~@/assets/images/default-avatar.png" /> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item @click.native="handleUpdateUser('info')">修改用户信息</el-dropdown-item> -->
                    <el-dropdown-item @click.native="handleUpdateUser('password')">我的资料</el-dropdown-item>
                    <el-dropdown-item @click.native="handleUpdateUser('temperature')">我的体温</el-dropdown-item>
                    <el-dropdown-item @click.native="handleLogout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>

export default {
    name: 'NavTop',
    props: {
        menuFold: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            scrollDown: false,
            mobileMenuAutoHide: false,
            logoutLoading: false,
            // 防止替换二维码图片后浏览器缓存
            qrcodeId: Date.now(),
        };
    },

    methods: {
        handleOpenSidebar() {
            this.$emit('menu-icon-click');
        },
        fullscreen() {
            if (this.$utils.fullscreenElement()) {
                this.$utils.closeFullScreen();
            } else {
                const rootElement = document.rootElement || document.documentElement || document.body;
                this.$utils.fullscreen(rootElement);
            }
        },
        isActiveForParentMenu(item) {
            return item.children.some(subItem => subItem.path === this.currentPath);
        },
        redirect(path) {
            this.$router.push(path);
        },
    },
};
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.nav-top {
    @nav-top-height: 60px;

    display: flex;
    // justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: @nav-top-height;
    line-height: @nav-top-height;
    background-color: @color-background2;
    border-bottom: 1px solid darken(@color-background2, 5%);
    color:@color-text-black;

    .datetime-text {
        font-size: 12px;
        color: @color-second;
        margin-right: 15px;
        line-height: 18px;

        &__item {
            display: flex;

            &-space {
                flex: 1;
            }
            &-text {
                white-space: nowrap;
            }
        }
    }

    .online-count {
        color: @color-second;
        display: flex;
        margin-right: 15px;
        font-size: 12px;

        &__label {
            margin-right: 5px;
        }
    }

    .left {
        // min-width: 250px;

        // @media screen and (max-width: 768px) {
        //     min-width: auto;
        // }

        .logo {
            white-space: nowrap;

            @media screen and (max-width: 768px) {
                display: none;
            }
            img {
                width: 250px;
                vertical-align: middle;

                &:first-child {
                    margin-right: 20px;
                }
            }
        }
        .menu-icon {
            display: none;
            cursor: pointer;
            color: @color-second;
            font-size: 22px;

            @media screen and (max-width: 768px) {
                display: block;
            }
        }
    }

    .main {
        padding-left: 10px;
        @media screen and (max-width: 768px) {
            display: none;
        }
    }

    .right {
        margin-left: auto;
        display: flex;
        align-items: center;
        height: @nav-top-height;
        line-height: initial;
        // justify-content: space-between;
        // width: 90px;

        &__full-btn {
            vertical-align: middle;
            cursor: pointer;
            font-size: 24px;
            margin-right: 12px;
            color: @color-second;
        }
        &__i18n {
            margin-right: 12px;
            background-color: @color-second;
            font-size: 10px;
            border-radius: 2px;
            padding: 0 5px;
            line-height: 22px;
            vertical-align: middle;
            cursor: pointer;
        }
        .avatar {
            width: 26px;
            vertical-align: middle;
            cursor: pointer;
        }
    }

    .menu {
        &__dropdown {
            margin-left: 10px;

            &:first-child {
                margin-left: 0;
            }

            &-arrow {
                margin-top: -1px;
                margin-bottom: -1px;
            }
        }
    }
}

.app-download {
    color: @color-second;
    margin-right: 10px;
    cursor: pointer;

    i {
        font-size: 20px;
        vertical-align: middle;
    }
    span {
        font-size: 14px;
        vertical-align: middle;
    }

    &__content {
        display: flex;

        &-item {
            &:first-child {
                margin-right: 12px;
            }

            img {
                width: 180px;
                height: 180px;
            }

            &-text {
                text-align: center;
                color: @color-second;

                i,
                span {
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
