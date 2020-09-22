<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout(){
      //基于token实现的登陆功能只需要清楚sessionStorage中的token就可以实现退出了
      sessionStorage.clear()
      //重新跳转到登陆界面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="" scoped>

</style>
