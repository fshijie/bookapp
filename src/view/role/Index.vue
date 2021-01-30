<template>
  <div class="main-box">
    <el-row>
      <el-col :span="20">
        <h1>黎清,字素衣</h1>
        <div>
          人物代表图片：
          <img src='../../assets/img/黎清冤句.jpg' style="width: 60px;height: 60px">
          <div>人物属性</div>
          <div>外在关系</div>
          <div>参与剧情</div>
          <el-row>
            <el-col :span="4">
              <el-tooltip effect="light" placement="right">
                <el-button type="text"> 人物典型：</el-button>

                <div slot="content" style="max-width: 500px">
                  就是属于某类人的代表。
                  这个类，1，可以从身份上定义：修仙世家中最有天赋，最尊贵的人，是新贵，备受众人瞩目。
                  2、可以从性格的典型：外冷内热，重感情，十分有责任心和原则的人。
                  3、容貌最美
                </div>

              </el-tooltip>
            </el-col>
            <el-col :span="20">
              比喻描述：尊贵的女王变成了卑贱的乞丐或者地位更低的奴隶，<br>
              真实描述：（XXX）仙尊，神界最受期待，仙界最受欢迎，人间最有信仰的仙尊跌落成了最卑贱（秽）女，身穿乌衣，受万人唾弃。
              是门派之耻辱。从前的亲人都不得不和她划清界限。
              因为复活了自己的徒弟，受到了神界最重的惩罚<br>

            </el-col>
          </el-row>
          考虑时代不同，大纲模板会略微不同
        </div>
        <div> 衣服的颜色：白色，蓝色</div>
        <div>门派：天华</div>
        <div>关系：父母，伴侣，师傅，好友，敌人</div>
        <div>
          武器:类型，剑，枪
          剑，名字，铭心，霜寒 玉瑱,安歌，可以从武器排行榜上选
          等级：
          外观描述：
        </div>
        <div>心法：昙息术。</div>
        爱好：
        擅长：
        <div>缺点：不善言辞，有话直说。嘴毒。高冷，不解释，自我。</div>
        <div>底线：</div>
        <div>第一座神庙，在且留下或者南浔，<b style="color:red">神像</b>仙界的且留下。神灯，昙花开放，最后熄灭了。</div>
      </el-col>
      <el-col :span="4">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="颜值排行" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="财富排行" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="战力排行" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="正义和邪恶值" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        activeName:"first"
      }
    },
    methods: {
      handleClick() {

      }
    },
  }
</script>

<style scoped>
</style>
