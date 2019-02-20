<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="loginout" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏 -->
        <el-menu default-active="2" unique-opened :router="true">
          <!-- 导航一 用户 -->
          <el-submenu :index="item.order+''" 
          v-for="(item) in menus" :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" 
            v-for="(item2) in item.children" :key="item2.id">
              <i class="el-icon-location"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
          <!-- 导航2权限 -->
          
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus:[]
    }
  },
  beforeMount() {
    // if(!localStorage.getItem('token')){
    //   this.$router.push({
    //     name:'login'
    //   })
    // }
  },
  created() {
    this.getMenus()
  },
  methods: {
    async getMenus(){
      const res = await this.$http.get(`menus`)
      const {meta:{msg,status},data}=res.data
      if(status===200){
        this.menus=data
      }
      console.log(res)
    },
    handleLoginout(){
      localStorage.clear();
      this.$router.push({
        name:'login'
      });
      this.$message.warning('退出成功')
    }

  },

};
</script>

<style>
.container {
  background-color: yellow;
  height: 100%;
}
.aside {
  background-color: red;
}
.main {
  background-color: blue;
}
.header {
  background-color: #b3c0d1;
  padding: 0;
}

.header .middle {
  line-height: 60px;
  color: #fff;
  text-align: center;
}

.header .loginout {
  line-height: 60px;
  text-decoration: none;
}

.aside {
  background-color: #d3dce6;
}
.aside .menu {
  height: 100%;
}

.main {
  background-color: #e9eef3;
  height: 100%;
}
</style>
