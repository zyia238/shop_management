<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>

      <el-dialog title="添加分类" :visible.sync="addCategorydialogVisible" width="50%" @closed="handleAddClose">
        <el-form
          :model="addCategoryForm"
          :rules="addCategoryrules"
          ref="addCategoryRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCategoryForm.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="父级名称">
            <el-cascader
              v-model="selectedParentCate"
              :options="parentsGoodsList"
              :props="selectParentProps"
              @change="handleChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategorydialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategoryConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 表格展示区域 -->
      <zk-table
        :data="goodsCategoryList"
        :columns="columns"
        show-index
        stripe
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="isOkay" slot-scope="scope">
          <i
            style="color:lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color:red" class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>

      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="goodsListParams.pagenum"
        :page-sizes="[5,10,20]"
        :page-size="goodsListParams.pagesize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getGoodsList,
  addGoodsCate,
  addParentsGoodsList
} from "../../../network/goods";
export default {
  data() {
    return {
      goodsListParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsCategoryList: [],
      addCategorydialogVisible: false,
      addCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      selectedParentCate: [],
      selectParentProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      parentsGoodsList: [],
      addCategoryrules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px"
        },
        {
          label: "是否有效",
          minWidth: "200px",
          type: "template",
          template: "isOkay"
        },
        {
          label: "排序",
          minWidth: "200px",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          minWidth: "300px"
        }
      ]
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      getGoodsList(
        this.goodsListParams.type,
        this.goodsListParams.pagenum,
        this.goodsListParams.pagesize
      ).then(res => {
        //获取全部一二三级商品信息
        console.log(res);
        this.total = res.data.data.total;

        this.goodsCategoryList = res.data.data.result;
      });
    },
    handleSizeChange(newSize) {
      this.goodsListParams.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newCurrent) {
      this.goodsListParams.pagenum = newCurrent;
      this.getGoodsList();
    },
    addCategory() {
      addParentsGoodsList().then(res => {
        // console.log(res)
        this.parentsGoodsList = res.data.data;
      });
      this.addCategorydialogVisible = true;
    },
    addCategoryConfirm() {
      this.$refs.addCategoryrulesRef.validate(valid => {
        // console.log(valid,this.selectedParentCate);
        // console.log(this.addCategoryForm.cat_name);
        if (valid) {
          this.addCategorydialogVisible = false;

          addGoodsCate(
            this.addCategoryForm.cat_pid,
            this.addCategoryForm.cat_name,
            this.addCategoryForm.cat_level
          ).then(res => {
            console.log(res);
            this.getGoodsList();
          });
        }
      });
    },
    handleChange() {
      this.addCategoryForm.cat_pid = this.selectedParentCate[
        this.selectedParentCate.length - 1
      ];
      this.addCategoryForm.cat_level = this.selectedParentCate.length;
    },
    handleAddClose(){
      //重置表单输入框
      this.$refs.addCategoryRef.resetFields()
      //级联选择器无法被resetFields函数清空，需要手动设置
      this.selectedParentCate = []
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;
}
</style>
