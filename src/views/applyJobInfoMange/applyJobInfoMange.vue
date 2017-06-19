<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleInquiry">查询</el-button>
				</el-form-item>
				<el-form-item v-if="false">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="tableData" highlight-current-row v-loading="listLoading"style="width: 100%;">
			<el-table-column type="index" width="70" label="序号" >
        		<template scope="scope">
                    <p>{{scope.$index+1+(p_index-1)*p_size}}</p>
                </template>
			</el-table-column>
			<el-table-column prop="applyid" width="120" label="求职编号" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="sname" label="求职者" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="specialty" label="专业" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="job" label="职位" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="salary" label="薪资" width="140" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="160" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="ptime" label="发布日期" width="170" sortable  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="resume" label="简历" min-width="100">
				<template scope="scope">
			        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.other!=''">
			          <p>{{ scope.row.resume}}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag>简历内容</el-tag>
			          </div>
			        </el-popover>
			        <p v-if="scope.row.other==''">--</p>
			    </template>
			</el-table-column>
			<el-table-column prop="other" label="其他说明" min-width="100">
				<template scope="scope">
			        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.other!=''">
			          <p>{{ scope.row.other}}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag>说明内容</el-tag>
			          </div>
			        </el-popover>
			        <p v-if="scope.row.other==''">--</p>
			    </template>
			</el-table-column>
			<el-table-column label="求职" fixed="right" width="80" v-if="userType==3">
				<template scope="scope">
					<el-button size="small" type="info" @click="handleInvite(scope.$index, scope.row)">招聘</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="80" v-if="userType==1">
				<template scope="scope">
					<el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange"  :current-page="p_index" :page-size="p_size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--查询界面-->
		<el-dialog title="查询" v-model="inquiryFormVisible" :close-on-click-modal="false">
			<el-form :model="inquiryForm" label-width="90px" :rules="inquiryFormRules" ref="inquiryForm">
				<el-form-item label="求职编号" prop="applyid">
					<el-input v-model.number="inquiryForm.applyid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="求职者" prop="sname">
					<el-input v-model="inquiryForm.sname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="specialty">
					<el-input v-model="inquiryForm.specialty" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="job">
					<el-input v-model="inquiryForm.job" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="inquiryForm.salary" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发布日期">
					<el-date-picker type="datetime" :editable="false":picker-options="pickerOptions"  placeholder="选择日期时间" v-model="inquiryForm.ptime" @change="changeInqueryDate"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="inquiryFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="inquirySubmit" :loading="inquiryLoading">查询</el-button>
			</div>
		</el-dialog>
		
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
				<el-form-item label="求职者" prop="sname">
					<el-input v-model="addForm.sname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="specialty">
					<el-input v-model="addForm.specialty" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="job">
					<el-input v-model="addForm.job" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="addForm.salary" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简历" prop="resume">
					<el-input type="textarea" v-model="addForm.resume"></el-input>
				</el-form-item>
				<el-form-item label="其他说明" prop="other">
					<el-input type="textarea" v-model="addForm.other"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
				<el-form-item label="求职者" prop="sname">
					<el-input v-model="editForm.sname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="specialty">
					<el-input v-model="editForm.specialty" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="job">
					<el-input v-model="editForm.job" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="editForm.salary" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简历" prop="resume">
					<el-input type="textarea" v-model="editForm.resume"></el-input>
				</el-form-item>
				<el-form-item label="其他说明" prop="other">
					<el-input type="textarea" v-model="editForm.other"></el-input>
				</el-form-item>
				<el-form-item label="是否删除">
					<el-switch
					  v-model="editForm.is_del"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	
	export default {
		data() {
			var validateToolong = (rule, value, callback) => {
				if(rule.field == 'salary' || rule.field == 'applyid'){
					if(value != ''){
				        if (typeof(value) != "number"){
				          callback(new Error('该字段为数字类型'));
				        } else {
				          callback();
				        };
					}else{
						 callback();
					}
				};
		    };
			return {
				tableData:[],
				total:1,
				p_index: 1,
				p_size:10,
				userType:JSON.parse(sessionStorage.getItem('user')).userType,
				access:true,//handleCurrentChange函数关卡
				editIndex:1,//编辑得第几条
				//设置禁止选择大于当前时间的时间
			    pickerOptions:{
			    	disabledDate:(time) => {
						return time.getTime() > Date.now();
					},
			    },
				getPara:{
					applyid : '',//求职编号
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    ptime : '',//发布日期
				},
				listLoading: false,
				
				inquiryFormVisible: false,//查询界面是否显示
				inquiryLoading: false,
				inquiryFormRules: {
//					ri_type: [
//						{ required: true, message: '请选择所属行业',type:'number', trigger: 'change' }
//					],
					applyid: [
						{ validator:validateToolong, trigger: 'change' }
					],
					salary: [
						{ validator:validateToolong, trigger: 'change' }
					],
				},
				//查询界面数据
				inquiryForm: {
					applyid : '',//求职编号
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    ptime : '',//发布日期
				},
				
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					salary: [
						{ validator:validateToolong, trigger: 'change' }
					],
					sname: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					job: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					salary: [
						{ required: true, message: '请输入正确的薪资',type:'number', trigger: 'change' }
					],
					specialty: [
						{ required: true, message: '请输入专业', trigger: 'blur' }
					],
					resume: [
						{ required: true, message: '请输入简历', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    resume : '',//简历
				    other:'',//其他说明
				    is_del:false,//是否删除
				},
				
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					salary: [
						{ validator:validateToolong, trigger: 'change' }
					],
					sname: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					job: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					salary: [
						{ required: true, message: '请输入正确的薪资',type:'number', trigger: 'change' }
					],
					specialty: [
						{ required: true, message: '请输入专业', trigger: 'blur' }
					],
					resume: [
						{ required: true, message: '请输入简历', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm: {
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    resume : '',//简历
				    other:'',//其他说明
				},
			}
		},
		methods:{
			changeInqueryDate(val){
				this.inquiryForm.c_time = val;
				console.log('this.inquiryForm.c_time:'+this.inquiryForm.c_time);
			},
			formatfield:function(row,column) {
				if(column.property == 'manage'){
					//所属行业显示转换
					switch (row.manage){
			        	case 1:
			        		return 'IT互联网';
			        	break;
			        	case 2:
			        	  	return '金融';
			        	break;
			        	case 3:
			        	  	return '房地产';
			        	break;
			        	case '':
			        		return '--';
			        	break;
			        }
				}else if(column.property == 'salary'){
					if (row.salary == '') {
						return '--';
					} else{
						return '￥'+row.salary.toFixed(2);
					}
				}else{
					return row[column.property]===''?'--':row[column.property];
				}
			},
			//显示查询界面
			handleInquiry: function () {
				this.inquiryFormVisible = true;
				this.inquiryForm = {
				    applyid : '',//求职编号
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    ptime : '',//发布日期
				};
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
				    sname : '',//求职者
					specialty:'',//专业 
				    job : '',//职位
				    salary : '',//薪资
				    resume : '',//简历
				    other:'',//其他说明
				};
			},	
			//显示编辑界面
			handleEdit: function (index, row) {
            	this.editIndex = index;//编辑的第几条数据
				this.editFormVisible = true;
				row.is_del = false;
				this.editForm = Object.assign({}, row);
			},
			handleCurrentChange(val) {
				//如果允许通过
				if(this.access == true){
					console.log(this.p_index);
					this.p_index = val;
					console.log('当前页：'+val);
					this.getData();
				};
			},
			//获取用户列表
			getData() {
				//设置门卡禁止通过当前页数改变的方法
				this.access = false;
				this.getPara.p_index = this.p_index;
				this.getPara.p_size = this.p_size;
				this.listLoading = true;
				NProgress.start();
				console.log(JSON.stringify(this.getPara));
				get('/api/applyjob/list',this.getPara).then((response) => {//请求成功
					this.listLoading = false;
					NProgress.done();
					if (response.data.status == 1){
						if(response.data.data != null){
	//						console.log(JSON.stringify(response.data.data));
							this.tableData = response.data.data;
							this.total = response.data.total;
						}else{
							this.tableData.length = 0;
							this.total = 0;	
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
					//设置页数变化门卡允许通过
					this.access = true;
				}).catch((err) => {//请求失败
					this.listLoading = false;
					NProgress.done();
					console.log('失败'+err);
					this.$notify({
						title: '失败',
						message: '加载失败',
						type: 'error'
					});
					//设置页数变化门卡允许通过
					this.access = true;
				});
			},
			//查询
			inquirySubmit: function () {
				this.$refs.inquiryForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							let para = Object.assign({}, this.inquiryForm);
							//设置门卡禁止通过当前页数改变的方法
							this.access = false;
							this.p_index = 1;
							this.getPara = Object.assign({}, para);
							this.getPara.p_index = this.p_index;
							this.getPara.p_size = this.p_size;
							this.inquiryLoading = true;
							NProgress.start();
							console.log(JSON.stringify(this.getPara));
							get('/api/applyjob/list',this.getPara).then((response) => {//请求成功
								//loading消失
								this.inquiryLoading = false;
								//头部加载进度条消失
								NProgress.done();
								//设置门卡允许通过
								this.access = true;
								if (response.data.status == 1){
									this.inquiryFormVisible = false;
									if(response.data.data != null){
		//								console.log(JSON.stringify(response.data.data));
										this.tableData = response.data.data;
										this.total = response.data.total;
									}else{
										this.tableData.length = 0;
										this.total = 0;	
									};
									this.$refs['inquiryForm'].resetFields();//清空表单
									this.$notify({
										title: '成功',
										message: '查询成功',
										type: 'success'
									});
								}else{
									this.$notify({
										title: '失败',
										message: '查询失败',
										type: 'error'
									});
								};
							}).catch((err) => {//请求失败
								console.log('失败'+err);
								this.$notify({
									title: '失败',
									message: '查询失败',
									type: 'error'
								});
								//头部加载进度条消失
								NProgress.done();
								//loading消失
								this.inquiryLoading = false;
								//设置门卡允许通过
								this.access = true;
							});
						}).catch(() => {
							//取消提交
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {//验证通过
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							this.addLoading = true;
							NProgress.start(); 
//							alert("this.addForm="+JSON.stringify(this.addForm));
							let para = Object.assign({}, this.addForm);//将this.addForm复制给变量para
							para.applyid = this.total+1;
							post('/api/applyjob/add',para).then((response) => {//请求成功
								this.addLoading = false;
								NProgress.done();
								if(response.data.status == 1){
									this.addFormVisible = false;
									this.$message({
										message:'添加成功!',
										type:'success',
									});
									this.$refs['addForm'].resetFields();//清空表单
									//刷新列表
									this.p_index = 1;//恢复到第一页
									//重新加载
									this.getData();
								}else{
									this.$message.error('添加失败!'); 
								};
							}).catch((err) => {//请求失败
								console.log('失败'+err);
								this.$message.error('添加失败!'); 
								this.addLoading = false;
								NProgress.done();
							});
						}).catch(() => {
							//取消提交
						});
					}
				});
			},
			//招聘
			handleInvite:function(index, row){
				this.$confirm('确认招聘吗？', '提示', {}).then(() => {
					NProgress.start();
					let para = {};
					para.applyid = row.applyid;
					para.job = row.job;
					para.sname = JSON.parse(sessionStorage.getItem('user')).name;//企业名字
					post('/api/company/invite',para).then((response) => {
						NProgress.done();
						console.log(response.data);
						if(response.data.status == -1){
							this.$message({
								message:response.data.msg,
								type:'error',
							});
							//重新请求当前页
							//重新加载
//							this.getData();
						}else if(response.data.status == 1){
							this.$message({
								message:response.data.msg,
								type:'success',
							});
							//重新请求当前页
							//重新加载
//							this.getData();
						}else{
							this.$message.error('应聘失败!'); 
						};
					}).catch((err) => {
						NProgress.done();
						console.log(err);
						this.$message.error('应聘失败!'); 
					});
				});
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log('para:'+JSON.stringify(para));
							post('/api/applyjob/update',para).then((response) => {
								this.editLoading = false;
								NProgress.done();
								if(response.data.status == 1){
									this.$message({
										message:'修改成功!',
										type:'success',
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									//重新请求当前页
									//重新加载
									this.getData();
								}else{
									this.$message.error('修改失败!'); 
								};
							}).catch((err) => {
								this.editLoading = false;
								NProgress.done();
								console.log(err);
								this.$message.error('修改失败!'); 
							});
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

