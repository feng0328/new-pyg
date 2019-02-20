<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cusBraed level1="商品管理" level2="商品列表"></cusBraed>
    <!-- 提示框 -->
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- <el-alert title="消息提示的文案" type="info" center show-icon></el-alert> -->
    <!-- 步骤栏 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 左侧tab栏 -->
    <!-- 表单 -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" tab-position="left" @tab-click="chengeTab()">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultProp"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- <el-tabs v-model="active" tab-position="left">
      <el-tab-pane label="基本信息" name="1">
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
    </el-tabs>-->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      form: {
        goods_name: "asdasd", // 商品名称
        goods_cat: "", // 商品分类
        goods_price: "", // 商品价格
        goods_number: "", // 商品数量
        goods_weight: "", // 商品重量
        goods_introduce: "", // 商品介绍
        pics: "", // 图片
        attrs: "" // 商品属性
        // arrDy:[]
      },
      //   级联选择器的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDy: []
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 点击tab获取数据
    async chengeTab() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类!");
          return;
        }

        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many `
        );
        console.log(res);
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          console.log(this.arrDy);
        }
      }
    },
    // 获取三级分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(data);
      }
    },
    handleChange() {}
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
.form {
  height: 400px;
  overflow: auto;
}
</style>
