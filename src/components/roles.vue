<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-braed level1="权限管理" level2="角色列表"></cus-braed>
    <!-- 添加按钮 -->
    <el-button class="btn">添加角色</el-button>
    <!-- 表单 -->
    <el-table height="450px" :data="roles" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable class="tag">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag closable type="info" class="tag">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    class="tag"
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果没有权限显示下面代码 -->
        <el-row v-if="scope.row.children.length===0">
            <el-col>
                <span class="tishi">未分配权限</span>
            </el-col>
        </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="400"></el-table-column>
      <el-table-column label="操作" width="400" class="caozuo">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <!-- @click="showDiaEditUsers(scope.row)" -->
          <!-- @click="showMsgBox(scope.row)" -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <!-- 分配权限 -->
          <el-button
            @click="showDiaSetRights(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 刷新角色列表
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      // const {data,meta:{msg,status}} = res.data
      this.roles = res.data.data;
      console.log(this.roles);
    },
    // 显示分配权限
    showDiaSetRights() {}
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
}
.caozuo {
  text-align: center;
}
.tag {
  margin-top: 5px;
  margin-bottom: 5px;
}
.tishi{
    display: block;
    width: 60%;
    text-align:center;
    }
</style>
