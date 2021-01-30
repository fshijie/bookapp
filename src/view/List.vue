<template>
    <div>
      <el-row>
        <el-col :span="4">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>主角</span>
              </template>
              <el-menu-item :index="'role/index'">黎清</el-menu-item>
              <el-menu-item index="1-3">谢追</el-menu-item>
            </el-submenu>
            <el-menu-item :index="area/index">
              <i class="el-icon-menu"></i>
              <span>小说地图框架</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <transition>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </el-col>

      </el-row>

    </div>
</template>

<script>

  export default {
    name: 'List',
    data () {
      return {
         activeIndex:'1'
      }
    },
  }
</script>

<style scoped>

</style>
