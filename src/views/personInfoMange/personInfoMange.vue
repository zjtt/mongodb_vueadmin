<template>
	<section>
		<el-collapse v-model="activeNames">
			<!--折叠面板-->
			<el-collapse-item  title="个人资料" name="1">
				<el-form ref="personform" :model="form" label-width="80px" v-loading.body="loading" :rules="formRules" style="margin:20px;width:60%;min-width:600px;">
					<el-form-item label="登录名" prop="pname">
						<el-input v-model="form.pname" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model.number="form.password" :disabled="disEdit" :maxlength="3"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex" :disabled="disEdit">
							<el-radio label="1">男</el-radio>
							<el-radio label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="出生日期" prop="birthday">
						<el-date-picker type="datetime" :disabled="disEdit" placeholder="选择日期" :editable="false" @change="changeDate" v-model="form.birthday" style="width: 100%;"></el-date-picker>
					</el-form-item>
					<el-form-item label="年龄" prop="age">
						<el-input v-model.number="form.age":maxlength="3" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item label="毕业院校" prop="school">
						<el-input v-model="form.school" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item label="专业" prop="specialty">
						<el-input v-model="form.specialty" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item label="学历" prop="knowledge">
						<el-input v-model="form.knowledge" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item label="简历" prop="resume">
						<el-input type="textarea" v-model="form.resume" :disabled="disEdit"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="modify" v-if="disEdit">修改</el-button>
						<el-button type="primary" @click="cancelModify" v-if="!disEdit">取消修改</el-button>
						<el-button type="primary" @click="modifySubmit" v-if="!disEdit">保存修改</el-button>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			<el-collapse-item title="发布个人求职信息" name="2">
			    <el-form :model="applyForm" label-width="90px" :rules="applyFormRules" ref="applyForm">
					<el-form-item label="职位" prop="job">
						<el-input v-model="applyForm.job" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="薪资" prop="salary">
						<el-input v-model.number="applyForm.salary" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="其他说明" prop="other">
						<el-input type="textarea" v-model="applyForm.other"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="sendApplyJob">发布求职信息</el-button>
					</el-form-item>
				</el-form>
		  	</el-collapse-item>
		</el-collapse>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	export default {
		data() {
			return {
				disEdit:true,
				activeNames: ['2'],
				loading:false,
				originform:{},//原始form，取消修改恢复原样
				form: {
					pname: 'shenm',
					password: '',
					age: '',
					sex: 1,
					birthday:'',
					school: '',
					specialty: '',
					knowledge: '',
					email: '',
					resume: '',//简历
				},
				formRules:{
					pname: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					age: [
						{ required: true, message: '请输入正确的年龄',type:'number',trigger: 'blur' }
					],
					birthday: [
						{ required: true, message: '请输入以上字段',trigger: 'change' }
					],
					school: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					specialty: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					knowledge: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					resume: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
				},
				applyFormRules: {
					job: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					salary: [
						{ required: true, message: '请输入正确的薪资',type:'number', trigger: 'change' }
					],
					other: [
						{ required: true, message: '请输入简历', trigger: 'blur' }
					],
				},
				//新增界面数据
				applyForm: {
				    job : '',//职位
				    salary : '',//薪资
				    other:'',//其他说明
				},
			}
		},
		methods: {
			changeDate(val){
				this.form.birthday = val;
				console.log('this.form.birthday:'+this.form.birthday);
			},
			//获取用户列表
			getData() {
				this.loading = true;
				NProgress.start();
				let para = {
					"name":JSON.parse(sessionStorage.getItem('user')).name,
				};
				get('/api/person',para).then((response) => {//请求成功
					this.loading = false;
					NProgress.done();
					if (response.data.status == 1){
						if(response.data.data != null){
							this.form = Object.assign({},response.data.data);
							this.originform = Object.assign({},response.data.data);
							console.log(JSON.stringify(response.data.data));
						};
						this.$notify({
							title: '成功',
							message: '加载成功',
							type: 'success'
						});
					}else{
						this.$notify({
							title: '失败',
							message: '加载失败',
							type: 'error'
						});
					};
				}).catch((err) => {//请求失败
					this.loading = false;
					NProgress.done();
					console.log('失败'+err);
					this.$notify({
						title: '失败',
						message: '加载失败',
						type: 'error'
					});
				});
			},
			modify:function(){
				this.disEdit = false;
			},	
			cancelModify:function(){
				this.form = Object.assign({},this.originform);
				this.disEdit = true;
			},					
			modifySubmit: function () {
				this.$refs.personform.validate((valid) => {
					if (valid) {//验证通过
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							this.loading = true;
							NProgress.start(); 
							let para = Object.assign({}, this.form);//将this.personform复制给变量para
							post('/api/person/update',para).then((response) => {//请求成功
								this.loading = false;
								NProgress.done();
								if(response.data.status == 1){
									this.disEdit = true;
									this.$message({
										message:'修改成功!',
										type:'success',
									});
									//重新加载
									this.getData();
								}else{
									this.$message.error('修改失败!'); 
								};
							}).catch((err) => {//请求失败
								console.log('失败'+err);
								this.$message.error('修改失败!'); 
								this.loading = false;
								NProgress.done();
							});
						}).catch(() => {
							//取消提交
						});
					}
				});
			},
			sendApplyJob: function () {
				if(this.originform.age=='' || this.originform.sex=='' || this.originform.birthday=='' 
				||this.originform.school=='' ||this.originform.specialty=='' ||this.originform.knowledge=='' 
				||this.originform.email=='' ||this.originform.resume==''){
					this.$message({
						message:'请先完善个人资料!',
						type:'error',
					});
					return;
				};
				this.$refs.applyForm.validate((valid) => {
					if (valid) {//验证通过
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							this.loading = true;
							NProgress.start(); 
							let para = Object.assign({}, this.applyForm);//将this.applyForm复制给变量para
							para.sname = this.originform.pname;
							para.specialty = this.originform.specialty;
							para.email = this.originform.email;
							para.resume = this.originform.resume;
							post('/api/applyjob/publish',para).then((response) => {//请求成功
								this.loading = false;
								NProgress.done();
								if(response.data.status == 1){
									this.$message({
										message:'发布成功!',
										type:'success',
									});
								}else{
									this.$message.error('发布失败!'); 
								};
							}).catch((err) => {//请求失败
								console.log('失败'+err);
								this.$message.error('发布失败!'); 
								this.loading = false;
								NProgress.done();
							});
						}).catch(() => {
							//取消提交
						});
					}
				});
			},
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style>
	.el-textarea.is-disabled .el-textarea__inner,.el-input.is-disabled .el-input__inner{
		color:#333;
	}
	.el-radio__input.is-disabled.is-checked .el-radio__inner{
		background-color: #333;
    	border-color: #333;
	}
</style>