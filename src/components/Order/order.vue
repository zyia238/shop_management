<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderQueryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditLocationDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showKuaidiInfoDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderQueryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="orderQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editLocationdialogVisible"
      width="50%"
      @closed="handleDialogClose"
    >
      <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            v-model="addressForm.city"
            :options="cityData"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="elaborated">
          <el-input v-model="addressForm.elaborated"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editLocationdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLocationdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="kuaididialogVisible" width="50%">
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in kuaidiInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
import { formatDate } from "../../common/js/dateFormat";
import { getOrderList, getKuaidiInfo } from "../../network/order";
export default {
  name: "order",
  data() {
    return {
      orderQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""
      },
      orderList: [],
      total: 0,
      editLocationdialogVisible: false,
      addressForm: {
        //address1 的表单项是一个级联选择器，所以需要绑定数组
        city: [],
        elaborated: ""
      },
      cityData,
      cascaderProps: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children"
      },
      addressRules: {
        city: [{ required: true, message: "请选择省市区/县", trigger: "blur" }],

        elaborated: [
          {
            required: true,
            message: "请输入符合规则的详细地址",
            trigger: "blur"
          }
        ]
      },
      kuaididialogVisible: false,
      kuaidiInfo:[]
    };
  },
  created() {
    this.getOrderList();
  },
  filters: {
    dateFormat(val) {
      var t = new Date(val);
      return formatDate(t, "yyyy-MM-dd hh:mm:ss");
    }
  },
  computed: {},
  watch: {},
  methods: {
    getOrderList() {
      getOrderList(
        this.orderQueryInfo.query,
        this.orderQueryInfo.pagenum,
        this.orderQueryInfo.pagesize,
        this.orderQueryInfo.user_id,
        this.orderQueryInfo.pay_status,
        this.orderQueryInfo.is_send,
        this.orderQueryInfo.order_fapiao_title,
        this.orderQueryInfo.order_fapiao_company,
        this.orderQueryInfo.order_fapiao_content,
        this.orderQueryInfo.consignee_addr
      ).then(res => {
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.orderQueryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(current) {
      this.orderQueryInfo.pagenum = current;
      this.getOrderList();
    },
    showEditLocationDialog() {
      this.editLocationdialogVisible = true;
    },
    handleDialogClose() {
      console.log(1);
      this.$refs.addressRef.resetFields();
    },
    handleChange() {
      console.log(this.addressForm);
    },
    showKuaidiInfoDialog() {
      this.kuaididialogVisible = true;
      getKuaidiInfo().then(res => {
          console.log(res)
        this.kuaidiInfo = res.data.data
      });
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
