<template>
    <el-menu class="side-menu" :default-active="$route.name" ref="navMenu" @select="handleMenuSelect">
        <template v-for="(item, index) in menu">
            <el-menu-item
                @click.native.prevent
                :key="'menu_item' + index"
                v-if="!item.children"
                :index="item.routerName"
            >
                <i :class="item.icon" class="fa-fw" style="margin-right: 18px; font-size: 20px;"></i>
                <span slot="title" :title="item.name">{{ item.name }}</span>
            </el-menu-item>
            <li
                v-else
                :key="'menu_item' + index"
                class="el-menu-item"
                style="padding-left: 20px;"
                @click="handleItemClick(item.type)"
            >
                <i :class="item.icon" class="fa-fw" style="margin-right: 18px; font-size: 20px;"></i>
                <span :title="item.name">{{ item.name }}</span>
            </li>
            <!-- <el-submenu
                :key="'menu_item' + index"
                :index="'submenu_' + index"
                v-else-if="$auth.check(item.auth)"
                :class="isActiveForParentMenu(item, index)"
            >
                <template slot="title">
                    <i :class="item.icon" class="fa-fw" style="margin-right: 18px; font-size: 20px;"></i>
                    <span :title="item.name">{{ item.name }}</span>
                </template>
                 <el-menu-item
                    v-if="$auth.check(subItem.auth)"
                    v-for="(subItem, subIndex) in item.children"
                    :key="`menu_subitem_${index}_${subIndex}`"
                    :index="subItem.routerName"
                >
                    <i :class="subItem.icon" class="fa-fw" style="margin-right: 18px; font-size: 20px;"></i>
                    <span slot="title" :title="subItem.name">{{ subItem.name }}</span>
                </el-menu-item> -->
            <!-- </el-submenu> -->
        </template>
    </el-menu>
</template>

<script>
import menu from '@/router/menu-data';

export default {
    name: 'SideMenu',
    data() {
        return {
            menu
        };
    },
    methods: {
        handleItemClick(type) {
            // if (type === 'csg-pdf') {
            //     return this.handlePdfPreview();
            // }
        },
        handleMenuSelect(name) {
            this.$router.push({ name });
        },
        isActiveForParentMenu(item, index) {
            const isActive = item.children.some(subItem => subItem.path === this.currentPath);

            if (isActive) {
                this.$refs.navMenu.open('submenu_' + index);
            }
            return '';
        }
    },
    computed: {
        i18nValue() {
            return this.$store.state.i18nValue;
        }
    },
    watch: {
        '$route.name'(val) {
            setTimeout(() => {
                try {
                    if (val !== this.$refs.navMenu.activeIndex) {
                        this.$refs.navMenu.activeIndex = null;
                    }
                } catch (error) {
                    // do nothing
                }
            }, 0);
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';

.side-menu {
    border-right: none;
    background-color: @color-background2;

    // 导航菜单
    /deep/ .el-menu-item.is-active {
        background-color: @color-background2;
        border-left: 5px solid @color-primary;
    }
    /deep/ .el-menu-item {
        transition: border-color 0s !important;
        color: @color-second;
        border-left: 5px solid transparent;
    }
    /deep/ .el-submenu__title {
        color: @color-second;
        border-left: 5px solid transparent;
    }

    /deep/ .el-menu {
        background-color: @color-background2;
    }

    .el-menu-item {
        transition: border-color 0s !important;
        color: @color-text-black;
        border-left: 5px solid transparent;

        &:hover {
            background-color: lighten(@color-background2, 5%);
        }

        i {
            color: darken(@color-text-black, 15%);
        }
    }
    /deep/ .el-submenu__title {
        color: @color-text-black;
        border-left: 5px solid transparent;

        i {
            color: darken(@color-text-black, 15%);
        }

        &:hover {
            background-color: lighten(@color-background2, 5%);
        }
    }
    .el-menu-item.is-active {
        background-color: lighten(@color-background2, 5%);
        border-left: 5px solid @color-primary;
        color: @color-primary;

        i {
            color: @color-primary;
        }
    }
}
.el-menu-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
