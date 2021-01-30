<template>
  <div
    ref="myCart"
    data-Url="manage/list"
    :type="post"
  >
    <div v-model="form">浩清门</div>
    地位，寒洲第一修真门派。
    地理位置在北：寒洲相对其它周，最为寒冷。
    五大洲的关系。
    寒洲，中州，东州，云州，江川  魇州  幽州冥河  茕州  扶风郡（九嶷山，翠微）
  </div>
  <div @click="submit"></div>
</template>

<script>
  export default {
    name: 'haoqing',
    data() {
      return {
        form:{}
      }
    },
    methods: {
      submit() {
        apiControl(this.dataUrl)
      }
    },
  }
</script>

<style scoped>

</style>
