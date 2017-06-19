<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="userType">
      <el-radio-group v-model="ruleForm2.userType">
        <el-radio label="1">管理员</el-radio>
        <el-radio label="2">个人用户</el-radio>
        <el-radio label="3">企业用户</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit3">去注册</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
//import { requestLogin } from '../api/api';
  import NProgress from 'nprogress'
	import { get,post} from '../api/api';
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          userType:'1',
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          userType: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            console.log( this.ruleForm2.account);
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username:String(this.ruleForm2.account), password: this.ruleForm2.checkPass };
            console.log('this.ruleForm2.userType:'+this.ruleForm2.userType);
            if(this.ruleForm2.userType == 1){
              //管理员登录接口
              get('/api/admin/login',loginParams).then(data => {
              	// alert(JSON.stringify(data.data));
                this.logining = false;
                //NProgress.done();
                let { msg, status, user } = data.data;
                if (status !== 1) {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                } else {
                	this.$message({
                    message: '登录成功',
                    type: 'success'
                  });
                	// alert(JSON.stringify(user));
                  user.avatar = 'http://115.159.194.189/sri/remember/images/p05.jpg';
                  user.userType = 1;
                  sessionStorage.setItem('user', JSON.stringify(user));
                  // console.log('user:'+JSON.stringify(user));
                  this.$router.push({ path: '/allPerson' });
                }
              }).catch((err) => {//请求失败
                this.logining = false;
  							console.log('失败'+err);
  							this.$notify({
  								title: '失败',
  								message: '登录失败',
  								type: 'error'
  							});
  						});
            }else if(this.ruleForm2.userType == 2){
              get('/api/person/login',loginParams).then(data => {
//              alert(JSON.stringify(data.data));
                this.logining = false;
                //NProgress.done();
                let { msg, status, user } = data.data;
                if (status !== 1) {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                } else {
                	this.$message({
                    message: '登录成功',
                    type: 'success'
                  });
                  user.avatar = 'http://115.159.194.189/sri/remember/images/p05.jpg';
                  user.userType = 2;
                  sessionStorage.setItem('user', JSON.stringify(user));
//                alert(JSON.stringify(user));
                  console.log('user:'+JSON.stringify(user));
                  this.$router.push({ path: '/personInfoMange' });
                }
              }).catch((err) => {//请求失败
                this.logining = false;
                console.log('失败'+err);
                this.$notify({
                  title: '失败',
                  message: '登录失败',
                  type: 'error'
                });
              });
            }else if(this.ruleForm2.userType == 3){
              get('/api/company/login',loginParams).then(data => {
//              alert(JSON.stringify(data.data));
                this.logining = false;
                //NProgress.done();
                let { msg, status, user } = data.data;
                if (status !== 1) {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                } else {
                	this.$message({
                    message: '登录成功',
                    type: 'success'
                  });
                  user.avatar = 'http://115.159.194.189/sri/remember/images/p05.jpg';
                  user.userType = 3;
                  sessionStorage.setItem('user', JSON.stringify(user));
//                alert(JSON.stringify(user));
                  console.log('user:'+JSON.stringify(user));
                  this.$router.push({ path: '/companyInfoMange' });
                }
              }).catch((err) => {//请求失败
                this.logining = false;
                console.log('失败'+err);
                this.$notify({
                  title: '失败',
                  message: '登录失败',
                  type: 'error'
                });
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSubmit3(){
        this.$router.push('/reg');
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>