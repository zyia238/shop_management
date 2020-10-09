<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- user组件中最外层的包裹容器 -->
    <el-card>
      <!-- 通过栅格 -->
      <el-row :gutter="20">
        <el-col :span="11">
          <el-input placeholder="请输入内容" v-model="query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click=" dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- user组件中用于显示数据的表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="180px">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteUser(scope.row.id)'></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2,5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户时弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addUserClosed">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="70px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editFormClosed">
      <el-form :model="editForm" ref="editUserRef" label-width="70px" :rules="editUserRules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogHandle">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  changeUserStatus,
  addUser,
  getEditUserFromInfo,
  editUserInfo,
  deleteUserInfo
} from "../../network/home";
export default {
  name: "user",
  data() {
    //自定义校验方式（对话框中的邮箱以及手机号格式）
    var checkEmail = (rule, value, callback) => {
      const regExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!regExp.test(value)) {
        return callback(new Error("输入的邮箱地址格式不正确"));
      }
      callback();
    };
    var checkMobile = (rule, value, callback) => {
      const regExp = /^1[34578]\d{9}$/;
      if (!regExp.test(value)) {
        return callback(new Error("输入的手机号格式不正确"));
      }
      callback();
    };
    return {
      //用于与表格绑定的数据
      query: null,
      pagenum: 1,
      pagesize: 2,
      //其他数据
      total: 0,
      userList: [],
      dialogVisible: false,
      editDialogVisible: false,
      editForm: {
        userName: "",
        email: "",
        mobile: ""
      },
      addUserForm: {
        userName: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          //自定义的邮箱格式校验
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          //自定义的手机号格式校验
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      addUserRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          //自定义的邮箱格式校验
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          //自定义的手机号格式校验
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //当组件一创建好就发送axios请求，请求的参数为默认已经初始化好的pageNum和pagesize
    this.getUserList();
  },
  methods: {

    getUserList() {
      getUserList(this.query, this.pagenum, this.pagesize).then(res => {
        console.log(res);

        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户列表失败");
        //将请求来的数据push进与table绑定的数组userList中
        this.total = res.data.data.total;
        this.userList = [];
        this.userList.push(...res.data.data.users);
      });
    },

    showEditDialog(uid) {
      this.editDialogVisible = true;
      //之所以要再次调用查询API是因为数据的实时性
      //用户并不知道这次的数据有没有在数据库中被更改
      getEditUserFromInfo(uid).then(res => {
        // console.log(res);
        this.editForm = res.data.data;
        console.log(this.editForm);
      });
    },
    editFormClosed() {
      this.$refs.editUserRef.resetFields();
    },

    deleteUser(id){
      console.log(id)
      deleteUserInfo(id).then(res=>{
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUserList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      })
      
    },
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(currentIndex) {
      this.pagenum = currentIndex;
      this.getUserList();
    },
    changeStatus(msg) {
      changeUserStatus(msg.id, msg["mg_state"]);
    },
    addUserClosed() {
      this.$refs.addUserRef.resetFields();
    },
    editFormConfirm() {
      this.$refs.editUserRef.validate(valid => {
        if (!valid) {
          return;
        }
        editUserInfo(
          this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        ).then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改用户信息失败");
          }
          this.editDialogVisible = false;
          this.getUserList();
          this.$message.success('修改用户信息成功')
        });
      });
    },
    editdialogHandle() {
      this.editDialogVisible = false;
    },

    addUserConfirm() {
      this.$refs.addUserRef.validate(valid => {
        if (!valid) {
          return;
        }
        addUser(
          this.addUserForm.userName,
          this.addUserForm.password,
          this.addUserForm.email,
          this.addUserForm.mobile
        ).then(res => {
          if (res.data.meta.status !== 201) {
            this.$message.error("添加用户失败");
          }

          this.getUserList();
          this.$message.success("添加用户成功");
        });
        this.dialogVisible = false;
      });
    }
  }
};
</script>

<style  scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.el-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
