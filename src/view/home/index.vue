<template>
   <div class="block">
  <el-timeline>
    <el-timeline-item timestamp="2018/4/12" placement="top" icon='el-icon-more'>
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王小虎 提交于 2018/4/12 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/3" placement="top">
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王小虎 提交于 2018/4/3 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/2" placement="top">
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王小虎 提交于 2018/4/2 20:46</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
</template>
<script>
export default {
    name: 'MainIndex',
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

</style>
