<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <el-row class="searchBox">
      <el-col>
        <el-input
          @clear="getAllUsers()"
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
          clearable
        >
          <el-button @click="searchUsers()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAddUsers()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- "id": 28,
        "username": "tige1200",
        "mobile": "test",
        "type": 1,
        "openid": "",
        "email": "test@test.com",
    "create_time": "2017-11-10T03:47:13.533Z",-->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column label="创建日期" width="130">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <!-- 前提: 单元格内容是一个组件, 不是porp的值 -->
        <template slot-scope="scope">
          <!-- 内容 -->
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="200">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button
            @click="showDiaEditUsers(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            @click="showMsgBox(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加对话框1 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="AddUsers()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditUsers()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="活动名称">{{formdata.username}}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色类别">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <!-- 剩下的动态生成 -->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item) in roles"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
  <!-- 添加 -->
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      list: [],
      formdata: {
        // username	用户名称	不能为空
        // password	用户密码	不能为空
        // email	邮箱	可以为空
        // mobile	手机号	可以为空
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //下拉框数据
      selectVal: -1,
      // 用户数据组
      roles: [],
      currUserId:'',
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色  更改角色
    async setRole(){
      const res= await this.$http.put(`users/${this.currUserId}/role`,{
        rid:this.selectVal
      })
      const {meta:{msg,status},data}=res.data
      if(status===200){
        this.dialogFormVisibleRole= false
        this.$message.success(msg)
      }
    },
    // 分配角色  显示对话框
    async showDiaSetRole(user) {
      this.currUserId=user.id
      this.formdata=user
      this.dialogFormVisibleRole = true;
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      };

      const res2=await this.$http.get(`users/${user.id}`)
      this.selectVal=res2.data.data.rid

    },
    // 修改用户状态
    async changeState(user) {
      // console.log(user);

      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    // 修改用户数据
    showDiaEditUsers(users) {
      this.formdata = users;
      this.dialogFormVisibleEdit = true;
    },
    async EditUsers() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      }
    },
    // 显示删除框
    showMsgBox(users) {
      this.$confirm("确定删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${users.id}`);

          // 对象解构
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功!");

            // 刷新列表
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加用户数据
    async AddUsers() {
      // 添加用户数据
      const res = await this.$http.post("users", this.formdata);

      console.log(res);

      // 关闭对话框
      this.dialogFormVisibleAdd = false;

      // 刷新列表
      this.getTableData();
    },
    // 显示添加用户提示框
    showDiaAddUsers() {
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    // 显示全部用户
    getAllUsers() {
      this.getTableData();
    },
    // 查询用户
    searchUsers() {
      this.pegenum = 1;
      this.getTableData();
    },
    // 翻页组件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    //  渲染表格
    async getTableData() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      // 设置发送请求时的请求头-> axios库 ->找axios中有没有可以设置headers头部的API->看axios文档
      //
      // const AUTH_TOKEN = localStorage.getItem("token");
      // // console.log(AUTH_TOKEN);
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
