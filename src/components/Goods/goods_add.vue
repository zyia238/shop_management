<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品的信息" type="info" show-icon :closable="false" center></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="currentAcive - 0 " finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性 3"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页 -->
      <!-- el-tabs的子标签必须是el-tab-pane，如果将el-form-item包裹在el-tabs中会无效 -->
      <!-- 由于是全部五个el-tab-pane共同组成要添加的商品，所以需要在外层包裹一个el-form以提交 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="currentAcive"
          :tab-position="'left'"
          :before-leave="tabsChange"
          @tab-click="tabsClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="nodesList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,index) in manyTable" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTable" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-input
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  v-model="item.attr_vals"
                ></el-input>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" class="quill-editor"/>
            <el-button type="primary" @click="handleAddGoods" class="addGoodsButton">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="上传图片预览" :visible.sync="previewdialogVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { addAllParentsGoodsList, getParamsList,addGoodsConfirm } from "../../network/goods";
import {deepClone} from '../../common/js/deepClone'
export default {
  name: "",
  data() {
    return {
      currentAcive: 0,
      nodesList: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cate: [],
        goods_cateNew:'',
        pics: [],
        goods_introduce: "",
        attrs:[]
      },
      picIndex: 0,
      manyTable: [],
      onlyTable: [],
      previewPath: "",
      previewdialogVisible: false,
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { min: 0, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { min: 0, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { min: 0, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        goods_cate: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      //el-upload组件上传图片发送ajax的方式并没有用到axios
      //因此并没有用到拦截器中为headers设置的token值
      //需要为el-upload组件设置header属性
      headerObj: {
        Authorization: sessionStorage.getItem("token")
      }
    };
  },
  created() {
    addAllParentsGoodsList().then(res => {
      console.log(res);
      this.nodesList = res.data.data;
    });
  },
  methods: {
    handleChange() {},
    //切换标签页绑定的钩子，如果用户处于基本信息栏并且没有选中商品的分类，那么就禁止用户跳转的接下来的商品标签页
    tabsChange(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cate.length !== 3) {
        this.$message.error("请先选择商品的分类");
        return false;
      }
    },
    //当标签页被点击时触发的回调
    tabsClicked() {
      //获取商品动态参数信息
      if (this.currentAcive === "1") {
        getParamsList(this.addForm.goods_cate[2], "many").then(res => {
          this.manyTable = res.data.data;
          this.manyTable.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
        });
      } else if (this.currentAcive === "2") {
        getParamsList(this.addForm.goods_cate[2], "only").then(res => {
          this.onlyTable = res.data.data;
          this.onlyTable.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
        });
      }
    },
    //上传图片的预览
    handlePreview(file) {
      // console.log(file)
      this.previewdialogVisible = true;
      this.previewPath = file.response.data.url;
    },
    handleRemove() {},
    //el-upload组件上传图片成功时的钩子
    handleSuccess(res) {
      var picObj = {};
      picObj.pic = res.data.tmp_path;
      this.addForm.pics.push(picObj);
    },

    handleRemove(file) {
      this.addForm.pics.forEach((item, index) => {
        if (item.pic === file.response.data.tmp_path) {
          this.picIndex = index;
        }
      });
      // console.log(this.picIndex);
      this.addForm.pics.splice(this.picIndex, 1);
      // console.log(this.addForm.pics);
    },
    handleAddGoods(){
      console.log(this.addForm.goods_introduce)
      this.$refs.addFormRef.validate(valid=>{
        if(!valid){
          this.$message.error('请填写必填的表单项')
        }
      })
      //最终要发给服务器端的分类信息必须是经过处理过后的字符串
      //而addform对象中的cate属性和cascader级联选择器的v-model是绑定的状态，必须为数组
      //因此需要深拷贝一个数组并操作这个数组变成字符串以便发送到服务器端
      this.addForm.goods_cateNew = deepClone(this.addForm.goods_cate).join(',');

      console.log(this.addForm.goods_cateNew )

      this.manyTable.forEach(item =>{
        var manycateObj = {}
        manycateObj.attr_id = item.attr_id
        manycateObj.attr_value = item.attr_vals.join(' ')
        this.addForm.attrs.push(manycateObj)
      })

      this.onlyTable.forEach(item =>{
        var onlycateObj = {}
        onlycateObj.attr_id = item.attr_id
        onlycateObj.attr_value = item.attr_vals.join(' ')
        this.addForm.attrs.push(onlycateObj)
      })

      addGoodsConfirm(
        this.addForm.goods_name,
        this.addForm.goods_cateNew,
        this.addForm.goods_price,
        this.addForm.goods_number,
        this.addForm.goods_weight,
        this.addForm.goods_introduce,
        this.addForm.pics,
        this.addForm.attrs,
      ).then(res=>{
        console.log(res)
        if(res.data.meta.status !== 201){
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/home/goods')
      })
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-steps {
  margin: 20px 0;
}

.el-checkbox {
  margin: 0 7px 0 0;
}

.previewImg {
  width: 100%;
}

.addGoodsButton{
  margin-top: 20px;
}

</style>
