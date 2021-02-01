<template>
  <div class="block">
    <el-row>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <div>简介</div>
        </div></el-col
      >
      <el-col :span="16" style="background: #ccc; height: 80vh"
        ><div class="grid-content bg-purple-light">
          <div>
            简介：
            <div class="text-xl">
              一个网文写手带领大家发家致富的过程。
              网文写手小云朵穿越了。家里有个瘦瘦弱弱的弟弟，颤颤巍巍的奶奶，父亲去参加修河道，摔断了腿，奶奶哭瞎了眼睛。母亲现在还怀着一个孩子。瘦得皮包骨头。
              二叔家每天从家里扣扣搜一点送到家里来接济，泼辣的二嫂立马就冲了上来。
              当时分家，我们家你二叔觉得自己牛逼，我也觉得他好厉害，结果他做生意亏了本，现在还欠一屁股债，这日子没法过了。什么头脑灵活，连地都没有了。
              接着是小叔子家，学了手艺，做木匠活，媳妇也是会绣花，有手艺的，但是被老丈人找去做赘婿了，钱财做不了主。
              女主一家正无奈中，某秀才家愿意出XXX两银子，取媳妇。村里七大姑，八大姨都推荐，搞得像是皇帝选后宫，秀才不想那么早娶媳妇，，太穷了，不想娶媳妇。
              一个有志向，也不是很开窍的秀才男主，他空有美貌，和上进心，但无奈实在没有天赋。
              男主他现如今是不上不下。母亲也想叫他停了。下面有个小妹妹。建议给他娶个媳妇管管，但是很宠哥哥，嫂子。妹妹比较实际。
              秀才有个朋友，是富家公子。 秀才有看不起他的死对头，会奚落他。
              村里有村花。 第一步，女主解决家里危机。
              第二步，融入秀才家的生活。人家妹妹喜欢，妈妈喜欢，爹爹喜欢，叔叔伯伯喜欢。
              第三步。
              这里涉及的每个人人物都记得交代一下。男主做到宰相，都是女主的书迷呀。女主开了一个网站，古代编辑部。指导女性写文之类，倡导妇女解放。
              最后女主实现了最大的成就，受女生喜欢，男生喜欢，小孩子喜欢。
              官方推崇。
              男主就是个死记硬背的学霸，不懂其理，吃苦耐劳，凿壁偷光。
              但是字很好。开始嫌弃女主，但是后来渐渐被女主吸引。
            </div>
          </div>
        </div></el-col
      >
      <el-col :span="4">
        <el-button
          @click="drawer = true"
          type="primary"
          style="margin-left: 16px"
        >
          人物设计
        </el-button>

        <div></div>
        <div></div>
      </el-col>
    </el-row>
    <el-drawer
      title="添加人物"
      :visible.sync="drawer"
      :with-header="false"
      size="800px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色列表" name="first">
          <el-card v-for="(item, index) in roleList" :key="index">
            <el-row>
              <el-col :span="4">
                <img style="width: 100%; height: 100%" :src="item.img" />
              </el-col>
              <el-col :span="20"
                ><div class="grid-content bg-purple-light">
                  姓名：{{ item.name }}
                  <i
                    @click="showDetail"
                    class="el-icon-video-play"
                    style="font-size: 24px; color: blue"
                  ></i>

                  <el-tag>主角</el-tag>
                  <div>
                    性别：
                    <span v-if="item.sex === 1">男</span>
                    <span v-if="item.sex === 2">女</span>
                  </div>
                  <div>
                    重要标志：
                    <el-tag
                      v-for="(data, index) in item.tag"
                      :key="index"
                      type="success"
                      >{{ data }}</el-tag
                    >
                  </div>
                  简介：{{ item.info }}
                  <div>重要目标：{{ item.target }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="创建角色" name="second">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            style="margin-top: 20px"
          >
            <el-form-item label="姓名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.resource">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="出生地">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-tag>活泼</el-tag>
            <el-tag type="success">热情</el-tag>
            <el-tag type="info">腿部残疾</el-tag>
            <el-tag type="warning">笑起来好看</el-tag>
            <el-tag type="danger">勤奋</el-tag>
            <el-form-item label="重要标签">
              <el-input v-model="form.name" style="width: 100px"></el-input
              ><i class="el-icon-circle-plus-outline"></i>
            </el-form-item>
            <el-form-item label="人物简介">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth"
          >定时任务补偿</el-tab-pane
        >
      </el-tabs>
    </el-drawer>
    <el-dialog title="角色信息" :visible.sync="dialogVisible" width="80%">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      ></el-avatar>
      <el-tabs :tab-position="tabPosition" style="height: 200px">
        <el-tab-pane label="简介">
          <div>小云朵</div>
          <div>
            性别：
            <el-radio-group v-model="info.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
            年龄：12 代表图片，代表图参考 总体描写 身高: 体重： 体态：羸弱
            气质：偏清秀， 性格：沉闷 细节描写：头部， 容貌
            头发：发黄，细软，干枯 额头：额头饱满 眉毛：眉毛清淡，如细柳 眼：
            耳：小巧 口：樱桃小口，嘴唇浅淡，偏薄，有点干到起皮 鼻：修挺，
            肤色：蜡黄。 身子： 脖子：纤长白皙 肩部：瘦小，偏窄
            双臂：胳膊纤细柔弱 左手：手指纤长，上面有一层茧，颜色黄色
            右手：是指头上有一些疤痕 胸部：还没发育完全，略微隆起
            脊背：广阔，平坦 腰部：腰部纤细 臀部：干瘪 双腿：细长
            双脚：小巧，穿三十五码的鞋子，约XXX尺 所属时代：
            <el-radio-group v-model="info.sex">
              <el-radio :label="1">现代</el-radio>
              <el-radio :label="2">古代</el-radio>
            </el-radio-group>
            具体朝代：
            <el-radio-group v-model="info.sex">
              <el-radio :label="1">汉朝</el-radio>
              <el-radio :label="2">清朝</el-radio>
            </el-radio-group>

            <div>
              穿着： 配饰 头上：用红绳绑了两个辫子 耳朵： 妆容： 脖子：
              手链，手镯，臂钏 戒指，扳指 腰部：香囊，玉佩，皮带 服饰： 上衣服：
              内衣 中衣 外套： 披风 大鳖 裤子，裙子 鞋子 性格： 活泼 三观 金钱
              房产 属于什么势力 等级
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人物初始属性">
          <div>小云朵</div>
        </el-tab-pane>
        <el-tab-pane label="人物小传">角色管理</el-tab-pane>
        <el-tab-pane label="人物关系">定时任务补偿</el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import roleList from "./role";
export default {
  name: "MainIndex",
  data() {
    return {
      mobileMenuShow: false,
      dialogVisible: false,
      drawer: false,
      roleList,
      form: {},
      tabPosition: "left",
      activeName: "first",
      info: {
        sex: 2,
      },
    };
  },
  watch: {},
  methods: {
    addRole() {
      this.drawer = true;
    },
    onSubmit() {},
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showDetail() {
      this.dialogVisible = true;
    },
  },
  created() {
    // this.sendHeartbeat();
  },
};
</script>

<style lang="less" scoped></style>
