<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示信息 -->
      <el-alert title="只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>

      <!-- 级联选择器 -->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCategory"
            :options="allParentsGoodsList"
            :props="selectedCategoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 选项卡 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="showAddParamsDialogue">添加参数</el-button>
          <el-table :data="manyTable" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">{{item}}</el-tag>
                <!-- +new Tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialogue(scope.row)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="showAddParamsDialogue">添加属性</el-button>
          <el-table :data="onlyTable" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">{{item}}</el-tag>
                <!-- +new Tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialogue(scope.row)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态参数和静态属性共用的弹出对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close="handleDialogueClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsrules"
        ref="addParamsRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="paramsName">
          <el-input v-model="addParamsForm.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsdialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑动态参数以及静态属性的共用弹出对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="EditParamsdialogVisible"
      width="50%"
      @close="handleEditDialogueClose"
    >
      <el-form
        :model="EditParamsForm"
        :rules="EditParamsrules"
        ref="EditParamsRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="paramsName">
          <el-input v-model="EditParamsForm.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditParamsdialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAllParentsGoodsList,
  getParamsList,
  addParams,
  queryParams,
  editParams,
  deleteParams,
  addParamsTags
} from "../../../network/goods";
export default {
  name: "goods_params",
  data() {
    return {
      //级联选择器中的数据
      allParentsGoodsList: [],
      selectedCategory: [],
      selectedCategoryProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      activeName: "many",
      onlyTable: [],
      manyTable: [],
      addParamsdialogVisible: false,
      EditParamsdialogVisible: false,
      attr_id: 0,
      addParamsForm: {
        paramsName: ""
      },
      EditParamsForm: {
        paramsName: ""
      },
      addParamsrules: {
        paramsName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      EditParamsrules: {
        paramsName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      
    };
  },
  created() {
    //获取级联选择器中的数据
    addAllParentsGoodsList().then(res => {
      console.log(res);
      this.allParentsGoodsList = res.data.data;
    });
  },
  computed: {
    //只有选定第三级分类才取消按钮的禁用
    isBtnDisabled() {
      return this.selectedCategory.length !== 3 ? true : false;
    },
    //绑定添加参数按钮的标题
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    //级联选择器选中时触发的事件
    handleChange() {
      //如果选中的不是第三级的分类，则重置选中类
      if (this.selectedCategory.length !== 3) {
        this.selectedCategory = [];
        this.onlyTable = [];
        this.manyTable = [];
        return;
      }
      this.getParamsList();
    },
    //选项卡tab栏切换事件
    handleClick() {
      this.getParamsList();
    },
    //根据tab栏显示对应的参数列表
    getParamsList() {
      getParamsList(this.selectedCategory[2], this.activeName).then(res => {
        //为渲染表格展开栏里的tag项，需要将返回的attr_vals字符串转化为数组方便遍历

        res.data.data.forEach(item => {
          item.inputVisible = false;
          item.inputValue ='';
          if (!item.attr_vals) {
            item.attr_vals = []
          } else {
            item.attr_vals = item.attr_vals.split(",");
          }
        });

        console.log(res);
        if (this.activeName === "many") {
          this.manyTable = res.data.data;
        } else if (this.activeName === "only") {
          this.onlyTable = res.data.data;
        }
      });
    },
    //控制对话框的显示隐藏
    showAddParamsDialogue() {
      this.addParamsdialogVisible = true;
    },

    //提交表单的预校验
    addParamsdialogConfirm() {
      this.$refs.addParamsRef.validate(valid => {
        if (valid) {
          addParams(
            this.selectedCategory[2],
            this.addParamsForm.paramsName,
            this.activeName
          ).then(res => {
            this.getParamsList();
            this.addParamsdialogVisible = false;
          });
        }
      });
    },

    //在对话框隐藏时重置表达输入框
    handleDialogueClose() {
      this.$refs.addParamsRef.resetFields();
    },
    handleEditDialogueClose() {
      this.$refs.EditParamsRef.resetFields();
    },
    showEditDialogue(data) {
      this.attr_id = data.attr_id;
      queryParams(this.selectedCategory[2], this.attr_id, this.activeName).then(
        res => {
          this.EditParamsForm.paramsName = res.data.data.attr_name;
        }
      );
      this.EditParamsdialogVisible = true;
    },
    EditParamsdialogConfirm() {
      editParams(
        this.selectedCategory[2],
        this.attr_id,
        this.EditParamsForm.paramsName,
        this.activeName
      ).then(res => {
        this.EditParamsdialogVisible = false;
        this.getParamsList();
      });
    },
    deleteParams(scope) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteParams(this.selectedCategory[2], scope.attr_id).then(res => {
            this.getParamsList();
          });
        })
        .catch(err => {
          return err;
        });
    },
    //输入框中输入完成后触发的事件
    handleInputConfirm(scope) {
      scope.inputVisible = false;
      //因为tag标签是根据这一行的数据的attr_vals来渲染的，所以需要往数组里push与tag输入框绑定的内容
      scope.attr_vals.push(scope.inputValue)

      //需要传给服务器的参数需要是字符串形式，在渲染tags时我们将attr_vals项转化成了数组，这一次需要手动转换成字符串
      

      //发起添加新标签的请求
    var newVals = scope.attr_vals.join(',')
        addParamsTags(this.selectedCategory[2], scope.attr_id,scope.attr_name,this.activeName,newVals).then(res=>{
        // console.log(res.data.meta.status)
        if(!res.data.meta.status){
          return this.$message.error('添加参数标签失败')
        }else{
          this.$message.success('添加参数标签成功!')
        }
      })
      
    },
    //点击添加新标签按钮显示输入框
    showInput(scope) {
      scope.inputVisible = true;
      //$nextTick的作用是当页面中的元素被重新渲染后，调用回调函数
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },

    handleTagClose(index,scope){
      console.log(scope)
      scope.attr_vals.splice(index,1)
      var newVals = scope.attr_vals.join(',')
      addParamsTags(this.selectedCategory[2], scope.attr_id,scope.attr_name,this.activeName,newVals).then(res=>{
        // console.log(res.data.meta.status)
        if(!res.data.meta.status){
          return this.$message.error('添加参数标签失败')
        }else{
          this.$message.success('添加参数标签成功!')
        }
      })
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-row {
  margin: 15px;
}

.el-cascader {
  margin-left: 15px;
}

.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 200px;
}
</style>
