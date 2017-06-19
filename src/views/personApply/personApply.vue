<template>
	<section>
			<el-form ref="personform" :model="form"  v-if="personformVisible" label-width="80px"  :rules="formRules" style="margin:20px;width:60%;min-width:600px;">
				<el-form-item label="求职编号" prop="applyid">
					<el-input v-model="form.applyid" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="sname">
					<el-input v-model.number="form.sname" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="specialty">
					<el-input v-model="form.specialty" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model.number="form.email":disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="发布日期" prop="ptime">
					<el-date-picker type="datetime" :disabled="true" placeholder="选择日期" :editable="true" @change="changeDate" v-model="form.ptime" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="简历" prop="resume">
					<el-input type="textarea" v-model="form.resume" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="form.salary":disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="job">
					<el-input v-model="form.job" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="其他说明" prop="other">
					<el-input type="textarea" v-model="form.other" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="modify" v-if="disEdit">修改</el-button>
					<el-button type="primary" @click="cancelModify" v-if="!disEdit">取消修改</el-button>
					<el-button type="primary" @click="modifySubmit" v-if="!disEdit">保存修改</el-button>
				</el-form-item>
			</el-form>
			<div class="box-card"  v-if="!personformVisible" style="text-align:center;">
				<br /><br /><h2>您还未发布求职信息，请到信息管理界面发布求职信息</h2>
			</div>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	export default {
		data() {
			return {
				disEdit:true,
				loading:false,
				originform:{},//原始form，取消修改恢复原样
				form: {
					applyid : '',//求职编号
				    sname : '',//姓名
					specialty:'',//专业
					job:'',//职位
					salary:'',//薪资
					email:'',//邮箱
					ptime:'',//发布日期
					resume:'',//简历
					other:'',//其他说明
				},
				formRules:{
					job: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					salary: [
						{ required: true, message: '请输入正确的薪资',type:'number', trigger: 'blur' }
					],
					other: [
						{ required: true, message: '请输入简历', trigger: 'blur' }
					],
				},
				personformVisible:true,//是否已发布简历
			}
		},
		methods: {
			changeDate(val){
				this.form.ptime = val;
				console.log('this.form.ptime:'+this.form.ptime);
			},
			//获取用户列表
			getData() {
				this.loading = true;
				NProgress.start();
				let para = {
					"name":JSON.parse(sessionStorage.getItem('user')).name,
				};
				get('/api/person/applyjob',para).then((response) => {//请求成功
					this.loading = false;
					NProgress.done();
					if (response.data.status == 1){
						if(response.data.data != null){
							this.form = Object.assign({},response.data.data);
							this.originform = Object.assign({},response.data.data);
							console.log(JSON.stringify(response.data.data));
						}else{
							this.personformVisible=false;
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
							post('/api/applyjob/update',para).then((response) => {//请求成功
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