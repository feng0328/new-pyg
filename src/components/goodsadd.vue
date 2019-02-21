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
        <el-tab-pane label="商品参数" name="2">
          <!-- group 复选框组 -->
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item label="添加图片">
            <el-upload
              :headers="headers"
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item label="" >
            <el-button @click="addGoods()" type="primary" class="btn">添加商品</el-button>
            <!-- vue项目的富文本 -->
           <quillEditor class="fwb"></quillEditor>
          </el-form-item>
        </el-tab-pane>
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
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
      // 动态参数的数组
      arrDy: [],
      // checkList: []
      // 动态参数的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //  商品内容
    addGoods() {},
    //  上传图片的两个方法
    handleRemove(file, fileList) {
      console.log("移除成功----");

      console.log(file);
      // file.response.data.tmp_path
    },

    handleSuccess(res, file, fileList) {
      console.log("上传成功----");
      console.log(res);

      // res.data.data.tmp_path
    },
    // 点击tab获取数据
    async chengeTab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类!");
          return;
        }
        // 获取动态数据
        if (this.active === "2") {
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
            // console.log(this.arrDy);
          }
        }
        // 获取静态数据
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          const {
            data,
            meta: { msg, status }
          } = res.data;

          if (status === 200) {
            this.arrStatic = data;
            console.log("静态参数----");

            console.log(this.arrStatic);
          }
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
        // console.log(data);
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
.ql-editor , .ql-blank{
  min-height: 200px;
  /* margin-top: 20px; */
}
.btn{
  margin-bottom: 20px;
}

</style>
