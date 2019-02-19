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
              <el-tag @close="deleRights(scope.row,item1)" closable class="tag">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    closable
                    type="info"
                    class="tag"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
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
    <!-- 对话框  分配权限:before-close="handleClose" -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" >
      <el-tree
      ref="treeDom"
        :data="treedata"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-expanded-keys="arrExpand"
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogVisible: false,
      // 树形数据
      treedata:[],
    //   默认展开的数据
      arrExpand:[],
      // 默认选中的数据
      arrCheck:[],
      // 配置选项  来源于树形数据treedata中的key名
      defaultProps:{
          label:'authName',
          children:'children',
      }
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //   删除单独权限
    async deleRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //   提示信息
        this.$message.success(msg);
        //   刷新权限
        // this.getRoles();
        role.children = data;
      }
    },
    // 刷新角色列表

    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      // const {data,meta:{msg,status}} = res.data
      this.roles = res.data.data;
      console.log(this.roles);
    },
    // 显示分配权限
    async  showDiaSetRights() {
        const res=await this.$http.get(`rights/tree`)
        console.log(res);
        const {meta:{msg,status},data}=res.data;
        if(status===200){
            this.treedata=data
        //    this.treedata.id= arrExpand


        
        }
        
      this.dialogVisible = true;
    }
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
  margin-left: 5px;
}
.tishi {
  display: block;
  width: 60%;
  text-align: center;
}
</style>
