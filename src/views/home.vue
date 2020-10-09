<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <div class="logo">
        <img src="../assets/img/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleAside">| | |</div>
        <!-- 当el-menu开启路由模式，每点击menu中的item就会跳转到对应的item的index属性的页面中  -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#3797fd"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activedItem"
        >
          <!-- 一级菜单 --> 
          <el-submenu :index="item.id+ ''" v-for="item in asideList" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getAsideData } from "../network/home";

export default {
  name: "home",
  data() {
    return {
      asideList: [],
      icons: {
        "103": "el-icon-setting",
        "101": "el-icon-shopping-bag-2",
        "125": "el-icon-user",
        "102": "el-icon-s-order",
        "145": "el-icon-s-data"
      },
      isCollapse: false,
      activedItem: ""
    };
  },
  created() {
    //渲染左侧菜单栏
    getAsideData().then(res => {
      if (res.status !== 200) return this.$message.error("获取左侧列表失败");

      this.asideList = res.data.data;

      // console.log(this.asideList);
    });
    //home 组件重新渲染时，立刻跳转到被激活的链接
    this.activedItem = sessionStorage.getItem("activePath");
    if (this.activedItem !== null) {
      this.$router.push("/home/" + this.activedItem);
    }
  },
  methods: {
    logout() {
      //基于token实现的登陆功能只需要清楚sessionStorage中的token就可以实现退出了
      sessionStorage.clear();
      //重新跳转到登陆界面
      this.$router.push("/login");
    },
    toggleAside() {
      this.isCollapse = !this.isCollapse;
    }
  },
  watch: {
    //监听路由变化，保持导航栏的选中状态
    $route(to, from) {
      sessionStorage.setItem("activePath", to.path.split("/")[2]);
      this.activedItem = sessionStorage.getItem("activePath");
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
}

.el-menu {
  border: 0;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.home_container {
  height: 100%;
}

.home_header {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo span {
  margin-left: 20px;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
}

.toggle-button {
  height: 25px;
  background-color: #485164;
  color: white;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  cursor: pointer;
}
</style>
