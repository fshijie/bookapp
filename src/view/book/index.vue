<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        timestamp="2018/4/12"
        placement="top"
        icon="el-icon-more"
        type="primary"
        size="large"
      >
        <el-card>
          <h4>玄幻频道</h4>
          <el-row type="flex" class="row-bg">
            <el-col
              :span="3"
              ><div
              @contextmenu.prevent="rightClick()"
                class="grid-content bg-purple"
                style="position:relative;background: #10c3c3;height:12rem;color:white;"
              >
                <div
                  style="position:absolute;top:50%;margin-top:-20px;left:20px;font-size:20px;text-align: center;"
                >
                  种田模板文分析
                </div>
                <el-card v-show="isShow" class="tool-book">
                  <div @click="add">添加大纲</div>
                   <div>写作</div>
                </el-card>
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content bg-purple-light"></div
            ></el-col>
            <el-col :span="6"
              ><div class="grid-content bg-purple"></div
            ></el-col>
            <el-col :span="6"
              ><div class="grid-content bg-purple"></div
            ></el-col>
          </el-row>
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
  name: "MainIndex",
  data() {
    return {
      mobileMenuShow: false,
      menuFold: false,
      isShow: false
    };
  },
  watch: {
    menuFold(value) {
      this.$root.$emit("ex:side-menu", value);
    }
  },
  methods: {
    handleShowMobileMenu() {
      this.mobileMenuShow = !this.mobileMenuShow;
    },
    add(){
      this.isShow=false;
       this.$router.push('/book/outline')
    },
    rightClick() {
      this.isShow = true;
      console.log('1111')
    }
  },
  created() {
    // this.sendHeartbeat();
  }
};
</script>

<style lang="less" scoped>
.tool-book {
  position: absolute;
  bottom: 0;
  right: -100px;
  line-height: 35px;
}
</style>
