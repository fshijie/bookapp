<template>
    <div class="main-index">
        <nav-top class="nav-top" @menu-icon-click="handleShowMobileMenu" :menuFold.sync="menuFold" />
        <div class="main-body" :class="menuFold ? 'fold' : 'unfold'">
            <div class="main-sidemenu" :class="mobileMenuShow ? 'show' : 'hide'">
                <!-- <div class="logo">
                    <img src="@/assets/images/ui/icon_zhihuigongdi-gray.png">
                    <span>LOGO</span>
                </div> -->
                <side-menu></side-menu>
            </div>
            <div class="main-container">
                <router-view style="z-index: 1;"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import NavTop from '@/view/common/NavTop';
import SideMenu from '@/view/common/SideMenu';
export default {
    name: 'MainIndex',
    components: { NavTop, SideMenu },
    data() {
        return {
            mobileMenuShow: false,
            menuFold: false,
        };
    },
    watch: {
        menuFold(value) {
            this.$root.$emit('ex:side-menu', value);
        }
    },
    methods: {
        handleShowMobileMenu() {
            this.mobileMenuShow = !this.mobileMenuShow;
        }
        // async sendHeartbeat() {
        //     try {
        //         const onlineCount = await this.$api.sendHeartbeat();
        //         this.$store.commit(types.updateOnlineCount, onlineCount);
        //     } catch (error) {
        //         console.error(error);
        //     }

        //     // 每4分钟发送一次心跳
        //     setTimeout(() => this.sendHeartbeat(), 4 * 60 * 1000);
        // }
    },
    created() {
        // this.sendHeartbeat();
    }
};
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.main-index {
    // padding: 70px 20px 20px 20px;
    box-sizing: border-box;
    height: 100%;
    position: relative;

    // @media screen and (max-width: 800px) {
    //     padding-top: 60px;
    // }
    // @media screen and (max-width: 768px) {
    //     .nav-top {
    //         display: none;
    //     }
    // }

    .main-body {
        @sidemenu-width: 270px;

        height: calc(100vh - 60px);
        display: flex;
        width: 100%;

        // @media screen and (max-width: 768px) {
        //     height: 100vh;
        // }

        .main-sidemenu {
            width: @sidemenu-width;
            border-right: 1px solid @color-border;
            height: 100%;
            overflow: auto;
            flex-shrink: 0;
            // background-color: #fff;
            background-color: @color-background2;
            .logo {
                text-align: center;
                margin: 40px 0;

                img {
                    width: 40%;
                }
            }
        }
        .main-container {
            height: 100%;
            width: calc(~"100% - @{sidemenu-width}");
            position: relative;
            padding: 20px;
            overflow: auto;
            // background-color: @color-background--main;
        }

        @media screen and (min-width: 769px) {
            &.fold {
                .main-sidemenu {
                    display: none;
                }
                .main-container {
                    width: 100%;
                }
            }
        }

        @media screen and (max-width: 768px) {
            .main-sidemenu {
                position: fixed;
                transition: transform 0.4s;
                z-index: 9000;
                max-width: 90%;
                height: calc(100vh - 60px);

                &.show {
                    transform: translateX(0);
                }
                &.hide {
                    transform: translateX(-100%);
                }

                .logo {
                    display: none;
                }
            }
            .main-container {
                width: 100%;
            }
        }
    }
}
</style>
