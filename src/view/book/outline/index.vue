<template>
  <div class="block">
    <el-row>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <div>简介</div>
        </div></el-col
      >
      <el-col :span="16"
        ><div class="grid-content bg-purple-light">
          <div>
            <div class="ut-text-xl" id="editor">
              <div ref="toolbar" class="toolbar"></div>
              <div ref="editor" class="text"></div>
            </div>
          </div></div
      ></el-col>
      <el-col :span="4">
        <el-tooltip
          class="item ut-float-right"
          effect="dark"
          content="人物设计"
          placement="left"
        >
          <i class="el-icon-user ut-text-3xl" @click="drawer = true"></i>
        </el-tooltip>

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
      <div class="ut-flex">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline ut-pt-4 ut-ml-2"
        >
          <el-form-item>
            <el-input v-model="form.user" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.region" placeholder="角色类型">
              <el-option label="主角" value="1"></el-option>
              <el-option label="配角" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="">
          <el-tooltip
            class="item"
            effect="dark"
            content="创建角色"
            placement="left"
          >
            <i @click="addRole" class="el-icon-folder-add ut-text-3xl"></i>
          </el-tooltip>
        </div>
      </div>
      <div>
        <el-card v-for="(item, index) in roleList" :key="index">
          <el-row>
            <el-col :span="4" class="ut-relative">
              <img style="width: 100%; height: 100%" :src="item.img" />
              <div
                v-if="item.cate === 1"
                class="ut-absolute ut-bottom-0 ut-top-0 ut-w-4 ut-h-10 ut-text-center ut-text-white ut-text-xs ut-bg-orange-600"
              >
                主角
              </div>
              <div
                v-if="item.cate === 2"
                class="ut-absolute ut-bottom-0 ut-top-0 ut-w-4 ut-h-10 ut-text-center ut-text-white ut-text-xs ut-bg-blue-600"
              >
                配角
              </div>

              <div
                class="ut-absolute ut-bottom-0 ut-left-0 ut-w-full ut-text-center ut-text-white ut-text-xs ut-bg-gray-700"
              >
                {{ item.name }}
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <div>
                  重要标志：
                  <el-tag
                    v-for="(data, index) in item.tag"
                    :key="index"
                    type="success"
                    class="ut-ml-2"
                    >{{ data }}</el-tag
                  >
                </div>
                简介：{{ item.info }}
                <div>重要目标：{{ item.target }}</div>
                <i
                  @click="showDetail"
                  class="el-icon-video-play"
                  style="font-size: 24px; color: blue"
                ></i>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <el-drawer
        title="创建角色"
        :append-to-body="true"
        size="400px"
        :visible.sync="innerDrawer"
      >
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
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色">
            <el-radio-group v-model="form.resource">
              <el-radio label="1">主角</el-radio>
              <el-radio label="2">配角</el-radio>
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
      </el-drawer>
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
import E from "wangeditor";
import roleList from "./role";
export default {
  name: "MainIndex",
  data() {
    return {
      innerDrawer: false,
      editor: null,
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
      this.innerDrawer = true;
    },
    onSubmit() {},
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showDetail() {
      this.dialogVisible = true;
    },
  },
  mounted() {
    this.editor = new E("#editor");
    this.editor.config.zIndex = 50;
    this.editor.create();
  },
  created() {
    // this.sendHeartbeat();
  },
};
</script>

<style lang="less" scoped></style>
