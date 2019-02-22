<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cusBraed level1="商品管理" level2="分类参数"></cusBraed>
    <!-- 提示框 -->
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
    <!-- 级联选择框 -->
    <el-form class="form" label-position="left" label-width="120px" :model="form">
      <el-form-item label="请选择商品分类:">
        <el-cascader
          clearable
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          :props="defaultProp"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab栏切换 -->
    <el-tabs v-model="active" type="border-card">
      <el-tab-pane label="动态参数" name="1">
        <el-button disabled class="btn">设置动态参数</el-button>
        <el-table height="450px" border stripe :data="arrDy" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="expand" width="100">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(attr,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,attr)"
              >{{attr}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="100"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称" width="240"></el-table-column>

          <el-table-column label="操作" width="240">
            <!-- -->
            <template slot-scope>
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button type="init" disabled>设置静态参数</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        goods_name: "asdasd", // 商品名称
        goods_cat: "", // 商品分类
        goods_price: "", // 商品价格
        goods_number: "", // 商品数量
        goods_weight: "", // 商品重量
        goods_introduce: "", // 商品介绍

        pics: [], // 图片
        attrs: "" // 商品属性
        // arrDy:[]
      },
      active: "1",
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDy: [],
      list: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 动态改动tag 方法
    handleClose(item, attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      // this.arrDy.split(this.arrDy);
      console.log(item.attr_vals);
    },

    showInput() {
      // console.log(1111);
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        item.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //   联动数据获取方法
    async handleChange() {
      //   console.log("级联改变-----");
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选择三级分类!");
        return;
      }
      // 获取动态数据
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many `
      );
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;

      if (status === 200) {
        this.arrDy = data;
        console.log("动态参数----");

        this.arrDy.forEach(item => {
          if (item.attr_vals.length === 0) {
            item.attr_vals = [];
          } else {
            item.attr_vals = item.attr_vals.trim().split(",");
          }
        });
        console.log(this.arrDy);
      }
    },
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(data);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.btn {
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
