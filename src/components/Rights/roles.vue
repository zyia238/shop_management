<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="characterList" border stripe>
        <!-- 自定义展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              :key="item.id"
              :class="{bordertop:index === 0}"
              class="center"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteTag(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="item1 in item.children" :key="item1.id" class="center">
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteTag(scope.row,item1.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      type="warning"
                      closable
                      @close="deleteTag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 表格索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialogue(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色时弹出的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoledialogVisible" width="50%" @close="addRoleClosed">
      <el-form :model="addRoleForm" ref="addRoleRef" label-width="70px">
        <el-form-item label="角色名称" prop="userName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="password">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色时弹出的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoledialogVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <el-form :model="editRoleForm" ref="editRoleRef" label-width="70px">
        <el-form-item label="角色名称" prop="userName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="password">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="setRightDialogueVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsTree" :props="defaultProps" node-key="id" default-expand-all show-checkbox
      :default-checked-keys	="defaultKeys" ref='treeDialogue'	></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCharacterList,
  addRole,
  editRole,
  deleteRole,
  deleteTag,
  getRightsListTree,
  allocateRole
} from "../../network/rights";
export default {
  data() {
    return {
      characterList: [],
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      editRoleForm: {
        id: 0,
        roleName: "",
        roleDesc: ""
      },
      addRoledialogVisible: false,
      editRoledialogVisible: false,
      setRightDialogueVisible: false,
      rightsTree:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      defaultKeys:[],
      allocateRoleId:'',
      rids:''
    };
  },
  created() {
    this.getCharacterList();
  },
  methods: {
    addRole() {
      this.addRoledialogVisible = true;
    },
    addRoleClosed() {
      this.$refs.addRoleRef.resetFields();
    },
    addRoleConfirm() {
      this.addRoledialogVisible = false;
      addRole(this.addRoleForm.roleName, this.addRoleForm.roleDesc);
      this.getCharacterList();
    },
    editRole(id) {
      this.editRoledialogVisible = true;
      this.editRoleForm.id = id;
    },
    editRoleClosed() {
      this.$refs.editRoleRef.resetFields();
    },
    getCharacterList() {
      getCharacterList().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        // this.$message.success('获取角色列表成功')
        this.characterList = res.data.data;
        console.log(this.characterList);
      });
    },
    editRoleConfirm() {
      this.editRoledialogVisible = false;
      editRole(
        this.editRoleForm.id,
        this.editRoleForm.roleName,
        this.editRoleForm.roleDesc
      ).then(res => {
        this.getCharacterList();
      });
    },
    showSetRightDialogue(scope) {
      this.allocateRoleId = scope.id
      this.setRightDialogueVisible = true;
      getRightsListTree().then(res=>{
        this.rightsTree = res.data.data
      })
      this.defaultKeys=[];
      console.log(scope)
      scope.children.forEach(item => {
        item.children.forEach(item2 => {
          item2.children.forEach(item3=>{
            this.defaultKeys.push(item3.id)
          })
        })
      })
    },
    deleteTag(scope, rightID) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTag(scope.id, rightID).then(res => {
            scope.children = res.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(id).then(res => {
            this.getCharacterList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    setRightConfirm(){
      var arr = []
      arr.push(...this.$refs.treeDialogue.getCheckedKeys())
      arr.push(...this.$refs.treeDialogue.getHalfCheckedKeys())
      this.rids = arr.join(',')
      allocateRole(this.allocateRoleId,this.rids).then(res =>{
        if(res.data.meta.status !== 200){
          this.$message.error('分配权限失败')
        }

        this.setRightDialogueVisible = false;
        this.getCharacterList();
      })
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 7px;
}

.el-row {
  border-bottom: 1px solid rgba(244, 245, 243);
}

.bordertop {
  border-top: 1px solid rgba(244, 245, 243);
}

.center {
  display: flex;
  align-items: center;
}
</style>
