<template>
  <div class="container">
    <div class="login_box">
      <!-- 头像框 -->
      <div class="avatar_box">
        <img src="../assets/img/spike.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form ref="formElement" label-width="0px" class="login_container" :model="loginForm" :rules="rules">
        <el-form-item label="" class="myusername"  prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="" class="mypassword" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="" class="buttons">
          <el-button type="primary" @click="loginPreValidate">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateLogin } from '../network/login.js'

export default {
  name: "login",
  data(){
      return {
          //用于与el-input中的输入做双向绑定
          loginForm:{
              username:'admin',
              password:'123456'
          },
          //与form-element绑定的验证规则，为固定写法
          rules:{
              username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
          }
      }
  },
  methods:{
      resetForm(){
          //取到整个el-form表单对象后，可以调用这个组件内的resetFields方法来重置整个表单域
          this.$refs.formElement.resetFields();
      },
      loginPreValidate(){
          //取到整个el-form表单对象后，可以调用这个组件内的validate方法来验证整个表单域
          //接收的回调函数的第一个参数为验证的结果
          this.$refs.formElement.validate(valid => {
            if(!valid){
                return
            }else{
                validateLogin(this.loginForm.username,this.loginForm.password).then(res => {
                    console.log(res)
                    if(res.data.meta.status !== 200){
                        //因为导入element-ui的方式非按需导入，所以vue的原型对象上已经挂载了message组件
                        //使用message组件的方法就是如下的固定写法
                        this.$message.error('登录失败');
                    }else{
                        sessionStorage.setItem('token',res.data.data.token)
                        this.$message.success('登陆成功');
                        this.$router.push('/home')
                    }
                })
            }
          });
      }
  }
};
</script>

<style scoped>

.container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}

.myusername, .mypassword{
    width: 100%;
    padding: 0 20px;
}

.buttons{
    display: flex;
    justify-content: flex-end;
    margin: 0 20px 0 0;
}

.login_container{
    position: absolute;
    bottom: 35px;
    width: 100%;
}

.login_box {
  background-color: white;
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid skyblue;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}

.avatar_box img {
  width: 100%;
  height: 100%;
}
</style>
