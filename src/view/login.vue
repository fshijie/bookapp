<template>
    <div>
      <h1 style="text-align: center">登录</h1>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import api from "../api/index";


  export default {
        name: "login",
      data() {
        return {
          form: {}
        }
      },
      methods: {
        onSubmit() {
          api.login(this.form);
        }
      },
    }
</script>

<style scoped>

</style>
