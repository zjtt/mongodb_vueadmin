<template>
	<el-collapse v-model="activeNames">
		<!--折叠面板-->
		<el-collapse-item  title="个人资料" name="1">
			<el-form ref="companyform" :model="form" label-width="80px" v-loading.body="loading" :rules="formRules" style="margin:20px;width:60%;min-width:600px;">
				<el-form-item label="登录名" prop="cname">
					<el-input v-model="form.cname" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model.number="form.password" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="tel">
					<el-input v-model="form.tel" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="所属行业" prop="manage">
					<el-select v-model="form.manage" clearable placeholder="请选择" :disabled="disEdit">
					    <el-option
					      v-for="item in manages"
					      :label="item.label"
					      :value="item.value"
					      :key="item.value">
					    </el-option>
					    <!--<el-option label="IT互联网" value="1"></el-option>
						<el-option label="金融" value="2"></el-option>
						<el-option label="房地产" value="3"></el-option>-->
					</el-select>
				</el-form-item>
				<el-form-item label="公司地址" prop="address">
					<el-input type="textarea" v-model="form.address" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item label="公司简介" prop="cintro">
					<el-input type="textarea" v-model="form.cintro" :disabled="disEdit"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="modify" v-if="disEdit">修改</el-button>
					<el-button type="primary" @click="cancelModify" v-if="!disEdit">取消修改</el-button>
					<el-button type="primary" @click="modifySubmit" v-if="!disEdit">保存修改</el-button>
				</el-form-item>
			</el-form>
		</el-collapse-item>
		<el-collapse-item title="发布企业招聘信息" name="2">
		    <el-form :model="offerForm" label-width="90px" :rules="offerFormRules" ref="offerForm">
				<el-form-item label="职位" prop="job">
					<el-input v-model="offerForm.job" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="offerForm.salary" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="其他说明" prop="other">
					<el-input type="textarea" v-model="offerForm.other"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="sendOfferJob">发布招聘信息</el-button>
				</el-form-item>
			</el-form>
	  	</el-collapse-item>
	</el-collapse>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	export default {
		data() {
			return {
				disEdit:true,
				activeNames: ['2'],
				form: {
					cname: '',
					password: '',
					tel: '',
					manage: '',
					email: '',
					address: '',//地址
					cintro: '',//公司简介
				},
				loading:false,
				originform:{},//原始form，取消修改恢复原样
				formRules:{
					cname: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					manage: [
						{ required: true, message: '请选择所属行业',type:'number', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					cinfo: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
				},
				//所属行业
				manages:[{
		          value: 1,
		          label: 'IT互联网'
		        },{
		          value: 2,
		          label: '金融'
		        },{
		          value: 3,
		          label: '房地产'
		        },],
		        //新增界面数据
				offerForm: {
				    job : '',//职位
				    salary : '',//薪资
				    other:'',//其他说明
				},
		        offerFormRules: {
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
				
			}
		},
		methods: {
			//获取用户列表
			getData() {
				this.loading = true;
				NProgress.start();
				let para = {
					"name":JSON.parse(sessionStorage.getItem('user')).name,
				};
				get('/api/company',para).then((response) => {//请求成功
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
				this.$refs.companyform.validate((valid) => {
					if (valid) {//验证通过
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							this.loading = true;
							NProgress.start(); 
//							alert("this.addForm="+JSON.stringify(this.addForm));
							let para = Object.assign({}, this.form);//将this.addForm复制给变量para
							post('/api/company/update',para).then((response) => {//请求成功
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
			sendOfferJob: function () {
				if(this.originform.email=='' ||this.originform.tel=='' ||this.originform.manage==''
				|| this.originform.address==''|| this.originform.cintro==''){
					this.$message({
						message:'请先完善企业资料!',
						type:'error',
					});
					return;
				};
				this.$refs.offerForm.validate((valid) => {
					if (valid) {//验证通过
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							this.loading = true;
							NProgress.start(); 
							let para = Object.assign({}, this.offerForm);//将this.applyForm复制给变量para
							para.sname = this.originform.cname;
							para.manage = this.originform.manage;
							para.email = this.originform.email;
							para.tel = this.originform.tel;
							post('/api/offerjob/publish',para).then((response) => {//请求成功
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

