<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框以及添加商品按钮 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getNewGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" class="addBtn">
          <el-button type="primary" @click = "goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表展示表格 -->
      <el-table :data="currentGoodsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100"></el-table-column>
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getNewGoodsList, deleteGoods } from "../../network/goods";

import { formatDate } from "../../common/js/dateFormat";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      currentGoodsList: []
    };
  },
  created() {
    this.getNewGoodsList();
  },
  methods: {
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getNewGoodsList();
    },
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.getNewGoodsList();
    },
    getNewGoodsList() {
      getNewGoodsList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then(res => {
        // console.log(res);
        this.total = res.data.data.total;
        // console.log(this.total);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取商品列表失败");
        }
        this.currentGoodsList = res.data.data.goods;
      });
    },
    queryGoods() {
      this.getNewGoodsList();
    },
    deleteGoods(scope) {
       this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(scope.goods_id).then(res=>{
            if(res.data.meta.status === 200){
              this.$message.success('成功删除商品')
            }
            this.getNewGoodsList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    goAddGoods(){
      this.$router.push('/home/goods/add')
    }
  },
  filters: {
    dateFormat(val) {
      var t = new Date(val);
      return formatDate(t, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.addBtn {
  margin-left: 20px;
}
</style>